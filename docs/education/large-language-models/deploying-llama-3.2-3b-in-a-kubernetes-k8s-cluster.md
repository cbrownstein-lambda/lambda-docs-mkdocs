---
description: Learn how to deploy Llama 3.2 in a Kubernetes cluster.
tags:
  - api
  - kubernetes
  - llama
  - llm
---

# Deploying Llama 3.2 3B on a Kubernetes cluster

## Introduction

In this tutorial, you'll:

- Stand up a single-node Kubernetes cluster on an on-demand instance using [K3s](#).
- Install the [NVIDIA GPU Operator](#) so the cluster can use GPUs.
- Deploy ollama on the Kubernetes cluster to serve the Llama 3.2 3B model.
- Install the ollama client and interact with the Llama 3.2 3B model.

!!! note

    You don't need a Kubernetes cluster to run ollama and serve the Llama 3.2 3B
    model. Part of this tutorial is to demonstrate that it's possible to stand
    up a Kubernetes cluster on on-demand instances.

## Stand up a single-node Kubernetes cluster

1. If you haven't already, use the
[dashboard](https://cloud.lambdalabs.com/instances) or [Cloud
API](https://docs.lambdalabs.com/on-demand-cloud/cloud-api) to launch an
instance. Then, SSH into your instance.

1. Install K3s (Kubernetes) by running:

    ```bash
    curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE=644 sh -s - --default-runtime=nvidia
    ```

## Install the NVIDIA GPU Operator

- Install the NVIDIA GPU Operator by running:

    ```bash
    k3s kubectl apply -f https://gist.githubusercontent.com/cbrownstein-lambda/d9e0bb8c68bd415354122b31106bdd9b/raw/e8a813a5b723d397e683d935139611c5018cd5cb/nvidia-gpu-operator.yml
    ```

## Deploy ollama on the Kubernetes cluster

1. Start a ollama server on your Kubernetes cluster by running:

    ```bash
    k3s kubectl apply -f https://gist.githubusercontent.com/cbrownstein-lambda/123cdd1fb5134482a2e75d05ff087d89/raw/1d030438f0fd9e0b4d6df06be02679962b602159/ollama.yml
    ```
1. Install socat by running:

    ```bash
    sudo apt -y install socat
    ```

1. Create a tmux session and run the following command to make ollama accessible
   from outside of your Kubernetes cluster:

    ```bash
    k3s kubectl -n ollama port-forward service/ollama 11434:80
    ```

## Install the ollama client

- In a new tmux window, download the ollama client by running:

    ```bash
    curl -L https://ollama.com/download/ollama-linux-amd64.tgz -o ollama-linux-amd64.tgz
    sudo tar -C /usr -xzf ollama-linux-amd64.tgz
    ```

## Test the Llama 3.2 3B model

1. Serve the Llama 3.2 3B model by running:

    ```bash
    ollama run llama3.2
    ```

1. Test the model by entering a prompt, for example:

    ```
    Why are my marigolds constantly being attacked by spider mites?
    ```

    You should see output similar to:

    ```{.text .no-copy}
    Spider mites can be a frustrating pest to deal with, especially when it comes to marigolds. Here are some reasons why your marigolds might be under attack:

    1. **Overwatering**: Spider mites thrive in moist environments. If the soil is consistently waterlogged, spider mites may be more likely to infest your plants.
    2. **Poor air circulation**: Marigolds need good air movement to prevent fungal diseases and pest infestations. Lack of air circulation can create a humid environment that's conducive to spider mite populations.
    3. **Temperature fluctuations**: Spider mites prefer temperatures between 65°F (18°C) and 85°F (29°C). If your marigolds are exposed to extreme temperature fluctuations, it may attract spider mites.
    4. **Lack of nutrients**: Spider mites often target plants that are nutrient-deficient or stressed. Ensure your marigolds receive adequate fertilization and watering.
    5. **Direct sunlight**: While marigolds love direct sunlight, excessive sun exposure can cause the leaves to become dry and brittle, making them more susceptible to spider mite infestations.
    6. **Pests in the soil**: Spider mites can lay eggs in the soil, which hatch into larvae that feed on plant sap. If you have pests like aphids or whiteflies in your potting mix, they may attract spider mites.

    To manage spider mite infestations on your marigolds:

    1. **Inspect your plants regularly**: Look for fine webbing on leaves and stems, as well as actual spider mites.
    2. **Increase air circulation**: Use fans to improve air movement around your plants.
    3. **Improve watering habits**: Avoid overwatering, and ensure the soil drains well.
    4. **Prune infested areas**: Remove any heavily infested leaves or stems to prevent further damage.
    5. **Use neem oil or insecticidal soap**: These can help control spider mite populations without harming your marigolds.
    6. **Consider introducing beneficial insects**: Ladybugs and lacewings are natural predators of spider mites.

    Keep in mind that prevention is key. By monitoring your plants regularly, improving air circulation, and ensuring proper care, you can reduce the likelihood of spider mite infestations on your marigolds.

    Would you like more specific advice or guidance?
    ```
