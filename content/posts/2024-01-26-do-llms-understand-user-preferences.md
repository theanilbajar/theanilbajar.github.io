---
title: "Paper Summary: Do LLMs Understand User Preferences? Evaluating LLMs on User Rating Prediction"
date: 2024-01-26T10:04:49+05:30
draft: false
tags: ['LLM', 'Recommendation System', 'Fine Tuning']
cover:
    image:
    alt: "title image"
    caption: "This is the caption"  
---

This is a summary post of this paper: https://arxiv.org/abs/2305.06474

## Why this paper/ Goal of this paper?
As LLMs have the following properties:

- Large-scale knowledge and real-world information
- Strong generalization ability through effective few-shot learning
- Strong reasons capability with chain-of-thought, self-consistency, etc.

### Key question answered by this paper: Can we use LLMs for recommender systems?

RQ1: Do off-the-shelf LLMs perform well for zero-shot and few-shot recommendations?

RQ2: How do LLMs compare with the traditional recommenders in a fair setting?

RQ3: How much does model size matter for LLMs when used for recommenders?

RQ4: Do LLMs converge faster than traditional recommender models?

## Key Experiments/Setup
### Baselines:

For the baselines below three groups were used:

- Traditional Recommenders: Matrix Factorization, Multi Layers Perceptron
- Attribute and Rating-aware Sequential Rating Predictor: Transformer+MLP
- Heuristics: global average rating, candidate item average rating, and user past average rating

**Zero-shot and few-shot performance with a wide range of LLMs (250M to 540B parameters)**

### LLMs

1. text-davinci-003 (173B) — GPT-3 model
2. ChatGPT — default version gpt-3.5-turbo
3. Flan-U-PaLM (540B)

**Fine-tuned LLMs with human interaction data + Range of LLMs ((250M to 540B parameters)**

User rating prediction tasks can be converted to multi-class classification and regression tasks.

1. Multi-class Classification: User Ratings can be converted to a 5-way classification task, where rating 1 to 5 as 5 classes. Cross Entropy loss would be used to fine-tune this model. Evaluation Metric — ROC-AUC(Area under the Receiver Operating Characteristic Curve)
2. Regression: We will make our model output a 1-digit logit. Mean Squared Error would be used to fine-tune this model. Evaluation Metric — RMSE(Root Mean Squared Error) and MAE(Mean Average Error)
### Datasets:

1. MovieLens-1M (contains 1 million user ratings for movies)
2. Amazon-Books(books category of the Amazon Review Dataset with user’s ratings with some filters)

### LLMs

For fine-tuning:

- Flan-T5-base(250M)
- Flan-T5-XXL(11B)

## Key Findings:
RQ1: Zero-shot LLMs exhibit poorer performance than traditional recommender models with context awareness with the help of user interaction data like user journey, etc.

RQ2: Fine-tuned LLMs perform well or surpass traditional recommender models when trained with a small fraction of data showing their potential through data efficiency.

RQ3: Only LLMs with greater than 100B perform well on rating prediction with zero-shot setting. For fine-tuning tasks, Flan-T5-XXL outperforms Flan-T5-base on both datasets. Larger is better here.

RQ4: A small amount of data is required for LLMs to perform well, however, Transformer+MLP needs much more training data to reach that performance.

## Key Takeaways/Conclusion:
LLM-based recommenders have the following benefits:

- better data efficiency
- simple feature processing and modeling process
- potential for unlocking conversational recommendation capabilities.

Future scope:

- improving recommender system performance with LLM-powered prompt tuning, and novel recommendation applications.