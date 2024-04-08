# This test script should be run from a host computer, plugged into the DE1 over UART.
from random import randint, sample
from time import sleep
import sys
import serial
import requests
import inspect

DEVICE_NAME = "/dev/cu.usbserial-A908KJD1"
BAUD_RATE = 115200

SERVER_HOST = "https://busyness-344108.uw.r.appspot.com"
WAIT_FOR_SERVER_SECONDS = 5
BUILDING_ID = "624d320b013c88c593b7b867"
ROOM_ID = "624debc0013c88c593b8043a"
EXECUTABLE = "./a.out"
SHOW_ALL_TEST_RESULTS = True
VALIDATE_WITH_CLOUD = True

#define ENDPOINT "/api/update_room/"
CRED = '\033[91m'
CGREEN = '\33[32m'
CEND = '\033[0m'
CBOLD = '\33[1m'
CYELLOW = '\33[33m'



sample_mac_address = list(set("{:02x}:{:02x}:{:02x}:{:02x}:{:02x}:{:02x}".format(randint(0,255), randint(0,255), randint(0,255), randint(0,255), randint(0,255), randint(0,255)) for i in range(1000)))
fail_count = 0

def send_command_assert_correct(args: str, expected_count: int) -> bool:
    # return randint(0,1)
    with serial.Serial(DEVICE_NAME, BAUD_RATE) as dev:
        dev.write(b"\x03") # Send ^C
        dev.read_until(b"# ") # wait for device ready
        if args != "": args = " " + args # add space if necessary

        dev.write((f"{EXECUTABLE}{args}\n").encode())
        dev.read_until(b"device count: ") # wait for hashing if needed
        if not sleep(WAIT_FOR_SERVER_SECONDS):
            actual_count = int(dev.read_until(b"\n"))
            return actual_count == expected_count
    
    

    if VALIDATE_WITH_CLOUD:
        sleep(WAIT_FOR_SERVER_SECONDS)
        resp = requests.get(f"{SERVER_HOST}/api/get_room?id={BUILDING_ID}&roomid={ROOM_ID}")

        return resp.json()["data"]["deviceCount"] == expected_count

def wait_for_tester(message: str):
    input(f"{CYELLOW}{message}{CEND}")
    sys.stdout.write("\033[F") # cursor up one line
    sys.stdout.write("\033[K") #clear that line

def _assert(description: str, val: bool):
    global fail_count
    curframe = inspect.currentframe()
    calling_function = inspect.getouterframes(curframe, 2)[1][3]
    if not val: fail_count += 1
    if SHOW_ALL_TEST_RESULTS or not val:
        result = (f"{CGREEN}PASSED" if val else f"{CRED}FAILED") + CEND
        print(f"   {calling_function}::{description}  {result}")



def test_count():
    _assert("count_pos", send_command_assert_correct("-c 5", 5) )
    _assert("count_neg", send_command_assert_correct("-c -2", 0) )
    _assert("count_empty", send_command_assert_correct("-c", 1) )
    _assert("empty", send_command_assert_correct("", 0) )
    _assert("garbage", send_command_assert_correct("kljsafoienafoi", 1) )
    _assert("1mac", send_command_assert_correct(sample_mac_address[0], 1) )
    _assert("50mac", send_command_assert_correct(" ".join(sample_mac_address[:50]), 50) )
    _assert("all_mac", send_command_assert_correct(" ".join(sample_mac_address), len(sample_mac_address)) )


def test_exclusion_list():
    wait_for_tester("Please set KEY0 to ON")

    _assert("exclusion", send_command_assert_correct(" ".join(sample_mac_address[:5]), 0))
    _assert("exclusion_again", send_command_assert_correct(" ".join(sample_mac_address[:5]), 0))
    
    wait_for_tester("Please set KEY0 to OFF")

    _assert("exclusion_check_none", send_command_assert_correct(" ".join(sample_mac_address[:5]), 0))
    _assert("exclusion_check_extra", send_command_assert_correct(" ".join(sample_mac_address[:10]), 5))
    



if __name__ == "__main__":
    print("Running tests: " + ", ".join(filter(lambda x: x.startswith("test_"), dir())))
    wait_for_tester("Please set KEY0 to OFF")

    fn_names = list(filter(lambda x: x.startswith("test_"), dir()))
    for fn_name in fn_names:
        if callable(globals()[fn_name]):
            globals()[fn_name]()
    
    print(f"{CBOLD}{fail_count} test(s) failed.{CEND}")
