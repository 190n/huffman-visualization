huffman-visualization
=====================

This is a visualizaiton of [Huffman coding](https://en.wikipedia.org/wiki/Huffman_coding). It builds the Huffman tree using a WASM module (compiled from C code) and displays it using HTML5 Canvas. It also shows the raw histogram.

## Development

Run `yarn dev` to start the development server, then open http://localhost:3000/huffman-visualization/.

To compile the WASM module, run `make` from `src/c`. You can also run `make clean` to delete the module and object files, or `make format` to format all the code with clang-format.
