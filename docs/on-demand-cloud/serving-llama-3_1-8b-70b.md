---
description: How to serve the Llama 3.1 8B and 70B models using Lambda Cloud on-demand instances
comments: true
tags:
  - docker
  - llama
---

# How to serve the Llama 3.1 8B and 70B models using Lambda Cloud on-demand instances

This tutorial shows you how to use Lambda Cloud a 1x or 8x H100 on-demand
to serve the Llama 3.1 8B and 70B models. You'll serve the model using vLLM
running inside of a Docker container.

{% include "../includes/need-hugging-face-llama.md" %}

## Launch an instance with a persistent storage file system and download the Llama 3.1 model

If you haven't already, launch an on-demand instance from the dashboard and
attach a persistent storage file system.

!!! warning

    Persistent storage file systems can't be attached to running instances.

```bash
export SHARED_DIR=/home/ubuntu/FILE-SYSTEM-NAME
export HF_TOKEN=HF-TOKEN
export HF_HOME="${SHARED_DIR}/.cache/huggingface"
export MODEL_REPO=meta-llama/MODEL
```

Replace **FILE-SYSTEM-NAME** with the name of the persistent storage file
system attached to your instance.

Replace **HF-TOKEN** with your Hugging Face User Access Token.

Replace **MODEL** with:

- If you want to use the 8B model: `Meta-Llama-3.1-8B-Instruct`.
- If you want to use the 70B model: `Meta-Llama-3.1-70B-Instruct.

Then, run:

```bash
mkdir -p "${HF_HOME}"

python3 -m venv llama-3.1
source llama-3.1/bin/activate
pip install -U huggingface_hub[cli]

huggingface-cli login --token "${HF_TOKEN}"
huggingface-cli download "${MODEL_REPO}"
```

These commands:

1. Create and activate a
   [Python virtual environment](https://docs.lambdalabs.com/software/virtual-environments-and-docker-containers#creating-a-python-virtual-environment)
   on the head node for this tutorial.

2. Download the Llama 3.1 model to your persistent storage file system.

TAKES ABOUT 10 MINUTES 260 GB.
## Serve the model using vLLM inside of a Docker container

First, configure Docker to use the
[NVIDIA Container Runtime](https://developer.nvidia.com/container-runtime) by
running:

```bash
sudo nvidia-ctk runtime configure --runtime=docker && sudo systemctl restart docker
```

### If you're serving the Llama 3.1 8B model on a 1x H100 instance

Run:

```bash


```

Depending on whether you're serving the Llama 3.1 8B or 70B model, and
depending on whether you're using a 1x H100 or an 8x H100 instance
