import { describe, it, expect } from 'vitest';
import { formatMessage } from '../Formatter';
import { WoaruMessage } from '../types';

describe('Formatter', () => {
	describe('formatMessage', () => {
		it('should format a complete message with all fields', () => {
			const message: WoaruMessage = {
				filePath: '/src/components/Button.tsx',
				lineNumber: 42,
				ruleId: 'react-hooks/rules-of-hooks',
				errorMessage: 'React Hook "useState" is called in function "Button" which is neither a React function component nor a custom React Hook function.',
				suggestion: 'Move the hook call to the top level of the component function.',
			};

			const result = formatMessage(message);

			expect(result).toBe(`### 📬 Nachricht von WOARU

Fehler in: **\`/src/components/Button.tsx\`** (Zeile: **42**)

> **Regel:** \`react-hooks/rules-of-hooks\`
> **Problem:** React Hook "useState" is called in function "Button" which is neither a React function component nor a custom React Hook function.
>
> **Vorschlag:**
> *Move the hook call to the top level of the component function.*
---`);
		});

		it('should handle messages with special characters in file path', () => {
			const message: WoaruMessage = {
				filePath: '/src/components/Special File (with spaces).tsx',
				lineNumber: 1,
				ruleId: 'no-unused-vars',
				errorMessage: 'Variable "test" is defined but never used.',
				suggestion: 'Remove the unused variable.',
			};

			const result = formatMessage(message);

			expect(result).toContain('**`/src/components/Special File (with spaces).tsx`**');
			expect(result).toContain('(Zeile: **1**)');
		});

		it('should handle messages with markdown special characters', () => {
			const message: WoaruMessage = {
				filePath: '/src/test.ts',
				lineNumber: 10,
				ruleId: 'markdown-test',
				errorMessage: 'Error with **bold** and *italic* text',
				suggestion: 'Use `code` and > quotes properly',
			};

			const result = formatMessage(message);

			expect(result).toContain('**Problem:** Error with **bold** and *italic* text');
			expect(result).toContain('*Use `code` and > quotes properly*');
		});

		it('should handle very long error messages', () => {
			const longMessage = 'This is a very long error message that might span multiple lines and contains a lot of detail about what went wrong in the code. '.repeat(3);
			
			const message: WoaruMessage = {
				filePath: '/src/long-error.ts',
				lineNumber: 999,
				ruleId: 'long-rule-id',
				errorMessage: longMessage,
				suggestion: 'A long suggestion that also spans multiple lines and provides detailed information about how to fix the issue.',
			};

			const result = formatMessage(message);

			expect(result).toContain('**Problem:** ' + longMessage);
			expect(result).toContain('*A long suggestion that also spans multiple lines and provides detailed information about how to fix the issue.*');
		});

		it('should handle messages with line number 0', () => {
			const message: WoaruMessage = {
				filePath: '/src/global.ts',
				lineNumber: 0,
				ruleId: 'global-rule',
				errorMessage: 'Global error not tied to specific line',
				suggestion: 'Fix the global issue',
			};

			const result = formatMessage(message);

			expect(result).toContain('(Zeile: **0**)');
		});

		it('should handle messages with very high line numbers', () => {
			const message: WoaruMessage = {
				filePath: '/src/big-file.ts',
				lineNumber: 999999,
				ruleId: 'big-file-rule',
				errorMessage: 'Error in very large file',
				suggestion: 'Consider splitting the file',
			};

			const result = formatMessage(message);

			expect(result).toContain('(Zeile: **999999**)');
		});

		it('should handle empty strings in optional fields', () => {
			const message: WoaruMessage = {
				filePath: '/src/empty.ts',
				lineNumber: 5,
				ruleId: '',
				errorMessage: '',
				suggestion: '',
			};

			const result = formatMessage(message);

			expect(result).toContain('**Regel:** ``');
			expect(result).toContain('**Problem:** ');
			expect(result).toContain('**Vorschlag:**\n> **');
		});

		it('should maintain consistent formatting structure', () => {
			const message: WoaruMessage = {
				filePath: '/test.js',
				lineNumber: 1,
				ruleId: 'test-rule',
				errorMessage: 'Test error',
				suggestion: 'Test suggestion',
			};

			const result = formatMessage(message);

			// Check that the result starts with the expected header
			expect(result).toMatch(/^### 📬 Nachricht von WOARU\n\n/);
			
			// Check that it ends with the separator
			expect(result).toMatch(/---$/);
			
			// Check that it contains all required sections
			expect(result).toContain('Fehler in:');
			expect(result).toContain('**Regel:**');
			expect(result).toContain('**Problem:**');
			expect(result).toContain('**Vorschlag:**');
		});
	});
});