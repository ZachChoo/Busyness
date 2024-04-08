/*
MIT No Attribution
Copyright (c) 2018-2021 Mika Tuupola
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-cut-
SPDX-License-Identifier: MIT-0
*/

#include <time.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <intelfpgaup/video.h>
#include "font6x9.h"
#include <wchar.h>

#include "hagl_hal.h"
#include "hagl.h"

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

void rand_color(color_t *color) 
{
        color_t video_color[] = {video_WHITE, video_YELLOW, video_RED,
                video_GREEN, video_BLUE, video_CYAN, video_MAGENTA, video_GREY,
                video_PINK, video_ORANGE};
        *color = video_color[(rand()%10)];      // random out of 10 video colors
}

int main()
{
    hagl_init();

    // Draws random circles on the screen
    //for (uint16_t i = 1; i < 500; i++) {
    //    int16_t x0 = DISPLAY_WIDTH / 2;
    //    int16_t y0 = DISPLAY_HEIGHT / 2;
    //    int16_t radius = rand() % DISPLAY_WIDTH;
    //    color_t color;
    //    rand_color(&color);
    //
    //    hagl_draw_circle(x0, y0, radius, color);
    //}

    // Draws random rectangles on the screen
    //for (uint16_t i = 1; i < 10; i++) {
    //    int16_t x0 = rand() % DISPLAY_WIDTH;
    //    int16_t y0 = rand() % DISPLAY_HEIGHT;
    //    int16_t x1 = rand() % DISPLAY_WIDTH;
    //    int16_t y1 = rand() % DISPLAY_HEIGHT;
    //    color_t color;
    //    rand_color(&color);
    //
    //    hagl_fill_rectangle(x0, y0, x1, y1, color);
    //}

    // Puts random characters on the screen
    //for (uint16_t i = 1; i < 10000; i++) {
    //    int16_t x0 = rand() % DISPLAY_WIDTH;
    //    int16_t y0 = rand() % DISPLAY_HEIGHT;
    //    color_t color;
    //    rand_color(&color);
    //    char code = rand() % 255
    //
    //    hagl_put_char(code, x0, y0, color, font6x9);
    //}

    // Puts strings on the display
    for (uint16_t i = 1; i < 10000; i++) {
        int16_t x0 = rand() % DISPLAY_WIDTH;
        int16_t y0 = rand() % DISPLAY_HEIGHT;
        color_t color;
        rand_color(&color);
    
        hagl_put_text(L"YO! MTV raps.", x0, y0, color, font6x9);
    }

    (void)hagl_flush();
    printf("\nDone\n");
    hagl_close();

    return 0;
}

