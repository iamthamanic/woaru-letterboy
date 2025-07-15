import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import { STATUS_BAR_PRIORITY } from './constants';

// Initialize localization
const localize = nls.loadMessageBundle();

/**
 * StatusBarManager class - manages the status bar item
 */
export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      STATUS_BAR_PRIORITY
    );
    
    this.statusBarItem.command = 'woaru-letterboy.showLogs';
    this.statusBarItem.show();
    
    this.setInactive();
  }

  /**
   * Set status to listening state
   */
  public setListening(port: number): void {
    this.statusBarItem.text = `$(plug) ${localize('status.listening', 'WOARU Letterboy: Port {0}', port)}`;
    this.statusBarItem.backgroundColor = undefined;
    this.statusBarItem.tooltip = localize('status.listening.tooltip', 'WOARU Letterboy is listening on port {0}. Click to show logs.', port);
  }

  /**
   * Set status to inactive state
   */
  public setInactive(): void {
    this.statusBarItem.text = `$(plug-disconnected) ${localize('status.inactive', 'WOARU Letterboy: Inaktiv')}`;
    this.statusBarItem.backgroundColor = undefined;
    this.statusBarItem.tooltip = localize('status.inactive.tooltip', 'WOARU Letterboy is not listening. Click to show logs.');
  }

  /**
   * Set status to error state
   */
  public setError(): void {
    this.statusBarItem.text = `$(error) ${localize('status.error', 'WOARU Letterboy: Port-Fehler')}`;
    this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    this.statusBarItem.tooltip = localize('status.error.tooltip', 'WOARU Letterboy encountered an error. Click to show logs.');
  }

  /**
   * Dispose the status bar item
   */
  public dispose(): void {
    this.statusBarItem.dispose();
  }
}