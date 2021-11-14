#include "huffman.h"

#include "imports.h"
#include "pq.h"

#include <stdlib.h>

//
// Construct a Huffman tree from a histogram containing how many times each character occurs
//
// hist: histogram of character frequencies
//
Node *build_tree(uint32_t hist[static ALPHABET]) {
	PriorityQueue *q = pq_create(ALPHABET);
	if (q == NULL) {
		return NULL;
	}

	for (uint16_t c = 0; c < ALPHABET; c += 1) {
		if (hist[c] > 0) {
			// make a Node for this character
			Node *n = node_create(c, hist[c]);
			// put it in
			enqueue(q, n);
		}
	}

	// save initial state where no nodes have been joined
	save_tree_snapshot(pq_items(q), pq_size(q));

	while (pq_size(q) >= 2) {
		Node *left, *right;
		// dequeue 2 nodes
		dequeue(q, &left);
		dequeue(q, &right);
		// join them (node_join handles adding their frequencies)
		Node *joined = node_join(left, right);
		// put the joined one back in
		enqueue(q, joined);
		// send it to mystical JS land
		save_tree_snapshot(pq_items(q), pq_size(q));
	}

	// now q contains only one Node
	// get it out
	Node *root;
	dequeue(q, &root);
	// we don't need the queue anymore
	pq_delete(&q);

	return root;
}
