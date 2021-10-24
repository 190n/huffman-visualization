#pragma once

#define BLOCK         4096 // 4KB blocks.
#define ALPHABET      256 // ASCII + Extended ASCII.
#define MAGIC         0xBEEFD00D // 32-bit magic number.
#define MAX_CODE_SIZE (ALPHABET / 8) // Bytes for a maximum, 256-bit code.
#define MAX_TREE_SIZE (3 * ALPHABET - 1) // Maximum Huffman tree dump size.
