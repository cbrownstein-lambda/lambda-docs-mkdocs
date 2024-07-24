---
description: How to serve the Llama 3.1 405B model using a Lambda 1-Click Cluster
comments: true
tags:
  - distributed training
---

# How to serve the Llama 3.1 405B model using a Lambda 1-Click Cluster

In this tutorial, you'll learn how to use a 1-Click Cluster (1CC) to serve the
[Meta Llama 3.1 405B model](https://huggingface.co/meta-llama/Meta-Llama-3.1-405B) using
[vLLM](https://docs.vllm.ai/en/latest/index.html) and pipeline parallelism.


!!! note

    You need a [Hugging Face](https://huggingface.co/) account to download the
    Llama 3.1 405B model. You also need a
    [User Access Token](https://huggingface.co/docs/hub/en/security-tokens)
    with the **Read** role.

    Before you can download the Llama 3.1 405B model, you need to review and
    accept the model's license agreement. Once you accept the agreement, a
    request to access the repository will be submitted.

    You can see the status of the request in your
    [Hugging Face account settings](https://huggingface.co/settings/gated-repos).

## Download the Llama 3.1 405B model and set up your 1CC's head node

First, follow the
[instructions for accessing your 1CC](https://docs.lambdalabs.com/1-click-clusters/getting-started#accessing-your-1-click-cluster).

Once you've followed the instructions for accessing your 1CC, SSH into one of
your head nodes. On the head node, run:

```bash
export HEAD_IP=
export SHARED_DIR=/home/ubuntu/FILE-SYSTEM-NAME
export HF_HOME=${SHARED_DIR}/.cache/huggingface
export HF_TOKEN=
export MODEL_REPO=

mkdir -p "${HF_HOME}"

python3 -m venv llama-3.1
source llama-3.1/bin/activate
pip install -U "huggingface_hub[cli]"

huggingface-cli login --token "${HF_TOKEN}"
huggingface-cli download "${MODEL_REPO}"
```

These commands:

1. Set environment variables needed for this tutorial.
2. Create a
   [Python virtual environment](https://docs.lambdalabs.com/software/virtual-environments-and-docker-containers#creating-a-python-virtual-environment)
   for this tutorial.
3. Download the Llama 3.1 405B model to your 1CC's shared persistent storage
   file system.

!!! note

    The Llama 3.1 405B model is about 2.3TB in size and can take several hours
    to download.

On the same head node, run:

```bash
curl -o "${SHARED_DIR}/run_cluster.sh" https://raw.githubusercontent.com/vllm-project/vllm/main/examples/run_cluster.sh

"${SHARED_DIR}/run_cluster.sh" \
    vllm/vllm-openai \
    "${HEAD_IP}" \
    --head "${HF_HOME}" \
    --privileged -e NCCL_IB_HCA=^mlx5_0
```

These commands:

1. Download to your shared persistent storage file system a helper script to
   [set up vLLM for multi-node inference and serving](https://docs.vllm.ai/en/latest/serving/distributed_serving.html#multi-node-inference-and-serving).
2. Run the script to start a
   [Ray cluster](https://docs.ray.io/en/latest/cluster/getting-started.html)
   for serving the Llama 3.1 405B model using vLLM. The Ray cluster uses your
   1CC's InfiniBand fabric for optimal performance.

## Connect your 1CC workers nodes to your head node

Next, you'll connect your 1CC worker nodes to your 1CC head node.

<!--

First, create a file named `hostfile` on your shared persistent storage file
by running `touch "${SHARED_DIR}/hostfile`. Add to this file the IP address of
each of your 1CC worker nodes. Each IP address should be on a new line.

!!! note

    The IP addresses of your worker nodes are on your
    [Cloud dashboard](https://cloud.lambdalabs.com/one-click-clusters/running).

The file should look like:

```
172.26.135.252
172.26.134.16
172.26.133.73
```

```bash
sudo bash "${SHARED_DIR}/run_cluster.sh" \
    vllm/vllm-openai \
    "${HEAD_IP}" \
    --worker \
    "${HF_HOME}" \
    --privileged -e NCCL_IB_HCA=^mlx5_0
```

-->
