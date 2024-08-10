---
description: Using the Lambda Chat API
comments: true
tags:
  - llama
  - llm
---

# Using the Lambda Chat API

The Lambda Chat API enables you to use the [Llama 3.1 405B Instruct large
language model (LLM)](https://llama.meta.com/) without the need to set up your
own vLLM API server on an on-demand instance or 1-Click Cluster (1CC).

Since the Lambda Chat API is compatible with the [OpenAI
API](https://platform.openai.com/docs/overview), you can use it as a drop-in
replacement for applications currently using the OpenAI API.

The Lambda Chat API implements endpoints for:

- [Creating chat completions](#creating-chat-completions) (`/chat/completions`)
- [Creating completions](#creating-completions) (`/completions`)
- [Listing models](#listing-models) (`/models`)

To use the Lambda Chat API, first [generate an API key from the
dashboard](https://cloud.lambdalabs.com/api-keys). You can also use an API key
that you've already generated.

## Creating chat completions

The `/chat/completions` endpoint takes a list of messages that make up a
conversation, then outputs a response.

To use the `/chat/completions` endpoint:

First, create a file named `messages.json` that contains [the necessary and
any optional
parameters](https://platform.openai.com/docs/api-reference/chat/create). For
example:

```json
{
  "model": "meta-llama/Meta-Llama-3.1-8B-Instruct",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "What is machine learning?"
    }
  ]
}
```

Then, run the following command:

```bash
curl http://localhost:8000/v1/chat/completions -d @messages.json -H "Authorization: Bearer API-KEY" -H "Content-Type: application/json" | jq .
```

Replace **API-KEY** with your actual API key.

You should see output similar to:

```json
{
  "id": "chat-11990cbb28f24a1c90848316f3f920ca",
  "object": "chat.completion",
  "created": 1723297942,
  "model": "meta-llama/Meta-Llama-3.1-8B-Instruct",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Machine learning is a subset of artificial intelligence (AI) that involves the development of algorithms and statistical models that enable computers to learn from data, make decisions, and improve their performance on a task without being explicitly programmed.\n\nIn traditional programming, a computer is given a set of instructions to follow in order to solve a problem. In contrast, machine learning algorithms are trained on data, allowing the computer to identify patterns, relationships, and trends, and to make predictions or decisions based on that data.\n\nThere are several key characteristics of machine learning:\n\n1. **Learning from data**: Machine learning algorithms are trained on a dataset, which allows them to learn from the data and improve their performance over time.\n2. **Improvement over time**: As the algorithm is exposed to more data, it can refine its performance and make more accurate predictions or decisions.\n3. **Ability to generalize**: Machine learning algorithms can apply what they have learned to new, unseen data, allowing them to make predictions or decisions in situations that are not explicitly programmed.\n4. **Autonomy**: Machine learning algorithms can operate independently, making decisions and taking actions without human intervention.\n\nSome common applications of machine learning include:\n\n1. **Predictive modeling**: Machine learning algorithms can be used to predict outcomes, such as customer churn, credit risk, or stock prices.\n2. **Image and speech recognition**: Machine learning algorithms can be used to recognize objects, people, and speech patterns.\n3. **Natural language processing**: Machine learning algorithms can be used to analyze and generate text, such as chatbots and language translation systems.\n4. **Recommendation systems**: Machine learning algorithms can be used to recommend products or services based on a user's preferences and behavior.\n\nThere are several types of machine learning, including:\n\n1. **Supervised learning**: The algorithm is trained on labeled data, and its goal is to predict the output based on the input.\n2. **Unsupervised learning**: The algorithm is trained on unlabeled data, and its goal is to identify patterns or structure in the data.\n3. **Reinforcement learning**: The algorithm learns through trial and error, receiving feedback in the form of rewards or penalties.\n4. **Deep learning**: A type of machine learning that uses neural networks to analyze and understand data.\n\nMachine learning has many benefits, including:\n\n1. **Improved accuracy**: Machine learning algorithms can make more accurate predictions and decisions than traditional programming.\n2. **Increased efficiency**: Machine learning algorithms can automate tasks, freeing up human resources for more strategic work.\n3. **Scalability**: Machine learning algorithms can handle large amounts of data and scale to meet the needs of growing businesses.\n\nHowever, machine learning also has some challenges, including:\n\n1. **Data quality**: Machine learning algorithms are only as good as the data they are trained on.\n2. **Explainability**: Machine learning algorithms can be difficult to understand and interpret.\n3. **Bias**: Machine learning algorithms can perpetuate biases and prejudices present in the data.\n4. **Security**: Machine learning algorithms can be vulnerable to attacks and data breaches.",
        "tool_calls": []
      },
      "logprobs": null,
      "finish_reason": "stop",
      "stop_reason": null
    }
  ],
  "usage": {
    "prompt_tokens": 46,
    "total_tokens": 667,
    "completion_tokens": 621
  }
}
```

## Creating completions

The `/completions` endpoint takes a single text string (a prompt) as input,
then outputs a response. In comparison, the `/chat/completions` endpoint takes
a list of messages as input.

To use the `/completions` endpoint:

First, create a file named `prompt.json` that contains [the necessary and any
optional
parameters](https://platform.openai.com/docs/api-reference/completions). For
example:

```json
{
  "model": "meta-llama/Meta-Llama-3.1-8B-Instruct",
  "prompt": "Computers are",
  "temperature": 0
}
```

Then, run the following command:

```bash
curl http://localhost:8000/v1/completions -d @prompt.json -H "Authorization: Bearer API-KEY" -H "Content-Type: application/json" | jq .
```

Replace **API-KEY** with your actual API key.

You should see output similar to:

```json
{
  "id": "cmpl-042276c70e5d4c7a8fa0cd0d3fc4c785",
  "object": "text_completion",
  "created": 1723300326,
  "model": "meta-llama/Meta-Llama-3.1-8B-Instruct",
  "choices": [
    {
      "index": 0,
      "text": " a crucial part of our daily lives, and they are used in various ways,",
      "logprobs": null,
      "finish_reason": "length",
      "stop_reason": null
    }
  ],
  "usage": {
    "prompt_tokens": 4,
    "total_tokens": 20,
    "completion_tokens": 16
  }
}
```

## Listing models

The `/models` endpoint lists the models available for use through the Lambda
Chat API.

!!! note

    Currently, only the Llama 3.1 405B Instruct model is available for use
    through the Lambda Chat API.

To use the `/models` endpoint, run:

```bash
curl http://localhost:8000/v1/models -H "Authorization: Bearer API-KEY" -H "Content-Type: application/json" | jq .
```

You should see output similar to:

```json
{
  "object": "list",
  "data": [
    {
      "id": "meta-llama/Meta-Llama-3.1-8B-Instruct",
      "object": "model",
      "created": 1723300383,
      "owned_by": "vllm",
      "root": "meta-llama/Meta-Llama-3.1-8B-Instruct",
      "parent": null,
      "max_model_len": 131072,
      "permission": [
        {
          "id": "modelperm-467095b6c94a40469cadc960c8d78868",
          "object": "model_permission",
          "created": 1723300383,
          "allow_create_engine": false,
          "allow_sampling": true,
          "allow_logprobs": true,
          "allow_search_indices": false,
          "allow_view": true,
          "allow_fine_tuning": false,
          "organization": "*",
          "group": null,
          "is_blocking": false
        }
      ]
    }
  ]
}
```
