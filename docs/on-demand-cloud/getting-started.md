---
tags:
  - kubernetes
---

# Getting started

## Can my data be recovered once I've terminated my instance?

!!! danger

    We cannot recover your data once you've terminated your instance! Before
    terminating an instance, make sure to back up all data that you want to
    keep.

    If you want to save data even after you terminate your instance, create a
    persistent storage file system.

!!! note

    The persistent storage file system must be attached to your instance
    before you start your instance. The file system cannot be attached to your
    instance after you start your instance.

    When you create a file system, a directory with the name of your file
    system is created in your home directory. For example, if the name of your
    file system is **PERSISTENT-FILE-SYSTEM**, the directory is created at
    `/home/ubuntu/PERSISTENT-FILE-SYSTEM`. **Data not stored in this directory is
    erased once you terminate your instance and cannot be recovered.**

## Can I pause my instance instead of terminating it?

It currently isn't possible to pause (suspend) your instance rather than
terminating it. But, this feature is in the works.

Until this feature is implemented, you can use persistent storage file systems
to imitate some of the benefits of being able to pause your instance.

## Do you support Kubernetes (K8s)?

Kubernetes, also known as K8s, isn't supported on On-Demand Cloud.

However, Lambda offers managed Kubernetes for Reserved Cloud.

[See our Managed Kubernetes Product Outline to learn more](../assets/pdf/Lambda_Kubernetes_One_Pager.pdf).

## Why can't my program find the NVIDIA cuDNN library?

Unfortunately, the NVIDIA cuDNN license limits how cuDNN can be used on our
instances.

On our instances, cuDNN can only be used by the PyTorch® framework and
TensorFlow library installed as part of Lambda Stack.

Other software, including PyTorch and TensorFlow installed outside of Lambda
Stack, won't be able to find and use the cuDNN library installed on our
instances.

!!! tip

    Software outside of Lambda Stack usually looks for the cuDNN library files
    in `/usr/lib/x86_64-linux-gnu`. However, on our instances, the cuDNN
    library files are in `/usr/lib/python3/dist-packages/tensorflow`.
    
    Creating symbolic links, or "symlinks," for the cuDNN library files might
    allow your program to find the cuDNN library on our instances.
    
    Run the following command to create symlinks for the cuDNN library files:

    ``` { .sh .copy }
    for cudnn_so in /usr/lib/python3/dist-packages/tensorflow/libcudnn*; do
      sudo ln -s "$cudnn_so" /usr/lib/x86_64-linux-gnu/
    done
    ```

## How do I upgrade Python?

!!! danger

    Upgrading Python, that is, replacing the preinstalled Python version with
    a newer version, will break your instance.

    Instead of upgrading Python, you should install your desired version of
    Python alongside the preinstalled version, and use your desired version in
    a virtual environment.

1. To install another version of Python alongside the preinstalled version:

   Run `sudo apt -y update && sudo apt -y install pythonVERSION-full`.

   Replace **VERSION** with the Python version you want to install, for
   example, `3.13`. Make sure `-full` is appended to the Python version,
   otherwise, you won't have the `venv` module needed to create Python virtual
   environments.

   As a complete example, if you want to install Python version 3.13, run:

   ``` { .sh .copy }
   sudo apt -y update && sudo apt -y install python3.13-full
   ```

2. Run `pythonVERSION -m venv VENV-NAME` to create a Python virtual
   environment.

   Replace **VERSION** with the Python version you installed in the previous
   step. Replace **VENV-NAME** with the name you want to give your virtual
   environment.

   Then, run `source VENV-NAME/bin/activate`.

   Replace **VENV-NAME** with the name you gave your virtual environment.

   As a complete example, if you want to create a virtual environment named
   `my-virtual-environment` using Python version 3.13 (installed in the
   example in the previous step), run:

   ``` { .sh .copy }
   python3.13 -m venv my-virtual-environment
   source my-virtual-environment/bin/activate
   ```

   Run `python --version` to confirm that your virtual environment is using
   your desired Python version.
