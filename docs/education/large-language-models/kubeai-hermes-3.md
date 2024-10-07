---
description: Learn how to use KubeAI to deploy NousResearch's Hermes 3 LLM.
tags:
  - kubernetes
  - llama
  - llm
---

# Using KubeAI to deploy NousResearch's Hermes 3 LLM

## Introduction

[KubeAI: Private Open AI on Kubernetes :octicons-link-external-16:](https://github.com/substratusai/kubeai){target="_blank"}
is a Kubernetes solution for running inference on open-weight large language
models (LLMs), including
[NousResearch's Hermes 3 fine-tuned Llama 3.1 8B model :octicons-link-external-16:](https://nousresearch.com/hermes3/){target="_blank"}.
Using model servers such as
[vLLM :octicons-link-external-16:](https://blog.vllm.ai/2023/06/20/vllm.html){target="_blank"}
and [Ollama :octicons-link-external-16:](https://ollama.com/){target="_blank"},
KubeAI enables you to interact with the models using both an OpenAI-compatible
API and a web-UI powered by OpenWebUI.

In this tutorial, you'll:

1. Stand up a single-node Kubernetes cluster on an
   [on-demand instance :octicons-link-external-16:](https://lambdalabs.com/service/gpu-cloud){target="_blank"}
   using [K3s :octicons-link-external-16:](https://k3s.io/).
1. Install the
   [NVIDIA GPU Operator :octicons-link-external-16:](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html){target="_blank"}
   so your Kubernetes cluster can use your instance's GPUs.
1. Deploy KubeAI in your Kubernetes cluster to serve NousResearch's Hermes 3
   model.
1. Set up an Ingress in your Kubernetes cluster so you can access the web UI.
1. Interact with the Hermes 3 model using the web UI.

## Stand up a single-node Kubernetes cluster

1. Use the
   [dashboard :octicons-link-external-16:](https://cloud.lambdalabs.com/instances)
   or [Cloud API](#) to launch an instance. Then, SSH into your instance.

1. Install K3s (Kubernetes) by running:

    ```bash
    curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE=644 sh -s - --default-runtime=nvidia
    ```

1. Verify that your Kubernetes cluster is ready by running:

    ```bash
    kubectl get nodes
    ```

    You should see output similar to:

    ```{.text .no-copy}
    NAME             STATUS   ROLES                  AGE     VERSION
    209-20-159-148   Ready    control-plane,master   4m21s   v1.30.5+k3s1
    ```

!!! tip

    You can enable tab completion for `kubectl` by running:

    ```bash
    echo "source <(kubectl completion bash)" >> ~/.bashrc && source ~/.bashrc
    ```

## Install the NVIDIA GPU Operator

1. Install the NVIDIA GPU Operator in your Kubernetes cluster by running:

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: Namespace
    metadata:
      name: gpu-operator
    ---
    apiVersion: helm.cattle.io/v1
    kind: HelmChart
    metadata:
      name: gpu-operator
      namespace: gpu-operator
    spec:
      repo: https://helm.ngc.nvidia.com/nvidia
      chart: gpu-operator
      targetNamespace: gpu-operator
    EOF
    ```

1. In a few minutes, verify that your instance's GPUs are detected by your
   cluster by running:

    ```bash
    kubectl describe nodes | grep nvidia.com
    ```

    You should see output similiar to:

    ```{.text .no-copy}
    nvidia.com/cuda.driver-version.full=535.129.03
    nvidia.com/cuda.driver-version.major=535
    nvidia.com/cuda.driver-version.minor=129
    nvidia.com/cuda.driver-version.revision=03
    nvidia.com/cuda.driver.major=535
    nvidia.com/cuda.driver.minor=129
    nvidia.com/cuda.driver.rev=03
    nvidia.com/cuda.runtime-version.full=12.2
    nvidia.com/cuda.runtime-version.major=12
    nvidia.com/cuda.runtime-version.minor=2
    nvidia.com/cuda.runtime.major=12
    nvidia.com/cuda.runtime.minor=2
    nvidia.com/gfd.timestamp=1728238737
    nvidia.com/gpu-driver-upgrade-state=upgrade-done
    nvidia.com/gpu.compute.major=9
    nvidia.com/gpu.compute.minor=0
    nvidia.com/gpu.count=1
    nvidia.com/gpu.deploy.container-toolkit=true
    nvidia.com/gpu.deploy.dcgm=true
    nvidia.com/gpu.deploy.dcgm-exporter=true
    nvidia.com/gpu.deploy.device-plugin=true
    nvidia.com/gpu.deploy.driver=pre-installed
    nvidia.com/gpu.deploy.gpu-feature-discovery=true
    nvidia.com/gpu.deploy.mig-manager=true
    nvidia.com/gpu.deploy.node-status-exporter=true
    nvidia.com/gpu.deploy.operator-validator=true
    nvidia.com/gpu.family=hopper
    nvidia.com/gpu.machine=Standard-PC-Q35-ICH9-2009
    nvidia.com/gpu.memory=81559
    nvidia.com/gpu.mode=compute
    nvidia.com/gpu.present=true
    nvidia.com/gpu.product=NVIDIA-H100-PCIe
    nvidia.com/gpu.replicas=1
    nvidia.com/gpu.sharing-strategy=none
    nvidia.com/mig.capable=true
    nvidia.com/mig.config=all-disabled
    nvidia.com/mig.config.state=success
    nvidia.com/mig.strategy=single
    nvidia.com/mps.capable=false
    nvidia.com/vgpu.present=false
    nvidia.com/gpu-driver-upgrade-enabled: true
    ```

    `nvidia.com/gpu.count=1` indicates that your cluster detects 1 GPUs.

    `nvidia.com/gpu.product=NVIDIA-H100-PCIe` indicates that the detected GPU is
    an NVIDIA-H100-PCIe.

## Install KubeAI

- Install KubeAI by running:

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: Namespace
    metadata:
      name: kubeai
    ---
    apiVersion: helm.cattle.io/v1
    kind: HelmChart
    metadata:
      name: kubeai
      namespace: kubeai
    spec:
      repo: https://www.kubeai.org
      chart: kubeai
      targetNamespace: kubeai
    EOF
    ```

    To know when KubeAI is installed and ready, run:

    ```bash
    kubectl get --watch -n kubeai pods
    ```

    This command watches and displays the status of Pods.

    KubeAI is installed and ready once you see output similar to:

    ```{.text .no-copy}
    kubeai-5f6cb9984b-t6tfz      1/1     Running             0          11s
    ```

    To stop watching, press ++ctrl++ + ++c++.

## Download and serve Hermes 3

1. Download and serve NousResearch's Hermes 3 model using vLLM by running:

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: kubeai.org/v1
    kind: Model
    metadata:
      name: hermes-3-llama-3.1-8b
      namespace: kubeai
    spec:
      features: [TextGeneration]
      owner: NousResearch
      url: hf://NousResearch/Hermes-3-Llama-3.1-8B
      engine: VLLM
      resourceProfile: nvidia-gpu-h100:1
      minReplicas: 1
    EOF
    ```

    To know when the Hermes 3 model is downloaded and being served, run again:

    ```bash
    kubectl get --watch -n kubeai pods
    ```

    The Hermes 3 model is downloaded and being served once you see output
    similar to:

    ```{.text .no-copy}
    kubeai         model-hermes-3-llama-3.1-8b-79cdb64947-shx5d                 1/1     Running     0          3m52s
    ```

    To stop watching, press ++ctrl++ + ++c++

1. Use the
   [Firewall
   :octicons-link-external-16:](https://cloud.lambdalabs.com/firewall){target="_blank"}
   feature to create an inbound rule to allow traffic to port TCP/80.

## Set up an Ingress and access the web UI

1. Run:

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: kubeai
      namespace: kubeai
    spec:
      rules:
        - host: cody-kubeai.duckdns.org
          http:
            paths:
              - path: /
                pathType: Prefix
                backend:
                  service:
                    name:  openwebui
                    port:
                      number: 80
    EOF
    ```

1. Access the web UI.
