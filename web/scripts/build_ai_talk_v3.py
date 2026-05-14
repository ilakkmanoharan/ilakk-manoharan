#!/usr/bin/env python3
"""
Build AI-talk-v3.mov from AI-talk-v2.mov:
  - Remove silent gaps (silencedetect + merged trims, A/V stay in sync).
  - Mildly attenuate impulsive / low-frequency cough energy (not perfect; true
    cough removal in speech needs manual or ML tools like Descript).

Usage:
  python3 build_ai_talk_v3.py <input.mov> <output.mov>
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
import tempfile
from pathlib import Path


def ffprobe_duration(path: Path) -> float:
    r = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(r.stdout.strip())


def run_silencedetect(path: Path, noise_db: str, min_silence: float) -> str:
    r = subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-nostats",
            "-i",
            str(path),
            "-af",
            f"silencedetect=noise={noise_db}:d={min_silence}",
            "-f",
            "null",
            "-",
        ],
        check=False,
        capture_output=True,
        text=True,
    )
    return r.stderr


def parse_silences(stderr: str) -> list[tuple[float, float]]:
    starts: list[float] = []
    ends: list[float] = []
    for line in stderr.splitlines():
        m = re.search(r"silence_start:\s*([0-9.]+)", line)
        if m:
            starts.append(float(m.group(1)))
        m = re.search(r"silence_end:\s*([0-9.]+)", line)
        if m:
            ends.append(float(m.group(1)))
    if len(starts) != len(ends):
        raise RuntimeError(
            f"Mismatched silence markers: {len(starts)} starts vs {len(ends)} ends"
        )
    return list(zip(starts, ends, strict=True))


def merge_intervals(
    intervals: list[tuple[float, float]], gap: float = 0.001
) -> list[tuple[float, float]]:
    if not intervals:
        return []
    intervals = sorted(intervals, key=lambda x: x[0])
    out: list[list[float]] = [[intervals[0][0], intervals[0][1]]]
    for s, e in intervals[1:]:
        if s <= out[-1][1] + gap:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return [(a, b) for a, b in out]


def keep_segments(
    duration: float,
    silences: list[tuple[float, float]],
    min_silence_remove: float,
) -> list[tuple[float, float]]:
    """Remove only silences with duration >= min_silence_remove (seconds)."""
    to_remove = [(s, e) for s, e in silences if e - s >= min_silence_remove]
    to_remove = merge_intervals(to_remove, gap=0.0)
    if not to_remove:
        return [(0.0, duration)]

    keep: list[tuple[float, float]] = []
    cursor = 0.0
    for s, e in to_remove:
        s = max(0.0, s)
        e = min(duration, e)
        if s > cursor + 1e-4:
            keep.append((cursor, s))
        cursor = max(cursor, e)
    if cursor < duration - 1e-4:
        keep.append((cursor, duration))
    # Drop ultra-short glitches
    return [(a, b) for a, b in keep if b - a >= 0.04]


def build_filter_complex(segs: list[tuple[float, float]]) -> str:
    """Single-line filtergraph: trims + concat + mild cough / clarity chain on audio."""
    parts: list[str] = []
    for i, (s, e) in enumerate(segs):
        parts.append(
            f"[0:v]trim=start={s}:end={e},setpts=PTS-STARTPTS[v{i}]"
        )
        parts.append(
            f"[0:a]atrim=start={s}:end={e},asetpts=PTS-STARTPTS,aresample=48000[a{i}]"
        )
    n = len(segs)
    pairs = "".join(f"[v{i}][a{i}]" for i in range(n))
    parts.append(f"{pairs}concat=n={n}:v=1:a=1[vcat][acat]")
    parts.append(
        "[acat]highpass=f=90,afftdn=nf=-28:nr=10,"
        "equalizer=f=220:width_type=h:width=250:g=-2.5,"
        "acompressor=threshold=0.12:ratio=2.2:attack=3:release=120:makeup=1.5:knee=6[aout]"
    )
    return ";".join(parts)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("input_mov", type=Path)
    ap.add_argument("output_mov", type=Path)
    ap.add_argument(
        "--noise",
        default="-38dB",
        help="silencedetect noise threshold (default -38dB)",
    )
    ap.add_argument(
        "--min-detect",
        type=float,
        default=0.35,
        help="silencedetect minimum silence duration (seconds)",
    )
    ap.add_argument(
        "--min-remove",
        type=float,
        default=0.48,
        help="only remove silences at least this long (keeps short word gaps; "
        "higher = fewer cuts, faster encode)",
    )
    args = ap.parse_args()

    src = args.input_mov.expanduser().resolve()
    dst = args.output_mov.expanduser().resolve()
    if not src.is_file():
        print(f"Missing input: {src}", file=sys.stderr)
        return 1

    duration = ffprobe_duration(src)
    print(f"Duration {duration:.3f}s — running silencedetect…", flush=True)
    stderr = run_silencedetect(src, args.noise, args.min_detect)
    silences = merge_intervals(parse_silences(stderr), gap=0.001)
    print(f"Detected {len(silences)} raw silence intervals (merged adjacent).", flush=True)

    segs = keep_segments(duration, silences, args.min_remove)
    removed = duration - sum(b - a for a, b in segs)
    print(
        f"Keep {len(segs)} segments (~{removed:.1f}s removed, "
        f"{100 * removed / duration:.1f}% of timeline).",
        flush=True,
    )

    if len(segs) == 1:
        # Single segment: simpler graph (still apply cough chain on full audio).
        s, e = segs[0]
        fc = (
            f"[0:v]trim=start={s}:end={e},setpts=PTS-STARTPTS[v0];"
            f"[0:a]atrim=start={s}:end={e},asetpts=PTS-STARTPTS,aresample=48000[a0];"
            "[a0]highpass=f=90,afftdn=nf=-28:nr=10,"
            "equalizer=f=220:width_type=h:width=250:g=-2.5,"
            "acompressor=threshold=0.12:ratio=2.2:attack=3:release=120:makeup=1.5:knee=6[aout]"
        )
    else:
        fc = build_filter_complex(segs)

    # Long graphs: write to a file and pass with @ (avoids argv limits).
    fc_path: Path | None = None
    if len(fc) > 180_000:
        tmp = tempfile.NamedTemporaryFile(
            mode="w", suffix=".txt", delete=False, encoding="utf-8"
        )
        tmp.write(fc)
        tmp.close()
        fc_path = Path(tmp.name)
        fc_arg = f"@{fc_path}"
    else:
        fc_arg = fc

    try:
        cmd = [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "info",
            "-i",
            str(src),
            "-filter_complex",
            fc_arg,
            "-map",
            "[vcat]" if len(segs) > 1 else "[v0]",
            "-map",
            "[aout]",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "20",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-movflags",
            "+faststart",
            str(dst),
        ]
        if len(segs) == 1:
            cmd[cmd.index("[vcat]")] = "[v0]"

        print("Encoding…", flush=True)
        subprocess.run(cmd, check=True)
    finally:
        if fc_path is not None:
            fc_path.unlink(missing_ok=True)

    print(f"Wrote {dst}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
