# Nature Foundation Models: A Hierarchical Framework for Learning Worlds, Embodiment, and Scientific Intelligence

**Author:** Ilakkuvaselvi Manoharan  
**Affiliation:** Nature Foundation Models  
**Date:** June 2026  
**Version:** 2.0 — SciLayer preprint (concept paper)

## Abstract

Recent advances in artificial intelligence have demonstrated remarkable capabilities in language understanding, perception, planning, and control. However, most contemporary systems remain specialized architectures optimized for specific tasks, datasets, or environments. We propose **Nature Foundation Models (NFM)**, a research program aimed at developing systems that learn representations, dynamics, causal structure, and mechanisms directly from interaction with the natural world.

NFM introduces a hierarchical framework consisting of three layers: NFM, a general scientific intelligence research program; NFM-Worlds, a foundational world-modeling platform that learns how environments evolve through observation and intervention; and NFM-Robotics, an embodied learning platform that grounds world learning in physical interaction.

Within this hierarchy, Atlas serves as the robotics project family, while Atlas-GS represents the first implementation based on Gaussian Splatting world representations. The framework defines a progression from world representation learning to action semantics acquisition, causal discovery, mechanism inference, hypothesis generation, active experimentation, and adaptive scientific reasoning.

The central thesis of this work is that scientific reasoning should not be treated as an independent symbolic capability but should emerge naturally from increasingly sophisticated interactions with learned world models.

This emergence is realized through a **developmental pipeline**—world representation, action semantics, causal discovery, mechanism inference, hypothesis generation, active experimentation, and adaptive reasoning—driven by increasingly sophisticated interaction with learned world models.

---

## 1. Introduction

Artificial intelligence has progressed through increasingly powerful pattern-learning systems. Deep learning enabled large-scale representation learning. Foundation models generalized these capabilities across broad domains. Reinforcement learning enabled decision-making through interaction.

A fundamental question remains:

> How can intelligent systems learn the structure of reality itself?

Humans do not merely predict observations. They construct models of environments, infer causal relationships, propose explanations, perform experiments, and refine theories through interaction. Scientific reasoning emerges from this iterative process.

We argue that future intelligent systems require architectures capable of:

- Learning persistent world representations
- Understanding actions through interaction
- Discovering causal relationships
- Inferring hidden mechanisms
- Generating competing explanations
- Designing experiments to reduce uncertainty

Nature Foundation Models is proposed as a research framework toward this objective.

### 1.1 Research Questions

1. Can world representation, action semantics, and causal reasoning be learned within a single developmental architecture rather than as disconnected modules?
2. Does embodiment—physical interaction with environments—provide information that passive observation or simulation cannot?
3. Can a unified state–action–dynamics abstraction span physical, biological, chemical, and ecological domains?
4. At what stage of world-model sophistication does scientific reasoning become an emergent capability rather than a hand-engineered subsystem?

### 1.2 Contributions

This document contributes:

1. A hierarchical research architecture connecting scientific intelligence, world modeling, embodiment, and concrete implementations.
2. A formal core abstraction—state, action, dynamics—shared across domains.
3. A seven-stage developmental roadmap from world representation to adaptive scientific reasoning.
4. A clear positioning against prior work in world models, causal inference, embodied AI, and 3D scene representations.
5. An initial instantiation (Atlas-GS) that grounds the framework in physical robotics.

---

## 2. Core Abstraction

The common abstraction across NFM is not the domain (robotics, biology, chemistry). It is the interaction loop:

```text
State_t + Action_t → State_{t+1}
```

A **world** is defined as:

```text
World = (State, Dynamics, Actions, Observations)
```

where:

- **State** — a representation of the environment at a point in time
- **Dynamics** — rules governing how states evolve
- **Actions** — interventions or controls that alter state
- **Observations** — partial, sensor-derived views of state

The overarching learning objective:

```text
Observation + Action + Feedback + Time → Knowledge
```

where knowledge includes representations, dynamics, causal relationships, mechanisms, and—eventually—scientific theories.

### 2.1 Cross-Domain Equivalence

The same abstraction applies across domains:

| Domain | State | Action / Intervention | Observed Transition |
|--------|-------|----------------------|---------------------|
| Physical (robotics) | 3D scene, robot pose | Move, push, grasp | New viewpoint, object displacement |
| Biological | Gene expression, pathway activity | Drug perturbation, knockout | Expression change, pathway shift |
| Chemical | Molecular configuration | Reaction, catalyst | Product formation |
| Ecological | Population, resource levels | Environmental stress | Adaptation, population change |

Mathematically, these are the same class of problem: learn world structure, dynamics, and the semantics of interventions from experience.

---

## 3. The NFM Hierarchy

The framework consists of five layers. Each layer addresses a different level of abstraction.

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

Future domain branches (NFM-Biology, NFM-Chemistry, NFM-Ecology) and additional Atlas implementations (Atlas-NeRF, Atlas-Sim) extend from this core chain but follow the same state–action–dynamics abstraction.

**NFM** is the scientific-intelligence research program. It is not robotics, biology, or simulation individually.

**NFM-Worlds** is the foundational world-modeling layer. All domain branches share the state–action–dynamics abstraction.

**NFM-Robotics** provides the embodied learning platform—sensors, manipulators, mobility—that generates structured experiences for world learning. It is the "body"; NFM-Worlds is the "brain."

**Atlas** is the robotics project family built on NFM-Robotics. It treats navigation, manipulation, and observation as mechanisms for acquiring knowledge, not merely for task completion.

**Atlas-GS** is the first Atlas implementation, using Gaussian Splatting for persistent 3D world representations.

---

## 4. NFM-Worlds

NFM-Worlds learns how environments evolve through observation and intervention:

```text
State_t + Action_t → State_{t+1}
```

without requiring complete prior knowledge of the environment.

### 4.1 World Representation

Learning persistent representations of environments.

Examples: 3D scenes, biological states, chemical systems, simulated environments.

### 4.2 Dynamics Learning

Learning how states evolve over time:

```text
Current State → Future State
```

### 4.3 Action Semantics

Understanding what actions mean by observing their consequences. Rather than defining actions symbolically:

```text
MoveForward = predefined meaning
```

NFM-Worlds learns:

```text
Action → Observed State Difference → Semantic Meaning
```

directly from experience.

### 4.4 Causal Discovery

Moving beyond prediction toward explanation:

- What caused this change?
- Which variables were responsible?
- What interventions alter outcomes?

### 4.5 Mechanism Discovery

Inferring hidden structures—latent variables, unobserved processes—that produce observed transitions. A door opening is not merely a state change; a latch mechanism may explain it.

---

## 5. NFM-Robotics and Atlas

### 5.1 Role of Embodiment

While NFM-Worlds can learn from simulations or datasets, robotics enables direct interaction with physical reality. The role of robotics is not merely control. It is **scientific observation**.

Robots provide sensors, cameras, manipulators, mobility, and interventions that generate structured experiences for world learning.

```text
NFM-Worlds = Brain
NFM-Robotics = Body
```

### 5.2 Atlas

Atlas is the embodied world-learning family built on NFM-Robotics. It provides:

- Navigation
- Manipulation
- Observation
- Experimentation

within learned world models. The objective is understanding, not merely task completion. Interaction is a mechanism for acquiring knowledge about environments.

Robotics provides fast feedback loops for validating NFM ideas—state representation, action semantics, causal intervention, replay and reflection—faster than in biological or chemical domains. Atlas is therefore both a practical engineering target and a scientific testbed for the broader NFM vision.

---

## 6. Atlas-GS: Gaussian World Models

Atlas-GS is the first implementation of the Atlas family.

**Inputs:**

```text
RGB, RGB-D, Stereo, Robot Sensors
```

**Output:**

```text
Persistent 3D Gaussian World
```

This representation supports:

- Localization and mapping
- Scene memory
- Action analysis
- Foundation for causal reasoning (future stages)

**Scope note.** Atlas-GS today is primarily a world-modeling and embodied-intelligence system—perception, mapping, action learning, prediction, and planning. Scientific reasoning capabilities (hypothesis generation, experiment design, theory refinement) are roadmap targets, not current defining characteristics. Positioning Atlas-GS accurately avoids overclaiming while preserving the long-term developmental arc.

---

## 7. Developmental Capability Roadmap

Capabilities emerge sequentially. Each stage builds on the previous; later stages are not independent modules bolted onto earlier ones.

```text
World Representation
    ↓
Action Semantics Learning
    ↓
Causal Discovery
    ↓
Mechanism Discovery
    ↓
Hypothesis Generation
    ↓
Active Experiment Design
    ↓
Adaptive Scientific Reasoning
```

### Stage 1: World Representation

| | |
|---|---|
| **Learn** | Observe → Build World |
| **Output** | Persistent world model |
| **Example (Atlas-GS)** | 3D Gaussian scene from RGB-D |

### Stage 2: Action Semantics

| | |
|---|---|
| **Learn** | State + Action → State Difference |
| **Output** | Grounded action meanings |
| **Example** | "Push" correlates with object displacement |

### Stage 3: Causal Learning

| | |
|---|---|
| **Learn** | Cause → Effect |
| **Output** | Interpretable causal models |
| **Example** | Identifying which action variable caused an outcome |

### Stage 4: Mechanism Discovery

| | |
|---|---|
| **Learn** | Infer hidden structures responsible for observations |
| **Output** | Mechanistic explanations |
| **Example** | Latent latch state explains door behavior |

### Stage 5: Hypothesis Generation

| | |
|---|---|
| **Learn** | Maintain multiple competing explanations |
| **Output** | Theory candidates |
| **Example** | H1: force threshold; H2: latch state change |

### Stage 6: Active Experiment Design

| | |
|---|---|
| **Learn** | Select actions that maximize information gain |
| **Output** | Efficient discovery |
| **Example** | Probe latch before pushing harder |

### Stage 7: Adaptive Scientific Reasoning

| | |
|---|---|
| **Learn** | Integrate all previous capabilities |
| **Output** | Agents that construct and refine theories through interaction |

---

## 8. What Is New?

The novelty is not a new robot, simulator, or world model alone.

The strongest novelty claim is **not** any single component in isolation:

| Component | Status |
|-----------|--------|
| World models | Established (Dreamer, MuZero, GWM) |
| Robotics | Established |
| Gaussian Splatting | Established |
| Causal reasoning | Established (Pearl, Peters et al.) |
| Active inference | Established (Friston) |
| Scientific reasoning | Established in narrow domains |

The novelty is the hierarchical integration of:

```text
World Learning
+
Action Semantics Learning
+
Causal Discovery
+
Mechanism Discovery
+
Hypothesis Generation
+
Experiment Design
```

within a single developmental framework.

**The novelty is the developmental integration.** NFM treats the following as a single continuous learning process—not separate research programs:

```text
World Learning + Action Semantics + Causal Discovery
+ Mechanism Discovery + Hypothesis Generation + Experiment Design
```

Most existing systems focus on one or two of these components.

NFM proposes that these capabilities emerge sequentially from increasingly sophisticated interactions with learned world models.

Scientific reasoning is therefore not treated as an independent symbolic module but as an emergent consequence of world learning.

NFM proposes that scientific reasoning emerges sequentially from increasingly sophisticated interactions with learned world models, rather than from an independent symbolic module added after the fact.

This is the central research thesis worth defending.

---

## 9. Relationship to Prior Work

NFM builds on established directions but differs in architectural intent.

### World Models

- Ha and Schmidhuber (2018); Dreamer (Hafner et al., 2019–2023); MuZero (Schrittwieser et al., 2020)
- **NFM difference:** World models are the substrate for a developmental pipeline toward scientific reasoning, not primarily for reward maximization or game playing.

### Causal Reasoning

- Pearl (2009); Peters, Janzing, and Schölkopf (2017)
- **NFM difference:** Causal structure is discovered through embodied interaction with learned world models, not assumed from a fixed observational dataset.

### Active Inference

- Friston (2010); Friston et al. (2017)
- **NFM difference:** Shares the emphasis on uncertainty reduction and action selection, but targets explicit mechanism and hypothesis stages beyond perceptual inference.

### Cognitive Architectures

- Newell (1990); ACT-R (Anderson et al., 2004)
- **NFM difference:** Capabilities are learned from interaction rather than hand-specified production rules and memory structures.

### Embodied AI

- Habitat, AI2-THOR, BEHAVIOR
- **NFM difference:** Benchmarks emphasize task completion; NFM emphasizes knowledge acquisition and developmental progression toward scientific reasoning.

### 3D World Representations

- NeRF; 3D Gaussian Splatting
- **NFM difference:** Representations serve persistent world memory, action-semantic learning, and future causal reasoning—not just novel-view synthesis.

### Large Language Models

- GPT, Claude, Gemini, and related foundation models
- **NFM difference:** LLMs learn statistical structure of text; NFM learns structure of environments through interaction. Complementary, not competing—language models may eventually interface with NFM world models, but NFM grounds knowledge in sensorimotor experience.

Unlike most prior approaches, NFM explicitly places scientific reasoning as the final stage of a developmental world-learning pipeline.

---

## 10. Evaluation and Open Challenges

### 10.1 Evaluation Principles

Progress should be measured at each developmental stage, not only by end-task performance:

| Stage | Example Metrics |
|-------|-----------------|
| World representation | Reconstruction quality, map persistence, localization accuracy |
| Action semantics | Predictive accuracy of state differences given actions |
| Causal discovery | Intervention effect identification, counterfactual prediction |
| Mechanism discovery | Latent variable recovery on environments with hidden structure |
| Hypothesis generation | Diversity and calibration of competing explanations |
| Experiment design | Information gain per intervention, sample efficiency |
| Scientific reasoning | Theory revision under new evidence |

### 10.2 Open Challenges

- **Scalability:** Persistent world models that grow with exploration without catastrophic drift.
- **Compositional generalization:** Transferring learned action semantics and causal structure to novel objects and environments.
- **Uncertainty:** Representing and acting under epistemic uncertainty at every developmental stage.
- **Cross-domain transfer:** Whether abstractions learned in robotics accelerate learning in biological or chemical domains.
- **Theory representation:** How competing hypotheses and mechanisms are stored, compared, and revised within world models.

---

## 11. Conclusion

Nature Foundation Models proposes a hierarchical framework for learning representations, actions, causality, mechanisms, and scientific theories directly from interaction with environments.

The framework is organized as:

```text
NFM
→ NFM-Worlds
→ NFM-Robotics
→ Atlas
→ Atlas-GS
```

where Gaussian world models provide the initial substrate for embodied learning.

The central hypothesis is that scientific reasoning emerges naturally from persistent world models that progressively acquire richer representations of actions, causes, mechanisms, and uncertainty.

If successful, this approach could provide a pathway from world modeling to autonomous scientific intelligence.

If successful, NFM could provide a pathway from world modeling to autonomous scientific intelligence, validated first in fast-feedback physical environments and extended to biological, chemical, and ecological domains through the same state–action–dynamics abstraction.

---

## Appendix A: Terminology

| Term | Definition |
|------|------------|
| **NFM** | Nature Foundation Models; overarching scientific-intelligence research program |
| **NFM-Worlds** | World-modeling platform; learns state, dynamics, actions, causality |
| **NFM-Robotics** | Embodied learning platform; sensors, actuators, and physical interaction |
| **Atlas** | Robotics project family built on NFM-Robotics |
| **Atlas-GS** | Atlas implementation using 3D Gaussian Splatting |
| **GWM** | Gaussian World Model; established term in splatting-robotics literature |
| **Developmental pipeline** | Sequential emergence of capabilities from world representation to scientific reasoning |
