# General

## How do I fix resolution and brightness control on my Tensorbook?

1. In a terminal, run the command `sudo prime-select on-demand`. Then, reboot your [Tensorbook](https://lambdalabs.com/deep-learning/laptops/tensorbook).
2. As the Tensorbook is booting, repeatedly press either the **Del** key or **F1** key to enter the BIOS.
3. In the BIOS, choose **Chipset** > **GPU MODE** > **NVIDIA® Optimus™**.
4. Choose **Save & Exit** > **Save Changes and Reset**.

## How do I reinstall Lambda Stack in Ubuntu on my Tensorbook?

To reinstall [Lambda Stack](https://lambdalabs.com/lambda-stack-deep-learning-software) in Ubuntu on a [Tensorbook](https://lambdalabs.com/deep-learning/laptops/tensorbook), run the following commands in a terminal:

1.  ```bash
    sudo rm -f /etc/apt/sources.list.d/{graphics,nvidia,cuda}* && \
    dpkg -l | \
    awk '/cuda|lib(accinj64|cu(blas|dart|dnn|fft|inj|pti|rand|solver|sparse)|magma|nccl|npp|nv[^p])|nv(idia|ml)|tensor(flow|board)|torch/ { print $2 }' | \
    sudo xargs -or apt -y remove --purge
    sudo apt -y update && sudo apt -y install lambda-stack-cuda lambda-tensorbook
    ```

    These commands, together:

    1. Remove existing `apt` sources that might conflict with the Lambda Stack `apt` source.
    2. Uninstall NVIDIA software and deep learning libraries that might conflict with Lambda Stack packages.
    3. Reinstall Lambda Stack.
2.  `grep LINUX /etc/default/grub`

    If the kernel boot options are already set correctly, this command will output the following:

    ```
    GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
    GRUB_CMDLINE_LINUX="button.lid_init_state=open i915.enable_fbc=0"
    #GRUB_DISABLE_LINUX_UUID=true
    ```

{% hint style="info" %}
`GRUB_CMDLINE_LINUX=` might contain custom kernel boot options in addition to `button.lid_init_state=open` and `i915.enable_fbc=0`.
{% endhint %}

If the kernel boot options are not already set correctly, run the following command:

```bash
sudo sed -iE '/^GRUB_CMDLINE_LINUX=/ s/"$/button.lid_init_state=open i915.enable_fbc=0"/' /etc/default/grub && \
sudo update-initramfs -u -k all && \
sudo update-grub
```

This command adds kernel boot options needed for Ubuntu to run properly on the Tensorbook.

{% hint style="info" %}
Be sure to note any custom kernel boot options before running this command. **Running this command will remove all custom kernel boot options.**
{% endhint %}

Lambda Stack is now reinstalled in Ubuntu.

## Where can I download recovery images for my Tensorbook?

Tensorbook recovery images can be downloaded from our [recovery images FAQ](../../education/linux-usage/lambda-stack-and-recovery-images.md#tensorbook).
