---
slug: greenflux
hackathonName: Kaggle's GEMMA4GOOD hackathon
projectName: GreenFlux
problemAddressed: "Environmental signals are harder to monitor and interpret in real time; microalgae such as *Chlorella* respond quickly to nutrient, temperature, salinity, and light stress—carrying information about ecosystem health, carbon cycling, and biofuel potential—yet many workflows stay fragmented, cloud-dependent, and unsuited to labs, classrooms, or field sites that need privacy and offline-capable tools."
solutionSummary: 'Streamlit platform ("Photosynthetic Decision Systems") that treats algae as biological decision systems under uncertainty—interactive environmental and biological dashboards, stress-response exploration, retrieval-grounded Gemma 4 via Ollama, and transparent scientific outputs; aligns with Impact (Global Resilience), Special Tech (Ollama), and Safety & Trust; optional structured chain via `run_reasoning_chain` (Hypothesis, Evidence, Adaptation logic, Uncertainty) in Gemma Explains.'
datasetUsed: "Synthetic demo Parquet, user-uploaded CSV, or pipelines from public sets (laboratory algae growth corpora, ATP3 UFS-3 pond CSVs from OpenEI, GEO series with supplementary DE spreadsheets)."
modelTech: "Gemma 4 (Ollama), TF-IDF RAG over curated markdown, scientific reasoning orchestrator (`scientific_explain`), scikit-learn, Plotly, Streamlit, pandas/Parquet."
technicalContribution: "Local-first inference with vetted static fallback when Ollama is unavailable (no mandatory cloud completion); RAG-assembled prompts and system instructions that discourage invented numbers, surface uncertainty, and separate evidence from hypothesis; optional audit logging for reproducible demos; one shared orchestrator for free-form Q&A and the lightweight agentic scaffold (single-turn structured sections, not a multi-step tool loop)."
impact: "Demonstrates how local frontier models plus grounded retrieval can support environmental resilience—monitoring and stress interpretation, climate-resilience education, biofuel-oriented exploration, and offline or edge-friendly scientific assistance—so learners and practitioners get explainable narratives tied to measured or curated context instead of opaque, always-on cloud chat."
githubUrl: "https://github.com/ilakkmanoharan/green-flux"
kaggleUrl: ""
demoVideo: ""
writeupLink: ""
statusResult: "Submitted"
---

GreenFlux is the Kaggle GEMMA4GOOD submission described in the frontmatter: local Gemma 4 via Ollama, TF-IDF RAG over curated markdown, Streamlit dashboards for stress and environment exploration, and optional `run_reasoning_chain` for structured scientific explanation.
