---
description: Using the Lambda Cloud vLLM API
comments: true
tags:
  - llama
  - llm
---

# Using the Lambda Cloud vLLM API

The Lambda Cloud vLLM API enables you to use the Llama 3.1 405B large language
model (LLM) without the need to set up your own vLLM API server on an
on-demand instance or 1-Click Cluster (1CC).

Since the Lambda Cloud vLLM API is compatible with the [OpenAI
API](https://platform.openai.com/docs/overview), you can use it as a drop-in
replacement for applications currently using the OpenAI API.

The Lambda Cloud vLLM API implements endpoints for:

- [Creating chat completions](#creating-chat-completions) (`/chat/completions`)
- Creating completions (`/completions`)
- Listing models (`/models`)

To use the Lambda Cloud vLLM API, first [generate an API key from the
dashboard](https://cloud.lambdalabs.com/api-keys). You can also use an API key
that you've already generated.

# Creating chat completions

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
