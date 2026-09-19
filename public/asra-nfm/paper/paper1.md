## Concepts Used in the ASRA-NFM Implementation

ASRA-NFM is an adaptive neuro-symbolic reasoning architecture designed to learn world models, solve unfamiliar interactive environments, and conduct autonomous machine-learning experiments. The implementation combines deep learning’s ability to discover patterns with symbolic AI’s ability to represent rules, reason about causes, and produce interpretable solutions.

### 1. Neuro-Symbolic Learning

The central concept is the integration of neural and symbolic reasoning.

The neural component learns representations from raw observations such as images, grids, numerical features, or environment states. It is useful when the structure of the input is not known in advance.

The symbolic component converts those learned representations into explicit objects, properties, relations, actions, constraints, and rules. It can then reason over them using operations such as comparison, transformation, search, and logical inference.

This combination allows the system to learn from data while still producing structured and explainable solutions.

### 2. Object-Centric State Representation

Instead of treating an observation as an undifferentiated array of values, the system attempts to identify meaningful entities.

A state may be represented as:

$$
s_t = \{o_1, o_2, \ldots, o_n, R_t, C_t\}
$$

where:

* \(o_i\) represents an object or entity.
* \(R_t\) represents relationships between objects.
* \(C_t\) represents global context or constraints.

Each object may contain properties such as position, color, shape, size, orientation, velocity, or category. This representation supports generalization because the system can reason about objects and relationships rather than memorizing entire observations.

### 3. Transition-Based World Modeling

The basic unit of learning is the transition:

$$
T_t = (s_t, a_t, s_{t+1})
$$

The system observes the state before an action, the action performed, and the resulting state. It then learns a transition model:

$$
\hat{s}_{t+1} = f_\theta(s_t, a_t)
$$

This model predicts how the environment changes in response to an action. Repeated transitions allow the system to discover stable rules, including movement behavior, collision rules, transformations, resource changes, and interaction mechanisms.

### 4. Action-Semantics Discovery

An action identifier does not necessarily reveal what the action means. For example, action `2` could mean move left, rotate an object, select an item, or interact with a tool.

ASRA-NFM learns action meaning through intervention. It compares states before and after an action and identifies the most consistent change:

$$
\Delta_t = s_{t+1} - s_t
$$

The system distinguishes between:

* Action syntax: the command or action identifier.
* Action semantics: the observable effect of the action.
* Action mechanism: the underlying rule that produces that effect.
* Action utility: whether the action helps achieve the current goal.

This is essential for solving environments with unknown controls.

### 5. Causal World Models

The system does more than identify correlations. It performs controlled interventions and observes their consequences.

For example, it may test whether:

* Moving onto a particular object changes the score.
* Touching an obstacle ends the episode.
* Repeating an action produces the same transition.
* An action behaves differently depending on position or context.

The learned model can be expressed as:

$$
P(s_{t+1} \mid s_t, do(a_t))
$$

This causal perspective helps the agent determine which actions produce particular outcomes and supports planning in novel situations.

### 6. Symbolic Rule Induction

Observed transitions are converted into candidate rules. Examples include:

```text
IF action = LEFT
AND the cell to the left is empty
THEN move the player one cell left.
```

```text
IF the player overlaps the goal
THEN increase reward
AND terminate the episode successfully.
```

Candidate rules are evaluated based on:

* Coverage of observed transitions
* Prediction accuracy
* Consistency across episodes
* Number of exceptions
* Rule complexity
* Generalization to unseen states

The system prefers the simplest rule set that adequately explains the observations. This follows the minimum-description-length principle: the shortest sufficient program or model is often more likely to capture the underlying mechanism.

### 7. Hypothesis Generation and Testing

When the environment is uncertain, the system maintains multiple possible explanations rather than committing immediately to one.

For example:

```text
H1: The red object is a goal.
H2: The red object is an obstacle.
H3: The red object changes the player’s abilities.
```

Each hypothesis receives a confidence score. The agent then chooses experiments that can distinguish between competing explanations.

The hypothesis lifecycle is:

```text
Propose → Predict → Intervene → Observe → Evaluate → Retain or Reject
```

This turns environment exploration into a structured scientific process.

### 8. Active Exploration and Information Gain

The agent does not select actions only for immediate reward. It may choose an action because it reduces uncertainty about the world.

A useful action balances several objectives:

$$
U(a) =
\alpha R(a)
+ \beta IG(a)
- \gamma Risk(a)
- \delta Cost(a)
$$

where:

* \(R(a)\) is expected task reward.
* \(IG(a)\) is expected information gain.
* \(Risk(a)\) is the probability of failure or irreversible damage.
* \(Cost(a)\) represents time or computational expense.

This allows the system to explore intelligently while avoiding unnecessary or dangerous actions.

### 9. Planning Through the Learned World Model

Once the transition rules are sufficiently reliable, the system can simulate possible action sequences internally.

Given the current state and a possible sequence:

$$
A = (a_1, a_2, \ldots, a_k)
$$

the world model predicts the resulting states and rewards. Search algorithms such as breadth-first search, A*, beam search, or Monte Carlo Tree Search can then select a promising plan.

The system prefers symbolic planning when the learned rules are discrete and reliable. Neural policies may be used when the state space is large, continuous, or visually complex.

### 10. Uncertainty-Aware Reasoning

Every perception, rule, prediction, and hypothesis carries uncertainty.

The system records:

* Confidence in detected objects
* Confidence in action meanings
* Confidence in induced rules
* Prediction errors
* Known exceptions
* Unexplored state regions

When confidence is low, the agent gathers more evidence. When confidence is high, it exploits the learned model. This prevents uncertain assumptions from silently becoming permanent rules.

### 11. Memory at Multiple Timescales

The implementation uses several kinds of memory:

* Working memory stores the current state, active goal, and recent transitions.
* Episodic memory stores complete attempts and their outcomes.
* Semantic memory stores reusable concepts, action meanings, and rules.
* Procedural memory stores successful plans, programs, and learned policies.
* Research memory stores experiments, configurations, metrics, and conclusions.

This layered memory allows knowledge to persist across episodes and, where permitted, across related tasks.

### 12. Autonomous Machine-Learning Experiments

For Kaggle-style problems, the same reasoning architecture is applied to the machine-learning workflow.

The system constructs a symbolic description of the experiment:

$$
E = (D, P, F, M, H, V, R)
$$

where:

* \(D\) is the dataset.
* \(P\) is preprocessing.
* \(F\) is feature construction.
* \(M\) is the model.
* \(H\) is the hyperparameter configuration.
* \(V\) is the validation strategy.
* \(R\) is the resulting evidence and metrics.

Each experiment must correspond to a clear hypothesis—for example, whether an object-centric feature, a different loss function, or a multimodal representation improves generalization.

The system compares experiments, analyzes errors, rejects unsupported hypotheses, and proposes the next experiment based on expected value rather than performing unrestricted random search.

### 13. Reproducibility and Experiment Lineage

Every result is connected to the exact conditions that produced it. The implementation records:

* Code version
* Dataset version
* Random seed
* Configuration
* Model checkpoint
* Training metrics
* Validation metrics
* Generated predictions
* Submission score
* Hypothesis tested
* Interpretation of the outcome

This creates a traceable research history and prevents the agent from repeating failed experiments without justification.

### 14. Safety and Bounded Autonomy

Autonomy is constrained by explicit budgets and policies. The system limits:

* Compute consumption
* Training duration
* Number of experiments
* Storage usage
* External tool access
* Competition submissions

High-impact actions, including final submissions or expensive training jobs, can require human approval. This keeps the system useful and autonomous without allowing it to consume resources or take external actions without control.

### Overall Architecture

The implementation follows a repeating reasoning loop:

```text
Observe
→ Construct a structured state
→ Retrieve relevant knowledge
→ Propose hypotheses
→ Select an informative or goal-directed action
→ Predict the outcome
→ Execute the action
→ Compare prediction with observation
→ Update rules and confidence
→ Plan the next step
```

ASRA-NFM therefore operates as more than a conventional predictive model. It is designed as an adaptive scientific reasoning system: it observes unfamiliar worlds, forms explicit explanations, tests them through intervention, learns causal mechanisms, plans with the resulting knowledge, and improves through reproducible experimentation.
