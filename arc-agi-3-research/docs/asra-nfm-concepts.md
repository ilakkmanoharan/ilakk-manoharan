# ASRA-NFM concepts (project page source)

Derived for the ARC-AGI-3 project page from ASRA-NFM paper notes.

## Neuro-symbolic learning

Combine neural pattern discovery with symbolic objects, relations, rules, and interpretable inference.

## Object-centric state representation

Represent states as entities with properties, relations, and constraints rather than raw grids alone.

## Transition-based world modeling

Learn (state, action, next-state) transitions to predict environment dynamics.

## Action-semantics discovery

Infer what action IDs mean via intervention—syntax vs semantics vs mechanism vs utility.

## Causal world models

Prefer do()-style interventions over correlations when explaining outcomes.

## Symbolic rule induction

Induce compact IF/THEN rules from transitions using coverage, accuracy, and MDL.

## Hypothesis generation and testing

Maintain competing explanations; propose → predict → intervene → evaluate.

## Active exploration / information gain

Choose actions that reduce uncertainty under risk and cost budgets.

## Planning through the world model

Simulate action sequences with search (BFS/A*/beam/MCTS) when rules are reliable.

## Uncertainty-aware reasoning

Track confidence on objects, actions, rules, and exceptions.

## Multi-timescale memory

Working, episodic, semantic, procedural, and research memory.

## Autonomous ML experiments

Treat Kaggle runs as hypothesis-linked experiments with lineage and bounded autonomy.

