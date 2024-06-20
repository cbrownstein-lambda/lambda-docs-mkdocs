---
comments: true
tags:
  - billing
  - on-demand cloud
---

# Billing

## How are on-demand instances billed?

Before you can launch on-demand instances, you need to add a credit card to
your account using the dashboard. We'll make a $10 pre-authorization charge to
make sure the card is valid, similar to how gas stations and hotels do. The
charge will be refunded in a few days.

[On-demand instances](https://lambdalabs.com/service/gpu-cloud) are billed in one-minute increments from the moment you
spin up (start) the instance up to the moment you terminate (stop) the
instance.

!!! danger "Be sure to terminate any instances that you're not using!"

    You will be billed for all minutes that an instance is running, even if
    the instance isn't actively being used.

The GPU Cloud dashboard allows you to view your resource usage.

Invoices are sent weekly for the previous week's usage.

!!! note "On-Demand Cloud vs. Reserved Cloud"

    On-demand instances require us to maintain excess capacity at all times so
    we can meet the changing workloads of our customers. For this reason,
    on-demand instances are priced higher than reserved instances.

    Conversely, we offer reserved GPU Cloud instances at a significant savings
    over on-demand instances, since they allow us to more accurately determine
    our capacity needs ahead of time.
