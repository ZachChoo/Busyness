#ifndef _HAGL_GD_HAL_H
#define _HAGL_GD_HAL_H

#ifdef __cplusplus
extern "C" {
#endif

#include <stdint.h>
#include <bitmap.h>

#ifndef DISPLAY_WIDTH
#define DISPLAY_WIDTH   (320)
#endif
#ifndef DISPLAY_HEIGHT
#define DISPLAY_HEIGHT  (240)
#endif
#define DISPLAY_DEPTH   (16)

#define HAGL_HAS_HAL_INIT
#define HAGL_HAS_HAL_FLUSH
#define HAGL_HAS_HAL_CLOSE
#define HAGL_HAS_HAL_COLOR
#define HAGL_HAS_HAL_CLEAR_SCREEN

/** HAL must provide typedef for colors. This HAL uses RGB888. */
typedef uint16_t color_t;

void hagl_hal_clear_screen(void);

/**
 * @brief Initialize the HAL
 *
 * Initialises all hardware and possible memory buffers needed
 * to draw and display an image. If HAL uses double or triple
 * buffering should return a pointer to current back buffer.
 * This HAL does not use buffering so it returns NULL instead.
 *
 * @return pointer to bitmap_t or NULL
 */
bitmap_t *hagl_hal_init(void);

/**
 * @brief Draw a single pixel
 *
 * This is the only mandatory function HAL must provide.
 *
 * @param x0 X coordinate
 * @param y0 Y coorginate
 * @param color color
 */
void hagl_hal_put_pixel(int16_t x0, int16_t y0, color_t color);

/**
 * @brief Output the image
 *
 * This is used for HAL implementations which do not display
 * the drawn pixels automatically. Call this function always when
 * you have finished rendering.
 *
 * @return number of bytes written
 */
size_t hagl_hal_flush();

/**
 * @brief Close and clean up the HAL
 *
 * This is used for HAL implementations which need some cleanup, such
 * as deallocating memory, to be done when closing the program.
 */
void hagl_hal_close();

/**
 * @brief Convert RGB to HAL color type
 *
 * This is used for HAL implementations which use some other pixel
 * format than RGB565.
 */
static inline color_t hagl_hal_color(uint8_t r, uint8_t g, uint8_t b)
{
    // red [15..11], green [10..5], blue [4..0]
   // r = r >> 3;
   // g = g >> 2;
   // b = b >> 3;
   // return (r << 11) | (g << 5) | (b);
    //uint16_t rgb;

    //rgb = ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | ((b & 0xF8) >> 3);
    //rgb = (((rgb) << 8) & 0xFF00) | (((rgb) >> 8) & 0xFF);

    //return rgb;

    uint16_t rgb;
 
    rgb = ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | ((b & 0xF8) >> 3);
    rgb = (((rgb) << 8) & 0xFF00) | (((rgb) >> 8) & 0xFF);
 
    return rgb;
 
}

#ifdef __cplusplus
}
#endif
#endif /* _HAGL_GD_HAL_H */
