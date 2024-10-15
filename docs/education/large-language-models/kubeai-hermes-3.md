---
description: Learn how to use KubeAI to deploy Nous Research's Hermes 3 LLM.
tags:
  - kubernetes
  - llama
  - llm
---

# Using KubeAI to deploy Nous Research's Hermes 3 LLM

## Introduction

[KubeAI: Private Open AI on Kubernetes](https://github.com/substratusai/kubeai){ .external target="_blank" }
is a Kubernetes solution for running inference on open-weight large language
models (LLMs), including
[Nous Research's Hermes 3 fine-tuned Llama 3.1 8B model](https://nousresearch.com/hermes3/){ .external target="_blank" }.
Using model servers such as
[vLLM](https://blog.vllm.ai/2023/06/20/vllm.html){ .external target="_blank" }
and [Ollama](https://ollama.com/){ .external target="_blank" },
KubeAI enables you to interact with the models using both an OpenAI-compatible
API and a web UI powered by [Open WebUI](https://openwebui.com/){ .external target="_blank" }.

In this tutorial, you'll:

1. Stand up a single-node Kubernetes cluster on an
   [on-demand instance](https://lambdalabs.com/service/gpu-cloud){ .external target="_blank" }
   using [K3s](https://k3s.io/){ .external target="_blank" }.
1. Install the
   [NVIDIA GPU Operator](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html){ .external target="_blank" }
   so your Kubernetes cluster can use your instance's GPUs.
1. Deploy KubeAI in your Kubernetes cluster to serve Nous Research's Hermes 3
   model.
1. Interact with the Hermes 3 model using the web UI.

## Stand up a single-node Kubernetes cluster

1. Use the
   [dashboard](https://cloud.lambdalabs.com/instances){ .external target="_blank" }
   or [Cloud API](../../public-cloud/cloud-api.md#launching-instances) to launch
   an instance. Then, SSH into your instance by running:

    ```bash
    ssh ubuntu@<INSTANCE-IP-ADDRESS> -L 8080:localhost:8080
    ```

    !!! note

        The `-L 3000:localhost:3000` option enables local port forwarding. Local
        port forwarding is needed to access KubeAI's web UI.
        [See the SSH man page to learn more](https://manpages.ubuntu.com/manpages/jammy/en/man1/ssh.1.html){ .external target="_blank" }.

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
    nvidia.com/cuda.driver-version.full=550.90.07
    nvidia.com/cuda.driver-version.major=550
    nvidia.com/cuda.driver-version.minor=90
    nvidia.com/cuda.driver-version.revision=07
    nvidia.com/cuda.driver.major=550
    nvidia.com/cuda.driver.minor=90
    nvidia.com/cuda.driver.rev=07
    nvidia.com/cuda.runtime-version.full=12.4
    nvidia.com/cuda.runtime-version.major=12
    nvidia.com/cuda.runtime-version.minor=4
    nvidia.com/cuda.runtime.major=12
    nvidia.com/cuda.runtime.minor=4
    nvidia.com/gfd.timestamp=1729014507
    nvidia.com/gpu-driver-upgrade-state=upgrade-done
    nvidia.com/gpu.compute.major=9
    nvidia.com/gpu.compute.minor=0
    nvidia.com/gpu.count=2
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
    nvidia.com/gpu.product=NVIDIA-H100-80GB-HBM3
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

    `nvidia.com/gpu.count=2` indicates that your cluster detects 2 GPUs.

    `nvidia.com/gpu.product=NVIDIA-H100-80GB-HBM3` indicates that the detected
    GPUs are NVIDIA-H100-80GB-HBM3 GPUs.

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

    This command watches and displays the status of pods in the `kubeai`
    namespace.

    KubeAI is installed and ready once you see output similar to:

    ```{.text .no-copy}
    kubeai-5f6cb9984b-t6tfz      1/1     Running             0          11s
    ```

    To stop watching, press ++ctrl++ + ++c++.

## Download and serve Hermes 3

- Download and serve Nous Research's Hermes 3 model using vLLM by running:

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

## Access the KubeAI web UI

1. Run the following command to make the KubeAI web UI accessible from your
   computer:

    ```bash
    kubectl -n kubeai port-forward service/openwebui 8080:8080
    ```

1. In your web browser, go to <http://localhost:8080>.
