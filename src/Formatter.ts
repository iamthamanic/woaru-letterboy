import { WoaruMessage } from './types';
import * as nls from 'vscode-nls';

// Initialize localization
const localize = nls.loadMessageBundle();

/**
 * Formatter class - formats WOARU messages into Markdown
 */
export class Formatter {
  /**
   * Format a WOARU message into Markdown according to the template
   */
  public static formatMessage(message: WoaruMessage): string {
    return `### 📬 ${localize('message.title', 'Nachricht von WOARU')}

${localize('message.error.in', 'Fehler in')}: **\`${message.filePath}\`** (${localize('message.line', 'Zeile')}: **${message.lineNumber}**)

> **${localize('message.rule', 'Regel')}:** \`${message.ruleId}\`
> **${localize('message.problem', 'Problem')}:** ${message.errorMessage}
>
> **${localize('message.suggestion', 'Vorschlag')}:**
> *${message.suggestion}*
---`;
  }
}