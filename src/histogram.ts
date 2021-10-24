import utf8 from 'utf8';

const TD_WIDTH = 148;

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

export function displayHistogram(tbody: Element, histogram: Map<number, number>) {
	// remove all current contents
	tbody.replaceChildren();
	const sortedKeys = [...histogram.keys()].sort((a, b) => histogram.get(b)! - histogram.get(a)!);
	for (const byte of sortedKeys) {
		const tr = document.createElement('tr'),
			char = document.createElement('td'),
			occurrences = document.createElement('td');

		tr.appendChild(char);
		tr.appendChild(occurrences);

		if (0x20 <= byte && byte <= 0x7e) {
			// printable character
			char.textContent = `'${String.fromCharCode(byte)}'`;
		} else if (byte < 0x10) {
			char.textContent = `0x0${byte.toString(16)}`;
		} else {
			char.textContent = `0x${byte.toString(16)}`;
		}

		occurrences.textContent = histogram.get(byte)!.toString();
		const fraction = histogram.get(byte)! / histogram.get(sortedKeys[0])!;
		occurrences.style.boxShadow = `-${fraction * TD_WIDTH}px 0 0 #0000ff40 inset`;
		tbody.appendChild(tr);
	}
}
