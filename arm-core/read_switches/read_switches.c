#include <stdio.h>
#include <stdlib.h>
#include <intelfpgaup/SW.h>

//
// Assuming the drivers have been loaded and the library has been installed
// compile using this command: 
//								gcc -Wall -o test main.c -lintelfpgaup
//

int main()
{
	int swval;

	// Open switches
	SW_open();

	// Reads the switch values
	SW_read(&swval);

	// Print the switch values
	printf("switch vals: %d\n", (int)swval);

	// Close switches
	SW_close();

	return 0;
}
