import { buildHistogram, displayHistogram } from './histogram';
import { buildTree, drawTree } from './huffman';
import type { Node } from './node';

const input = document.getElementById('input') as HTMLTextAreaElement,
	tbody = document.getElementById('histogram')!,
	canvas = document.getElementById('huffman') as HTMLCanvasElement,
	ctx = canvas.getContext('2d')!;

let tree: Node|undefined = undefined;

function redrawTree(highlightSymbol?: number) {
	const displayWidth = canvas.parentElement!.clientWidth,
		displayHeight = canvas.parentElement!.clientHeight;
	canvas.width = displayWidth * window.devicePixelRatio;
	canvas.height = displayHeight * window.devicePixelRatio;
	canvas.style.width = `${displayWidth}px`;
	canvas.style.height = `${displayHeight}px`;

	if (tree) {
		drawTree(ctx, tree, highlightSymbol);
	}
}

async function handleInput(tdWidth: number) {
	const hist = buildHistogram(input.value);
	displayHistogram(hist, tbody, tdWidth, symbol => redrawTree(symbol));
	const trees = await buildTree(hist);
	console.log(trees);
	tree = trees[trees.length - 1][0];
	redrawTree();
}

const tr = document.createElement('tr'),
	td1 = document.createElement('td'),
	td2 = document.createElement('td');

tr.appendChild(td1);
tr.appendChild(td2);
tbody.appendChild(tr);
const tdWidth = td1.getClientRects()[0].width;

input.addEventListener('input', () => handleInput(tdWidth), false);

tbody.addEventListener('pointerout', () => redrawTree(), false);

handleInput(tdWidth);

window.addEventListener('resize', () => redrawTree(), false);
