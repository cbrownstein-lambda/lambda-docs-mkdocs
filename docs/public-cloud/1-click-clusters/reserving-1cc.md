---
description: How to reserve 1-Click Clusters and cancel 1-Click Cluster reservations
tags:
  - 1-click clusters
  - distributed training
---

# Reserving 1-Click Clusters

To reserve a 1CC:

1. [Log into](https://cloud.lambdalabs.com/cloud/login) your Lambda On-Demand Cloud account. If you don’t already have an account, you can [create an account for free](https://cloud.lambdalabs.com/sign-up).  
1. If you haven’t already, [generate or add an SSH key](../on-demand/dashboard#add-generate-and-delete-ssh-keys) for your 1CC.  
1. Navigate to the [1-Click Clusters page](https://cloud.lambdalabs.com/one-click-clusters/running) of the Lambda Cloud dashboard and click **Reserve 1-Click Cluster**.  
1. Use the 1CC reservation wizard to reserve your cluster.  
    1. *Type/Duration:* Enter the duration in weeks that you want to reserve the cluster, and then select the cluster type you want to launch.
    1. *Region:* Select the region in which you want to launch your cluster.
    1. *Filesystem:* Optionally, select an existing file system that you want to attach to the cluster, or click **Create a new  filesystem** to create a new file system. If you don’t want to attach an existing file system or create a new file system, click **Don’t attach a filesystem (an empty one will be created)**.
    1. *SSH Key:* Select the SSH key that you want to use to access your cluster, then click **Next**.
    1. *Cluster name:* Enter a name for your cluster, then click **Continue to Payment**. You’re presented with a billing summary and the billing information you have saved to your Lambda On-Demand Cloud account.
1. If needed, update your billing information and change the email address where you’d like the invoice for your 1CC reservation to be sent.  
1. Only the invoice will be sent to this email address. All notifications and other information regarding your 1CC will be sent to the email address associated with your account.  
1. Review the listed policies and terms of service. If you agree to the policies and terms of service, click the checkbox under **Terms and Conditions**.  
1. Click **Submit reservation request**. Within a few minutes, you’ll receive an email confirming your 1CC reservation request.

You can check the status of your 1CC reservation request or cancel your request by visiting the [Instances page](https://cloud.lambdalabs.com/instances) in the Lambda Cloud dashboard.

## Completing your 1-Click Cluster reservation

When your reservation is approved, you’ll receive an email with your invoice and payment instructions.  
This email will be sent to the address you entered when making your reservation, which might be different from the email associated with your Lambda account.

**The invoice must be paid within 10 days of approval of your 1CC reservation. Otherwise, you risk losing your reservation.** Daily reminder emails will be sent until the invoice is paid or the reservation is canceled.

Your 1CC will automatically launch on the day your reservation begins. You’ll be sent an email informing you that your cluster is launching, and that you should check your dashboard to monitor the status of your 1CC.

## Ending your 1-Click Cluster reservation

Beginning three days prior to your 1CC reservation ending, you’ll be sent a daily email reminding you that your reservation is ending.  

!!! warning

    All data saved to ephemeral local storage will be deleted and unrecoverable once your reservation ends! You’re responsible for backing up your data, for example, to a persistent storage file system.

It’s not currently possible to extend or renew your 1CC reservation. You’ll need to request a new reservation.  