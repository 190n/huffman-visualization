// malloc and free are by Surma from https://surma.dev/things/c-to-webassembly/
// CC BY 4.0

#include "defines.h"

#include <malloc.h>
#include <string.h>

extern unsigned char __heap_base;

unsigned long bump_pointer = (unsigned long) &__heap_base;

export void *malloc(size_t n) {
	unsigned long r = bump_pointer;
	bump_pointer += n;
	return (void *) r;
}

void *memset(void *s, int c, size_t n) {
	__builtin_memset(s, c, n);
	return s;
}

export void *calloc(size_t n, size_t size) {
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
