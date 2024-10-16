---
description: Learn how use On Demand Cloud to serve Meta Llama 3.1 8B and 70B models
tags:
  - on-demand cloud
---

# How to serve the Llama 3.1 8B and 70B models using Lambda Cloud on-demand instances

!!! note

    [**Apply for Cloud Credits and experiment with this tutorial—for free!**](https://lambdalabs.com/vllm-deployment-guide){ .external target="_blank" }

This tutorial shows you how to use a [Lambda Cloud](https://lambdalabs.com/service/gpu-cloud){ .external target="_blank" } 1x or 8x NVIDIA Tensor Core A100 or H100 instance to serve the Llama 3.1 8B and 70B models. You'll serve the models using [vLLM running inside of a Docker container](https://docs.vllm.ai/en/latest/serving/deploying\_with\_docker.html){ .external target="_blank" }.

## Prerequisites <a href="#start-the-vllm-api-server" id="start-the-vllm-api-server"></a>

This tutorial assumes the following prerequisites:

1. A Lambda Cloud on-demand instance appropriate for the Llama 3.1 model you want to run.
   * 8B ([**meta-llama/Meta-Llama-3.1-8B**](https://huggingface.co/meta-llama/Meta-Llama-3.1-8B){ .external target="_blank" }[**-Instruct**](https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct){ .external target="_blank" }) requires a 1x or 8x A100 or H100 instance.
   * 70B ([**meta-llama/Meta-Llama-3.1-70B-Instruct**](https://huggingface.co/meta-llama/Meta-Llama-3.1-70B-Instruct){ .external target="_blank" }[)](https://huggingface.co/meta-llama/Meta-Llama-3-70B) requires an 8x A100 or H100 instance.
2. A Hugging Face [user account](https://huggingface.co/join).
3. An approved [Hugging Face user access token](https://huggingface.co/docs/hub/en/security-tokens) that includes repository read permissions for the  model repository you wish to use.

## Start the vLLM API server <a href="#start-the-vllm-api-server" id="start-the-vllm-api-server"></a>

If you haven't already, use the [dashboard](https://cloud.lambdalabs.com/instances) or [Cloud API](https://docs.lambdalabs.com/on-demand-cloud/cloud-api) to launch an instance. Then, SSH into your instance.

Run:

```bash
export HF_TOKEN=HF-TOKEN HF_HOME="/home/ubuntu/.cache/huggingface" MODEL_REPO=meta-llama/MODEL
```

Replace **HF-TOKEN** with your Hugging Face user access token.

Replace **MODEL** with:

* If you're serving the 8B model:

```
Meta-Llama-3.1-8B-Instruct
```

* If you're serving the 70B model:

```
Meta-Llama-3.1-70B-Instruct
```

These commands set environment variables needed for this tutorial.

Start a tmux session by running `tmux`.

If you're serving the 8B model, run:

```bash
sudo docker run \
  --gpus all \
  --ipc=host \
  -v "${HF_HOME}":/root/.cache/huggingface \
  -p 8000:8000 \
  --env "HUGGING_FACE_HUB_TOKEN=${HF_TOKEN}" \
  vllm/vllm-openai --model "${MODEL_REPO}" \
    --disable-log-requests
```

If you're serving the 70B model, instead run:

```bash
sudo docker run \
  --gpus all \
  --ipc=host \
  -v "${HF_HOME}":/root/.cache/huggingface \
  -p 8000:8000 \
  --env "HUGGING_FACE_HUB_TOKEN=${HF_TOKEN}" \
  vllm/vllm-openai --model "${MODEL_REPO}" \
    --disable-log-requests \
    --tensor-parallel-size 8
```

Both commands, above:

* Download the model you're serving.
* Start vLLM's API server with the chosen model.

!!! note

    The difference betweeen the two commands, above, is that the second command enables the tensor parallel strategy to use 8x GPUs. [See vLLM's docs to learn more about the distributed inference strategies](https://docs.vllm.ai/en/latest/serving/distributed\_serving.html).

The vLLM API server is running once you see:

```
INFO 08-01 19:11:07 api_server.py:292] Available routes are:
INFO 08-01 19:11:07 api_server.py:297] Route: /openapi.json, Methods: GET, HEAD
INFO 08-01 19:11:07 api_server.py:297] Route: /docs, Methods: GET, HEAD
INFO 08-01 19:11:07 api_server.py:297] Route: /docs/oauth2-redirect, Methods: GET, HEAD
INFO 08-01 19:11:07 api_server.py:297] Route: /redoc, Methods: GET, HEAD
INFO 08-01 19:11:07 api_server.py:297] Route: /health, Methods: GET
INFO 08-01 19:11:07 api_server.py:297] Route: /tokenize, Methods: POST
INFO 08-01 19:11:07 api_server.py:297] Route: /detokenize, Methods: POST
INFO 08-01 19:11:07 api_server.py:297] Route: /v1/models, Methods: GET
INFO 08-01 19:11:07 api_server.py:297] Route: /version, Methods: GET
INFO 08-01 19:11:07 api_server.py:297] Route: /v1/chat/completions, Methods: POST
INFO 08-01 19:11:07 api_server.py:297] Route: /v1/completions, Methods: POST
INFO 08-01 19:11:07 api_server.py:297] Route: /v1/embeddings, Methods: POST
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

## Test the vLLM API server <a href="#test-the-vllm-api-server" id="test-the-vllm-api-server"></a>

To test that the API server is serving the Llama 3.1 model:

Press **Ctrl** + **B**, then press **C** to open a new tmux window.

Then, run:

```bash
curl -X POST http://localhost:8000/v1/completions \
     -H "Content-Type: application/json" \
     -d "{
           \"prompt\": \"What is the name of the capital of France?\",
           \"model\": \"${MODEL_REPO}\",
           \"temperature\": 0.0,
           \"max_tokens\": 1
         }"
```

You should see output similar to:

```json
{"id":"cmpl-d3a33498b5d74d9ea09a7c256733b8df","object":"text_completion","created":
```

!!! tip

    You can make the output more human-readable using jq. To do this, first install jq by running:

```bash
sudo apt update && sudo apt install -y jq
```

Then, append `| jq .` to the `curl` command, above.

The complete command should be:

```bash
curl -X POST http://localhost:8000/v1/completions \
     -H "Content-Type: application/json" \
     -d "{
           \"prompt\": \"What is the name of the capital of France?\",
           \"model\": \"${MODEL_REPO}\",
           \"temperature\": 0.0,
           \"max_tokens\": 1
         }" | jq .
```

The output should now look similar to:

```json
{
  "id": "cmpl-529d01c83069409fa5c166e1d137e21e",
  "object": "text_completion",
  "created": 1722545913,
  "model": "meta-llama/Meta-Llama-3.1-70B-Instruct",
  "choices": [
    {
      "index": 0,
      "text": " Paris",
      "logprobs": null,
      "finish_reason": "length",
      "stop_reason": null
    }
  ],
  "usage": {
    "prompt_tokens": 11,
    "total_tokens": 12,
    "completion_tokens": 1
  }
}
```

## Acknowledgement <a href="#acknowledgement" id="acknowledgement"></a>

We'd like to thank the [vLLM](https://github.com/vllm-project/vllm) team for their partnership in developing this guide and their pioneering work in streamlining LLM serving.
