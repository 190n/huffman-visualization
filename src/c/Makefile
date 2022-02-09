CC     = zig cc
CFLAGS = -Wall -Wextra -Werror -Wpedantic -Os -target wasm32-freestanding -flto -I/usr/include
LD     = wasm-ld
LFLAGS = --no-entry --export-dynamic --lto-O3 --allow-undefined-file=imports.syms
OBJS   = huffman.o node.o pq.o stdlib.o

all: huffman.wasm

.PHONY: all clean format

huffman.wasm: $(OBJS)
	$(LD) $(LFLAGS) -o huffman.wasm $(OBJS)

%.o: %.c
	$(CC) $(CFLAGS) -c $<

pq.o: pq.zig node.h
	zig build-obj -target wasm32-freestanding -O ReleaseSmall pq.zig -I. -flto

clean:
	rm -f huffman.wasm $(OBJS)

format:
	clang-format -i -style=file *.[ch]
