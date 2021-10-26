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

type Path = (0|1)[];

export async function buildTree(hist: Map<number, number>): Promise<Node[][]> {
	const snapshots: Node[][] = [];

	const exports = await init({
		env: {
			save_tree_snapshot(nodesPtr: number, n: number) {
				const nodePtrs = new Uint32Array(exports.memory.buffer, nodesPtr, n),
					nodes: Node[] = [];
				for (let i = 0; i < n; i += 1) {
					nodes.push(unmarshalNode(exports.memory.buffer, nodePtrs[i]));
				}
				snapshots.push(nodes);
			},
		},
	}) as unknown as HuffmanExports;
	// allocate array to store histogram (256x uint32_t)
	const ptr = exports.calloc(256, 4),
		u32 = new Uint32Array(exports.memory.buffer, ptr, 256);

	for (let i = 0; i < 256; i += 1) {
		u32[i] = hist.get(i) ?? 0;
	}

	exports.build_tree(ptr);
	return snapshots;
}

function getTreeDepth(root: Node): number {
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

function getNodeX(path: Path): number {
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

function* postOrderTraverse(root: Node, basePath: Path = []): Generator<[Node, Path]> {
	if (root.left) {
		yield* postOrderTraverse(root.left, [...basePath, 0]);
	}
	if (root.right) {
		yield* postOrderTraverse(root.right, [...basePath, 1]);
	}
	yield [root, basePath];
}

function getNodeXY(path: Path, width: number, levelHeight: number): [number, number] {
	return [getNodeX(path) * (width - NODE_WIDTH * 2) + NODE_WIDTH, path.length * levelHeight + NODE_HEIGHT];
}

enum ConnectionType { None, Normal, Highlighted };

function drawNode(
	ctx: CanvasRenderingContext2D,
	node: Node,
	path: Path,
	levelHeight: number,
	width: number,
	connection: ConnectionType = ConnectionType.Normal,
	highlight: boolean = false,
) {
	const [x, y] = getNodeXY(path, width, levelHeight);

	if (path.length > 0 && connection != ConnectionType.None) {
		const parentPath = path.slice(0, -1),
			[parentX, parentY] = getNodeXY(parentPath, width, levelHeight);

		ctx.beginPath();
		[ctx.strokeStyle, ctx.lineWidth] = connection == ConnectionType.Highlighted
			? ['blue', 3]
			: ['black', 0];
		ctx.moveTo(parentX, parentY);
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.closePath();
	}

	ctx.beginPath();
	[ctx.fillStyle, ctx.strokeStyle, ctx.lineWidth] = highlight
		? ['#c0c0ff', 'blue', 3]
		: ['white', 'black', 1];
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

function findNode(root: Node, searchSymbol: number): Path|undefined {
	for (const [{ symbol }, path] of postOrderTraverse(root)) {
		if (symbol == searchSymbol) {
			return path;
		}
	}

	return undefined;
}

export function drawTree(ctx: CanvasRenderingContext2D, root: Node, highlight?: number) {
	const width = ctx.canvas.width / window.devicePixelRatio,
	height = ctx.canvas.height / window.devicePixelRatio;

	ctx.resetTransform();
	ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	ctx.clearRect(0, 0, width, height);
	const levelHeight = Math.min((height - NODE_HEIGHT * 2) / (getTreeDepth(root) - 1), 80);

	let deferredNode: Node | undefined = undefined,
		deferredPath: Path | undefined = undefined;

	const highlightPath = typeof highlight == 'number' ? findNode(root, highlight) : undefined;

	for (const [node, path] of postOrderTraverse(root)) {
		if (node.symbol == highlight && !node.left && !node.right) {
			deferredNode = node;
			deferredPath = path;
		}

		const onHighlightedPath = highlightPath ? path.every((step, i) => highlightPath[i] == step) : false;
		drawNode(ctx, node, path, levelHeight, width, onHighlightedPath ? ConnectionType.Highlighted : ConnectionType.Normal);
	}

	if (deferredNode && deferredPath) {
		drawNode(ctx, deferredNode, deferredPath, levelHeight, width, ConnectionType.None, true);
	}
}
