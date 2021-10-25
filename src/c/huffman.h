#ifndef __HUFFMAN_H__
#define __HUFFMAN_H__

#include "defines.h"
#include "node.h"

#include <stdint.h>

Node *build_tree(uint32_t hist[static ALPHABET]);

void delete_tree(Node **root);

#endif
