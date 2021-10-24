// bump allocator by Surma from https://surma.dev/things/c-to-webassembly/
// CC BY 4.0

#include <malloc.h>
#include <string.h>

extern unsigned char __heap_base;

unsigned long bump_pointer = (unsigned long) &__heap_base;

void *malloc(unsigned long n) {
	unsigned long r = bump_pointer;
	bump_pointer += n;
	return (void *) r;
}

void *memset(void *s, int c, size_t n) {
	char *char_ptr = (char *) s;
	for (size_t i = 0; i < n; i += 1) {
		char_ptr[i] = c;
	}
	return s;
}

void *calloc(size_t n, size_t size) {
	void *ptr = malloc(n * size);
	// only fill if it's not NULL
	if (ptr) {
		// fill with 0
		memset(ptr, 0, n * size);
	}
	return ptr;
}

void free(void *p) {
	// lol
	(void) p;
}
