import { buildHistogram, displayHistogram } from './histogram';

const input = document.getElementById('input') as HTMLTextAreaElement;

function handleInput() {
	const histogram = buildHistogram(input.value);
	displayHistogram(document.getElementById('histogram')!, histogram);
}

input.addEventListener('input', handleInput, false);

handleInput();
