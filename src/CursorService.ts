import * as vscode from 'vscode';
import * as nls from 'vscode-nls';

// Initialize localization
const localize = nls.loadMessageBundle();

/**
 * CursorService class - handles VS Code/Cursor API interactions
 */
export class CursorService {
  /**
   * Display a formatted message in the active text editor
   */
  public async displayMessage(message: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
      await vscode.window.showWarningMessage(
        localize('warning.no.active.editor', 'WOARU Letterboy: Keine aktive Textdatei gefunden. Bitte klicken Sie in ein Chat-Fenster.')
      );
      return;
    }
    
    try {
      // Get current cursor position
      const position = editor.selection.active;
      
      // Insert the formatted message at cursor position
      await editor.edit(editBuilder => {
        editBuilder.insert(position, message + '\n\n');
      });
      
      // Move cursor to end of inserted text
      const newPosition = position.translate(message.split('\n').length + 1, 0);
      editor.selection = new vscode.Selection(newPosition, newPosition);
      
    } catch (error) {
      await vscode.window.showErrorMessage(
        localize('error.insert.message', 'WOARU Letterboy: Fehler beim Einfügen der Nachricht: {0}', error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }
}