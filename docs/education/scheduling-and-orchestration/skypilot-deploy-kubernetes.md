---
description: Lambda and SkyPilot make it easy to deploy a Kubernetes cluster. Read this tutorial to learn more.
comments: true
tags:
  - api
  - kubernetes
---

# Using SkyPilot to deploy a Kubernetes cluster

## Introduction

[SkyPilot](https://skypilot.readthedocs.io/en/latest/docs/index.html) makes it
easy to deploy a Kubernetes cluster using [Lambda Public
Cloud](https://lambdalabs.com/service/gpu-cloud) on-demand instances. The
[NVIDIA GPU
Operator](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html)
is preinstalled so you can immediately use your instances' GPUs.

In this tutorial, you'll

- Configure your Lambda Public Cloud Firewall and a Cloud API key for SkyPilot
  and Kubernetes.
- Install SkyPilot on your computer.
- Configure SkyPilot for Lambda Public Cloud.
- Use SkyPilot to launch 2 1x A10 on-demand instances and deploy a 2-node
  Kubernetes cluster using those instances.

!!! note

    [**You're billed for all of the time the instances are
    running.**](https://docs.lambdalabs.com/on-demand-cloud/billing#how-are-on-demand-instances-billed)

All of the instructions in this tutorial should be followed on your computer.

This tutorial assumes you already have installed:

- `python3`
- `python3-venv`
- `python3-pip`
- `git`
- `curl`
- `socat`

You can install these packages by running:

```bash
sudo apt update && sudo apt install -y python3 python3-venv python3-pip git curl socat`
```

You also need to install
[kubectl](https://kubernetes.io/docs/reference/kubectl/) by running:

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

## Configure your Lambda Public Cloud Firewall and generate a Cloud API key

Use the [Lambda Public Cloud Firewall
feature](https://docs.lambdalabs.com/on-demand-cloud/firewall) to add rules
allowing incoming traffic to TCP/443 and TCP/6443.

[Generate a Cloud API
key](https://docs.lambdalabs.com/on-demand-cloud/dashboard#generate-and-delete-api-keys)
for SkyPilot. You can also use an existing Cloud API key.

## Install SkyPilot

On your computer, create and activate a Python virtual environment for this
tutorial by running:

```bash
python3 -m venv skypilot-tutorial && source skypilot-tutorial/bin/activate
```

Run the following commands to:

- Clone the SkyPilot GitHub repository to your home directory.
- Change into the repository directory.
- Check out the `lambda_k8s` branch.

```bash
git clone https://github.com/skypilot-org/skypilot.git ~/skypilot && \
cd skypilot && \
git checkout lambda_k8s
```

Install SkyPilot in your virtual environment by running:

```bash
pip3 install -e ".[lambda,kubernetes]"
```

## Configure SkyPilot for Lambda Public Cloud

Change into the repository `examples/k8s_deploy` directory by running:

```bash
cd ~/skypilot/examples/k8s_deploy
```

Edit the `deploy_k8s.yaml` file.

At the top of the file, under `cloud: lambda`, add `accelerators: A10:1`.

For `SKY_K3S_TOKEN`, replace **mytoken** with a **strong passphrase**.

!!! warning

    It's important that you use a strong passphrase. Otherwise, the Kubernetes
    cluster can be compromised, especially if your [firewall rules](#) allow
    incoming traffic from all sources.

    You can generate a strong passphrase by running:

    ```bash
    openssl rand -base64 16
    ```

    This command will generate a random string of characters such as
    `zPUlZGe4HRcy+Om04RvGmQ==`.

The top of the `deploy_k8s.yaml` file should look similar to:

```yaml
resources:
  cloud: lambda
  accelerators: A10:1
#  Uncomment the following line to expose ports on a different cloud
#  ports: 6443

num_nodes: 2

envs:
  SKY_K3S_TOKEN: zPUlZGe4HRcy+Om04RvGmQ== # Can be any string, used to join worker nodes to the cluster
```

Create a directory in your home directory named `.lambda_cloud` and change into
that directory by running:

```bash
mkdir -m 700 ~/.lambda_cloud && cd ~/.lambda_cloud
```

Create a file named `lambda_keys` that contains:

```
api_key = API-KEY
```

Replace **API-KEY** with your actual Cloud API key.

## Use SkyPilot to launch instances and deploy Kubernetes

Change into the repository `examples/k8s_deploy` directory by running:

```bash
cd ~/skypilot/examples/k8s_deploy
```

Then, launch 2 1x A10 instances and deploy a 2-node Kubernetes cluster using
those instances by running:

```bash
./launch_k8s.sh
```

You'll begin to see output similar to:

```
This script will deploy a Kubernetes cluster on the cloud and GPUs specified in deploy_k8s.yaml.

+ CLUSTER_NAME=k8s
+ sky launch -y -c k8s deploy_k8s.yaml
SkyPilot collects usage data to improve its services. `setup` and `run` commands are not collected to ensure privacy.
Usage logging can be disabled by setting the environment variable SKYPILOT_DISABLE_USAGE_COLLECTION=1.
Task from YAML spec: deploy_k8s.yaml
I 09-07 08:56:33 common.py:228] Updated Lambda catalog.
I 09-07 08:56:33 optimizer.py:718] == Optimizer ==
I 09-07 08:56:33 optimizer.py:729] Target: minimizing cost
I 09-07 08:56:33 optimizer.py:741] Estimated cost: $1.5 / hour
I 09-07 08:56:33 optimizer.py:741]
I 09-07 08:56:33 optimizer.py:866] Considered resources (2 nodes):
I 09-07 08:56:33 optimizer.py:936] ------------------------------------------------------------------------------------------
I 09-07 08:56:33 optimizer.py:936]  CLOUD    INSTANCE     vCPUs   Mem(GB)   ACCELERATORS   REGION/ZONE   COST ($)   CHOSEN
I 09-07 08:56:33 optimizer.py:936] ------------------------------------------------------------------------------------------
I 09-07 08:56:33 optimizer.py:936]  Lambda   gpu_1x_a10   30      200       A10:1          us-east-1     1.50          ✔
I 09-07 08:56:33 optimizer.py:936] ------------------------------------------------------------------------------------------
I 09-07 08:56:33 optimizer.py:936]
Running task on cluster k8s...
I 09-07 08:56:33 cloud_vm_ray_backend.py:4354] Creating a new cluster: 'k8s' [2x Lambda(gpu_1x_a10, {'A10': 1})].
I 09-07 08:56:33 cloud_vm_ray_backend.py:4354] Tip: to reuse an existing cluster, specify --cluster (-c). Run `sky status` to see existing clusters.
I 09-07 08:56:34 cloud_vm_ray_backend.py:1314] To view detailed progress: tail -n100 -f /home/c/sky_logs/sky-2024-09-07-08-56-32-005984/provision.log
I 09-07 08:56:35 cloud_vm_ray_backend.py:1721] Launching on Lambda us-east-1
I 09-07 09:00:57 log_utils.py:45] Head node is up.
I 09-07 09:01:44 cloud_vm_ray_backend.py:1826] Successfully provisioned or found existing head instance. Waiting for workers.
```

It usually takes about 15 minutes for the Kubernetes cluster to be deployed.

The Kubernetes cluster is successfully deployed once you see:

```
Checking credentials to enable clouds for SkyPilot.
  Kubernetes: enabled
    Hint: Could not detect GPU labels in Kubernetes cluster. If this cluster has GPUs, please ensure GPU nodes have node labels of either of these formats: skypilot.co/accelerator, cloud.google.com/gke-accelerator, karpenter.k8s.aws/instance-gpu-name, nvidia.com/gpu.product, gpu.nvidia.com/class. Please refer to the documentation on how to set up node labels.

To enable a cloud, follow the hints above and rerun: sky check
If any problems remain, refer to detailed docs at: https://skypilot.readthedocs.io/en/latest/getting-started/installation.html

🎉 Enabled clouds 🎉
  ✔ Kubernetes
  ✔ Lambda
+ set +x
===== Kubernetes cluster deployment complete =====
You can now access your k8s cluster with kubectl and skypilot.

• View the list of available GPUs on Kubernetes: sky show-gpus --cloud kubernetes
• To launch a SkyPilot job running nvidia-smi on this cluster: sky launch --cloud kubernetes --gpus <GPU> -- nvidia-smi
```
