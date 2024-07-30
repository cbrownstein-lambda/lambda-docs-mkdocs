# Troubleshooting Workstations and Desktops

## I can't access the BIOS on a Vector desktop with a WRX80 motherboard when it's connected to a 4K monitor.

If you have a Vector desktop with a WRX80 motherboard and a 4K monitor, when the system boots, the monitor should display the ASUS logo screen; however, it does not show the prompts to access the BIOS. If you press F2 to access the BIOS, the monitor continues to not display the BIOS prompts until after the system restarts. The system boots normally if you don't interact with it, but the video only displays when the Ubuntu OS boots successfully.

You can determine whether your system has the WRX80 motherboard by running:

```sudo dmidecode -t 2 | grep Name```

Your system has a WRX80 motherboard if the command returns: `Product Name: Pro WS WRX80E-SAGE SE`

The best solution at this time is to switch to a non-4K monitor, like 1080p.
