#include "hash.h"

static int open_physical (int);
static void * map_physical (int, unsigned int, unsigned int);
static void close_physical (int);
static int unmap_physical (void *, unsigned int);

/**
 * Function to run hardware accelerated SHA 256 hash on 64 bit input and return
 * 256 bit return value in return array
 *
 * @param word1     32 bits word 1 of value to hash
 * @param word0     32 bits word 0 of value to hash
 * @param hash_arr  array to return 256 bit output as 8*32 bit unsigned ints
 *
 * @return 0 if success, -1 otherwise
 */
int sha256_hash(unsigned int word1, unsigned int word0, unsigned int hash_arr[HASH_ARR_SIZE])
{
   volatile int * HASH_ptr;   // virtual address pointer to red LEDs

   int fd = -1;               // used to open /dev/mem for access to physical addresses
   void *LW_virtual;          // used to map physical addresses for the light-weight bridge
    
   // Create virtual memory access to the FPGA light-weight bridge
   if ((fd = open_physical (fd)) == -1)
      return (-1);
   if ((LW_virtual = map_physical (fd, LW_BRIDGE_BASE, LW_BRIDGE_SPAN)) == NULL)
      return (-1);

   // Set virtual address pointer to I/O port
   HASH_ptr = (unsigned int *) (LW_virtual + HASH_ACCEL_BASE);
    
   // Set word1 of value to be hashed by writing value to be hashed to offset 2 of accelerator
   *(HASH_ptr + 2) = (unsigned)word1;

   // Set word0 of value to be hashed by writing value to be hashed to offset 1 of accelerator
   *(HASH_ptr + 1) = (unsigned)word0;

   // Start accelerator by writing to offset 0 of accelerator
   *HASH_ptr = 0;

   // Get result by reading out 8 words of hashed value
   // Least significant word going into lowest index of hash_arr
   // TODO: currently need to read for 2 cycles, fix this bug in verilog core
   hash_arr[7] = *(HASH_ptr + 3);
   hash_arr[7] = *(HASH_ptr + 3);
   hash_arr[6] = *(HASH_ptr + 4);
   hash_arr[6] = *(HASH_ptr + 4);
   hash_arr[5] = *(HASH_ptr + 5);
   hash_arr[5] = *(HASH_ptr + 5);
   hash_arr[4] = *(HASH_ptr + 6);
   hash_arr[4] = *(HASH_ptr + 6);
   hash_arr[3] = *(HASH_ptr + 7);
   hash_arr[3] = *(HASH_ptr + 7);
   hash_arr[2] = *(HASH_ptr + 8);
   hash_arr[2] = *(HASH_ptr + 8);
   hash_arr[1] = *(HASH_ptr + 9);
   hash_arr[1] = *(HASH_ptr + 9);
   hash_arr[0] = *(HASH_ptr + 10);
   hash_arr[0] = *(HASH_ptr + 10);

   unmap_physical (LW_virtual, LW_BRIDGE_SPAN);   // release the physical-memory mapping
   close_physical (fd);   // close /dev/mem
   return 0;
}

// Open /dev/mem, if not already done, to give access to physical addresses
static int open_physical (int fd)
{
   if (fd == -1)
      if ((fd = open( "/dev/mem", (O_RDWR | O_SYNC))) == -1)
      {
         printf ("ERROR: could not open \"/dev/mem\"...\n");
         return (-1);
      }
   return fd;
}

// Close /dev/mem to give access to physical addresses
static void close_physical (int fd)
{
   close (fd);
}

/*
 * Establish a virtual address mapping for the physical addresses starting at base, and
 * extending by span bytes.
 */
static void* map_physical(int fd, unsigned int base, unsigned int span)
{
   void *virtual_base;

   // Get a mapping from physical addresses to virtual addresses
   virtual_base = mmap (NULL, span, (PROT_READ | PROT_WRITE), MAP_SHARED, fd, base);
   if (virtual_base == MAP_FAILED)
   {
      printf ("ERROR: mmap() failed...\n");
      close (fd);
      return (NULL);
   }
   return virtual_base;
}

/*
 * Close the previously-opened virtual address mapping
 */
static int unmap_physical(void * virtual_base, unsigned int span)
{
   if (munmap (virtual_base, span) != 0)
   {
      printf ("ERROR: munmap() failed...\n");
      return (-1);
   }
   return 0;
}

