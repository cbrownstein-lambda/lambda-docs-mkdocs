---
tags:
  - BIOS
  - monitor
  - WRX80
---

# Troubleshooting Workstations and Desktops

## Unable to access the BIOS on a Vector desktop with a WRX80 motherboard when it's connected to a 4K monitor.

If you have a Vector desktop with a WRX80 motherboard and a 4K monitor, when the system boots, the monitor should display the ASUS logo screen; however, it does not show the prompts to access the BIOS. If you press ++f2++ to access the BIOS, the monitor continues to not display the BIOS prompts until after the system restarts. The system boots normally if you don't interact with it, but the video only displays when the Ubuntu OS boots successfully.

You can determine whether your system has the WRX80 motherboard by running:

``` bash
sudo dmidecode -t 2 | grep Name
```

Your system has a WRX80 motherboard if the command returns: `Product Name: Pro WS WRX80E-SAGE SE`

The best solution at this time is to switch to a non-4K monitor, like 1080p.

## No audio from aux ports on Vector workstations

### Known issue with Ubuntu 22.02
A bug in Ubuntu 22.02 can cause the front aux port to malfunction on some Vector workstations. This issue is resolved in Ubuntu 24.04; however, Lambda Stack does not yet support this version. Once Lambda Stack moves to Ubuntu 24.04, this issue should be resolved.

### Test the rear audio port
If your machine does not recognize audio devices connected to the front aux port, try using the rear audio port, which is lime green in color.
If you still experience audio issues with the rear port, here are some further steps you can take:

#### Update drivers
Update your drivers by running the following command in the terminal:

```bash
sudo apt-get update && sudo apt-get full-upgrade && sudo reboot.
```

After updating the drivers, test the aux ports again to see if the issue is resolved.

#### Reinstall audio packages
If the issue persists after updating the drivers, try reinstalling the audio packages using the following commands:

```bash
sudo apt-get -y install --reinstall alsa-base alsa-topology-conf alsa-ucm-conf alsa-utils gstreamer1.0-alsa:amd64

sudo apt-get -y install --reinstall libasound2 libasound2-data libasound2-plugins

sudo apt-get -y install --reinstall gstreamer1.0-pulseaudio:amd64 libpulse-mainloop-glib0:amd64 libpulse0:amd64 libpulsedsp:amd64 pulseaudio pulseaudio-utils
```
After reinstalling the audio packages, test the aux ports to see if the issue is resolved.

#### Check the motherboard HD audio cable connection
Reseat the HD audio cable connected to the port on the bottom-left of the motherboard and make sure the cable is securely connected.

# Contact Lambda
If you can’t discover the cause for the issue you are experiencing, contact [Lambda Support](https://support.lambdalabs.com/hc/en-us/requests/new?_gl=1*14mhprh*_gcl_aw*R0NMLjE3MjUwNTY3OTYuQ2owS0NRancyOFcyQmhDN0FSSXNBUGVycmNMRnFXN0xyV2RBNlZBV0dzWXR0RTRVZjg1a0Y0YTFUUllOVUI3Zy1DTGtVZEFwclJ1YlZBTWFBdGhuRUFMd193Y0I.*_gcl_au*MTUxMDIxMzUyNS4xNzI2NzgwODUx*_ga*ODIxNzg0NzQ0LjE2OTIzMDA3ODQ.*_ga_43EZT1FM6Q*MTcyODY2NjU3NC44OC4xLjE3Mjg2NjY1ODQuNTAuMC4w) and provide us with your Lambda bug report.
