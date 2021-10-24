import { displayHistogram } from './histogram';

// vite.js uses module workers in development which firefox doesn't support
let HistogramWorker: (typeof import('./histogram-worker?worker').default) | undefined,
	buildHistogram: (typeof import('./histogram').buildHistogram) | undefined;

(async () => {
	if (import.meta.env.PROD) {
		HistogramWorker = (await import('./histogram-worker?worker')).default;
	} else {
		buildHistogram = (await import('./histogram')).buildHistogram;
	}

	const input = document.getElementById('input') as HTMLTextAreaElement,
		tbody = document.getElementById('histogram')!;

	let worker: Worker|null = null;

	function handleInput(tdWidth: number) {
		if (worker) {
			console.log('terminating worker');
			worker.terminate();
		}

		if (import.meta.env.PROD) {
			console.log('using worker');
			worker = new HistogramWorker!();
			worker.addEventListener('message', e => {
				if (e.data instanceof Map) {
					displayHistogram(e.data, tbody, tdWidth);
				}
				if (worker) {
					worker.terminate();
					worker = null;
				}
			});
			worker.postMessage(input.value);
		} else {
			displayHistogram(buildHistogram!(input.value), tbody, tdWidth);
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
})();
