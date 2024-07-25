---
description: How to serve the Llama 3.1 405B model using a Lambda 1-Click Cluster
comments: true
tags:
  - distributed training
---

# How to serve the Llama 3.1 405B model using a Lambda 1-Click Cluster

In this tutorial, you'll learn how to use a 1-Click Cluster (1CC) to serve the
[Meta Llama 3.1 405B model](https://huggingface.co/meta-llama/Meta-Llama-3.1-405B) using
[vLLM](https://docs.vllm.ai/en/latest/index.html) with pipeline parallelism.


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

!!! tip

    It's recommended that you use [tmux](https://github.com/tmux/tmux/wiki/)
    sesions for this tutorial. Otherwise, you'll need to use multiple
    terminals and multiple SSH connections. You'll also need to set
    environment variables multiple times.

## Download the Llama 3.1 405B model and set up a head node

First, follow the
[instructions for accessing your 1CC](https://docs.lambdalabs.com/1-click-clusters/getting-started#accessing-your-1-click-cluster).

Once you've followed the instructions for accessing your 1CC, SSH into one of
your 1CC GPU nodes. This GPU node will be set up as a head node for this
tutorial and will be referred to in this tutorial as the "head node."

On the head node, set environment variables needed for this tutorial by
running:

```bash
export HEAD_IP=HEAD-IP
export SHARED_DIR=/home/ubuntu/FILE-SYSTEM-NAME
export HF_TOKEN=HF-TOKEN
export HF_HOME="${SHARED_DIR}/.cache/huggingface"
export MODEL_REPO=meta-llama/Meta-Llama-3.1-405B-Instruct
```

Replace **HEAD-IP** with the IP address of the head node. You can
obtain the IP address from the
[1-Click Clusters dashboard](https://cloud.lambdalabs.com/one-click-clusters/running).

Replace **FILE-SYSTEM-NAME** with the name of your 1CC's persistent storage
file system.

Replace **HF-TOKEN** with your Hugging Face User Access Token.

Then, start a tmux session by running `tmux`.

Run:

```bash
mkdir -p "${HF_HOME}"

python3 -m venv llama-3.1
source llama-3.1/bin/activate
pip install -U huggingface_hub[cli] openai

huggingface-cli login --token "${HF_TOKEN}"
huggingface-cli download "${MODEL_REPO}"
```


These commands:

1. Create a
   [Python virtual environment](https://docs.lambdalabs.com/software/virtual-environments-and-docker-containers#creating-a-python-virtual-environment)
   for this tutorial.

2. Download the Llama 3.1 405B model to your 1CC's persistent storage file
   system.

!!! note

    The Llama 3.1 405B model is about 2.3TB in size and can take several hours
    to download.

Still on the head node, press **Ctrl** + **b**, then press **Ctrl** + **c** to
open a new tmux window.

Then, run:

```bash
curl -o "${SHARED_DIR}/run_cluster.sh" https://raw.githubusercontent.com/vllm-project/vllm/main/examples/run_cluster.sh

sudo bash "${SHARED_DIR}/run_cluster.sh" \
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

## Connect another GPU node to the head node

Next, you'll connect another of your 1CC's GPUs nodes to the head node. This
other GPU node will be referred to below as the "worker node."

In a new terminal, SSH into the worker node, then set environment variables
needed for this tutorial by running:

```bash
export HEAD_IP=HEAD-IP
export SHARED_DIR=/home/ubuntu/FILE-SYSTEM-NAME
export HF_HOME="${SHARED_DIR}/.cache/huggingface"
```
Replace **HEAD-IP** with the IP address of the head node.

Replace **FILE-SYSTEM-NAME** with the name of your 1CC's persistent storage
file system.

Run `tmux` to start a new tmux session. Then, run:

```bash
sudo bash "${SHARED_DIR}/run_cluster.sh" \
       vllm/vllm-openai \
       "${HEAD_IP}" \
       --worker \
       "${HF_HOME}" \
       --privileged -e NCCL_IB_HCA=^mlx5_0
```

This command connects the worker node to the head node.

## Check the status of the Ray cluster and serve the Llama 3.1 405B model

Still on the worker node, press **Ctrl** + **b**, then press **Ctrl** + **c**
to open a new tmux window. Then, run:

```bash
sudo docker exec -it node /bin/bash
```

Check the status of the Ray cluster by running:

```bash
ray status
```

You should see output similar to:

```
======== Autoscaler status: 2024-07-25 00:20:50.831620 ========
Node status
---------------------------------------------------------------
Active:
 1 node_d86d9f0f1894c2e463d8168530f6745e32beb08ddf3b908d229d8527
 1 node_37af7f860c4bab2e035b5a55ba06e2e49dba9fa891d65f8264648804
Pending:
 (no pending nodes)
Recent failures:
 (no failures)

Resources
---------------------------------------------------------------
Usage:
 0.0/416.0 CPU
 16.0/16.0 GPU (16.0 used of 16.0 reserved in placement groups)
 0B/3.43TiB memory
 0B/19.46GiB object_store_memory

Demands:
 (no resource demands)
```

This output shows 2 active nodes (the head node and the worker node) and 16
GPUs in the Ray cluster.

Press **Ctrl** + **b**, then press **Ctrl** + **c** to open a new tmux window.

Run the following command to begin serving the Llama 3.1 405B model:

```bash
vllm serve "/root/.cache/huggingface/hub/models--meta-llama--Meta-Llama-3.1-405B-Instruct/snapshots/SNAPSHOT" --tensor-parallel-size 8 --pipeline-parallel-size 2
```

Replace **SNAPSHOT** with the name of snapshot of the Llama 3.1 405B model.
The name of the snapshot should be similar to
`e04e3022cdc89bfed0db69f5ac1d249e21ee2d30`.

You can obtain the name of the snapshot by running:

```bash
ls /root/.cache/huggingface/hub/models--meta-llama--Meta-Llama-3.1-405B-Instruct/snapshots
```

## Test the Llama 3.1 405B model

Press **Ctrl** + **b**, then press **Ctrl** + **c** to open a new tmux window.

Then, run:

```bash
curl -o ${SHARED_DIR}/inference_test.py 'https://raw.githubusercontent.com/vllm-project/vllm/main/examples/openai_chat_completion_client.py'

python3 ${SHARED_DIR}/inference_test.py
```

These commands:

1. Download the Open AI chat completion client.

2. Run an inference test.

You should see output similar to:



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
