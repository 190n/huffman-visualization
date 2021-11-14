#include "node.h"

#include <malloc.h>

//
// Create a Node. Returns NULL if memory allocation fails.
//
// symbol:    what symbol the node represents
// frequency: frequency of that symbol
//
Node *node_create(uint8_t symbol, uint32_t frequency) {
	Node *n = (Node *) malloc(sizeof(Node));
	// no segfault
	if (n != NULL) {
		n->symbol = symbol;
		n->frequency = frequency;
		n->left = n->right = NULL;
	}

	return n;
}

//
// Free all memory used by a Node and set the pointer to NULL
//
// n: pointer to a pointer to the Node
//
void node_delete(Node **n) {
	free(*n);
	*n = NULL;
}

//
// Create a new Node with two Nodes as children and the sum of their frequencies
//
// left:  pointer to the left child
// right: pointer to the right child
//
Node *node_join(Node *left, Node *right) {
	Node *n = node_create('$', left->frequency + right->frequency);
	n->left = left;
	n->right = right;
	return n;
}
