# Raspberry Pi Component

Since we are trying to detect nearby devices, we need to listen to Wi-Fi probe frames. In order to do so, our 802.11 Wi-Fi chip needs to be able to enter monitor mode. We found that many off the shelf SPI Wi-Fi cards did not support this. Through our investigation, we stumbled up using [Nexmon](https://github.com/seemoo-lab/nexmon) drivers to enable a Raspberry Pi's Wi-Fi chip to enter monitor mode. Paired with [Kismet](https://www.kismetwireless.net/) to actually listen and decode the probe frames, we are able to detect nearby device's MAC addresses.

To keep within the scope of the project, we will use the Raspberry Pi as a glorified Wi-Fi card and nothing more.

## Setup

1. First, install [this image](https://downloads.raspberrypi.org/raspios_armhf/images/raspios_armhf-2020-08-24/) onto the Raspberry Pi 3B+ (RPi). It's a slightly older version on Raspberry Pi OS running a 5.4 kernel.
2. After boot, set up your Pi as usual. Hit <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>F1</kbd> to show the CLI, and login with user `pi`, password `raspberry`. Run `$ sudo raspi-config`, set your locale, WLAN info, and other configuration. You can enable SSH here.
3. Download and run `rpi-source`. Instructions can be found in its [GitHub repository](https://github.com/RPi-Distro/rpi-source). This allows us to get the correct kernel headers (`apt-get` will give you the kernel headers for 5.10, but we need 5.4).
4. Build & install Nexmon.

    i. Follow installation instructions found in the [Nexmon's GitHub repo's readme](https://github.com/seemoo-lab/nexmon#build-patches-for-bcm43430a1-on-the-rpi3zero-w-or-bcm434355c0-on-the-rpi3rpi4-or-bcm43436b0-on-the-rpi-zero-2w-using-raspbianraspberry-pi-os-recommended).

    ii. Make sure to also follow the *optional* steps to make the RPi load the new driver on reboot (this is in the following section in that readme).

5. Install Kismet via packages. You can find instruction on the [Kismet website](https://www.kismetwireless.net/docs/readme/packages/#debian--raspbian-buster-intel-raspberry-pi).
    
    i. When prompted with *"Should Kismet be installed with suid-root helpers?"*, select `yes`.
    
    ii. `$ sudo usermod -aG kismet $USER` to add the pi user to the necessary group.
    
    iii. Via pip: `$ pip3 install kismetdb`.

    iv. In `/etc/kismet/` update your config files to minimize logging and memory usage. This is up to you, but recommended to set `tracker_device_timeout=600` and `packet_backlog_limit=16` in `kismet_memory.conf`, and uncomment `device_location_signal_threshold_dbm=-65` in `kismet_filter.conf`.

6. Copy this `rpi/` directory to `~/software/` on the RPi (perhaps using `scp`, or just `git clone`).

### Setting up systemd
We'll use `systemd` to start the watchdog script and kismet firmware on startup.

1. Move `~/software/nexmon_watchdog.service` and `~/software/uart_kismet.service` to `/etc/systemd/system/`.
2. `chmod +x ~/software/nexmon_watchdog.sh`
3. `$ sudo systemctl enable nexmon_watchdog.service` and `$ sudo systemctl enable uart_kismet.service`. 
4. `$ sudo systemctl start nexmon_watchdog.service` and `$ sudo systemctl start uart_kismet.service`. 

## Running the UART-Kismet Driver

Just run `python3 uart_kismet.py` or, if you've set up systemd, it will run automatically on boot.
