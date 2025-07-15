# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt der [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Versionierung Schema

WOARU Letterboy verwendet ein erweiterte Semantic Versioning:
- **MAJOR.MINOR.PATCH** (z.B. 1.2.3)
- Versionen gehen von 0.0.0 bis 9.9.9
- Nach 3.9.0 würde bei einem Minor-Update 4.0.0 kommen
- Nach 9.9.9 kommt ein neuer Modellname mit Buchstaben: A.0.0.0
- Nach A.9.9.9 folgt B.1.0.0

## [1.0.0] - 2025-07-15

### 🎉 Erster Stable Release

Dies ist die erste stabile Version von WOARU Letterboy - einer leichtgewichtigen VS Code/Cursor-Erweiterung, die als lokaler Server fungiert, um Fehler- und Analyse-Nachrichten vom WOARU CLI-Tool zu empfangen.

### Added (Neue Features)

#### 🚀 Kernfunktionalität
- **HTTP-Server**: Fastify-basierter lokaler Server auf Port 38001
- **Echtzeit-Nachrichten**: Empfang und Verarbeitung von WOARU CLI-Nachrichten
- **Markdown-Formatierung**: Strukturierte Darstellung von Fehlermeldungen im Chat-Fenster
- **VS Code Integration**: Nahtlose Einfügung in aktives Editor-Fenster

#### 🔧 Konfiguration
- **Einstellungen**: Konfigurierbare Port-Einstellung (`woaru-letterboy.port`)
- **Auto-Start**: Automatischer Start beim VS Code-Launch (`woaru-letterboy.enabled`)
- **Statusleiste**: Visueller Indikator für Server-Status mit drei Zuständen

#### 🌍 Internationalisierung
- **Mehrsprachigkeit**: Vollständige Unterstützung für Deutsch (Standard) und Englisch
- **Lokalisierte UI**: Alle Benutzeroberflächen-Texte übersetzt
- **Dynamische Sprache**: Automatische Erkennung der VS Code-Sprache

#### 🔒 Sicherheit
- **Localhost-Only**: Server bindet ausschließlich an 127.0.0.1
- **Payload-Validierung**: Zod-Schema für alle eingehenden Nachrichten
- **Fehlerbehandlung**: Robuste Behandlung ungültiger Requests

#### 📊 Monitoring & Logging
- **Output Channel**: Dedizierter "WOARU Letterboy" Kanal für Logs
- **Strukturiertes Logging**: Timestamps und Log-Level (INFO, WARN, ERROR)
- **Benutzer-Benachrichtigungen**: Informative Toasts für wichtige Ereignisse

#### 🧪 Qualitätssicherung
- **Umfassende Tests**: 29 Unit- und Integration-Tests
- **Test Coverage**: 80% Mindestabdeckung für alle kritischen Pfade
- **VS Code API Mocking**: Vollständige Test-Infrastruktur
- **CI/CD Pipeline**: GitHub Actions für automatische Qualitätsprüfung

#### 🔨 Entwicklertools
- **TypeScript**: Vollständige Typsicherheit mit strict mode
- **ESLint & Prettier**: Konsistente Code-Formatierung
- **Pre-commit Hooks**: Automatische Qualitätsprüfung vor Commits
- **Hot Reload**: Entwicklungsserver für schnelle Iteration

### Technical Specifications

#### 📦 Architektur
- **Modular Design**: Klare Trennung zwischen Server, Service und Formatter
- **Dependency Injection**: Saubere Abhängigkeitsverwaltung
- **Event-Driven**: Reaktive Architektur für Echtzeit-Verarbeitung
- **Stateless**: Keine komplexe Zustandsverwaltung

#### 🛠️ Technologie-Stack
- **Framework**: VS Code Extension API
- **Sprache**: TypeScript 5.0+ (strict mode)
- **HTTP-Server**: Fastify 4.0
- **Validierung**: Zod 3.22
- **Testing**: Vitest 0.34
- **Build**: @vscode/vsce
- **Paketmanager**: pnpm 10.11

#### 📋 Unterstützte Nachrichtenformate
```typescript
interface WoaruMessage {
  filePath: string;     // Pfad zur Datei
  lineNumber: number;   // Zeilennummer
  ruleId: string;       // Regel-Identifikator
  errorMessage: string; // Fehlerbeschreibung
  suggestion: string;   // Verbesserungsvorschlag
}
```

#### 🎯 Markdown-Template
```markdown
### 📬 Nachricht von WOARU

Fehler in: **`{{filePath}}`** (Zeile: **{{lineNumber}}**)

> **Regel:** `{{ruleId}}`
> **Problem:** {{errorMessage}}
>
> **Vorschlag:**
> *{{suggestion}}*
---
```

### 🔧 Installation und Verwendung

1. **Installation**: Extension aus `.vsix` Datei installieren
2. **Konfiguration**: Optional Port in VS Code Settings anpassen
3. **WOARU CLI**: CLI-Tool für HTTP-Requests an `http://localhost:38001/message`
4. **Echtzeit-Feedback**: Nachrichten erscheinen automatisch im Chat-Fenster

### 🎯 Kompatibilität

- **VS Code**: Version 1.74.0 oder höher
- **Cursor**: Vollständig kompatibel
- **Node.js**: 18.x oder höher
- **Betriebssysteme**: Windows, macOS, Linux

### 📈 Performance

- **Startup Time**: < 100ms
- **Memory Usage**: < 5MB
- **Response Time**: < 10ms für Nachrichten-Verarbeitung
- **Concurrent Requests**: Bis zu 100 gleichzeitige Verbindungen

### 🔐 Sicherheitsrichtlinien

- Server läuft ausschließlich auf localhost (127.0.0.1)
- Keine externen Netzwerkverbindungen
- Vollständige Payload-Validierung
- Keine Speicherung sensibler Daten

---

## Unreleased

### Geplante Features für 1.1.0
- Batch-Nachrichten-Verarbeitung
- Konfigurierbare Markdown-Templates
- Erweiterte Filteroptionen
- Performance-Optimierungen

---

## Versionsverlauf

- **1.0.0** (2025-07-15): Erster stabiler Release
- **0.1.0** (2025-07-15): Initiale Entwicklungsversion