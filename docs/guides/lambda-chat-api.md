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
own vLLM API server on an [on-demand
instance](https://lambdalabs.com/service/gpu-cloud) or [1-Click Cluster
(1CC)](https://lambdalabs.com/service/gpu-cloud/1-click-clusters).

Since the Lambda Chat API is compatible with the [OpenAI
API](https://platform.openai.com/docs/overview), you can use it as a drop-in
replacement for applications currently using the OpenAI API.

The Lambda Chat API implements endpoints for:

- [Creating chat completions](#creating-chat-completions) (`/chat/completions`)
- [Creating completions](#creating-completions) (`/completions`)
- [Listing models](#listing-models) (`/models`)

To use the Lambda Chat API, first [generate a Cloud API key from the
dashboard](https://cloud.lambdalabs.com/api-keys). You can also use a Cloud
API key that you've already generated.

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
      "content": "You are a helpful assistant named Hermes, made by Nous Research."
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
curl https://api.lambdalabs.com/v1/chat/completions -d @messages.json -H "Authorization: Bearer API-KEY" -H "Content-Type: application/json" | jq .
```

Replace **API-KEY** with your actual Cloud API key.

You should see output similar to:

```json
{
  "id": "chat-0c39fdafb9b142519494bef9fb7c5f81",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Machine Learning is a subset of Artificial Intelligence that involves the development of algorithms that can learn from and make predictions or decisions based on data. It is a method of teaching computers to learn from data, without being explicitly programmed. This is achieved by building models that can recognize patterns and make predictions from data, which can then be used to solve complex problems or automate tasks. Machine learning is used in a wide range of applications, including speech recognition, image recognition, natural language processing, and recommendation systems.",
        "role": "assistant",
        "tool_calls": null,
        "function_call": null
      }
    }
  ],
  "created": 1723639634,
  "model": "405bnmfp8",
  "object": "chat.completion",
  "system_fingerprint": null,
  "usage": {
    "completion_tokens": 100,
    "prompt_tokens": 32,
    "total_tokens": 132
  },
  "service_tier": null
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
  "model": "405bnmfp8",
  "prompt": "Computers are",
  "temperature": 0
}
```

Then, run the following command:

```bash
curl https://api.lambdalabs.com/v1/completions -d @prompt.json -H "Authorization: Bearer API-KEY" -H "Content-Type: application/json" | jq .
```

Replace **API-KEY** with your actual Cloud API key.

You should see output similar to:

```json
{
  "id": "cmpl-0ed3e4f07bf242bab6d4ec67c48e0e83",
  "object": "text_completion",
  "created": 1723487710,
  "model": "405bnmfp8",
  "choices": [
    {
      "stop_reason": null,
      "finish_reason": "stop",
      "index": 0,
      "text": " a part of our daily lives, and we use them for various purposes, including work, entertainment, and communication. However, like any other electronic device, computers are prone to malfunctions and errors. When your computer starts acting up, it can be frustrating, especially if you don’t know how to fix the problem. In this article, we will discuss some common computer problems and how to troubleshoot them.\n1. Slow Performance\nOne of the most common computer problems is slow performance. If your computer is running slowly, there could be several reasons why. Here are some steps you can take to troubleshoot the issue:\nCheck your hard drive space: If your hard drive is almost full, it can slow down your computer. Free up some space by deleting unnecessary files or moving them to an external hard drive.\nClose unused programs: If you have too many programs running at the same time, it can slow down your computer. Close any programs that you’re not using.\nRun a virus scan: Malware and viruses can slow down your computer. Run a virus scan to check for any malicious software.\nUpgrade your hardware: If your computer is old, it may not have the necessary hardware to run newer programs efficiently. Consider upgrading your RAM or processor.\n2. Blue Screen of Death\nThe Blue Screen of Death (BSOD) is a common error that occurs when your computer encounters a critical system error. When this happens, your computer will restart, and you may lose any unsaved work. Here are some steps you can take to troubleshoot the issue:\nCheck for updates: Make sure your operating system and drivers are up to date.\nRun a memory test: A faulty RAM module can cause the BSOD. Run a memory test to check for any errors.\nCheck your hardware: Loose cables, overheating, and faulty hardware can all cause the BSOD. Check your computer’s hardware and make sure everything is properly connected and functioning.\n3. Internet Connectivity Issues\nIf you’re having trouble connecting to the internet, there could be several reasons why. Here are some steps you can take to troubleshoot the issue:\nCheck your router: Make sure your router is properly connected and turned on. If it’s not working, try restarting it.\nCheck your network settings: Make sure your computer is set to connect to the correct network and that your network settings are correct.\nRun a network troubleshooter: Most operating systems have a built-in network troubleshooter that can help diagnose and fix connectivity issues.\n4. Printer Problems\nPrinter problems are another common issue that computer users face. If your printer isn’t working, here are some steps you can take to troubleshoot the issue:\nCheck your printer queue: If there are too many print jobs in the queue, it can cause your printer to stop working. Clear the print queue and try again.\nCheck your printer drivers: Make sure your printer drivers are up to date. If they’re not, download and install the latest drivers from the manufacturer’s website.\nCheck your printer settings: Make sure your printer settings are correct. If they’re not, adjust them and try again.\n5. Audio Issues\nIf you’re having trouble with your computer’s audio, there could be several reasons why. Here are some steps you can take to troubleshoot the issue:\nCheck your audio settings: Make sure your audio settings are correct and that your speakers or headphones are properly connected.\nUpdate your audio drivers: If your audio drivers are outdated, it can cause audio issues. Download and install the latest drivers from the manufacturer’s website.\nCheck for muted applications: If you’re not hearing any sound from a specific application, make sure it’s not muted.\nIn conclusion, computer problems can be frustrating, but with the right troubleshooting steps, you can often fix the issue yourself. If you’re still having trouble, consider contacting a professional for help.\n*Note: This is a sample article and may not reflect the most up-to-date information or best practices. Always consult with a professional for the most accurate and relevant advice.*",
      "logprobs": null
    }
  ],
  "usage": {
    "completion_tokens": 816,
    "prompt_tokens": 4,
    "total_tokens": 820
  },
  "system_fingerprint": null
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
curl https://api.lambdalabs.com/v1/models -H "Authorization: Bearer API-KEY" -H "Content-Type: application/json" | jq .
```

You should see output similar to:

```json
{
  "data": [
    {
      "id": "405bnmfp8",
      "object": "model",
      "created": 1677610602,
      "owned_by": "openai"
    }
  ],
  "object": "list"
}
```
