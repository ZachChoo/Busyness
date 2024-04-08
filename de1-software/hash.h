#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/mman.h>
#include "address_map_arm.h"

#define HASH_ARR_SIZE 8

/* Prototypes for functions used to access physical memory addresses */
int sha256_hash(unsigned int, unsigned int, unsigned int hash_arr[HASH_ARR_SIZE]);
