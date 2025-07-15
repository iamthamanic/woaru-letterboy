import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import { MessageListener } from './MessageListener';
import { StatusBarManager } from './StatusBarManager';
import { DEFAULT_PORT, OUTPUT_CHANNEL_NAME } from './constants';

// Initialize localization
const localize = nls.loadMessageBundle();

let messageListener: MessageListener | null = null;
let outputChannel: vscode.OutputChannel;
let statusBarManager: StatusBarManager | null = null;

/**
 * Extension activation function
 */
export function activate(context: vscode.ExtensionContext): void {
  outputChannel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
  statusBarManager = new StatusBarManager();
  
  // Register show logs command
  const showLogsCommand = vscode.commands.registerCommand('woaru-letterboy.showLogs', () => {
    outputChannel.show();
  });

  context.subscriptions.push(showLogsCommand, outputChannel, statusBarManager);
  
  outputChannel.appendLine(`${new Date().toISOString()} [INFO] WOARU Letterboy activated`);
  
  // Get configuration
  const config = vscode.workspace.getConfiguration('woaru-letterboy');
  const isEnabled = config.get<boolean>('enabled', true);
  const port = config.get<number>('port', DEFAULT_PORT);
  
  // Start server if enabled
  if (isEnabled) {
    startServer(port);
  }
}

/**
 * Extension deactivation function
 */
export function deactivate(): void {
  if (messageListener) {
    messageListener.stop().catch(error => {
      console.error('Failed to stop message listener:', error);
    });
  }
  
  if (statusBarManager) {
    statusBarManager.dispose();
  }
  
  if (outputChannel) {
    outputChannel.appendLine(`${new Date().toISOString()} [INFO] WOARU Letterboy deactivated`);
    outputChannel.dispose();
  }
}

/**
 * Start the message listener server
 */
async function startServer(port: number): Promise<void> {
  try {
    messageListener = new MessageListener(port);
    await messageListener.start();
    
    if (statusBarManager) {
      statusBarManager.setListening(port);
    }
    
    await vscode.window.showInformationMessage(
      localize('info.server.started', 'WOARU Letterboy lauscht jetzt auf Port {0}', port)
    );
  } catch (error) {
    messageListener = null;
    
    if (statusBarManager) {
      statusBarManager.setError();
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    outputChannel.appendLine(`${new Date().toISOString()} [ERROR] Failed to start server: ${errorMessage}`);
    
    // Show appropriate error message based on error type
    if (errorMessage.includes('EADDRINUSE')) {
      await vscode.window.showErrorMessage(
        localize('error.port.in.use', 'WOARU Letterboy: Port {0} ist bereits belegt. Bitte schließen Sie andere Anwendungen oder ändern Sie den Port in den Einstellungen.', port)
      );
    } else {
      await vscode.window.showErrorMessage(
        localize('error.server.start', 'WOARU Letterboy: Start fehlgeschlagen: {0}', errorMessage)
      );
    }
  }
}