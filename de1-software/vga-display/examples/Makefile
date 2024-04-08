CC = gcc -std=c99
GDFLAGS = -g -lm -lintelfpgaup
palette: CFLAGS = -Wall -I../ -I../hagl_hal/ -I../hagl/include -DDISPLAY_WIDTH=320 -DDISPLAY_HEIGHT=240
shapes: CFLAGS = -Wall -I../ -I../hagl_hal/ -I../hagl/include -DDISPLAY_WIDTH=320 -DDISPLAY_HEIGHT=240

PALETTEFLAGS=

src = $(wildcard ../hagl_hal/*.c) \
      $(wildcard ../hagl/src/*.c)

obj = $(src:.c=.o)

all: palette

palette: palette.c $(obj)
	$(CC) $(PALETTEFLAGS) $(CFLAGS) -o $@ $^ $(LDFLAGS) $(GDFLAGS)

shapes: shapes.c $(obj)
	$(CC) $(PALETTEFLAGS) $(CFLAGS) -o $@ $^ $(LDFLAGS) $(GDFLAGS)

.PHONY: clean
clean:
	rm -f $(obj) palette *.png *.o
