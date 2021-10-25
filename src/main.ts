import { buildHistogram, displayHistogram } from './histogram';
import { buildTree, getTreeDepth, getNodeX, inOrderTraverse } from './huffman';

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

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const levelHeight = (canvas.height - 10) / (getTreeDepth(tree) - 1);

	for (const [_, path] of inOrderTraverse(tree)) {
		const x = getNodeX(path) * (canvas.width - 10) + 5,
			y = path.length * levelHeight + 5;
		ctx.beginPath();
		ctx.arc(x, y, 5, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();

		if (path.length > 0) {
			const parentPath = path.slice(0, -1),
				parentX = getNodeX(parentPath) * (canvas.width - 10) + 5,
				parentY = parentPath.length * levelHeight + 5;

			ctx.beginPath();
			ctx.moveTo(parentX, parentY);
			ctx.lineTo(x, y);
			ctx.stroke();
			ctx.closePath();
		}
	}
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
