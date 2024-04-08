import serial

with serial.Serial('/dev/ttyUSB0', 115200, timeout=1) as ser:
    #result = ser.write("echo TESTMAC > ~/mac_address_test.txt\n")
    result = ser.write(b"/home/root/tutorial_files/increment_leds/increment_leds\n")
    result = ser.readline()
    print(result)
