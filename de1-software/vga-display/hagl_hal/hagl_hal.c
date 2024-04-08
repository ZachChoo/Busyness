#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <intelfpgaup/video.h>
#include "hagl_hal.h"

bitmap_t *hagl_hal_init(void)
{
    video_open();
    /* This HAL does not use double buffering so we return NULL. */
    return NULL;
}

void hagl_hal_clear_screen(void)
{
    video_erase();
    video_clear();
}

void hagl_hal_put_pixel(int16_t x0, int16_t y0, color_t color)
{
    video_pixel(x0,y0,color);
}

size_t hagl_hal_flush()
{
    video_erase();
    video_show();        // clear current VGA Back buffer
    return DISPLAY_WIDTH * DISPLAY_HEIGHT * DISPLAY_DEPTH;
}

void hagl_hal_close()
{
    video_close();
}
