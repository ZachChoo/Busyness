# The compiler.
CC = gcc

# Compiler flags.
CCFLAGS	= -Wall -o

# The target executable name.
TARGET = read_switches 

# The source to compile.
SRC = read_switches.c

# The included libraries.
LIBS = -lintelfpgaup

# Compile the source file: gcc -Wall -o test test.c -lintelfpgaup
$(TARGET): $(SRC)
	@$(CC) $(CCFLAGS) $(TARGET) $(SRC) $(LIBS)


# Remove the target (the executable).
.PHONY: clean
clean:
	@rm -f $(TARGET)

