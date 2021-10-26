import { defineConfig } from 'vite';
import theme from './src/theme';

function* joinedKV(obj: Object, prefix = ''): Generator<[string, any]> {
	for (const key of Object.keys(obj)) {
		if (typeof obj[key] == 'object') {
			yield* joinedKV(obj[key], `${prefix}${key}_`);
		} else {
			yield [`${prefix}${key}`, obj[key]];
		}
	}
}

let variables = '';
for (const [k, v] of joinedKV(theme)) {
	variables += `\$${k}: ${v};`;
}

export default defineConfig({
	base: '/huffman-visualization/',
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: variables,
			},
		},
	},
});
