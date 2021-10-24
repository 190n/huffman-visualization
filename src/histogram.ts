import utf8 from 'utf8';

import { characterDisplay } from './util';

export function buildHistogram(input: string): Map<number, number> {
	const encoded = utf8.encode(input),
		histogram = new Map<number, number>();
	histogram.set(0, 1);
	histogram.set(255, 1);

	for (let i = 0; i < encoded.length; i += 1) {
		const byte = encoded.charCodeAt(i);
		if (histogram.has(byte)) {
			histogram.set(byte, histogram.get(byte)! + 1);
		} else {
			histogram.set(byte, 1);
		}
	}

	return histogram;
}

export function displayHistogram(histogram: Map<number, number>, tbody: Element, tdWidth: number) {
	// remove all current contents
	tbody.replaceChildren();
	const sortedKeys = [...histogram.keys()].sort((a, b) => histogram.get(b)! - histogram.get(a)!);
	for (const byte of sortedKeys) {
		const tr = document.createElement('tr'),
			char = document.createElement('td'),
			occurrences = document.createElement('td');

		tr.appendChild(char);
		tr.appendChild(occurrences);

		char.textContent = characterDisplay(byte);

		occurrences.textContent = histogram.get(byte)!.toString();
		const fraction = histogram.get(byte)! / histogram.get(sortedKeys[0])!;
		occurrences.style.boxShadow = `-${fraction * tdWidth}px 0 0 #0000ff40 inset`;
		tbody.appendChild(tr);
	}
}
