import { buildHistogram, displayHistogram } from './histogram';
import { buildTree, drawTrees } from './huffman';
import type { Node } from './node';

const input = document.getElementById('input') as HTMLTextAreaElement,
	tbody = document.getElementById('histogram')!,
	canvas = document.getElementById('huffman') as HTMLCanvasElement,
	ctx = canvas.getContext('2d')!,
	scrubber = document.getElementById('scrubber') as HTMLInputElement;

let snapshots: Node[][]|undefined = undefined;
let whichSnapshot = 0;

function redrawTrees(highlightSymbol?: number) {
	const displayWidth = canvas.parentElement!.clientWidth,
		displayHeight = canvas.parentElement!.clientHeight;
	canvas.width = displayWidth * window.devicePixelRatio;
	canvas.height = displayHeight * window.devicePixelRatio;
	canvas.style.width = `${displayWidth}px`;
	canvas.style.height = `${displayHeight}px`;

	if (snapshots) {
		drawTrees(ctx, snapshots[whichSnapshot], highlightSymbol);
	}
}

async function handleInput(tdWidth: number) {
	const hist = buildHistogram(input.value);
	displayHistogram(hist, tbody, tdWidth, symbol => redrawTrees(symbol));
	snapshots = await buildTree(hist);
	whichSnapshot = snapshots.length - 1;
	scrubber.max = whichSnapshot.toString();
	scrubber.value = whichSnapshot.toString();
	redrawTrees();
}

const tr = document.createElement('tr'),
	td1 = document.createElement('td'),
	td2 = document.createElement('td');

tr.appendChild(td1);
tr.appendChild(td2);
tbody.appendChild(tr);
const tdWidth = td1.getClientRects()[0].width;

input.addEventListener('input', () => handleInput(tdWidth), false);

tbody.addEventListener('pointerout', () => redrawTrees(), false);

handleInput(tdWidth);

window.addEventListener('resize', () => redrawTrees(), false);

scrubber.addEventListener('mousemove', () => {
	whichSnapshot = parseInt(scrubber.value);
	redrawTrees();
}, false);
