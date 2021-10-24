#pragma once

#include "defines.h"
#include <stdbool.h>
#include <stdint.h>

typedef struct {
    uint32_t top;
    uint8_t bits[MAX_CODE_SIZE];
} Code;

Code code_init(void);

uint32_t code_size(Code *c);

bool code_empty(Code *c);

bool code_full(Code *c);

bool code_set_bit(Code *c, uint32_t i);

bool code_clr_bit(Code *c, uint32_t i);

bool code_get_bit(Code *c, uint32_t i);

bool code_push_bit(Code *c, uint8_t bit);

bool code_pop_bit(Code *c, uint8_t *bit);

void code_print(Code *c);
