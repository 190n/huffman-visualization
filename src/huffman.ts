import init from './c/huffman.wasm';
import { unmarshalNode } from './node';

interface HuffmanExports {
	memory: WebAssembly.Memory;
	build_tree: (hist: number) => number;
	malloc: (n: number) => number;
	calloc: (n: number, size: number) => number;
}

const exports = await init({ imports: {} }) as unknown as HuffmanExports;
console.log(exports);
const ptr = exports.calloc(256, 4),
	u32 = new Uint32Array(exports.memory.buffer, ptr, 256);
u32[0] = 1;
u32[255] = 1;
for (let i = 1; i < 255; i += 1) {
	u32[i] = 0;
}
console.log(ptr);
const treePtr = exports.build_tree(ptr);
console.log(treePtr);
console.log(unmarshalNode(exports.memory.buffer, treePtr));
