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

	const input = document.getElementById('input') as HTMLTextAreaElement;

	let worker: Worker|null = null;

	function handleInput() {
		if (worker) {
			console.log('terminating worker');
			worker.terminate();
		}

		if (import.meta.env.PROD) {
			console.log('using worker');
			worker = new HistogramWorker!();
			worker.addEventListener('message', e => {
				if (e.data instanceof Map) {
					displayHistogram(document.getElementById('histogram')!, e.data);
				}
				if (worker) {
					worker.terminate();
					worker = null;
				}
			});
			worker.postMessage(input.value);
		} else {
			displayHistogram(document.getElementById('histogram')!, buildHistogram!(input.value));
		}
	}

	input.addEventListener('input', handleInput, false);

	handleInput();
})();
