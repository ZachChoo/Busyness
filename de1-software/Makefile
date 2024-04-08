# compiler:
CC = gcc

INCLUDES = -I./vga-display/ -I./vga-display/hagl_hal/ -I./vga-display/hagl/include -DDISPLAY_WIDTH=320 -DDISPLAY_HEIGHT=240
# compiler flags: 
CFLAGS  = -lcurl -lintelfpgaup $(INCLUDES) -pthread -std=c99 

# the build target executable:
TARGET = a.out

# object files to build:
src = $(wildcard ./vga-display/hagl_hal/*.c) \
      $(wildcard ./vga-display/hagl/src/*.c)

OBJ = $(src:.c=.o) main.c exclusion.c hash.c vga.c history.c

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CC) -o $(TARGET) $(OBJ) $(CFLAGS)

clean:
	rm $(TARGET)
