# Virtual environments and Docker containers

## What are virtual environments?

Virtual environments allow you to create and maintain development environments
that are isolated from each other. Lambda recommends using either:

- [Python venv](#creating-a-python-virtual-environment)
- conda

## Creating a Python virtual environment

=== "Linux / MacOS"

    1. Create a Python virtual environment using the `venv` module by running:

    ``` { .sh .copy }
    python -m venv --system-site-packages NAME
    ```

    Replace **NAME** with the name you want to give to your virtual
    environment.

    !!! note

        The command, above, creates a virtual environment that has access to
        Lambda Stack packages and packages installed from Ubuntu repositories.

        To create a virtual environment that doesn't have access to Lambda Stack
        and Ubuntu packages, omit the `--system-site-packages option`.

    2.  Activate the virtual environment by running:

    ``` { .sh .copy }
    source NAME/bin/activate
    ```

    Replace **NAME** with the name you gave your virtual environment in the
    previous step.

    Python packages you install in your virtual environment are isolated from
    the base environment and other virtual environments.

    !!! note

        Locally installed packages can conflict with packages installed in virtual
        environments. For this reason, it's recommended to uninstall locally installed
        packages by running:

        To uninstall packages installed locally for your user only, run:

        ``` { .sh .copy }
        pip uninstall -y $(pip -v list | grep ${HOME}/.local | awk '{printf "%s ", $1}')
        ```

        To uninstall packages installed locally, system-wide (for all users), run:

        ``` { .sh .copy }
        sudo pip uninstall -y $(pip -v list | grep /usr/local | awk '{printf "%s ", $1}')
        ```

    !!! danger

        **Don't run the above uninstall commands on Lambda GPU Cloud on-demand
        instances!**
        
        The above uninstall commands remove all locally installed packages and, on
        on-demand instances, break programs including pip and JupyterLab.

=== "Windows"

    Switch to Linux or MacOS.
