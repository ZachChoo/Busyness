#include <time.h>
#include <stdlib.h>
#include <stdio.h>

#include "main.h"


device_count_time_t * save_and_get_history(int deviceCount){
    FILE* fp = fopen(HISTORY_FILENAME, "rwb+");
    
    device_count_time_t * history = NULL;
    
    if (fp) {

        // History will be oldest to newest
        history = malloc(sizeof(device_count_time_t) * HISTORY_LENGTH);

        int history_length_read = fread(history, sizeof(device_count_time_t), HISTORY_LENGTH, fp);

        printf("Read %d items file... ", history_length_read);

        rewind(fp);
        fwrite(&history[(history_length_read >= HISTORY_LENGTH) ? 1 : 0], 
            sizeof(device_count_time_t), MIN(history_length_read, HISTORY_LENGTH-1), fp);
    } else {
        fp = fopen(HISTORY_FILENAME, "wb+");
        if (!fp) return NULL;
    }
    device_count_time_t new_dct;
    new_dct.ts = (unsigned long) time(NULL);
    new_dct.device_count = deviceCount;

    int i = fwrite(&new_dct, sizeof(device_count_time_t), 1, fp);
    printf("wrote %d to file (err %d)...\n", i, ferror(fp));
    fclose(fp);

    return history;
}

