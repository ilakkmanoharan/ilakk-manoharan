# Atlas-GS: An End-to-End Implementation of Gaussian World Modeling for Embodied Robotics

**Author:** Ilakkuvaselvi Manoharan  
**Affiliation:** Nature Foundation Models  
**Date:** June 2026  
**Version:** 1.0 — SciLayer preprint (implementation paper)

## Abstract

We present **Atlas-GS v1**, the first end-to-end implementation of a 3D Gaussian world-modeling pipeline within the Nature Foundation Models (NFM) hierarchy. Atlas-GS ingests RGB-D observations from simulation or benchmark datasets, constructs a persistent Gaussian field representation of the environment, localizes subsequent observations against that map, persists world state across sessions, and logs state–action–state transitions for downstream learning. The system implements Phases 0–6 of the Atlas-GS build specification as a modular Python package with CLI tools, reproducible dataset ingestion, and demo video generation—without requiring GPU hardware or robot deployment for v1 validation. We describe the architectural placement of Atlas-GS within NFM → NFM-Worlds → NFM-Robotics → Atlas, the design of a CPU-friendly Gaussian proxy field, key algorithms for mapping and localization, the world bundle persistence format, and empirical results on TUM RGB-D and synthetic sequences. Atlas-GS v1 establishes the substrate on which action semantics (v2), causal world models (v3), and the seven-stage NFM developmental pipeline can be built without architectural rework.

**Keywords:** 3D Gaussian Splatting, world models, embodied AI, RGB-D mapping, scene memory, Nature Foundation Models

---

## 1. Introduction

Persistent world representation is a prerequisite for embodied systems that learn from interaction. Classical SLAM maintains sparse feature maps or dense voxel grids; neural approaches use NeRF-style implicit fields or explicit 3D Gaussian Splatting (3DGS) for photorealistic, editable scene models. Within the Nature Foundation Models (NFM) research program, world representation is not an isolated engineering task—it is **Stage 1** of a developmental pipeline that progresses toward action semantics, causal discovery, mechanism inference, hypothesis generation, active experimentation, and adaptive scientific reasoning.

**Atlas-GS** is the first concrete implementation at the bottom of the NFM stack:

```text
Nature Foundation Models (NFM)
        ↓
NFM-Worlds
        ↓
NFM-Robotics
        ↓
Atlas
        ↓
Atlas-GS
```

This paper documents what was built, how it works, and how it connects to the broader NFM vision. Atlas-GS v1 is deliberately scoped as a **world-modeling and embodied-intelligence platform**, not a scientific-reasoning system. Its job is to make the core loop operational:

```text
Observe → Build / Update World → Log State → (Act → Observe consequences)*
```

with the abstraction:

```text
State_t + Action_t → State_{t+1}
```

### 1.1 Contributions

1. **End-to-end pipeline.** A working implementation from dataset download through world build, localization, scene memory, transition logging, and demo video export.
2. **Modular architecture.** Eight Python modules (`sensors`, `perception`, `gaussian_world`, `mapping`, `localization`, `scene_memory`, `transition_log`, `viz`) aligned with the Atlas-GS specification.
3. **CPU-first Gaussian proxy field.** RGB-D fusion and voxel aggregation produce a splat-compatible representation runnable without CUDA, with a documented upgrade path to Inria 3DGS / gsplat.
4. **Reproducible evaluation.** Benchmark ingest (TUM RGB-D), synthetic data generation, localization metrics, and persisted world bundles.
5. **Repository structure.** The NFM hierarchy is reflected in folder layout: `NFM-Worlds/`, `NFM-Robotics/Atlas/Atlas-GS/`.

### 1.2 Scope and non-goals (v1)

| In scope | Out of scope (v1) |
|----------|-------------------|
| RGB-D ingest (TUM, synthetic) | Action semantics learning (v2) |
| Gaussian world build & merge | Causal / mechanism models (v3–v4) |
| Pose localization vs map | LLM reasoning, symbolic planners |
| Scene memory save/load | Real-time multi-robot fleets |
| Transition logging | Full GPU 3DGS training (hook provided) |
| Novel-view / trajectory rendering | ROS 2 production nodes (planned) |

---

## 2. Position in Nature Foundation Models

Atlas-GS instantiates layers of the NFM hierarchy as follows:

| Layer | Role in Atlas-GS v1 |
|-------|----------------------|
| **NFM** | Long-term vision; seven-stage developmental roadmap |
| **NFM-Worlds** | `State_t`, transition tuples, future dynamics APIs |
| **NFM-Robotics** | Sensor ingest, calibration hooks, sim-first development |
| **Atlas** | Navigation / observation as knowledge acquisition |
| **Atlas-GS** | Gaussian map, mapping, localization, scene memory |

The repository mirrors this chain:

```text
Nature-Foundation-Models/
├── NFM-Worlds/
├── NFM-Robotics/
│   └── Atlas/
│       └── Atlas-GS/
│           ├── implementation/    ← Python package
│           ├── docs/
│           ├── data/
│           ├── worlds/
│           └── demos/
└── paper/                         ← this document
```

Atlas-GS v1 implements world-state and transition **locally** within `Atlas-GS/`. As the stack matures, shared abstractions will migrate upward into `NFM-Worlds/` (state schemas, dynamics) and `NFM-Robotics/` (sensor middleware).

---

## 3. System Architecture

### 3.1 Pipeline overview

```text
┌─────────────────────────────────────────────────────────────┐
│  Inputs: TUM RGB-D · Synthetic RGB-D · (future: ROS bags)   │
└────────────────────────────┬────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Phase 0: Environment — configs, dataset download            │
└────────────────────────────┬────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Phases 1–2: Sensor ingest + RGB-D fusion                  │
│  sensors/tum_loader · sensors/synthetic · perception/rgbd    │
└────────────────────────────┬────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Phase 3: Mapping — keyframes + Gaussian world build         │
│  mapping/mapper · gaussian_world/builder                     │
└────────────────────────────┬────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Phase 4: Localization — ICP vs Gaussian centers             │
│  localization/localizer                                      │
└────────────────────────────┬────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Phase 5: Scene memory — world bundle persist/load           │
│  scene_memory/world_bundle                                   │
└────────────────────────────┬────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Phase 6: Transition log + demo videos                       │
│  transition_log/logger · viz/video                           │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Module map

| Module | Responsibility |
|--------|----------------|
| `sensors/` | Load TUM sequences; procedural synthetic RGB-D |
| `perception/` | Depth back-projection to world-frame points |
| `gaussian_world/` | Gaussian field params, build, CPU splat render |
| `mapping/` | Keyframe selection by pose delta |
| `localization/` | ICP pose refinement against map |
| `scene_memory/` | PLY + binary bundle + metadata |
| `transition_log/` | JSONL `(state, action, state)` records |
| `viz/` | Orbit and trajectory MP4 export |

### 3.3 Software stack

| Component | Choice (v1) |
|-----------|-------------|
| Language | Python 3.9+ |
| Arrays / geometry | NumPy, OpenCV |
| Config | YAML |
| Video | imageio + libx264 |
| Tests | pytest |
| Package | `atlas_gs` (editable install via `pyproject.toml`) |

---

## 4. Data Model

### 4.1 World state

At time \(t\):

```text
State_t = {
  gaussian_map_id,
  gaussian_params: GaussianField,
  robot_pose: SE(3),
  timestamp,
  frame_id,
  metadata
}
```

### 4.2 Gaussian field (v1 proxy)

Full 3DGS stores anisotropic covariances and spherical-harmonic color. Atlas-GS v1 uses a **Gaussian proxy field** so the entire pipeline runs on CPU:

| Field | Type | Description |
|-------|------|-------------|
| `position` | \(\mathbb{R}^3\) | Mean in world frame |
| `scale` | \(\mathbb{R}\) | Isotropic radius |
| `color` | RGB uint8 | View-independent color (v1) |
| `opacity` | \(\mathbb{R}\) | Alpha |
| `id` | uint64 | Stable identifier |

**Upgrade path:** `gaussian_world/trainer_gsplat.py` documents COLMAP export → Inria 3DGS / gsplat training → import of SH coefficients and anisotropic scales.

### 4.3 Observations

```text
Observation_t = {
  rgb: Image[H, W, 3],
  depth: Image[H, W],           # meters
  intrinsics: CameraMatrix,
  extrinsics: SE(3),             # optional ground truth
  timestamp, frame_id
}
```

### 4.4 Transitions

Every logged interaction:

```text
Transition = {
  state_before, action, state_after,
  delta_summary: { pose_delta, ... }
}
```

v1 derives actions as `base_velocity` from consecutive ground-truth pose translations—placeholder semantics for v2 learning.

---

## 5. Algorithms

### 5.1 RGB-D fusion

Valid depth pixels (within `[min_depth, max_depth]`) are back-projected:

\[
\mathbf{p}_\text{cam} = z \cdot K^{-1} [u, v, 1]^T
\]

and transformed to world frame when pose \(T_{wc}\) is available:

\[
\mathbf{p}_\text{world} = R \mathbf{p}_\text{cam} + \mathbf{t}
\]

Stride-2 subsampling balances density and speed.

### 5.2 Voxel Gaussian merge

Fused points are aggregated into voxels of size \(v\) (default 2–4 cm). Each voxel becomes one Gaussian with mean position, mean color, mean opacity, and scale \(\approx v/2\). Incremental mapping merges new keyframe Gaussians via `GaussianField.merge()` followed by voxel downsampling.

### 5.3 Keyframe selection

A new keyframe is accepted when translation exceeds 8–12 cm or rotation exceeds 8–10° relative to the previous keyframe (configurable in `configs/default.yaml` and `configs/demo.yaml`).

### 5.4 Localization

Given an initial pose (ground truth on TUM, or previous frame), subsampled depth points are refined with lightweight **ICP** against Gaussian center positions:

- Max correspondence distance: 5–8 cm  
- Iterations: 20–30  
- Translation update: damped step on mean residual  

Pose error is reported against TUM ground truth when available.

### 5.5 Rendering

A CPU splat renderer projects Gaussians as alpha-blended disks sorted by depth. Two demo modes:

- **Orbit** — 360° tour around the world centroid  
- **Trajectory** — replay dataset camera poses against the map  

---

## 6. Implementation Phases

Atlas-GS v1 implements all specification phases:

| Phase | Goal | Status | Key artifacts |
|-------|------|--------|---------------|
| **0** | Environment & datasets | Done | `pyproject.toml`, `download_datasets.py`, synthetic generator |
| **1** | Offline world builder | Done | `gaussian_world/builder.py`, `atlas-gs build` |
| **2** | Sensor ingest | Done | `tum_loader.py`, `rgbd_fusion.py` |
| **3** | Online mapping | Done | Keyframes + incremental merge |
| **4** | Localization | Done | `localizer.py`, `localization.json` |
| **5** | Scene memory | Done | PLY + `ATLASGS1` binary + metadata |
| **6** | Transitions & demo | Done | `transitions.jsonl`, MP4 videos, `run_demo.py` |

### 6.1 CLI

```bash
atlas-gs build      --input <dataset> --output <world_dir>
atlas-gs localize   --world <world_dir> --input <dataset>
atlas-gs log-transitions --world <world_dir> --input <dataset>
atlas-gs demo-video --world <world_dir> --output <mp4> [--mode orbit|trajectory]
```

### 6.2 End-to-end orchestrator

`scripts/run_demo.py` executes Phases 0–6 in sequence for `synthetic` or `tum-fr1-xyz` presets.

---

## 7. Datasets

| Dataset | Preset | Role |
|---------|--------|------|
| TUM RGB-D `fr1_xyz` | `tum-fr1-xyz` | Mapping, localization, transitions |
| TUM RGB-D `fr1_desk` | `tum-fr1-desk` | Optional second scene |
| Synthetic room | `synthetic` | CI / offline demo, known GT poses |

**TUM ingest:** fx=fy=525, cx=319.5, cy=239.5, 640×480; depth scale 5000; RGB–depth sync via nearest timestamp (Δt ≤ 20 ms).

**Future:** Replica, ScanNet, Habitat-Sim, AI2-THOR—same ingest path with additional loaders.

---

## 8. Evaluation and Results

We report results from the v1 demo configuration (`configs/demo.yaml`: voxel 4 cm, 40 frames).

### 8.1 TUM RGB-D `fr1_xyz`

| Metric | Value |
|--------|-------|
| Frames processed | 40 |
| Keyframes selected | 4 |
| Gaussians in map | 4,018 |
| Localization trans. RMSE | **0.0102 m** |
| Transitions logged | 39 |
| World bundle | `worlds/tum-fr1-xyz/` |

### 8.2 Synthetic room

| Metric | Value |
|--------|-------|
| Frames processed | 40 |
| Keyframes | 40 (full orbit) |
| Gaussians in map | ~29,000 (demo config) |
| Demo videos | orbit + trajectory MP4 |

### 8.3 Artifacts

```text
worlds/<name>/
├── metadata.json
├── gaussians.ply
├── gaussians.bin          # ATLASGS1 magic, fast reload
├── localization.json
└── transitions.jsonl

demos/videos/
├── tum-fr1-xyz_orbit.mp4
├── tum-fr1-xyz_trajectory.mp4
├── synthetic_orbit.mp4
└── synthetic_trajectory.mp4
```

---

## 9. Design Decisions

### 9.1 Simulation-first, hardware-optional

v1 validates the full loop on benchmark and synthetic data. RealSense / ROS 2 ingest is specified but deferred—reducing barrier to reproduction.

### 9.2 CPU proxy before GPU 3DGS

Training full 3DGS requires CUDA and minutes-to-hours per scene. The proxy field proves mapping, memory, localization, and logging semantics immediately, while `trainer_gsplat.py` preserves the upgrade path.

### 9.3 Transition logging for v2

JSONL transition logs with pose deltas are intentionally simple. They seed **action semantics learning** in v2 without committing to a specific policy or manipulation stack.

### 9.4 Folder hierarchy = conceptual hierarchy

`NFM-Worlds/` and `NFM-Robotics/Atlas/` exist as scaffolds even where code is not yet extracted—making the research architecture legible in the repository.

---

## 10. Limitations

1. **Isotropic Gaussians, no SH.** View-dependent effects and anisotropic geometry are approximated.
2. **ICP localization.** Not comparable to learned relocalizers or full Gaussian SLAM systems.
3. **Batch keyframe processing.** v1 merges keyframes in batch; true streaming SLAM is future work.
4. **Hardcoded TUM intrinsics.** Per-device calibration YAML is specified but not yet wired.
5. **No dynamic objects.** Static world assumption; dynamic scenes are out of scope.
6. **CPU renderer.** Demo videos are functional, not photorealistic.

---

## 11. Roadmap

Atlas-GS follows the NFM seven-stage pipeline:

| Version | Capability |
|---------|------------|
| **v1** | World representation (this work) |
| **v2** | Action semantics from transition log |
| **v3** | Causal world models |
| **v4** | Mechanism discovery |
| **v5** | Hypothesis generation |
| **v6** | Active experiment design |
| **v7** | Adaptive scientific reasoning |

Near-term engineering: gsplat integration, ROS 2 nodes, Replica/ScanNet loaders, learned localization, incremental online mapping.

---

## 12. Reproducibility

```bash
cd NFM-Robotics/Atlas/Atlas-GS/implementation
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"

python scripts/run_demo.py --dataset synthetic --max-frames 40
python scripts/run_demo.py --dataset tum-fr1-xyz --max-frames 40
```

Source: `NFM-Robotics/Atlas/Atlas-GS/implementation/src/atlas_gs/`  
Documentation: `NFM-Robotics/Atlas/Atlas-GS/docs/`  
Specification: `private/atlas-gs-spec/atlas-gs-spec.md`

---

## 13. Conclusion

Atlas-GS v1 delivers the first runnable Gaussian world-modeling stack in the Nature Foundation Models hierarchy. It transforms RGB-D observations into persistent Gaussian maps, localizes against them, saves and reloads world state, logs transitions for future action learning, and produces demo videos—all in a modular, CPU-accessible package. The implementation is intentionally narrow: it does not yet reason scientifically, but it establishes the **world substrate** on which NFM’s developmental pipeline depends. By mirroring the NFM hierarchy in repository structure and keeping the `State_t + Action_t → State_{t+1}` abstraction central, Atlas-GS provides a concrete foundation for v2–v7 without architectural rework.

---

## References

1. Kerbl, B., et al. (2023). *3D Gaussian Splatting for Real-Time Radiance Field Rendering.* SIGGRAPH.  
2. Sturm, J., et al. (2012). *A Benchmark for the Evaluation of RGB-D SLAM Systems.* IROS (TUM RGB-D dataset).  
3. Haarnoja, T., et al. (2023). *Learning Universal Policies via Text-Guided Video Generation.* (World models context.)  
4. Manoharan, I. (2026). *Nature Foundation Models: A Hierarchical Framework for Learning Worlds, Embodiment, and Scientific Intelligence.* NFM framework paper.  
5. Nature Foundation Models Project. *Atlas-GS Build Specification.* `private/atlas-gs-spec/atlas-gs-spec.md`.

---

## Appendix A: Configuration defaults

```yaml
mapping:
  voxel_size: 0.02
  max_depth: 4.0
  keyframe_translation: 0.08
  keyframe_rotation_deg: 8.0

localization:
  icp_max_correspondence: 0.05
  icp_iterations: 30
```

Demo profile uses coarser voxels (0.04 m) for faster build and render.

## Appendix B: World bundle binary format

```text
Magic:     "ATLASGS1" (8 bytes)
Count:     uint64
Positions: count × 3 × float32
Scales:    count × float32
Colors:    count × 3 × uint8
Opacity:   count × float32
IDs:       count × uint64
```

Interchange PLY is written in parallel for external tools.
