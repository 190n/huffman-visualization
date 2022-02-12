export interface Node {
	left?: Node;
	right?: Node;
	symbol: number;
	frequency: number;
}

export function unmarshalNode(arr: ArrayBuffer, ptr: number): Node {
	const u32 = new Uint32Array(arr, ptr, 4),
		left = u32[0] ? unmarshalNode(arr, u32[0]) : undefined,
		right = u32[1] ? unmarshalNode(arr, u32[1]) : undefined,
		// make sure not to care about padding bytes
		symbol = u32[2] & 0xff,
		frequency = u32[3];

	return { left, right, symbol, frequency };
}
