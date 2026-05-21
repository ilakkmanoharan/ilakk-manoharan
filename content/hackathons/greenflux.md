---
slug: greenflux
hackathonName: Kaggle's GEMMA4GOOD hackathon
projectName: GreenFlux
problemAddressed: "Environmental signals are harder to monitor and interpret in real time; microalgae such as *Chlorella* respond quickly to nutrient, temperature, salinity, and light stress—carrying information about ecosystem health, carbon cycling, and biofuel potential—yet many workflows stay fragmented, cloud-dependent, and unsuited to labs, classrooms, or field sites that need privacy and offline-capable tools."
solutionSummary: 'GreenFlux ("Photosynthetic Decision Systems"): Streamlit app exploring how microalgae—especially *Chlorella*—respond to abiotic stress and reallocate metabolism; Plotly dashboards, optional scikit-learn models, environmental what-if simulator, and privacy-friendly Gemma 4 via Ollama with TF-IDF RAG over curated markdown—plus optional `run_reasoning_chain` (Hypothesis, Evidence, Adaptation logic, Uncertainty) for scaffolded scientific explanation.'
datasetUsed: "Synthetic demo Parquet, user-uploaded CSV, or pipelines from public sets (laboratory algae growth corpora, ATP3 UFS-3 pond CSVs from OpenEI, GEO series with supplementary DE spreadsheets)."
modelTech: "Gemma 4 (Ollama), TF-IDF RAG over curated markdown, scientific reasoning orchestrator (`scientific_explain`), scikit-learn, Plotly, Streamlit, pandas/Parquet."
technicalContribution: "Local-first inference with vetted static fallback when Ollama is unavailable (no mandatory cloud completion); RAG-assembled prompts that discourage invented numbers and surface uncertainty; shared `scientific_explain` orchestrator for free-form Q&A and single-turn structured reasoning via `run_reasoning_chain`—scaffolded agentic pattern, not a multi-step tool loop yet; reproducible grounding for labs, classrooms, and offline field use."
impact: "Demonstrates how local frontier models plus grounded retrieval can support environmental resilience—monitoring and stress interpretation, climate-resilience education, biofuel-oriented exploration, and offline or edge-friendly scientific assistance—so learners and practitioners get explainable narratives tied to measured or curated context instead of opaque, always-on cloud chat."
githubUrl: "https://github.com/ilakkmanoharan/green-flux"
kaggleUrl: ""
demoVideo: ""
writeupLink: ""
statusResult: "Submitted"
---

GreenFlux is the Kaggle GEMMA4GOOD submission: Streamlit, pandas/Parquet, Plotly, scikit-learn + TF-IDF RAG over markdown, and local Gemma chat via Ollama. Data may be synthetic demo parquet, user CSV, or public algae growth / pond / GEO pipelines. The shipped experience focuses on reproducible grounding, simple deployment, and clear limits of single-turn assistance—fine-tuning and future tool-call loops are documented as extensions.
