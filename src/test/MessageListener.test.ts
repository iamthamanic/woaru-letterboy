import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MessageListener } from '../MessageListener';
import { CursorService } from '../CursorService';
import { mockVSCode } from './setup';

// Mock Fastify
const mockFastify = {
	listen: vi.fn(),
	close: vi.fn(),
	post: vi.fn(),
	register: vi.fn(),
};

vi.mock('fastify', () => ({
	default: vi.fn(() => mockFastify),
}));

describe('MessageListener', () => {
	let messageListener: MessageListener;
	let mockCursorService: CursorService;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let mockOutputChannel: any;

	beforeEach(() => {
		vi.clearAllMocks();
		
		mockOutputChannel = {
			appendLine: vi.fn(),
			show: vi.fn(),
			dispose: vi.fn(),
		};
		
		mockVSCode.window.createOutputChannel.mockReturnValue(mockOutputChannel);
		
		mockCursorService = new CursorService();
		vi.spyOn(mockCursorService, 'displayMessage').mockResolvedValue(true);
		
		messageListener = new MessageListener(mockCursorService);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('start', () => {
		it('should start the server successfully', async () => {
			mockFastify.listen.mockResolvedValue(undefined);
			
			const result = await messageListener.start(38001);
			
			expect(result).toBe(true);
			expect(mockFastify.listen).toHaveBeenCalledWith({
				port: 38001,
				host: '127.0.0.1',
			});
			expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
				expect.stringContaining('Server started successfully on port 38001')
			);
		});

		it('should handle EADDRINUSE error', async () => {
			const error = new Error('Port already in use');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(error as any).code = 'EADDRINUSE';
			mockFastify.listen.mockRejectedValue(error);
			
			const result = await messageListener.start(38001);
			
			expect(result).toBe(false);
			expect(mockVSCode.window.showErrorMessage).toHaveBeenCalledWith(
				'message.listener.port.in.use'
			);
			expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
				expect.stringContaining('Port 38001 is already in use')
			);
		});

		it('should handle generic server errors', async () => {
			const error = new Error('Generic server error');
			mockFastify.listen.mockRejectedValue(error);
			
			const result = await messageListener.start(38001);
			
			expect(result).toBe(false);
			expect(mockVSCode.window.showErrorMessage).toHaveBeenCalledWith(
				'message.listener.start.failed'
			);
			expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
				expect.stringContaining('Failed to start server: Generic server error')
			);
		});

		it('should register the message endpoint', async () => {
			mockFastify.listen.mockResolvedValue(undefined);
			
			await messageListener.start(38001);
			
			expect(mockFastify.post).toHaveBeenCalledWith(
				'/message',
				expect.any(Object)
			);
		});
	});

	describe('stop', () => {
		it('should stop the server successfully', async () => {
			mockFastify.close.mockResolvedValue(undefined);
			
			await messageListener.stop();
			
			expect(mockFastify.close).toHaveBeenCalledTimes(1);
			expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
				expect.stringContaining('Server stopped successfully')
			);
		});

		it('should handle errors when stopping server', async () => {
			const error = new Error('Failed to stop server');
			mockFastify.close.mockRejectedValue(error);
			
			await messageListener.stop();
			
			expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
				expect.stringContaining('Error stopping server: Failed to stop server')
			);
		});
	});

	describe('message endpoint handler', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let endpointHandler: any;

		beforeEach(async () => {
			mockFastify.listen.mockResolvedValue(undefined);
			mockFastify.post.mockImplementation((path, options) => {
				if (path === '/message') {
					endpointHandler = options.handler;
				}
			});
			
			await messageListener.start(38001);
		});

		it('should process valid message payload', async () => {
			const validPayload = {
				filePath: '/src/test.ts',
				lineNumber: 42,
				ruleId: 'test-rule',
				errorMessage: 'Test error',
				suggestion: 'Test suggestion',
			};

			const mockRequest = {
				body: validPayload,
			};

			const mockReply = {
				code: vi.fn().mockReturnThis(),
				send: vi.fn(),
			};

			await endpointHandler(mockRequest, mockReply);

			expect(mockCursorService.displayMessage).toHaveBeenCalledWith(
				expect.stringContaining('### 📬 Nachricht von WOARU')
			);
			expect(mockReply.code).toHaveBeenCalledWith(200);
			expect(mockReply.send).toHaveBeenCalledWith({ success: true });
		});

		it('should handle invalid payload with validation error', async () => {
			const invalidPayload = {
				filePath: '/src/test.ts',
				// Missing required fields
			};

			const mockRequest = {
				body: invalidPayload,
			};

			const mockReply = {
				code: vi.fn().mockReturnThis(),
				send: vi.fn(),
			};

			await endpointHandler(mockRequest, mockReply);

			expect(mockCursorService.displayMessage).not.toHaveBeenCalled();
			expect(mockReply.code).toHaveBeenCalledWith(400);
			expect(mockReply.send).toHaveBeenCalledWith(
				expect.objectContaining({
					success: false,
					error: 'Invalid payload',
				})
			);
		});

		it('should handle cursor service failure', async () => {
			vi.spyOn(mockCursorService, 'displayMessage').mockResolvedValue(false);

			const validPayload = {
				filePath: '/src/test.ts',
				lineNumber: 42,
				ruleId: 'test-rule',
				errorMessage: 'Test error',
				suggestion: 'Test suggestion',
			};

			const mockRequest = {
				body: validPayload,
			};

			const mockReply = {
				code: vi.fn().mockReturnThis(),
				send: vi.fn(),
			};

			await endpointHandler(mockRequest, mockReply);

			expect(mockReply.code).toHaveBeenCalledWith(500);
			expect(mockReply.send).toHaveBeenCalledWith(
				expect.objectContaining({
					success: false,
					error: 'Failed to display message',
				})
			);
		});

		it('should handle cursor service exception', async () => {
			vi.spyOn(mockCursorService, 'displayMessage').mockRejectedValue(
				new Error('Cursor service error')
			);

			const validPayload = {
				filePath: '/src/test.ts',
				lineNumber: 42,
				ruleId: 'test-rule',
				errorMessage: 'Test error',
				suggestion: 'Test suggestion',
			};

			const mockRequest = {
				body: validPayload,
			};

			const mockReply = {
				code: vi.fn().mockReturnThis(),
				send: vi.fn(),
			};

			await endpointHandler(mockRequest, mockReply);

			expect(mockReply.code).toHaveBeenCalledWith(500);
			expect(mockReply.send).toHaveBeenCalledWith(
				expect.objectContaining({
					success: false,
					error: 'Internal server error',
				})
			);
		});

		it('should log all message processing attempts', async () => {
			const validPayload = {
				filePath: '/src/test.ts',
				lineNumber: 42,
				ruleId: 'test-rule',
				errorMessage: 'Test error',
				suggestion: 'Test suggestion',
			};

			const mockRequest = {
				body: validPayload,
			};

			const mockReply = {
				code: vi.fn().mockReturnThis(),
				send: vi.fn(),
			};

			await endpointHandler(mockRequest, mockReply);

			expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(
				expect.stringContaining('Processing message for file: /src/test.ts')
			);
		});
	});

	describe('dispose', () => {
		it('should dispose resources', async () => {
			await messageListener.dispose();
			
			expect(mockFastify.close).toHaveBeenCalledTimes(1);
			expect(mockOutputChannel.dispose).toHaveBeenCalledTimes(1);
		});
	});
});