# CLAUDE.md - Projektspezifische Regeln für WOARU Letterboy

## 🎯 Überblick

Diese Datei definiert die unveränderlichen Regeln und Richtlinien für die KI-gestützte Entwicklung von WOARU Letterboy. Alle KI-Assistenten MÜSSEN diese Regeln befolgen.

## 📋 Kernanforderungen

### @Core_Rule_1: Technologie-Stack (UNVERÄNDERLICH)
- **Framework**: VS Code Extension API + TypeScript (strict mode)
- **HTTP-Server**: Fastify (localhost-only)
- **Validierung**: Zod für alle eingehenden Payloads
- **Paketmanager**: pnpm bevorzugt, npm als Fallback
- **Build-Tool**: @vscode/vsce für .vsix-Erstellung
- **Testing**: Vitest für Unit/Integration Tests
- **Linting**: ESLint + Prettier (siehe Konfiguration)

### @Core_Rule_2: Sicherheit (UNVERÄNDERLICH)
- HTTP-Server MUSS AUSSCHLIESSLICH auf 127.0.0.1 binden
- Alle eingehenden Requests MÜSSEN mit Zod validiert werden
- Keine externen Netzwerkverbindungen erlaubt
- Keine Secrets oder API-Keys im Code
- Fehlerbehandlung MUSS graceful sein (keine Crashes)

### @Core_Rule_3: Code-Qualität (UNVERÄNDERLICH)
- **TypeScript**: `strict: true` obligatorisch
- **Keine `any` Typen** ohne explizite Begründung + eslint-disable
- **Alle exportierten Funktionen** MÜSSEN JSDoc/TSDoc haben
- **Fehlerbehandlung**: try-catch für alle async Operations
- **Logging**: Strukturiertes Logging mit Timestamps

### @Core_Rule_4: Projektstruktur (UNVERÄNDERLICH)
```
src/
├── extension.ts        # Haupt-Einstiegspunkt
├── MessageListener.ts  # HTTP-Server Logik
├── CursorService.ts    # VS Code API Integration
├── Formatter.ts        # Markdown-Formatierung
├── StatusBarManager.ts # UI-Statusverwaltung
├── constants.ts        # Anwendungskonstanten
└── types.ts           # Zod-Schemas + TypeScript-Typen
```

### @Core_Rule_5: Markdown-Template (UNVERÄNDERLICH)
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

## 🔧 Entwicklungsrichtlinien

### Code-Stil
- **Prettier**: singleQuote: true, trailingComma: 'all', printWidth: 100
- **ESLint**: Konforme Konfiguration (siehe .eslintrc.js)
- **Imports**: Relative Imports innerhalb src/, absolute für node_modules
- **Naming**: camelCase für Variablen, PascalCase für Klassen/Typen

### Commit-Konventionen
- **Format**: `type(scope): description`
- **Typen**: feat, fix, docs, style, refactor, test, chore
- **Beispiele**: 
  - `feat(server): add JSON validation for message endpoint`
  - `fix(ui): resolve status bar icon flickering`

### Testing-Regeln
- **Unit Tests**: Für alle Formatter.ts und CursorService.ts Funktionen
- **Integration Tests**: Für MessageListener.ts Server-Routen
- **Mocking**: VS Code API MUSS gemockt werden
- **Coverage**: Kritische Pfade MÜSSEN getestet sein

## 🚀 Deployment-Regeln

### Pre-Release Checkliste
1. ✅ Alle Tests bestehen (`pnpm run test`)
2. ✅ Linting erfolgreich (`pnpm run lint`)
3. ✅ TypeScript kompiliert (`pnpm run compile`)
4. ✅ .vsix-Paket erstellt (`pnpm run package`)
5. ✅ Manuelle Funktionstests durchgeführt
6. ✅ README.md aktualisiert

### Versionierung
- **Semantic Versioning**: MAJOR.MINOR.PATCH
- **Breaking Changes**: MAJOR version bump
- **Neue Features**: MINOR version bump
- **Bug Fixes**: PATCH version bump

## 📊 Internationalisierung

### Obligatorische Übersetzungen
- **Sprachen**: Deutsch (Standard), Englisch
- **Dateien**: package.nls.json, package.nls.en.json
- **Verwendung**: vscode-nls für alle UI-Texte
- **Neue Strings**: MÜSSEN in beide Sprachen übersetzt werden

### Lokalisierung-Schlüssel
- **Format**: `category.subcategory.key`
- **Beispiele**: `message.title`, `status.listening`, `error.port.in.use`

## 🔍 Debugging & Logging

### Output Channel
- **Name**: "WOARU Letterboy"
- **Format**: `${timestamp} [${level}] ${message}`
- **Levels**: INFO, WARN, ERROR
- **Verwendung**: Alle wichtigen Events loggen

### Fehlerbehandlung
- **Server-Fehler**: Benutzer-freundliche Notifications
- **Validation-Fehler**: Strukturiert loggen, aber weiterlaufen
- **VS Code API-Fehler**: Graceful degradation

## 🚫 Verbotene Praktiken

### NIEMALS tun:
- ❌ `any` Typen ohne Begründung verwenden
- ❌ Server auf 0.0.0.0 oder externen IPs binden
- ❌ Unvalidierte Daten verarbeiten
- ❌ Synchrone File I/O in der Hauptschleife
- ❌ Credentials oder Secrets hartkodieren
- ❌ Extension ohne Fehlerbehandlung crashen lassen

### IMMER tun:
- ✅ Zod für alle externen Daten verwenden
- ✅ Try-catch für alle async Operations
- ✅ Strukturiertes Logging für Debug-Zwecke
- ✅ Benutzer-freundliche Fehlermeldungen
- ✅ Graceful shutdown bei Extension-Deaktivierung

## 📝 Dokumentation-Standards

### README.md
- **Abschnitte**: Features, Installation, Konfiguration, API, Troubleshooting
- **Aktualisierung**: Bei jeder neuen Feature oder API-Änderung
- **Beispiele**: Vollständige Code-Beispiele für API-Verwendung

### Code-Dokumentation
- **JSDoc**: Für alle exportierten Funktionen obligatorisch
- **Inline-Kommentare**: Für komplexe Logik
- **Type-Annotations**: Explizite Typen für bessere Verständlichkeit

## 🔄 Continuous Integration

### GitHub Actions
- **Trigger**: Push zu main/develop, Pull Requests
- **Steps**: install → lint → typecheck → test → build → package
- **Artefakte**: .vsix-Datei als Release-Asset

### Quality Gates
- **Linting**: Muss bestehen
- **Type-Checking**: Muss bestehen
- **Tests**: Muss bestehen
- **Build**: Muss erfolgreich sein

## 📋 Feature-Entwicklung

### Neues Feature hinzufügen
1. 📄 INITIAL.md erstellen mit detaillierter Spezifikation
2. 🔍 Bestehende Architektur analysieren
3. 🏗️ Implementation gemäß Core-Rules
4. 🧪 Tests schreiben (Unit + Integration)
5. 📚 Dokumentation aktualisieren
6. ✅ Pre-Release Checkliste abarbeiten

### Code-Review Kriterien
- **Functionality**: Feature funktioniert wie spezifiziert
- **Security**: Keine Sicherheitslücken
- **Performance**: Keine Performance-Regression
- **Maintainability**: Code ist wartbar und verständlich
- **Documentation**: Vollständige Dokumentation vorhanden

## 🎯 Ziele & Nicht-Ziele

### Projekt-Ziele
- ✅ Stabiler, performanter lokaler HTTP-Server
- ✅ Nahtlose Integration in VS Code/Cursor
- ✅ Benutzer-freundliche Konfiguration
- ✅ Robuste Fehlerbehandlung
- ✅ Vollständige Internationalisierung

### Nicht-Ziele
- ❌ Externe Netzwerk-Funktionalität
- ❌ Komplexe Datenverarbeitung
- ❌ Multi-User Support
- ❌ Cloud-Integration
- ❌ Advanced Analytics

---

**Diese Regeln sind verbindlich und dürfen nur nach expliziter Diskussion geändert werden.**