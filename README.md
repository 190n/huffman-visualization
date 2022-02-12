**This repository contains some code from CSE 13S, as well as some code I wrote which is not related to the class. If you are a student in CSE 13S, do not view `src/c/huffman.c`, `src/c/pq.c`, or `src/c/node.c`. If you copy from one of those files, you will be caught.**

huffman-visualization
=====================

This is a visualizaiton of [Huffman coding](https://en.wikipedia.org/wiki/Huffman_coding). It builds the Huffman tree using a WASM module (compiled from C code) and displays it using HTML5 Canvas. It also shows the raw histogram.

## Development

Run `yarn dev` to start the development server, then open http://localhost:3000/huffman-visualization/.

~~To compile the WASM module, run `zig build -Drelease-small` from `src/zig`.~~

The Zig source code is currently unavailable to discourage cheating in the class that this visualization was made for.
