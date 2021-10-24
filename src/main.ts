import utf8 from 'utf8';

const input = document.getElementById('input') as HTMLTextAreaElement;

input.addEventListener('input', () => {
	const encoded = utf8.encode(input.value), bytes: number[] = [];
	for (let i = 0; i < encoded.length; i += 1) {
		bytes.push(encoded.charCodeAt(i));
	}
	console.log(bytes);
}, false);
