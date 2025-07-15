import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CursorService } from '../CursorService';
import { mockVSCode } from './setup';

describe('CursorService', () => {
	let cursorService: CursorService;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let mockOutputChannel: any;

	beforeEach(() => {
		// Reset all mocks
		vi.clearAllMocks();
		
		// Create mock output channel
		mockOutputChannel = {
			appendLine: vi.fn(),
			show: vi.fn(),
			dispose: vi.fn(),
		};
		
		// Setup mock return values
		mockVSCode.window.createOutputChannel.mockReturnValue(mockOutputChannel);
		
		cursorService = new CursorService();
	});

	describe('displayMessage', () => {
		it('should insert message when active editor exists', async () => {
			const mockEditor = {
				selection: {
					active: { line: 0, character: 0 },
				},
				edit: vi.fn().mockResolvedValue(true),
			};
			
			mockVSCode.window.activeTextEditor = mockEditor;
			
			const message = 'Test message';
			const result = await cursorService.displayMessage(message);
			
			expect(result).toBe(true);
			expect(mockEditor.edit).toHaveBeenCalledTimes(1);
			expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
				expect.stringContaining('Message inserted successfully')
			);
		});

		it('should show warning when no active editor exists', async () => {
			mockVSCode.window.activeTextEditor = null;
			
			const message = 'Test message';
			const result = await cursorService.displayMessage(message);
			
			expect(result).toBe(false);
			expect(mockVSCode.window.showWarningMessage).toHaveBeenCalledWith(
				'cursor.service.no.active.editor'
			);
			expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
				expect.stringContaining('No active editor found')
			);
		});

		it('should handle editor.edit failure gracefully', async () => {
			const mockEditor = {
				selection: {
					active: { line: 0, character: 0 },
				},
				edit: vi.fn().mockResolvedValue(false),
			};
			
			mockVSCode.window.activeTextEditor = mockEditor;
			
			const message = 'Test message';
			const result = await cursorService.displayMessage(message);
			
			expect(result).toBe(false);
			expect(mockVSCode.window.showErrorMessage).toHaveBeenCalledWith(
				'cursor.service.insert.failed'
			);
			expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
				expect.stringContaining('Failed to insert message')
			);
		});

		it('should handle editor.edit rejection', async () => {
			const mockEditor = {
				selection: {
					active: { line: 0, character: 0 },
				},
				edit: vi.fn().mockRejectedValue(new Error('Edit failed')),
			};
			
			mockVSCode.window.activeTextEditor = mockEditor;
			
			const message = 'Test message';
			const result = await cursorService.displayMessage(message);
			
			expect(result).toBe(false);
			expect(mockVSCode.window.showErrorMessage).toHaveBeenCalledWith(
				'cursor.service.insert.failed'
			);
			expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
				expect.stringContaining('Error inserting message: Edit failed')
			);
		});

		it('should insert message with correct formatting', async () => {
			const mockEditor = {
				selection: {
					active: { line: 5, character: 10 },
				},
				edit: vi.fn().mockImplementation((callback) => {
					const mockEditBuilder = {
						insert: vi.fn(),
					};
					callback(mockEditBuilder);
					return Promise.resolve(true);
				}),
			};
			
			mockVSCode.window.activeTextEditor = mockEditor;
			
			const message = 'Test message content';
			await cursorService.displayMessage(message);
			
			expect(mockEditor.edit).toHaveBeenCalledTimes(1);
			// Verify the edit callback was called with the correct parameters
			const editCallback = mockEditor.edit.mock.calls[0][0];
			const mockEditBuilder = { insert: vi.fn() };
			editCallback(mockEditBuilder);
			
			expect(mockEditBuilder.insert).toHaveBeenCalledWith(
				mockEditor.selection.active,
				'Test message content\n\n'
			);
		});

		it('should log messages with timestamps', async () => {
			mockVSCode.window.activeTextEditor = null;
			
			const message = 'Test message';
			await cursorService.displayMessage(message);
			
			expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
				expect.stringMatching(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \[WARN\]/)
			);
		});

		it('should handle empty message', async () => {
			const mockEditor = {
				selection: {
					active: { line: 0, character: 0 },
				},
				edit: vi.fn().mockResolvedValue(true),
			};
			
			mockVSCode.window.activeTextEditor = mockEditor;
			
			const result = await cursorService.displayMessage('');
			
			expect(result).toBe(true);
			expect(mockEditor.edit).toHaveBeenCalledTimes(1);
		});

		it('should handle very long messages', async () => {
			const mockEditor = {
				selection: {
					active: { line: 0, character: 0 },
				},
				edit: vi.fn().mockResolvedValue(true),
			};
			
			mockVSCode.window.activeTextEditor = mockEditor;
			
			const longMessage = 'x'.repeat(10000);
			const result = await cursorService.displayMessage(longMessage);
			
			expect(result).toBe(true);
			expect(mockEditor.edit).toHaveBeenCalledTimes(1);
		});
	});

	describe('dispose', () => {
		it('should dispose the output channel', () => {
			cursorService.dispose();
			expect(mockOutputChannel.dispose).toHaveBeenCalledTimes(1);
		});
	});
});