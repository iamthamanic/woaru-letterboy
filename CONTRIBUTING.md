# Contributing to WOARU Letterboy

Vielen Dank für Ihr Interesse an der Mitarbeit an WOARU Letterboy! Diese Anleitung hilft Ihnen beim Einstieg.

## 🚀 Schnellstart

### Voraussetzungen
- **Node.js**: Version 18.x oder höher
- **pnpm**: Bevorzugter Paketmanager (oder npm)
- **VS Code**: Für die Entwicklung empfohlen
- **Git**: Für die Versionskontrolle

### Repository Setup
```bash
# Repository klonen
git clone https://github.com/iamthamanic/woaru-letterboy.git
cd woaru-letterboy

# Abhängigkeiten installieren
pnpm install

# Entwicklungsserver starten
pnpm run watch
```

### Entwicklungsworkflow
1. **Extension testen**: `F5` in VS Code drückt eine neue Extension Host-Instanz
2. **Code ändern**: Änderungen werden automatisch kompiliert (watch mode)
3. **Reload**: `Ctrl+R` in der Extension Host-Instanz
4. **Debugging**: Breakpoints in TypeScript-Code setzen

## 🏗️ Projektstruktur

```
woaru-letterboy/
├── .vscode/          # VS Code Konfiguration
├── .github/          # GitHub Actions Workflows
├── src/              # Quellcode
│   ├── extension.ts        # Haupt-Einstiegspunkt
│   ├── MessageListener.ts  # HTTP-Server
│   ├── CursorService.ts    # VS Code API
│   ├── Formatter.ts        # Markdown-Formatierung
│   ├── StatusBarManager.ts # UI-Management
│   ├── constants.ts        # Konstanten
│   └── types.ts           # Typen & Schemas
├── out/              # Kompilierte JavaScript-Dateien
├── package.json      # Extension-Manifest
├── tsconfig.json     # TypeScript-Konfiguration
├── .eslintrc.js      # ESLint-Konfiguration
├── prettier.config.js # Prettier-Konfiguration
├── README.md         # Projektdokumentation
├── CLAUDE.md         # KI-Entwicklungsregeln
├── INITIAL.md        # Feature-Request Template
└── CONTRIBUTING.md   # Diese Datei
```

## 📋 Entwicklungsrichtlinien

### Code-Stil
- **TypeScript**: Strict mode aktiviert
- **ESLint**: Alle Regeln müssen befolgt werden
- **Prettier**: Automatische Formatierung
- **Naming Conventions**:
  - Variablen: `camelCase`
  - Konstanten: `UPPER_SNAKE_CASE`
  - Klassen: `PascalCase`
  - Dateien: `PascalCase` für Klassen, `camelCase` für Utilities

### Commit-Konventionen
Wir verwenden [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(server): add support for batch message processing
fix(ui): resolve status bar icon alignment issue
docs(readme): update installation instructions
style(formatter): improve markdown template spacing
refactor(listener): extract validation logic
test(cursor): add integration tests for message insertion
chore(deps): update dependencies to latest versions
```

**Typen**:
- `feat`: Neue Features
- `fix`: Bugfixes
- `docs`: Dokumentation
- `style`: Code-Formatierung
- `refactor`: Code-Refactoring
- `test`: Tests
- `chore`: Wartungsaufgaben

## 🧪 Testing

### Test-Struktur
```
src/
├── Formatter.test.ts       # Unit Tests für Formatter
├── CursorService.test.ts   # Unit Tests für CursorService
├── MessageListener.test.ts # Integration Tests für Server
└── types.test.ts          # Schema-Validation Tests
```

### Tests ausführen
```bash
# Alle Tests
pnpm run test

# Tests mit Watch-Mode
pnpm run test:watch

# Coverage-Report
pnpm run test:coverage
```

### Test-Richtlinien
- **Unit Tests**: Für jede neue Funktion/Klasse
- **Integration Tests**: Für API-Endpunkte
- **Mocking**: VS Code API muss gemockt werden
- **Coverage**: Mindestens 80% für neue Features

## 🔍 Code-Qualität

### Linting & Formatierung
```bash
# Linting
pnpm run lint

# Automatische Fixes
pnpm run lint --fix

# Formatierung prüfen
pnpm run format:check

# Automatisch formatieren
pnpm run format
```

### Pre-Commit Hooks
Husky führt automatisch aus:
- ESLint
- TypeScript-Kompilierung
- Prettier-Formatierung

### Code-Review Checkliste
- [ ] Code folgt den Stil-Richtlinien
- [ ] Alle Tests bestehen
- [ ] Neue Features sind getestet
- [ ] Dokumentation ist aktualisiert
- [ ] Keine `any` Typen ohne Begründung
- [ ] Fehlerbehandlung ist implementiert

## 📚 Dokumentation

### JSDoc-Standards
```typescript
/**
 * Formats a WOARU message into Markdown format
 * @param message - The validated WOARU message
 * @returns Formatted markdown string
 * @throws {Error} When message format is invalid
 */
public static formatMessage(message: WoaruMessage): string {
  // Implementation
}
```

### README-Updates
Bei API-Änderungen oder neuen Features:
1. API-Dokumentation aktualisieren
2. Beispiele hinzufügen/aktualisieren
3. Konfigurationsoptionen dokumentieren
4. Troubleshooting-Sektion erweitern

## 🚀 Pull Request-Prozess

### 1. Branch erstellen
```bash
# Feature-Branch erstellen
git checkout -b feat/awesome-feature

# Bugfix-Branch erstellen
git checkout -b fix/issue-123
```

### 2. Entwicklung
- Änderungen implementieren
- Tests schreiben
- Dokumentation aktualisieren
- Commits erstellen (Conventional Commits)

### 3. Pre-Submission Checkliste
- [ ] Alle Tests bestehen
- [ ] Code ist gelintet
- [ ] TypeScript kompiliert
- [ ] Extension funktioniert lokal
- [ ] Dokumentation ist aktualisiert

### 4. Pull Request erstellen
- **Titel**: Folgt Conventional Commits
- **Beschreibung**: Erklärt was, warum und wie
- **Linked Issues**: Verweist auf relevante Issues
- **Screenshots**: Bei UI-Änderungen

### 5. Code Review
- Mindestens ein Approve erforderlich
- Alle Kommentare müssen bearbeitet werden
- CI/CD Pipeline muss erfolgreich sein

## 🐛 Bug Reports

### Issue-Template
```markdown
## Bug-Beschreibung
[Klare Beschreibung des Bugs]

## Reproduktionsschritte
1. Schritt 1
2. Schritt 2
3. Schritt 3

## Erwartetes Verhalten
[Was sollte passieren]

## Aktuelles Verhalten
[Was passiert tatsächlich]

## Umgebung
- VS Code Version: [Version]
- WOARU Letterboy Version: [Version]
- Betriebssystem: [OS]
- Node.js Version: [Version]

## Logs
[Relevante Logs aus dem Output Panel]
```

### Debugging-Hilfen
- **Output Panel**: "WOARU Letterboy" für Logs
- **Developer Tools**: `Help > Toggle Developer Tools`
- **Extension Host**: Separate Instanz für Debugging

## 💡 Feature Requests

### INITIAL.md verwenden
Für neue Features:
1. `INITIAL.md` kopieren → `INITIAL_[FEATURE_NAME].md`
2. Alle Abschnitte vollständig ausfüllen
3. Als Issue einreichen mit dem `enhancement` Label

### Diskussion
- **GitHub Discussions**: Für Ideen und Konzepte
- **Issues**: Für konkrete Feature-Requests
- **PRs**: Für Implementierungen

## 🔧 Entwicklungstools

### Empfohlene VS Code Extensions
- **TypeScript**: Sprachunterstützung
- **ESLint**: Linting-Integration
- **Prettier**: Formatierung
- **GitLens**: Git-Integration
- **Thunder Client**: HTTP-Testing

### Debugging-Setup
```json
// .vscode/launch.json
{
  "name": "Run Extension",
  "type": "extensionHost",
  "request": "launch",
  "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
  "outFiles": ["${workspaceFolder}/out/**/*.js"]
}
```

## 🌐 Internationalisierung

### Neue Übersetzungen hinzufügen
1. **Deutsch**: `package.nls.json`
2. **Englisch**: `package.nls.en.json`
3. **Code**: `localize('key', 'default')`

### Übersetzungsschlüssel
- **Format**: `category.subcategory.key`
- **Beispiel**: `message.error.validation`

## 📊 Release-Prozess

### Versioning
Semantic Versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking Changes
- **MINOR**: Neue Features (abwärtskompatibel)
- **PATCH**: Bugfixes

### Release-Checkliste
- [ ] Changelog aktualisiert
- [ ] Version in `package.json` erhöht
- [ ] Tests bestehen
- [ ] .vsix-Paket erstellt
- [ ] Git-Tag erstellt
- [ ] GitHub Release erstellt

## 🤝 Community

### Code of Conduct
- Respektvoller Umgang
- Konstruktive Kritik
- Hilfsbereitschaft
- Inklusive Sprache

### Kommunikation
- **GitHub Issues**: Bugs und Features
- **GitHub Discussions**: Allgemeine Diskussionen
- **Pull Requests**: Code-Reviews

## 📞 Support

### Hilfe bekommen
- **Dokumentation**: README.md lesen
- **Issues**: Bestehende Issues durchsuchen
- **Discussions**: Community fragen

### Hilfe anbieten
- **Issue-Triaging**: Issues kategorisieren
- **Code-Reviews**: PRs reviewen
- **Dokumentation**: Verbesserungen vorschlagen

---

**Vielen Dank für Ihre Beiträge zu WOARU Letterboy! 🎉**