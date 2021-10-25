import { buildHistogram, displayHistogram } from './histogram';
import './huffman';

const input = document.getElementById('input') as HTMLTextAreaElement,
	tbody = document.getElementById('histogram')!;

function handleInput(tdWidth: number) {
	displayHistogram(buildHistogram!(input.value), tbody, tdWidth);
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
