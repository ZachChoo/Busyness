//#define HOST "192.168.0.140:8000"
#define HOST "https://busyness-344108.uw.r.appspot.com"
#define ENDPOINT "/api/update_room/"
#define EXCLUSION_LIST_FILE "exclusion.bin"
#define HISTORY_FILENAME "history.bin"
#define BUILDING_ID "624c74a06bbe0da50991208f"
#define ROOM_ID "624c7536ca7267e1ce92aa56"

// #define NON_DE1

#ifndef NON_DE1
#include "hash.h"
#endif

#define MIN(X, Y) (((X) < (Y)) ? (X) : (Y))
#define MAX(X, Y) (((X) > (Y)) ? (X) : (Y))

struct hashed_device_t{
    unsigned int d[8];
};

typedef struct hashed_device_t hashed_device_t;

int hashDevice(char*, hashed_device_t*, int);
void * sendDeviceCountAsync(void * device_count_ptr);
int hashAndCountDevices(int argc, char* argv[]);

// exclusion.c
char isHashedDeviceExcluded(hashed_device_t*, hashed_device_t* exclusion_list, int list_size);
int addMACsToExclusion(int argc, char* argv[]);
int getExclusionList(hashed_device_t **exclusion_list);

// history.c
#define HISTORY_LENGTH 256

// number of seconds back in time to display on the screen
#define HISTORY_DISPLAY_SECONDS (60*15)

struct device_count_time_t
{
    unsigned long ts;
    int device_count;
};

typedef struct device_count_time_t device_count_time_t;

device_count_time_t * save_and_get_history(int deviceCount);

// vga.c
int init_vga();
int show_device_count_vga(int device_count, unsigned long updated_at, device_count_time_t *);