---
description: This tutorial teaches you how to use dstack to deploy vLLM and Llama 3.1 8B. dstack is an alternative to K8s designed for AI.
comments: true
tags:
  - api
  - llama
  - llm
---

# Using dstack to deploy vLLM and Llama 3.1 8B

## Introduction

[dstack](https://dstack.ai/) is an alternative to Kubernetes for the
orchestration of AI and ML applications.

In this tutorial, you'll learn how to set up dstack, and use it to deploy vLLM
and serve the Llama 3.1 8B model.

## Setting up the dstack server

{% include "../../includes/need-hugging-face-llama.md" %}

1. [Generate a Cloud API key from the
   dashboard](https://docs.lambdalabs.com/on-demand-cloud/dashboard#generate-and-delete-api-keys).

2. Create a directory for this tutorial, and change into the directory by
   running:

   ```bash
   mkdir dstack-tutorial && cd dstack-tutorial
   ```

   Then, create and activate a Python virtual environment by running:

   ```bash
   python -m venv .venv && source .venv/bin/activate
   ```

3. Install the dstack server by running:

   ```bash
   pip install -U "dstack[all]"
   ```

!!! note

    You'll see multiple error messages during the installation, for example:

    ```
    ERROR: Command errored out with exit status 1:
    ```

    You can safely disregard these messages.

4. Create a directory for the dstack server configuration by running:

   ```bash
   mkdir -p -m 700 ~/.dstack/server
   ```

   In the directory, create a [config
   file](https://dstack.ai/docs/reference/server/config.yml/) named `config.yml`
   with the following contents:

   ```yaml
   projects:
   - name: dstack-tutorial
     backends:
       - type: lambda
         creds:
           type: api_key
           api_key: API-KEY
   ```

   Replace **API-KEY** with your actual Cloud API key.

   Then, start the dstack server by running:

   ```bash
   dstack server
   ```

   You should see output similar to:

   ```
   [02:23:10] WARNING  dstack._internal.server.app:91 OpenSSH 8.4+ is required. The dstack server may not work properly
              INFO     Applying ~/.dstack/server/config.yml...
   [02:23:11] INFO     Configured the main project in ~/.dstack/config.yml
              INFO     The admin token is ADMIN-TOKEN
              INFO     The dstack server 0.18.11 is running at http://127.0.0.1:3000
   ```

## Deploying vLLM and serving Llama 3.1

5. Create a file named `llama-3-1-vllm.yml` with the following contents:

```yaml
type: task
name: llama31-task-vllm

python: "3.10"

env:
  - MODEL=NousResearch/Hermes-3-Llama-3.1-8B

commands:
  - pip install vllm
  - vllm serve $MODEL

ports:
  - 8000

spot_policy: auto

resources:
  gpu: 24GB
```
