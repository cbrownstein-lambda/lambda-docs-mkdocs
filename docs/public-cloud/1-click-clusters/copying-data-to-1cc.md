---
description: How to copy data to a 1-Click Cluster
tags:
  - 1-click-clusters
---


# Copying data to your 1-Click Cluster

The recommended way to copy data to your 1CC is to use rsync. rsync allows you to copy files from your computer to your 1CC, as well as directly from a running on-demand instance to your 1CC.

[See our documentation to learn how to use rsync](../../education/programming/basic-linux-commands-and-system-administration#using-rsync-to-copy-and-synchronize-files). When following the instructions, replace **SERVER-IP** with the name of one of your management nodes.  
Unless you copy your data to a persistent storage file system, your data will only be accessible from the nodes your data was copied to.

If your data isn’t saved to a persistent storage file system, you can copy your data from one node to another by following [our instructions on copying files directly between remote servers](../../education/programming/basic-linux-commands-and-system-administration#copy-files-directly-between-remote-servers).  
For [higher performance](../on-demand-cloud/file-systems#how-do-i-use-persistent-storage-to-save-datasets-and-system-state), you can also use rsync to copy data from your persistent storage file system to your nodes’ local ephemeral storage.

