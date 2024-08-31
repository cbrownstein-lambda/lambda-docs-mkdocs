---
description: Learn how to use dstack to deploy vLLM and serve the Hermes 3 fine-tuned Llama 3.1 8B model.
comments: true
tags:
  - api
  - llama
  - llm
---

# Using dstack to deploy vLLM and serve the Hermes 3 fine-tuned Llama 3.1 8B model

## Introduction

[dstack](https://dstack.ai/) is an alternative to Kubernetes for the
orchestration of AI and ML applications. With dstack, you can use YAML
configuration files to define the [Lambda Public
Cloud](https://lambdalabs.com/service/gpu-cloud) resources needed for your
applications. dstack will automatically obtain those resources, that is, launch
appropriate on-demand instances, and start your applications.

In this tutorial, you'll learn how to set up dstack, and use it to deploy
[vLLM](https://github.com/vllm-project/vllm) and serve the [Hermes 3 fine-tuned
Llama 3.1 8B large language model (LLM)](https://nousresearch.com/hermes3/).

All of the instructions in this tutorial should be followed on your computer
rather than on a Cloud on-demand instance. This tutorial assumes you already
have Python, the [Python venv
module](https://docs.python.org/3/library/venv.html), and
[pip](https://pypi.org/project/pip/), and Git installed on your computer.

You can install these packages by running:

```bash
sudo apt update && sudo apt install -y python3 python3-venv pip git
```

## Setting up the dstack server

To set up the dstack server:

1. [Generate a Cloud API key from the
   Cloud dashboard](https://docs.lambdalabs.com/on-demand-cloud/dashboard#generate-and-delete-api-keys).

2. Create a directory for this tutorial, and change into the directory by
   running:

   ```bash
   mkdir ~/lambda-dstack-tutorial && cd ~/lambda-dstack-tutorial
   ```

   Then, create and activate a Python virtual environment by running:

   ```bash
   python3 -m venv .venv && source .venv/bin/activate
   ```

3. Install dstack by running:

   ```bash
   pip install -U "dstack[all]"
   ```

!!! note

    You'll see multiple error messages during the installation, for example:

    ```
    ERROR: Command errored out with exit status 1:
    ```

    You can safely disregard these messages.

4. Create a directory for the dstack server configuration and files that will be
   created by the dstack server by running:

   ```bash
   mkdir -p -m 700 ~/.dstack/server
   ```

   In the `~/.dstack/server` directory you just created, create a [configuration
   file](https://dstack.ai/docs/reference/server/config.yml/) named `config.yml`
   with the following contents:

   ```yaml
   projects:
   - name: main
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

## Deploying vLLM and serving Hermes 3

To deploy vLLM and serve the Hermes 3 model:

5. Open another terminal and activate the virtual environment you created
   earlier by running:

   ```bash
   cd ~/lambda-stack-tutorial && source .venv/bin/activate
   ```

6. In the `~/lambda-stack-tutorial` directory, create a filed named
   `.dstack.yml` with the following contents:

   ```yaml
   type: task
   name: task-hermes-3-vllm
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
     gpu: A100:1
   ```

   Then, apply the configuration by running:

   ```bash
   dstack apply
   ```

7. You'll see output similar to:

   ```
    Configuration          .dstack.yml
    Project                main
    User                   admin
    Pool                   default-pool
    Min resources          2..xCPU, 8GB.., 1xA100, 100GB.. (disk)
    Max price              -
    Max duration           72h
    Spot policy            auto
    Retry policy           no
    Creation policy        reuse-or-create
    Termination policy     destroy-after-idle
    Termination idle time  5m

    #  BACKEND  REGION      INSTANCE          RESOURCES                                     SPOT  PRICE
    1  lambda   us-south-1  gpu_1x_a100       30xCPU, 215GB, 1xA100 (40GB), 549.9GB (disk)  no    $1.29
    2  lambda   us-west-2   gpu_1x_a100_sxm4  30xCPU, 215GB, 1xA100 (40GB), 549.9GB (disk)  no    $1.29
    3  lambda   us-east-1   gpu_1x_a100_sxm4  30xCPU, 215GB, 1xA100 (40GB), 549.9GB (disk)  no    $1.29
       ...
    Shown 3 of 20 offers, $1.29 max

   Submit the run task-vllm-hermes-3? [y/n]:
   ```

   Press ++y++ then ++enter++ to submit the run. The run will take several
   minutes to complete.

   dstack will automatically:

   - Launch a new 1x A100 instance
   - Install vLLM and its dependencies
   - Download the Hermes 3 model
   - Start vLLM and serve the Hermes 3 model

   [**You're billed for all of the time the instance is
   running.**](https://docs.lambdalabs.com/on-demand-cloud/billing#how-are-on-demand-instances-billed)

   In the [Cloud dashboard](https://cloud.lambdalabs.com/instances), you can
   see the 1x A100 instance launching.

   vLLM is running and serving the Hermes 3 model once you see output similar
   to:

   ```
   INFO:     Started server process [57]
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
   ```

8. In another terminal, test that vLLM is serving the Hermes 3 model by running:

   ```bash
   curl -X POST http://localhost:8000/v1/completions \
        -H "Content-Type: application/json" \
        -d "{
              \"prompt\": \"What is the name of the capital of France?\",
              \"model\": \"NousResearch/Hermes-3-Llama-3.1-8B\",
              \"temperature\": 0.0,
              \"max_tokens\": 1
            }" | jq .

   ```

   You should see output similar to:

   ```json
   {
     "id": "cmpl-250265add39147f58e7dba91ab244c8b",
     "object": "text_completion",
     "created": 1724824435,
     "model": "NousResearch/Hermes-3-Llama-3.1-8B",
     "choices": [
       {
         "index": 0,
         "text": " Paris",
         "logprobs": null,
         "finish_reason": "length",
         "stop_reason": null,
         "prompt_logprobs": null
       }
     ],
     "usage": {
       "prompt_tokens": 11,
       "total_tokens": 12,
       "completion_tokens": 1
     }
   }
   ```

9. To quit vLLM and terminate the instance that was launched:

   In the previous terminal, that is, the terminal you used to run `dstack
   apply`, press ++ctrl++ + ++c++. You'll be asked if you want to stop the run
   before detaching. Press ++y++ then ++enter++. You'll see `Stopped` once the
   run is stopped.

   After 5 minutes, the instance will terminate. Alternatively, you can delete
   the instance immediately by running:

   ```bash
   dstack fleet delete task-vllm-hermes-3
   ```

   You'll be asked for confirmation that you want to delete the fleet, that is,
   the instance launched for this tutorial. Press ++y++ then press ++enter++.

   Using the Cloud dashboard, you can confirm that the instance was terminated.

10. To shut down the dstack server, press ++ctrl++ + ++c++ in the terminal
    running the server.
