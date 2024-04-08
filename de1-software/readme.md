## Setup
### Flashing the SD card
Download the image: [here](https://ftp.intel.com/Public/Pub/fpgaup/pub/Intel_Material/18.1/SD_Images/DE1-SoC.zip). Extract the zip and then extract `DE1-SoC-UP-Linux/DE1-SoC-UP-Linux.zip` and flash the SD card using your favorite image flasher with `DE1-SoC_UP_Linux_ROS.img`. I like [Balena Etcher](https://www.balena.io/etcher/).


### Once you're booted
1. To get Ethernet working to the global network and enable switch reading, add the following commands to `/etc/rc.local` before `exit 0`:
```bash
sudo dhclient eth0
sudo date -s "$(wget -qSO- --max-redirect=0 google.com 2>&1 | grep Date: | cut -d' ' -f5-8)Z"
TZ='America/Vancouver'; export TZ
```

2. Then update the source list `/etc/apt/sources.list`, replacing `precise` to `trusty`.

3. Run the following:
```bash
sudo apt-get update
sudo apt-get install dpkg
sudo apt-get upgrade
apt-get install curl
apt-get install libcurl4-openssl-dev
```

4. Setup SW drivers:
    1. Make directory ``/lib/modules/`uname -r`/kernel/drivers/SW``.
    2. Copy `~/Linux-Libraries/drivers/SW.ko` to this new directory.
    3. Add the line `SW` to `/etc/modules` file.
    4. Add the line `insmod /home/root/Linux_Libraries/drivers/SW.ko || true` to `/etc/rc.local`.

5. Repeat step 4 replacing `SW` with `video` in all cases. Also, add `insmod /home/root/Linux_Libraries/drivers/SW.ko || true` to `~/.bash_profile`. Also add `TZ='America/Vancouver'; export TZ` to `~/.bash_profile`.

6. Run `$ depmod`. Reboot and confirm the SW module was loaded with `$ lsmod`. You should see SW.

7. Make sure you have the correct `.rbf` file loaded. Easiest way to do this is to replace `~/DE1_SoC_Computer.rbf` on the DE1 with `/de1-soc-fpga-vga/output_files/output_file.rbf` found in this repo (change the name).

8. Create a symlink in the home directory: `$ ln -s ~/software/a.out a.out`

## Building the project
Build using `make`.
