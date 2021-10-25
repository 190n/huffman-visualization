import init from './c/huffman.wasm';
import { unmarshalNode, Node } from './node';
import { characterDisplay } from './util';

interface HuffmanExports {
	memory: WebAssembly.Memory;
	build_tree: (hist: number) => number;
	malloc: (n: number) => number;
	calloc: (n: number, size: number) => number;
}

export type Path = (0|1)[];

export async function buildTree(hist: Map<number, number>): Promise<Node> {
	const exports = await init({ imports: {} }) as unknown as HuffmanExports;
	// allocate array to store histogram (256x uint32_t)
	const ptr = exports.calloc(256, 4),
		u32 = new Uint32Array(exports.memory.buffer, ptr, 256);

	for (let i = 0; i < 256; i += 1) {
		u32[i] = hist.get(i) ?? 0;
	}

	const treePtr = exports.build_tree(ptr);
	return unmarshalNode(exports.memory.buffer, treePtr);
}

export function getTreeDepth(root: Node): number {
	if (root.left && root.right) {
		return 1 + Math.max(getTreeDepth(root.left), getTreeDepth(root.right));
	} else if (root.left) {
		return 1 + getTreeDepth(root.left);
	} else if (root.right) {
		return 1 + getTreeDepth(root.right);
	} else {
		return 1;
	}
}

export function getNodeX(path: Path): number {
	let x = 0.5;
	for (const i in path) {
		const step = path[i],
			change = 2 ** (-i - 2);
		if (step == 0) {
			// left
			x -= change;
		} else {
			// right
			x += change;
		}
	}

	return x;
}

export function* postOrderTraverse(root: Node, basePath: Path = []): Generator<[Node, Path]> {
	if (root.left) {
		yield* postOrderTraverse(root.left, [...basePath, 0]);
	}
	if (root.right) {
		yield* postOrderTraverse(root.right, [...basePath, 1]);
	}
	yield [root, basePath];
}

export function getNodeXY(path: Path, width: number, levelHeight: number, xPad: number, yPad: number): [number, number] {
	return [getNodeX(path) * (width - xPad * 2) + xPad, path.length * levelHeight + yPad];
}

export function drawTree(ctx: CanvasRenderingContext2D, root: Node) {
	const xPad = 28, yPad = 20;

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	const levelHeight = Math.min((ctx.canvas.height - yPad * 2) / (getTreeDepth(root) - 1), 80);

	for (const [node, path] of postOrderTraverse(root)) {
		const [x, y] = getNodeXY(path, ctx.canvas.width, levelHeight, xPad, yPad);

		if (path.length > 0) {
			const parentPath = path.slice(0, -1),
				[parentX, parentY] = getNodeXY(parentPath, ctx.canvas.width, levelHeight, xPad, yPad);

			ctx.beginPath();
			ctx.moveTo(parentX, parentY);
			ctx.lineTo(x, y);
			ctx.stroke();
			ctx.closePath();
		}

		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.rect(x - xPad, y - yPad, xPad * 2, yPad * 2);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();

		ctx.fillStyle = 'black';
		ctx.font = '16px monospace';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';

		if (node.left || node.right) {
			ctx.fillText(node.frequency.toString(), x, y);
		} else {
			ctx.fillText(characterDisplay(node.symbol), x, y - 8);
			ctx.fillText(node.frequency.toString(), x, y + 8);
		}
	}
}
