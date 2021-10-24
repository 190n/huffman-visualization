import { buildHistogram } from './histogram';

addEventListener('message', e => {
	if (typeof e.data == 'string') {
		postMessage(buildHistogram(e.data));
	}
});
