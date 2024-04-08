#include <stdlib.h> /* atoi */
#include <stdio.h>

#include "main.h"



int getExclusionList(hashed_device_t **exclusion_list) {

    FILE *file;
	unsigned long fileLen;
    int exclusionListLength;

	//Open file
	file = fopen(EXCLUSION_LIST_FILE, "ab+");
	if (!file)
	{
		fprintf(stderr, "Unable to open file %s", EXCLUSION_LIST_FILE);
		return 0;
	}
	
	//Get file length
	fseek(file, 0, SEEK_END);
	fileLen=ftell(file);
	fseek(file, 0, SEEK_SET);

    if(fileLen % sizeof(hashed_device_t) != 0) {
        fprintf(stderr, "File length (%lu) invalid size. Should be divisible by 32.\n", fileLen);
        fclose(file);
        return 0;
    }
    exclusionListLength = fileLen / sizeof(hashed_device_t);

    printf("Exclusion list length = %d\n", exclusionListLength);

	//Allocate memory
	*exclusion_list = malloc(exclusionListLength * sizeof(hashed_device_t));
	if (!(*exclusion_list))
	{
		fprintf(stderr, "Memory error!");
        fclose(file);
		return 0;
	}

	// //Read file contents into buffer
	fread(*exclusion_list, fileLen, 1, file);
	fclose(file);

    // printf("%s bottom int\n", (char*) *exclusion_list);

	return exclusionListLength;
}

char isHashedDeviceExcluded(hashed_device_t* hashed_device, hashed_device_t* exclusion_list, int list_size) {
	for(int i = 0; i < list_size; i++) {
		char equal = 1;
		for(int d = 0; d < 8; d++){
			if(hashed_device->d[d] != exclusion_list[i].d[d]) {
				equal = 0;
				break;
			}
		}
		if(equal) return 1;
	}
	return 0;
}

int addMACsToExclusion(int argc, char* argv[]) {
    hashed_device_t *exclusion_list;
	int exclusionListSize = getExclusionList(&exclusion_list);

	hashed_device_t hashed_device;

    int seenDeviceCount = argc - 1;

    FILE *file;
    file = fopen(EXCLUSION_LIST_FILE, "ab");
    if (!file)
	{
		fprintf(stderr, "Unable to open file %s", EXCLUSION_LIST_FILE);
		return 0;
	}

    int count = 0;

	for (int i = 1; i < seenDeviceCount+1; i++) {
		hashDevice(argv[i], &hashed_device, i);

		if(!isHashedDeviceExcluded(&hashed_device, exclusion_list, exclusionListSize)) {
            count++;
            fwrite(hashed_device.d, 1, sizeof(hashed_device_t ), file);
        }
	}

    fclose(file);
    if (exclusionListSize > 0) free(exclusion_list);
    
    printf("Added %d devices to the exclusion list.\n", count);

    return 0;
}