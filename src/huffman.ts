import init from './c/huffman.wasm';
import { unmarshalNode, Node } from './node';
import { characterDisplay } from './util';

const NODE_WIDTH = 28, NODE_HEIGHT = 20;

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

export function getNodeXY(path: Path, width: number, levelHeight: number): [number, number] {
	return [getNodeX(path) * (width - NODE_WIDTH * 2) + NODE_WIDTH, path.length * levelHeight + NODE_HEIGHT];
}

export function drawNode(
	ctx: CanvasRenderingContext2D,
	node: Node,
	path: Path,
	levelHeight: number,
	width: number,
	drawConnection: boolean = true,
	bgColor: string = 'white',
) {
	const [x, y] = getNodeXY(path, width, levelHeight);

	if (path.length > 0 && drawConnection) {
		const parentPath = path.slice(0, -1),
			[parentX, parentY] = getNodeXY(parentPath, width, levelHeight);

		ctx.beginPath();
		ctx.moveTo(parentX, parentY);
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.closePath();
	}

	ctx.beginPath();
	ctx.fillStyle = bgColor;
	ctx.rect(x - NODE_WIDTH, y - NODE_HEIGHT, NODE_WIDTH * 2, NODE_HEIGHT * 2);
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

export function drawTree(ctx: CanvasRenderingContext2D, root: Node, highlight?: number) {
	const width = ctx.canvas.width / window.devicePixelRatio,
	height = ctx.canvas.height / window.devicePixelRatio;

	console.log(`drawTree dpr=${window.devicePixelRatio} w=${width} h=${height}`);
	ctx.resetTransform();
	ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	ctx.clearRect(0, 0, width, height);
	const levelHeight = Math.min((height - NODE_HEIGHT * 2) / (getTreeDepth(root) - 1), 80);

	let deferredNode: Node | undefined = undefined,
		deferredPath: Path | undefined = undefined;

	for (const [node, path] of postOrderTraverse(root)) {
		if (node.symbol == highlight && !node.left && !node.right) {
			deferredNode = node;
			deferredPath = path;
		}

		drawNode(ctx, node, path, levelHeight, width);
	}

	if (deferredNode && deferredPath) {
		drawNode(ctx, deferredNode, deferredPath, levelHeight, width, false, '#c0c0ff');
	}
}
