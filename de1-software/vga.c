#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include "font10x20.h"
#include "font5x7.h"
#include <wchar.h>
#include <time.h>

#include "hagl_hal.h"
#include "hagl.h"

#include "main.h"
#include <intelfpgaup/video.h>


#define video_WHITE     0xFFFF   // Define some colors for video graphics
#define video_YELLOW    0xFFE0
#define video_RED       0xF800
#define video_GREEN     0x07E0
#define video_BLUE      0x041F
#define video_CYAN      0x07FF
#define video_MAGENTA   0xF81F
#define video_GREY      0xC618
#define video_PINK      0xFC18
#define video_ORANGE    0xFC00
#define video_BLACK     0x0000


int init_vga() {
    hagl_init();
    // we could set background color here or something
    return 0;
}

void show_history(int device_count, unsigned long updated_at, device_count_time_t * history) {
    unsigned long now = (unsigned long) time(NULL);

    /* x axis 
    left most point at (DISPLAY_WIDTH/10, 9*DISPLAY_HEIGHT/10)
    right most point at (9*DISPLAY_WIDTH/10, 9*DISPLAY_HEIGHT/10)
    */
    hagl_draw_vline(DISPLAY_WIDTH/10, 9*DISPLAY_HEIGHT/10-3,6, video_WHITE);
    hagl_draw_vline(9*DISPLAY_WIDTH/10, 9*DISPLAY_HEIGHT/10-3,6, video_WHITE);
    hagl_put_text(L"NOW",9*DISPLAY_WIDTH/10 - 3, 9*DISPLAY_HEIGHT/10 + 6, video_GREEN, font5x7);
    
    wchar_t lookBackText[25];

    swprintf(lookBackText, sizeof(lookBackText), L"%d mins ago", HISTORY_DISPLAY_SECONDS / 60);
    hagl_put_text(lookBackText,DISPLAY_WIDTH/10 - 5, 9*DISPLAY_HEIGHT/10 + 6, video_GREEN, font5x7);
    hagl_draw_hline(DISPLAY_WIDTH/10-5, 9*DISPLAY_HEIGHT/10, 8*DISPLAY_WIDTH/10+10, video_WHITE);


    /* y axis */
    //compute max device count
    int max_device_count = device_count;
    for (int i = 0; i < HISTORY_LENGTH; i++) {
        if (now-history[i].ts > HISTORY_DISPLAY_SECONDS) continue;
        if(history[i].device_count > max_device_count) {
            max_device_count = history[i].device_count;
        }
    }
    // round up to 5s (but 5s go to next 5s)
    max_device_count += 5;
    max_device_count -= max_device_count % 5;

    hagl_draw_vline(DISPLAY_WIDTH/10-7, 4*DISPLAY_HEIGHT/10-5, 5*DISPLAY_HEIGHT/10+5, video_GREY);
    for (int i = 5; i >= 0; i--) {
        hagl_draw_hline(DISPLAY_WIDTH/10-7-3, 4*DISPLAY_HEIGHT/10 + (5-i)*DISPLAY_HEIGHT/10, 3, video_GREY);
        wchar_t device_count_label[8];
        int label_len = swprintf(device_count_label, sizeof(device_count_label), L"%d", i*max_device_count/5);
        hagl_put_text(device_count_label, DISPLAY_WIDTH/10-7-(label_len*5)-5, 4*DISPLAY_HEIGHT/10 + (5-i)*DISPLAY_HEIGHT/10 - 3, video_GREEN, font5x7);
    }

    /* draw history */
    #define DRAW_PRECISION (1000)
    int x, y, lastx, lasty = 0;
    for (int i = 0; i < HISTORY_LENGTH; i++) {
        int time_delta = now-history[i].ts;
        if (time_delta > HISTORY_DISPLAY_SECONDS) continue;

        int pct_of_max = DRAW_PRECISION*history[i].device_count / max_device_count;
        int pct_of_time = DRAW_PRECISION*time_delta / (HISTORY_DISPLAY_SECONDS);
        x = DISPLAY_WIDTH/10 + (DRAW_PRECISION-pct_of_time) * 8*DISPLAY_WIDTH/10/DRAW_PRECISION;
        y = 9*DISPLAY_HEIGHT/10 - (pct_of_max * 5*DISPLAY_HEIGHT/10 / DRAW_PRECISION);

        hagl_fill_circle(x,y,2,video_BLUE);
        if (lasty) {
            hagl_draw_line(lastx, lasty, x, y, video_CYAN);
        }
        lastx = x;
        lasty = y;
    }

    int pct_of_max = DRAW_PRECISION*device_count / max_device_count;
    int pct_of_time = DRAW_PRECISION*(abs(now-updated_at)) / (HISTORY_DISPLAY_SECONDS);
    x = DISPLAY_WIDTH/10 + (DRAW_PRECISION-pct_of_time) * 8*DISPLAY_WIDTH/10/DRAW_PRECISION;
    y = 9*DISPLAY_HEIGHT/10 - (pct_of_max * 5*DISPLAY_HEIGHT/10 / DRAW_PRECISION);

    if(now-updated_at <= HISTORY_DISPLAY_SECONDS){
        hagl_fill_circle(x,y,2,video_BLUE);

        if(lasty) hagl_draw_line(lastx, lasty, x, y, video_CYAN);
    }

    /* Show time */

    struct tm *local_now = localtime(&now);

    wchar_t cur_time_label[20];
    swprintf(cur_time_label, sizeof(cur_time_label), L"%2d:%02d:%02d %ls", 
                local_now->tm_hour % 12 ?: 12, local_now->tm_min, local_now->tm_sec, 
                local_now->tm_hour < 12 ? L"AM" : L"PM");

    // free(local_now);

    struct tm *local_updated_at = localtime(&updated_at);

    wchar_t updated_at_label[50];
    swprintf(updated_at_label, sizeof(updated_at_label), L"Last updated at %2d:%02d:%02d %ls", 
                local_updated_at->tm_hour % 12 ?: 12, local_updated_at->tm_min, local_updated_at->tm_sec,
                local_updated_at->tm_hour < 12 ? L"AM" : L"PM");

    // free(local_updated_at);

    hagl_put_text(updated_at_label, 10, 10, video_WHITE, font5x7);
    hagl_put_text(cur_time_label, 8*DISPLAY_WIDTH / 10, 10, video_PINK, font5x7);

}

int show_device_count_vga(int device_count, unsigned long updated_at, device_count_time_t * history) {

    // hagl_fill_rectangle(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, video_BLACK);
    
    wchar_t device_count_string[15];
    int str_len = swprintf(device_count_string,sizeof(device_count_string),L"= %d =", device_count);
    hagl_put_text(device_count_string, (DISPLAY_WIDTH - str_len*10)/2, DISPLAY_HEIGHT/12, video_WHITE, font10x20);
    hagl_put_text(L"devices nearby", (DISPLAY_WIDTH - 15*5)/2, DISPLAY_HEIGHT/12+20, video_WHITE, font5x7);
    
    if (history != NULL) {
        show_history(device_count, updated_at, history);
    }

    (void)hagl_flush();
    hagl_close();

    return 0;
}
