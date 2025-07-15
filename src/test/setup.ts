import { vi } from 'vitest';

// Mock VS Code API
const mockVSCode = {
	window: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		activeTextEditor: null as any,
		showInformationMessage: vi.fn(),
		showWarningMessage: vi.fn(),
		showErrorMessage: vi.fn(),
		createOutputChannel: vi.fn(() => ({
			appendLine: vi.fn(),
			show: vi.fn(),
			dispose: vi.fn(),
		})),
	},
	workspace: {
		getConfiguration: vi.fn(() => ({
			get: vi.fn(),
		})),
	},
	StatusBarAlignment: {
		Right: 2,
	},
	commands: {
		registerCommand: vi.fn(),
	},
	languages: {
		createDiagnosticCollection: vi.fn(),
	},
	Uri: {
		file: vi.fn(),
	},
	Range: vi.fn(),
	Position: vi.fn(),
	Selection: vi.fn(),
	TextEdit: {
		insert: vi.fn(),
	},
	WorkspaceEdit: vi.fn(),
	ExtensionContext: vi.fn(),
};

// Mock the entire vscode module
vi.mock('vscode', () => mockVSCode);

// Mock vscode-nls
vi.mock('vscode-nls', () => ({
	config: vi.fn(() => vi.fn((key: string) => key)),
}));

// Export mocks for use in tests
export { mockVSCode };