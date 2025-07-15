# WOARU Letterboy

Eine leichtgewichtige VS Code / Cursor-Erweiterung, die als lokaler Server agiert, um Fehler- und Analyse-Nachrichten vom "WOARU"-CLI-Tool zu empfangen. Letterboy formatiert diese Nachrichten und fügt sie nahtlos und in Echtzeit in das aktive Chat-Fenster von Cursor ein, um einen vollautomatischen Feedback-Loop zu schaffen.

## 🚀 Features

- **HTTP-Server**: Lokaler Fastify-Server auf Port 38001 (konfigurierbar)
- **Sichere Kommunikation**: Nur localhost-Bindung, robuste Zod-Validierung
- **Echtzeit-Integration**: Automatische Nachrichtenzustellung in aktive Chat-Fenster
- **Statusanzeige**: Intelligente Statusleiste mit Zustandsvisualisierung
- **Internationalisierung**: Vollständige Deutsch/Englisch Unterstützung
- **Konfigurierbar**: VS Code Settings Integration

## 📋 Anforderungen

- **VS Code**: Version 1.74.0 oder höher
- **Node.js**: Version 18.x oder höher
- **WOARU CLI**: Kompatibles CLI-Tool für Nachrichtenversendung

## 🛠️ Installation

### Aus .vsix-Datei installieren

```bash
code --install-extension woaru-letterboy-0.1.0.vsix
```

### Aus dem Quellcode entwickeln

```bash
git clone https://github.com/iamthamanic/woaru-letterboy.git
cd woaru-letterboy
pnpm install
pnpm run compile
```

## ⚙️ Konfiguration

Die Erweiterung kann über die VS Code Settings konfiguriert werden:

### Verfügbare Einstellungen

| Einstellung | Typ | Standard | Beschreibung |
|-------------|-----|----------|--------------|
| `woaru-letterboy.port` | number | 38001 | Port für den HTTP-Server |
| `woaru-letterboy.enabled` | boolean | true | Automatischer Start beim VS Code Start |

### Konfiguration über settings.json

```json
{
  "woaru-letterboy.port": 38001,
  "woaru-letterboy.enabled": true
}
```

## 🔌 API-Schnittstelle

### HTTP-Endpunkt

- **URL**: `http://localhost:38001/message`
- **Methode**: `POST`
- **Content-Type**: `application/json`

### Payload-Format

```json
{
  "filePath": "src/services/UserService.ts",
  "lineNumber": 127,
  "ruleId": "complexity",
  "errorMessage": "Function 'calculateUserMetrics' has a complexity of 15. Maximum allowed is 10.",
  "suggestion": "Consider refactoring the function into smaller, more manageable parts to reduce its cyclomatic complexity."
}
```

### Antwortformat

**Erfolg (200)**:
```json
{
  "status": "success"
}
```

**Fehler (400)**:
```json
{
  "status": "error",
  "message": "Invalid payload"
}
```

## 📱 Benutzeroberfläche

### Statusleiste

Die Erweiterung zeigt ihren Status in der VS Code Statusleiste an:

- **$(plug) WOARU Letterboy: Port 38001** - Server läuft
- **$(plug-disconnected) WOARU Letterboy: Inaktiv** - Server gestoppt
- **$(error) WOARU Letterboy: Port-Fehler** - Fehler beim Start

### Nachrichten-Format

Eingehende Nachrichten werden automatisch in folgendem Markdown-Format eingefügt:

```markdown
### 📬 Nachricht von WOARU

Fehler in: **`src/services/UserService.ts`** (Zeile: **127**)

> **Regel:** `complexity`
> **Problem:** Function 'calculateUserMetrics' has a complexity of 15. Maximum allowed is 10.
>
> **Vorschlag:**
> *Consider refactoring the function into smaller, more manageable parts to reduce its cyclomatic complexity.*
---
```

## 🎯 Verwendung

### 1. Extension aktivieren

Die Extension startet automatisch beim VS Code Start (wenn `woaru-letterboy.enabled: true`).

### 2. WOARU CLI konfigurieren

Konfigurieren Sie Ihr WOARU CLI-Tool, um HTTP-Nachrichten an:
```
POST http://localhost:38001/message
```

### 3. Chat-Fenster aktivieren

- Öffnen Sie ein Cursor-Chat-Fenster
- Klicken Sie in das Textfeld (aktiver Editor)
- Nachrichten werden automatisch an der Cursor-Position eingefügt

### 4. Logs anzeigen

- Klicken Sie auf das Statusleisten-Item
- Oder verwenden Sie den Befehl: `WOARU Letterboy: Show Logs`

## 🔍 Fehlerbehebung

### Port bereits belegt

```
WOARU Letterboy: Port 38001 ist bereits belegt
```

**Lösung**: Ändern Sie den Port in den VS Code Settings oder beenden Sie die andere Anwendung.

### Keine aktive Textdatei

```
WOARU Letterboy: Keine aktive Textdatei gefunden
```

**Lösung**: Klicken Sie in ein Chat-Fenster oder Texteditor, bevor Sie Nachrichten senden.

### Server-Start fehlgeschlagen

Prüfen Sie die Logs im Output Panel:
1. Klicken Sie auf das Statusleisten-Item
2. Oder: `View > Output > WOARU Letterboy`

## 🏗️ Entwicklung

### Entwicklungsumgebung einrichten

```bash
# Repository klonen
git clone https://github.com/iamthamanic/woaru-letterboy.git
cd woaru-letterboy

# Abhängigkeiten installieren
pnpm install

# Entwicklungsserver starten
pnpm run watch
```

### Verfügbare Skripte

- `pnpm run compile` - TypeScript kompilieren
- `pnpm run watch` - Watch-Modus für Entwicklung
- `pnpm run lint` - Code-Qualitätsprüfung
- `pnpm run test` - Tests ausführen
- `pnpm run package` - .vsix-Paket erstellen
- `pnpm run build` - Vollständiger Build

### Architektur

```
src/
├── extension.ts        # Haupt-Einstiegspunkt
├── MessageListener.ts  # HTTP-Server (Fastify)
├── CursorService.ts    # VS Code API Integration
├── Formatter.ts        # Markdown-Formatierung
├── StatusBarManager.ts # Statusleisten-Verwaltung
├── constants.ts        # Anwendungskonstanten
└── types.ts           # Zod-Schemas & TypeScript-Typen
```

## 🧪 Tests

### Test-Framework

- **Unit Tests**: Vitest
- **Integration Tests**: Vitest mit VS Code API Mocks
- **E2E Tests**: @vscode/test-electron (optional)

### Tests ausführen

```bash
# Alle Tests
pnpm run test

# Tests mit Watch-Modus
pnpm run test:watch

# Coverage-Report
pnpm run test:coverage
```

## 🚀 Deployment

### Lokale .vsix-Datei erstellen

```bash
pnpm run build
```

### CI/CD Pipeline

Die GitHub Actions Pipeline:
1. Linting & Type-Checking
2. Tests ausführen
3. .vsix-Artefakt erstellen
4. Automatische Releases

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 🤝 Beitragen

Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Entwicklungsrichtlinien.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/iamthamanic/woaru-letterboy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/iamthamanic/woaru-letterboy/discussions)

## 🔗 Links

- [WOARU CLI Documentation](https://github.com/iamthamanic/woaru)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Cursor Editor](https://cursor.sh)

---

**Entwickelt mit ❤️ für die WOARU Community**