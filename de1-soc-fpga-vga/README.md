SHA-256 verilog module from OpenCores: https://opencores.org/websvn/listing?repname=sha_core&path=%2Fsha_core%2F&rev=0

### SHA256 Hash HW Accelerator Avalon Slave Interface

- The interface works by writing the 64 bits you want hashed to offsets 1 and 2 of the accelerator, and then writing to offset 0 to start the accelerator.
- Then, to read back the hash you will read offsets 3-7 to get the 8*32 bits that make up the 256 bit return value of the hashed value.
- Under the hood the accelerator will stall until it is ready to serve the cpu using the `waitrequest` signal.

| word |                       meaning                                      |
| ---- | ------------------------------------------------------------------ |
|   0  | write: starts accelerator                                          |
|   1  | input 32 bit value to be hashed word 0 (least significant 32 bits) |
|   2  | input 32 bit value to be hashed word 1                             |
|   3  | SHA256 hashed value output word7 (most significant 32 bits)        |
|   4  | SHA256 hashed value output word6                                   |
|   5  | SHA256 hashed value output word5                                   |
|   6  | SHA256 hashed value output word4                                   |
|   7  | SHA256 hashed value output word3                                   |
|   8  | SHA256 hashed value output word2                                   |
|   9  | SHA256 hashed value output word1                                   |
|   10 | SHA256 hashed value output word0 (least significant 32 bits)       |
