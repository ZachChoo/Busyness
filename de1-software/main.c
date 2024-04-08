#include "main.h"

#include <stdio.h> /* printf, sprintf */
#include <stdlib.h> /* atoi */
#include <unistd.h>
#include <pthread.h>
#include <string.h> /* strlen, strcmp */
#include <curl/curl.h>

#ifndef NON_DE1

#include <intelfpgaup/SW.h>

#endif

static char ADD_TO_EXCLUSION_LIST = 0;

void * sendDeviceCountAsync(void * device_count_ptr)
{
	int device_count = *((int*) device_count_ptr);
	CURL *curl;
	CURLcode res;
	curl = curl_easy_init();
	if (curl)
	{
		char data_buffer[256];

		/* Set the endpoint */
		curl_easy_setopt(curl, CURLOPT_URL, HOST ENDPOINT);
		printf(HOST ENDPOINT "\n");

		/* Create and set the POST data */
		sprintf(data_buffer, "deviceCount=%d&id=" BUILDING_ID "&roomid=" ROOM_ID, device_count);

		curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data_buffer);
		curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "PUT");
		// curl_easy_setopt(curl, CURLOPT_DEFAULT_PROTOCOL, "https");


		/* Perform the request, res will get the return code */
		res = curl_easy_perform(curl);
		/* Check for errors */
		if (res != CURLE_OK)
			fprintf(stderr, "curl_easy_perform() failed: %s\n",
					curl_easy_strerror(res));

		/* always cleanup */
		curl_easy_cleanup(curl);
	}
	// printf("\n");
}


int hashAndCountDevices(int argc, char *argv[]){
	int seenDeviceCount = argc - 1;
	if(seenDeviceCount == 0) return 0;
	
	hashed_device_t *exclusion_list;
	int exclusionListSize = getExclusionList(&exclusion_list);

	hashed_device_t hashed_device;

	int deviceCount = 0;

	for (int i = 1; i < seenDeviceCount+1; i++) {
		hashDevice(argv[i], &hashed_device, i);
		// printf("%d \n", hashed_device.d[0]);
		if(!isHashedDeviceExcluded(&hashed_device, exclusion_list, exclusionListSize))
			deviceCount++;
	}

	if (exclusionListSize > 0) free(exclusion_list);
	
	return deviceCount;
}

int decode_mac(char* device, unsigned int* lower, unsigned int* upper) {
	*lower = 0;
	*upper = 0;
	for (int i = 0; i < 2; i++) {
		*upper = (*upper << 8) | strtol(device, NULL, 16);
		device += 3;
	}

	for (int i = 0; i < 4; i++) {
		*lower = (*lower << 8) | strtol(device, NULL, 16);
		device += 3;
	}
	return 0;
}

int hashDevice(char* device, hashed_device_t *hashed_device, int i){
#ifdef NON_DE1
	hashed_device->d[0] = i;
	for (int j = 1; j < 8; j++) {
		hashed_device->d[j] = 0;
	}
#else
	unsigned int lower, upper;

	decode_mac(device, &lower, &upper);

	sha256_hash(upper, lower, hashed_device->d);

	printf("MAC: %x %x  HASH: ", upper, lower);
	for (int i = 7; i>=0; i--){
		printf("%x ", hashed_device->d[i]);
		if(i==4) printf("  ");
	}
	printf("\n");

#endif
	return 0;
}


int main(int argc, char *argv[])
{
	unsigned long updated_at = (unsigned long) time(NULL);
	int deviceCount = 0; 
	
	if (argc == 3 && (strcmp("-c", argv[1]) == 0 || strcmp("--count", argv[1]) == 0))
	{
		deviceCount = atoi(argv[2]);
		// we've parsed the entire argument, meaning it was a raw number (device count) so we are done
		printf("device count given\n");
	} else if (argc >= 2) {
	#ifdef NON_DE1
		ADD_TO_EXCLUSION_LIST = 0;
	#else
		int swval = 0;

		SW_open();
		// Reads the switch values
		SW_read(&swval);

		ADD_TO_EXCLUSION_LIST = swval & 1;
		// Close switches
		SW_close();

	#endif


		if(ADD_TO_EXCLUSION_LIST) {
			addMACsToExclusion(argc, argv);
			deviceCount = 0; // we are excluding everything anyway
		} else{	
			deviceCount = hashAndCountDevices(argc, argv);
		}
	}

	deviceCount = MAX(0, deviceCount);

	pthread_t network_thread;
	pthread_create(&network_thread, NULL, sendDeviceCountAsync, &deviceCount);

	device_count_time_t * history = save_and_get_history(deviceCount);
	
	printf("device count: %d\n", deviceCount);

	while (1) {
		init_vga();
		show_device_count_vga(deviceCount, updated_at, history);
		sleep(1);
	}
}