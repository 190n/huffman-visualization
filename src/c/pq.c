#include "pq.h"

#include <inttypes.h>
#include <malloc.h>
#include <stdio.h>

struct PriorityQueue {
	uint32_t capacity;
	uint32_t tail; // index where the next Node will be inserted (initially, and then it bubbles up)
	Node **items;
};

//
// Create a PriorityQueue. Returns NULL if memory allocation fails.
//
// capacity: how many Nodes the queue may contain
//
PriorityQueue *pq_create(uint32_t capacity) {
	PriorityQueue *q = (PriorityQueue *) malloc(sizeof(PriorityQueue));
	if (q != NULL) {
		q->capacity = capacity;
		q->tail = 0;
		q->items = (Node **) calloc(capacity, sizeof(Node *));

		if (q->items == NULL) {
			free(q);
			q = NULL;
		}
	}
	return q;
}

//
// Free all memory used by a PriorityQueue, and set the pointer to NULL
//
// q: pointer to a pointer to the queue
//
void pq_delete(PriorityQueue **q) {
	free((*q)->items);
	free(*q);
	*q = NULL;
}

//
// Check if a PriorityQueue is empty
//
// q: pointer to the queue
//
bool pq_empty(PriorityQueue *q) {
	return q->tail == 0;
}

//
// Check if a PriorityQueue is full
//
// q: pointer to the queue
//
bool pq_full(PriorityQueue *q) {
	return q->tail == q->capacity;
}

//
// Get the number of items in a PriorityQueue
//
// q: pointer to the queue
//
uint32_t pq_size(PriorityQueue *q) {
	return q->tail;
}

int cmp(Node *a, Node *b) {
	if (a->frequency > b->frequency) {
		return 1;
	} else if (a->frequency < b->frequency) {
		return -1;
	} else {
		return 0;
	}
}

void swap(Node **a, Node **b) {
	Node *temp = *a;
	*a = *b;
	*b = temp;
}

uint32_t min_child(PriorityQueue *q, uint32_t first, uint32_t last) {
	uint32_t left = 2 * first, right = left + 1;
	if (right <= last && cmp(q->items[right - 1], q->items[left - 1]) < 0) {
		return right;
	} else {
		return left;
	}
}

void fix_heap(PriorityQueue *q, uint32_t first, uint32_t last) {
	bool found = false;
	uint32_t mother = first, great = min_child(q, mother, last);

	while (mother <= last / 2 && !found) {
		if (cmp(q->items[mother - 1], q->items[great - 1]) > 0) {
			swap(&q->items[mother - 1], &q->items[great - 1]);
			mother = great;
			great = min_child(q, mother, last);
		} else {
			found = true;
		}
	}
}

//
// Insert a Node into a PriorityQueue. Returns true if it was successfully inserted.
//
// q: pointer to the queue
// n: pointer to the Node
//
bool enqueue(PriorityQueue *q, Node *n) {
	if (pq_full(q)) {
		return false;
	} else {
		// insert node at the end
		uint32_t current_index = q->tail + 1;
		q->tail += 1;
		q->items[current_index - 1] = n;
		// float it up
		while (current_index > 1
			   && cmp(q->items[current_index - 1], q->items[current_index / 2 - 1]) < 0) {
			swap(&q->items[current_index - 1], &q->items[current_index / 2 - 1]);
			current_index /= 2;
		}
		return true;
	}
}

//
// Remove and return the smallest (least frequent) Node from a PriorityQueue. Returns true if it was
// successfully dequeued.
//
// q: pointer to the queue
// n: pointer to the Node pointer that should contain the dequeued Node
//
bool dequeue(PriorityQueue *q, Node **n) {
	if (pq_empty(q)) {
		return false;
	} else {
		// get out root node
		*n = q->items[0];
		// move last node to front
		q->tail -= 1;
		q->items[0] = q->items[q->tail];
		// fix it
		fix_heap(q, 1, q->tail);
		return true;
	}
}

//
// Print out the items in a PriorityQueue
//
// q: the queue to print
//
void pq_print(PriorityQueue *q) {
	return;
	fprintf(stderr, "=== pq with %" PRIu32 "/%" PRIu32 " items ===\n", pq_size(q), q->capacity);
	// just print each item in the order they're stored
	// when debugging i can put them in a tree manually
	for (uint32_t i = 0; i < q->tail; i += 1) {
		node_print(q->items[i]);
	}
	fprintf(stderr, "=== end pq ===\n");
	fflush(stderr);
}

Node **pq_items(PriorityQueue *q) {
	return q->items;
}
