CC     = clang
CFLAGS = -Wall -Wextra -Werror -Wpedantic --target=wasm32 -O3 -flto -nostdlib -I/usr/include
LFLAGS = --no-entry --export-all --lto-O3
LD     = wasm-ld
OBJS   = huffman.o node.o pq.o stdlib.o

all: huffman.wasm

.PHONY: all clean format

huffman.wasm: $(OBJS)
	$(LD) $(LFLAGS) -o huffman.wasm $(OBJS)

%.o: %.c
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f huffman.wasm $(OBJS)

format:
	clang-format -i -style=file *.[ch]
