"""
Serial commands (all must end in new line character \n)
    * "HEALTH"
        response: "FEELING GOOD\n"
    * "GET_DEVICES" (doesn't yet have unix time)
        response: "UNIXTIME_AS_OF|MAC1|MAC2|...\n"
    * "GET_SSIDS" (wip)
        response: "UNIXTIME_AS_OF|ssid1|ssid2|...\n"

TODO: add time into response
"""


import kismetdb
import os
import threading
import subprocess
import glob
import serial

USE_PUSH = True
PUSH_COMMAND = "./a.out"

KISMET_LOG_PATTERN = "Kismet-*.kismet"
# SERIAL_DEVICE = "/dev/ttyAMA0"
SERIAL_DEVICE = "/dev/ttyUSB0"
BAUD_RATE = 115200
KISMET_TIMEOUT_SECONDS = 40
KISMET_RUN_INTERVAL_SECONDS = 10

DELETE_KISMET_LOGS_AFTER_READ = True

# Change directory to here
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

device_lock = threading.Lock()
devices = []


def refreshDevicesFromLatestKismet():
    global devices

    kismet_files = sorted(glob.glob(KISMET_LOG_PATTERN))
    if len(kismet_files) == 0:
        device_lock.acquire()
        devices = []
        device_lock.release()
        return
    file_location = kismet_files[-1]
    print("Device source:", file_location)
    dev = kismetdb.Devices(file_location)
    meta_dev = dev.get_meta(type="Wi-Fi Device")
    # print(meta_dev)
    device_lock.acquire()
    devices = sorted(set(map(lambda obj: obj["devmac"], meta_dev)))
    device_lock.release()

def resetKismetLogs():
    for fn in glob.glob(KISMET_LOG_PATTERN):
        print(f"Deleting {fn}...")
        os.remove(fn)
    for fn in glob.glob(KISMET_LOG_PATTERN+"-journal"):
        print(f"Deleting {fn}...")
        os.remove(fn)
    


def startKismet(timeout=10):
    proc = subprocess.Popen(["kismet", "-c", "wlan0"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stopped_early = False
    try:
        outs, errs = proc.communicate(timeout=timeout)
        stopped_early = True
    except subprocess.TimeoutExpired:
        proc.terminate()
        outs, errs = proc.communicate()

    print("---- outs ----")
    print(outs)
    print("---- errs ----")
    print(errs)
    print("Stopped early", stopped_early)
    if b"ERROR: Data source 'wlan0' failed to launch: Unable to find driver for \n       'wlan0'" in outs:
        # we need to restart the drivers with
        print("Failed to load driver. Reloading...")
        os.system("sudo rmmod brcmfmac")
        os.system("sudo modprobe brcmfmac")
        stopped_early = True

    return not stopped_early and (b"*** KISMET IS SHUTTING DOWN ***" in errs)

def kismetCron():
    if DELETE_KISMET_LOGS_AFTER_READ:
        resetKismetLogs()
    else:
        refreshDevicesFromLatestKismet()
    if startKismet(timeout=KISMET_TIMEOUT_SECONDS):
        # success
        refreshDevicesFromLatestKismet()
        if USE_PUSH:
            push_devices()
        threading.Timer(KISMET_RUN_INTERVAL_SECONDS, kismetCron).start()
    else:
        # something went wrong probably, just try again immediately after deleting bad log
        print("Something went wrong... trying again...")
        os.remove(sorted(glob.glob("Kismet-*.kismet"))[-1])
        kismetCron()

def push_devices():
    global devices

    with serial.Serial(SERIAL_DEVICE, BAUD_RATE) as ser:
        device_lock.acquire()
        device_message = " ".join(devices)
        # device_message = str(len(devices))
        device_count = len(devices)
        device_lock.release()
        
        print(f"found {device_count} devices")
        ser.write(b"\x03") # Send ^C
        print("READ FROM DEVICE:")
        print("\t", ser.read_until(b"# ")) # wait for device ready
        
        ser.write((f"{PUSH_COMMAND} {device_message}\n").encode())
        

def sendDevices(ser):
    global devices
    device_lock.acquire()
    device_message = "|".join(devices)
    device_lock.release()
    ser.write((device_message+"\n").encode())


def main():
    
    threading.Thread(target=kismetCron, name="kismet_cron_thread").start()

    if USE_PUSH:
        return

    commands = {
        "HEALTH": lambda ser: ser.write(b"FEELING GOOD\n"),
        "GET_DEVICES": sendDevices,
    }

    with serial.Serial(SERIAL_DEVICE, BAUD_RATE) as ser:
        ser.write(b"hello\n")
        while True:
            command = ser.readline().decode().replace("\n","").upper()

            print(command)
            commands.get(command, lambda x: None)(ser)


if __name__ == "__main__":
    main()