const escapeSequences: Record<number, string> = {
	// audible bell
	7: `'\\a'`,
	// backspace
	8: `'\\b'`,
	// tab
	9: `'\\t'`,
	// newline
	10: `'\\n'`,
	// vertical tab
	11: `'\\v'`,
	// form feed
	12: `'\\f'`,
	// carriage return
	13: `'\\r'`,
	// apostrophe/single quote
	39: `'\\''`,
	// backslash
	92: `'\\\\'`,
};

export function characterDisplay(byte: number): string {
	if (escapeSequences.hasOwnProperty(byte)) {
		return escapeSequences[byte];
	} else if (0x20 <= byte && byte <= 0x7e) {
		// printable character
		return `'${String.fromCharCode(byte)}'`;
	} else if (byte < 0x10) {
		return `0x0${byte.toString(16)}`;
	} else {
		return `0x${byte.toString(16)}`;
	}
}
