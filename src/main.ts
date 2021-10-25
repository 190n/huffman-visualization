import { buildHistogram, displayHistogram } from './histogram';
import { buildTree, drawTree } from './huffman';

const input = document.getElementById('input') as HTMLTextAreaElement,
	tbody = document.getElementById('histogram')!;

async function handleInput(tdWidth: number) {
	const hist = buildHistogram(input.value);
	displayHistogram(hist, tbody, tdWidth);
	const tree = await buildTree(hist);

	const canvas = document.getElementById('huffman') as HTMLCanvasElement,
		ctx = canvas.getContext('2d')!;

	canvas.width = canvas.parentElement!.clientWidth;
	canvas.height = canvas.parentElement!.clientHeight;

	drawTree(ctx, tree, { frequency: 5, symbol: 98 });
}

const tr = document.createElement('tr'),
	td1 = document.createElement('td'),
	td2 = document.createElement('td');

tr.appendChild(td1);
tr.appendChild(td2);
tbody.appendChild(tr);
const tdWidth = td1.getClientRects()[0].width;

input.addEventListener('input', () => handleInput(tdWidth), false);

handleInput(tdWidth);
