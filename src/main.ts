import { buildHistogram, displayHistogram } from './histogram';
import { buildTree, drawTrees } from './huffman';
import type { Node } from './node';

const input = document.getElementById('input') as HTMLTextAreaElement,
	tbody = document.getElementById('histogram')!,
	canvas = document.getElementById('huffman') as HTMLCanvasElement,
	ctx = canvas.getContext('2d')!,
	scrubber = document.getElementById('scrubber') as HTMLInputElement,
	howto = document.getElementById('howto-container')!;

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

function scrub() {
	whichSnapshot = parseInt(scrubber.value);
	redrawTrees();
}

scrubber.addEventListener('mousemove', scrub, false);
scrubber.addEventListener('change', scrub, false);

document.getElementById('close')!.addEventListener('click', () => {
	howto.classList.remove('visible');
}, false);

document.getElementById('dont-show')!.addEventListener('click', () => {
	howto.classList.remove('visible');
	window.localStorage.setItem('dont-show-howto', 'true');
}, false);

document.getElementById('show-howto')!.addEventListener('click', () => {
	howto.classList.add('visible');
	window.localStorage.removeItem('dont-show-howto');
}, false);

if (!window.localStorage.getItem('dont-show-howto')) {
	howto.classList.add('visible');
}

document.addEventListener('keyup', e => {
	if (e.key == 'Escape') {
		howto.classList.remove('visible');
	}
}, false);

function toStart() {
	whichSnapshot = 0;
	scrubber.value = '0';
	redrawTrees();
}

function stepBack() {
	whichSnapshot = Math.max(0, whichSnapshot - 1);
	scrubber.value = whichSnapshot.toString();
	redrawTrees();
}

function stepForward() {
	whichSnapshot = Math.min(snapshots!.length - 1, whichSnapshot + 1);
	scrubber.value = whichSnapshot.toString();
	redrawTrees();
}

function toEnd() {
	whichSnapshot = snapshots!.length - 1;
	scrubber.value = whichSnapshot.toString();
	redrawTrees();
}

function filterEnterOrSpace(f: () => void, e: KeyboardEvent) {
	if (e.key == 'Enter' || e.key == ' ') {
		f();
	}
}

document.getElementById('to-start')!.addEventListener('click', toStart, false);
document.getElementById('to-start')!.addEventListener('keypress', filterEnterOrSpace.bind(null, toStart), false);
document.getElementById('step-back')!.addEventListener('click', stepBack, false);
document.getElementById('step-back')!.addEventListener('keypress', filterEnterOrSpace.bind(null, stepBack), false);
document.getElementById('step-forward')!.addEventListener('click', stepForward, false);
document.getElementById('step-forward')!.addEventListener('keypress', filterEnterOrSpace.bind(null, stepForward), false);
document.getElementById('to-end')!.addEventListener('click', toEnd, false);
document.getElementById('to-end')!.addEventListener('keypress', filterEnterOrSpace.bind(null, toEnd), false);
