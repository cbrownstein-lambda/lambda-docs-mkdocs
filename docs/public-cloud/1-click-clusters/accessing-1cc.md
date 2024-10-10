---
description: How to access 1-Click Clusters
tags:
  - distributed training
---

# Accessing your 1-Click Cluster

Your 1CC’s management nodes have public IP addresses and can be accessed directly via SSH. You can access your compute nodes via SSH using a management node as a jump box. You can also access both your management nodes and your compute nodes using [Jupyter Notebook](https://docs.lambdalabs.com/on-demand-cloud/getting-started#how-do-i-open-jupyter-notebook-on-my-instance).  
If you want to access your management nodes through SSH, make sure your [Firewall rules](https://cloud.lambdalabs.com/firewall) are configured to allow SSH traffic.

To access your management nodes and compute nodes via SSH:

1. [Log into](https://cloud.lambdalabs.com/cloud/login){ .external target="_blank" } your Lambda On-Demand Cloud account. Then, click **1-Click Clusters** in the left sidebar of the dashboard.

1.  At the top of the table of your 1CC’s nodes, next to **SSH LOGIN**, click **SETUP**.

    ![SSH setup](../../assets/images/ssh-setup.png)

    Follow the instructions in the **INITIAL CLUSTER SETUP** dialog, then click **Next**.

    !!! tip 

        Follow these instructions on any other computers you want to use to access your 1CC. Make sure those computers have the SSH key that you chose when you reserved your 1CC.

1.  Follow the instructions in the **SETUP INTER-NODE PASSWORDLESS SSH** dialog. You can now SSH into each of your nodes using their names, which you can obtain from the dashboard. You can also SSH from each of your nodes into the other nodes.

    !!! warning

        The computer where you’re running the script must have both your cluster SSH config, downloaded in the previous step, and the SSH key that you chose when you reserved your 1CC.

1.   Click **Done** to close the dialog.  

## Adding SSH keys

You can add SSH keys to your 1CC to allow others to log in.

To add another SSH key:

1. [From the dashboard](https://cloud.lambdalabs.com/one-click-clusters/running), save the names of your 1CC nodes into a text file. You can do this by copy and pasting from the dashboard. The file should contain the names of your nodes, each on a separate line, and should look like:

    ```
    us-east-2-1cc-node-1
    us-east-2-1cc-node-2
    us-east-2-1cc-node-3
    us-east-2-1cc-node-4
    us-east-2-1cc-head-1
    us-east-2-1cc-head-2
    us-east-2-1cc-head-3
    ```

1. Add the additional SSH key to your 1CC by running:

    ```
    while read node; \
    do ssh -n -F CLUSTER-SSH-CONFIG "$node" "echo 'PUBLIC-KEY' >> ~/.ssh/authorized_keys" && echo "Key added to $node"; \
    done < LIST-OF-NODES
    ```
    In this command:

    *  Replace `CLUSTER-SSH-CONFIG` with the path to your cluster SSH config. The path should look like `~/.ssh/config.d/config.us-east-2-1cc`.
    *  Replace `PUBLIC-KEY` with the public key you want to add to your 1CC nodes. Public keys look like:  

        ```{ .yaml .no-copy }
        ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIK5HIO+OQSyFjz0clkvg+48YAihYMo5J7AGKiq+9Alg8 user@hostname
        ```

    *  **Make sure to keep the single quotes (**`' '`**).**
    *  Replace `LIST-OF-NODES` with the name of the file containing the names of your nodes.