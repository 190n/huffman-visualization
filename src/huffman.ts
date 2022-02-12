import init from './zig/zig-out/lib/huffman.wasm';
import { unmarshalNode, Node } from './node';
import { characterDisplay } from './util';
import theme from './theme';

const NODE_WIDTH = 56, NODE_HEIGHT = 40;

interface HuffmanExports {
	memory: WebAssembly.Memory;
	buildTree: (hist: number) => number;
	histogram: WebAssembly.Global;
}

type Path = (0|1)[];

export async function buildTree(hist: Map<number, number>): Promise<Node[][]> {
	const snapshots: Node[][] = [];

	const exports = await init({
		env: {
			saveTreeSnapshot(nodesPtr: number, n: number) {
				const nodePtrs = new Uint32Array(exports.memory.buffer, nodesPtr, n),
					nodes: Node[] = [];
				for (let i = 0; i < n; i += 1) {
					nodes.push(unmarshalNode(exports.memory.buffer, nodePtrs[i]));
				}
				snapshots.push(nodes);
			},
		},
	}) as unknown as HuffmanExports;

	// store histogram in global
	const ptr = exports.histogram.value,
		u32 = new Uint32Array(exports.memory.buffer, ptr, 256);

	for (let i = 0; i < 256; i += 1) {
		u32[i] = hist.get(i) ?? 0;
	}

	exports.buildTree(ptr);
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
	return [getNodeX(path) * (width - NODE_WIDTH - 6) + NODE_WIDTH / 2 + 3, path.length * levelHeight + NODE_HEIGHT / 2 + 3];
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
			? [theme.colors.blue, 3]
			: [theme.colors.fg, 1];
		ctx.moveTo(parentX, parentY);
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.closePath();
	}

	ctx.beginPath();
	[ctx.fillStyle, ctx.strokeStyle, ctx.lineWidth] = highlight
		? [theme.colors.blue25Opaque, theme.colors.blue, 3]
		: [theme.colors.bg, theme.colors.fg, 1];
	ctx.rect(x - NODE_WIDTH / 2, y - NODE_HEIGHT / 2, NODE_WIDTH, NODE_HEIGHT);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	ctx.fillStyle = theme.colors.fg;
	ctx.font = `16px ${theme.fonts.mono}`;
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

interface DrawnTree {
	image: ImageData;
	rootFrequency: number;
}

function drawTree(ctx: CanvasRenderingContext2D, root: Node, highlight?: number): DrawnTree {
	const width = ctx.canvas.width / window.devicePixelRatio,
		height = ctx.canvas.height / window.devicePixelRatio;

	const levelHeight = Math.min((height - NODE_HEIGHT - 6) / (getTreeDepth(root) - 1), 80);

	let deferredNode: Node | undefined = undefined,
		deferredPath: Path | undefined = undefined;

	const highlightPath = typeof highlight == 'number' ? findNode(root, highlight) : undefined;

	let minX = Infinity, maxX = -Infinity;

	for (const [node, path] of postOrderTraverse(root)) {
		if (node.symbol == highlight && !node.left && !node.right) {
			deferredNode = node;
			deferredPath = path;
		}

		const onHighlightedPath = highlightPath ? path.every((step, i) => highlightPath[i] == step) : false;
		drawNode(ctx, node, path, levelHeight, width, onHighlightedPath ? ConnectionType.Highlighted : ConnectionType.Normal);

		const x = getNodeX(path);
		if (x < minX) {
			minX = x;
		}
		if (x > maxX) {
			maxX = x;
		}
	}

	if (deferredNode && deferredPath) {
		drawNode(ctx, deferredNode, deferredPath, levelHeight, width, ConnectionType.None, true);
	}

	minX *= width;
	maxX *= width;
	let sx = minX - NODE_WIDTH / 2 - 3,
		sy = 0,
		sw = maxX - minX + NODE_WIDTH + 6,
		sh = height;

	sx *= window.devicePixelRatio;
	sy *= window.devicePixelRatio;
	sw *= window.devicePixelRatio;
	sh *= window.devicePixelRatio;

	return {
		image: ctx.getImageData(sx, sy, sw, sh),
		rootFrequency: root.frequency,
	};
}

export function drawTrees(ctx: CanvasRenderingContext2D, trees: Node[], highlight?: number) {
	const drawnTrees = trees.map(tree => {
		ctx.resetTransform();
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		return drawTree(ctx, tree, highlight);
	}).sort((a, b) => a.rootFrequency - b.rootFrequency);

	const totalWidth = drawnTrees.reduce<number>((prevWidth, curr) => prevWidth + curr.image.width, 0);
	ctx.canvas.width = totalWidth;
	ctx.canvas.style.width = `${totalWidth / window.devicePixelRatio}px`;

	ctx.resetTransform();
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	let x = 0;
	for (const { image } of drawnTrees) {
		ctx.putImageData(image, x, 0);
		x += image.width;
	}
}
