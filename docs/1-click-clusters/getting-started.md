---
tags:
  - distributed training
---

# Getting started

{% include "../includes/hello-world.incl.md" %}

## Conceptual overview

1-Click Clusters (1CC) are clusters of GPU and CPU instances in
[Lambda On-Demand Cloud](https://lambdalabs.com/service/gpu-cloud) consisting
of 16 to 512 NVIDIA H100 SXM Tensor Core GPUs. Compute (GPU) nodes are
interconnected over an NVIDIA Quantum-2 400Gb/s InfiniBand non-blocking fabric
in a rail-optimized topology, providing peer-to-peer GPUDirect RDMA
communication of up to 3200Gb/s. All nodes are connected via 2x100Gb/s
Ethernet for IP communication and are connected to the Internet via 2x100Gb/s
Direct Internet Access (DIA) circuits.

Each 1CC includes 3x CPU management (head) nodes for use as jump boxes
(bastion hosts) and for cluster administration and job scheduling. These
management nodes are assigned public IP addresses and are directly accessible
over the Internet via SSH.

All nodes can be directly accessed using
[Jupyter Notebook](https://docs.lambdalabs.com/on-demand-cloud/getting-started#how-do-i-open-jupyter-notebook-on-my-instance)
from the Lambda On-Demand Cloud dashboard.

1CC nodes are in an isolated private network and can communicate freely with
each other using private IP addresses.

Generic CPU nodes can optionally be launched in the same regions as 1CCs.
These generic CPU nodes run independently of 1CCs and don't terminate when 1CC
reservations end.

Each compute note includes 24TB of usable local ephemeral NVMe storage. Each
management node includes 208GB of usable local ephemeral NVMe storage.
[Persistent storage](https://docs.lambdalabs.com/on-demand-cloud/file-systems)
is automatically created and attached to each 1CC node, and can also be
attached to on-demand instances. Existing file systems in the same
region can additionally be attached.
[You're billed only for the storage you actually use](https://docs.lambdalabs.com/on-demand-cloud/file-systems#how-are-file-systems-billed).

All 1CC nodes are preinstalled with Ubuntu 22.04 LTS and
[Lambda Stack](https://lambdalabs.com/lambda-stack-deep-learning-software),
including NCCL, Open MPI, PyTorch with DDP and FSDP support, TensorFlow, OFED,
and other popular libraries and frameworks for distributed ML workloads,
allowing ML engineers and researchers to begin their large-scale experiments
and other work immediately after launching a 1CC.
