---
description: Using the Lambda Chat API
comments: true
tags:
  - llama
  - llm
---

# Using the Lambda Chat API

The Lambda Chat API enables you to use the Llama 3.1 405B large language
model (LLM) without the need to set up your own vLLM API server on an
on-demand instance or 1-Click Cluster (1CC).

Since the Lambda Chat API is compatible with the [OpenAI
API](https://platform.openai.com/docs/overview), you can use it as a drop-in
replacement for applications currently using the OpenAI API.

The Lambda Chat API implements endpoints for:

- [Creating chat completions](#creating-chat-completions) (`/chat/completions`)
- [Creating completions](#creating-completions) (`/completions`)
- Listing models (`/models`)

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
  "model": "405bnmfp8",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Who won the world series in 2020?"
    }
  ]
}
```

Then, run the following command:

```bash
curl http://192.222.52.40:8000/v1/chat/completions -d @messages.json -H "Authorization: Bearer API-KEY" -H "Content-Type: application/json" | jq .
```

Replace **API-KEY** with your actual API key.

You should see output similar to:

```json
{
  "id": "chat-c0b989214e164879826a76820f9e238d",
  "object": "chat.completion",
  "created": 1723165547,
  "model": "405bnmfp8",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The Los Angeles Dodgers won the 2020 World Series, defeating the Tampa Bay Rays in the series 4 games to 2. This was the Dodgers' first World Series title since 1988.",
        "tool_calls": []
      },
      "logprobs": null,
      "finish_reason": "stop",
      "stop_reason": null
    }
  ],
  "usage": {
    "prompt_tokens": 31,
    "total_tokens": 73,
    "completion_tokens": 42
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
  "model": "facebook/opt-125m",
  "prompt": "San Francisco is a",
  "temperature": 0
}
```

Then, run the following command:

```bash
curl http://192.222.52.40:8000/v1/completions -d @prompt.json -H "Authorization: Bearer API-KEY" -H "Content-Type: application/json" | jq .
```

Replace **API-KEY** with your actual API key.

You should see output similar to:

```json
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
