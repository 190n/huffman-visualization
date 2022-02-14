**If you're a student in CSE 13S, don't look at or attempt to copy from any of the Zig source files. You'll be caught.** Feel free to look at the TypeScript code if you want to see how to use WebAssembly modules and make janky visualizations.

huffman-visualization
=====================

This is a visualizaiton of [Huffman coding](https://en.wikipedia.org/wiki/Huffman_coding). It builds the Huffman tree using a WASM module (compiled from Zig code) and displays it using HTML5 Canvas. It also shows the raw histogram.

## Development

Run `yarn dev` to start the development server, then open http://localhost:3000/huffman-visualization/.

To compile the WASM module, run `zig build -Drelease-small` from `src/zig`.
