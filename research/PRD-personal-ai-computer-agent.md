# PRD: Personal AI Computer-Control Agent
**Version:** 1.0
**Date:** June 13, 2026
**Status:** Ready for Development

---

## 1. EXECUTIVE SUMMARY

The Personal AI Computer-Control Agent is a desktop application that lets any user control their entire computer using plain-language commands — typed or spoken — exactly as if they had a skilled human assistant sitting at their keyboard. It targets developers, entrepreneurs, and power users who spend hours on repetitive computer tasks. The agent sees the screen, clicks, types, downloads files, installs software, edits documents, converts media, and runs terminal commands — but only when directly commanded, always confirming before any irreversible action.

---

## 2. PROBLEM STATEMENT

### 2.1 Current Pain Points

- Existing automation tools (UiPath, Selenium, AutoHotkey) require programming knowledge and break whenever a UI changes — non-technical users cannot use them at all.
- Switching between 6–10 apps to complete a single workflow (download → rename → open in Excel → send via email) wastes 30–60 minutes per day on coordination overhead.
- There is no single tool that handles the full computer surface: browser + file system + installed apps + terminal + media editing + Office documents in one place.
- Current AI assistants (ChatGPT, Claude.ai) can only *describe* how to do tasks — they cannot *execute* them on the user's behalf.
- RPA enterprise tools cost thousands of dollars per seat and require dedicated IT teams to maintain.

### 2.2 Proposed Solution

A locally-installed Python desktop app with a chat UI where the user types (or speaks) a command in plain English. The agent's AI brain (Claude or GPT-4o) reads a screenshot, plans the steps needed, and executes them using a full toolkit of Python libraries — mouse/keyboard control, browser automation, file operations, app launching, software installation, Office document creation, media conversion, and terminal execution. Every dangerous action triggers a confirmation dialog before proceeding. After every task, the agent reports exactly what it did.

---

## 3. GOALS & SUCCESS METRICS

### 3.1 Primary Goals

- [ ] Agent successfully executes 8 capability domains (browser, files, apps, install, system, productivity, media, dev) from natural language commands
- [ ] All dangerous actions (delete, install, send, shutdown) require and respect user confirmation before executing
- [ ] Complete working prototype installable on Windows 10/11 in under 10 minutes
- [ ] Every completed task generates a human-readable action log with timestamps

### 3.2 Success Metrics (KPIs)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Task success rate (simple tasks) | ≥ 90% | Manual test: 20 simple commands |
| Task success rate (complex tasks) | ≥ 65% | Manual test: 10 multi-step commands |
| Average steps to complete a task | ≤ 8 LLM calls | Log count per completed task |
| Dangerous action confirmation rate | 100% | Automated: every delete/install path tested |
| Cold start time | < 5 seconds | Time from launch to ready |
| False confirmation triggers | 0 | Audit log: safe actions must never prompt |

---

## 4. TARGET USERS

### 4.1 Primary User Persona

- **Name:** Saif Khan (Developer / Freelancer)
- **Role:** Senior full-stack developer, solo freelancer
- **Goals:** Automate repetitive computer tasks (file organization, batch media conversion, software updates, report generation) without writing separate scripts for each one
- **Frustrations:** Spends 1–2 hours daily on tasks that feel mechanical; existing tools are either too simple (can't handle complex workflows) or too complex (require coding/maintenance)
- **Tech Level:** Advanced — comfortable in terminal, not afraid of Python, but does not want to maintain brittle automation scripts

### 4.2 Secondary User

Power user / entrepreneur with no coding background who wants to command their computer verbally and have it execute multi-step workflows (e.g., "find all invoices in Downloads, rename them with dates, move to Dropbox, and email me the list").

---

## 5. TECH STACK & ARCHITECTURE

### 5.1 Recommended Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend (chat UI) | React 18 + TypeScript + Vite | Fast, familiar, works as Electron renderer |
| Desktop shell | Electron 32 | Cross-platform desktop app, access to Node.js + system |
| Agent backend | Python 3.12 (FastAPI) | All automation libs are Python-native |
| IPC bridge | Electron ↔ FastAPI via HTTP localhost | Simple, debuggable, no native bindings needed |
| LLM | Anthropic Claude Opus 4.x (primary) / GPT-4o (fallback) | Best vision + tool-use for computer control |
| Screen capture | Python `mss` / `Pillow.ImageGrab` | Cross-platform screenshot |
| Mouse/keyboard | `pyautogui` | Cross-platform, battle-tested |
| Browser | `playwright` + `browser-use` | Self-healing, LLM-native browser control |
| File ops | Python stdlib (`pathlib`, `shutil`, `zipfile`) | No deps, complete |
| Media | `ffmpeg-python`, `Pillow`, `pydub` | Industry standard for media conversion |
| Office docs | `python-docx`, `openpyxl` | Read/write without Office installed |
| System monitor | `psutil` | Cross-platform CPU/RAM/disk/process |
| Action log | SQLite (via `sqlite3` stdlib) | Zero-config, fast, queryable |
| Styling | Tailwind CSS v3 + shadcn/ui | Consistent dark-mode UI |

### 5.2 Project Structure

```
personal-ai-agent/
├── electron/
│   ├── main.ts                  # Electron main process
│   ├── preload.ts               # Context bridge
│   └── updater.ts               # Auto-update logic
├── src/                         # React frontend
│   ├── App.tsx
│   ├── pages/
│   │   ├── Chat.tsx             # Main command interface
│   │   ├── History.tsx          # Action log viewer
│   │   └── Settings.tsx         # API keys, preferences
│   ├── components/
│   │   ├── CommandInput.tsx     # Text/voice input bar
│   │   ├── MessageBubble.tsx    # Chat message display
│   │   ├── ConfirmDialog.tsx    # Dangerous action gate
│   │   ├── ActionLog.tsx        # Live action stream
│   │   ├── ScreenPreview.tsx    # Live screenshot panel
│   │   └── StatusBar.tsx        # Agent state indicator
│   ├── hooks/
│   │   ├── useAgent.ts          # WebSocket connection to Python
│   │   └── useVoice.ts          # Browser speech recognition
│   └── lib/
│       └── api.ts               # HTTP client to FastAPI
├── agent/                       # Python FastAPI backend
│   ├── main.py                  # FastAPI app + WebSocket server
│   ├── agent_loop.py            # Core perception-action loop
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── browser_tools.py     # Playwright + browser-use
│   │   ├── file_tools.py        # pathlib, shutil, zipfile
│   │   ├── app_tools.py         # subprocess, pyautogui app open
│   │   ├── install_tools.py     # winget, apt, brew, .exe/.msi
│   │   ├── system_tools.py      # psutil, display, volume, wifi
│   │   ├── productivity_tools.py # python-docx, openpyxl, email
│   │   ├── media_tools.py       # ffmpeg-python, Pillow, pydub
│   │   ├── dev_tools.py         # subprocess, git, pip, npm
│   │   └── screen_tools.py      # screenshot, click, type, scroll
│   ├── safety/
│   │   ├── confirmation.py      # Dangerous action registry + gate
│   │   └── validator.py         # Path sandbox, domain allowlist
│   ├── logger.py                # SQLite action log
│   └── requirements.txt
├── public/
│   └── icon.ico
├── package.json
├── electron-builder.config.js
├── vite.config.ts
└── .env.example
```

### 5.3 Key Environment Variables

```
ANTHROPIC_API_KEY=your-anthropic-api-key-here
OPENAI_API_KEY=your-openai-api-key-fallback
AGENT_PORT=7788
AGENT_MODEL=claude-opus-4-6-20251001
AGENT_SCREENSHOT_INTERVAL_MS=500
AGENT_WORKSPACE_ROOT=~/agent_workspace
AGENT_ALLOWED_DOMAINS=google.com,github.com,microsoft.com,python.org,npmjs.com,pypi.org
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=
SMTP_PASSWORD=
```

---

## 6. FEATURES & REQUIREMENTS

### Feature 1: Command Input Interface
- **Priority:** P0
- **User Story:** As a user, I want to type a plain-English command in a chat box so that the agent immediately begins executing it on my computer.
- **Acceptance Criteria:**
  - [ ] Text input field is always focused when the app is open
  - [ ] Pressing Enter submits the command; Shift+Enter adds a newline
  - [ ] A microphone button enables voice input via Web Speech API
  - [ ] A "Stop" button (red, always visible while agent is running) immediately halts agent execution
  - [ ] Commands are echoed in the chat as user messages; agent responses appear as assistant messages
  - [ ] Input is disabled while agent is actively executing (shows spinner)
- **UI Notes:** Full-width chat input at the bottom of the screen. Dark background. Placeholder text: "Tell me what to do — e.g. 'Open Chrome and search for Python tutorials'". Microphone icon on right side of input.
- **API/Logic Notes:** POST `/api/command` with `{ task: string }`. Returns `202 Accepted` immediately. Agent streams progress events over WebSocket. Validate: command must be non-empty string, max 2000 characters.
- **Dependencies:** WebSocket connection (Feature 2), Agent Loop (Feature 3)

---

### Feature 2: Real-Time Action Stream (WebSocket)
- **Priority:** P0
- **User Story:** As a user, I want to see live updates of what the agent is doing step by step so that I can follow along and trust the process.
- **Acceptance Criteria:**
  - [ ] WebSocket connects on app launch and auto-reconnects on disconnect
  - [ ] Each agent action streams as a typed event within 200ms of occurrence
  - [ ] Event types displayed: `thinking`, `screenshot_taken`, `clicking`, `typing`, `running_command`, `downloading`, `waiting_confirmation`, `completed`, `error`
  - [ ] A live screenshot preview panel updates every time the agent takes a screenshot
  - [ ] Status bar shows current agent state: Idle / Thinking / Acting / Waiting / Done
- **UI Notes:** Right panel (30% of screen width) shows the live screenshot. Left panel (70%) shows the chat/action stream. Each event has an icon, timestamp, and short description.
- **API/Logic Notes:** FastAPI WebSocket at `ws://localhost:7788/ws`. Server pushes `{ type, message, screenshot_b64?, timestamp }` JSON events. Client never sends on this socket — it is receive-only.
- **Dependencies:** Feature 1

---

### Feature 3: Core Agent Perception-Action Loop
- **Priority:** P0
- **User Story:** As a user, I want the agent to see my screen and take actions automatically until my command is completed so that I don't have to guide it step by step.
- **Acceptance Criteria:**
  - [ ] On every loop iteration: take screenshot → send to LLM → receive tool call → execute → repeat
  - [ ] Loop terminates when LLM returns `stop_reason: end_turn` with no tool calls pending
  - [ ] Loop terminates with error message if > 50 iterations without completion
  - [ ] All 35+ tool functions are registered and callable by the LLM
  - [ ] LLM receives full screenshot as base64 image on every iteration
  - [ ] Tool call parameters are validated against their schema before execution
- **UI Notes:** No direct UI — drives the action stream events.
- **API/Logic Notes:** Uses Anthropic `beta.messages.create` with `computer-use-2025-11-24` beta. Model: `claude-opus-4-6-20251001`. Max tokens: 8096. System prompt includes all safety rules and capability descriptions. Implements exponential backoff on 429/500 errors.
- **Dependencies:** All tool modules (Features 4–11), Safety Layer (Feature 12)

---

### Feature 4: Browser & Internet Tools
- **Priority:** P0
- **User Story:** As a user, I want the agent to browse the web, download files, fill forms, and manage browser tabs on my command so that I don't have to do repetitive web tasks myself.
- **Acceptance Criteria:**
  - [ ] Agent can navigate to any URL
  - [ ] Agent can search Google/Bing with a query string
  - [ ] Agent can download any file from a URL to a specified local path (with progress bar in UI)
  - [ ] Agent can upload a local file to a website with a file input element
  - [ ] Agent can fill text fields, select dropdowns, and click buttons on any web form
  - [ ] Agent can open multiple tabs and switch between them
  - [ ] Agent can log in to websites only when the user explicitly provides credentials in the command
  - [ ] Download progress shown as percentage in the action stream
- **UI Notes:** Downloads appear in action stream with filename, size, and progress percentage. A "Downloads" section in History shows all files downloaded.
- **API/Logic Notes:** Uses `playwright` for direct browser control and `browser-use` for natural-language web tasks. Headless: `False` (user can see what the browser is doing). Download directory defaults to `AGENT_WORKSPACE_ROOT/downloads`. Never store or log credentials.
- **Dependencies:** Feature 3

---

### Feature 5: File & Folder Management Tools
- **Priority:** P0
- **User Story:** As a user, I want the agent to create, copy, move, rename, delete, search, compress, and extract files on my computer so that I never have to manually organize files again.
- **Acceptance Criteria:**
  - [ ] Agent can create files and folders at any path (with parent directories auto-created)
  - [ ] Agent can read text file contents and return them
  - [ ] Agent can write/overwrite text file contents
  - [ ] Agent can copy, move, and rename files and folders
  - [ ] Agent can delete files and folders — **only after confirmation** (Feature 12)
  - [ ] Agent can search for files by name pattern recursively (e.g., `*.pdf`)
  - [ ] Agent can create ZIP archives from folders
  - [ ] Agent can extract ZIP and RAR archives
  - [ ] Agent can find duplicate files by MD5 hash and list them
  - [ ] Agent can back up a folder to another location
  - [ ] All paths resolved to absolute before execution; path-traversal attacks blocked
- **UI Notes:** File operations show source → destination in action stream. Delete operations show file size and ask "Are you sure you want to permanently delete X? This cannot be undone."
- **API/Logic Notes:** Uses Python stdlib: `pathlib`, `shutil`, `zipfile`, `hashlib`. `rarfile` for RAR. Sandbox: resolve all paths, reject any path that escapes `AGENT_WORKSPACE_ROOT` OR user's home directory. Exception: user must explicitly pass full absolute paths for operations outside workspace.
- **Dependencies:** Feature 3, Feature 12 (for delete)

---

### Feature 6: App Control Tools
- **Priority:** P0
- **User Story:** As a user, I want the agent to open any installed application, interact with it using the screen, and close it when done so that I can use any app through natural language.
- **Acceptance Criteria:**
  - [ ] Agent can open any installed app by common name (Chrome, Excel, VS Code, Notepad, etc.) or full path
  - [ ] Agent can close a running app by name
  - [ ] Agent can list all currently running processes
  - [ ] Agent can click, double-click, right-click at any screen coordinates
  - [ ] Agent can type text into any focused input field
  - [ ] Agent can press keyboard shortcuts (Ctrl+C, Alt+F4, Win+D, etc.)
  - [ ] Agent can scroll up/down on any element
  - [ ] Agent can drag and drop between coordinates
  - [ ] Agent waits for app to load (screenshot diff check) before next action
- **UI Notes:** Each GUI action (click at x,y) shown with brief description: "Clicked 'Save' button" not "Clicked at (832, 445)". The LLM describes actions semantically.
- **API/Logic Notes:** `pyautogui` for mouse/keyboard. `subprocess.Popen` for app launch. `psutil` for process list/close. Built-in `APP_MAP` dictionary maps friendly names to executable paths per OS. After every click/type action, always take a new screenshot before the next action to verify.
- **Dependencies:** Feature 3

---

### Feature 7: Software Installation & Update Tools
- **Priority:** P0
- **User Story:** As a user, I want the agent to download and install any software, update all installed apps, and uninstall apps I no longer need — all with my confirmation — so I never have to manage software manually.
- **Acceptance Criteria:**
  - [ ] Agent can install any app by package ID using winget (Windows), brew (macOS), or apt (Linux) — **requires confirmation**
  - [ ] Agent can install from a direct URL (.exe or .msi) with silent flags — **requires confirmation**
  - [ ] Agent can uninstall any app by package ID — **requires confirmation**
  - [ ] Agent can update all installed apps — **requires confirmation**
  - [ ] Agent verifies download URL is in `AGENT_ALLOWED_DOMAINS` or asks user to add it before proceeding
  - [ ] Installation progress streamed to UI in real time
  - [ ] Agent reports success/failure with exit code after installation
- **UI Notes:** Confirmation dialog shows: app name, source URL, estimated size (if known), and winget package ID. Large warning icon. Two buttons: "Install" (primary/green) and "Cancel" (secondary/red).
- **API/Logic Notes:** winget: `--silent --accept-package-agreements --accept-source-agreements`. MSI: `msiexec /i /qn /norestart`. EXE: try `/S`, then `/VERYSILENT`, then `/quiet` in that order. Subprocess timeout: 600 seconds. Run with elevated permissions if UAC required (prompt user to allow UAC popup if it appears on screen).
- **Dependencies:** Feature 3, Feature 12 (confirmation)

---

### Feature 8: System Control Tools
- **Priority:** P0
- **User Story:** As a user, I want the agent to monitor my system performance, adjust settings, clean up temporary files, and manage startup apps so that I can maintain my computer without manual effort.
- **Acceptance Criteria:**
  - [ ] Agent can report CPU %, RAM used/total, disk used/total, top processes
  - [ ] Agent can kill any process by name or PID — **requires confirmation**
  - [ ] Agent can set system volume (0–100%) — no confirmation needed
  - [ ] Agent can mute/unmute volume — no confirmation needed
  - [ ] Agent can get/set display resolution — **requires confirmation**
  - [ ] Agent can list available WiFi networks
  - [ ] Agent can clean Windows temp files (`%TEMP%`, `%WINDIR%\Temp`) — **requires confirmation**, reports MB freed
  - [ ] Agent can list startup applications
  - [ ] Agent can disable a startup app — **requires confirmation**
  - [ ] Agent can restart or shut down the computer — **requires confirmation**, with 30-second countdown cancel option
- **UI Notes:** System status shows as a small widget in the UI sidebar: CPU bar, RAM bar, Disk bar — updates every 5 seconds when agent is idle. Shutdown/restart shows a countdown timer in the confirmation dialog with a Cancel button.
- **API/Logic Notes:** `psutil` for monitoring. PowerShell for Windows-specific settings (volume, resolution, startup). `subprocess` with `netsh wlan show networks` for WiFi list. Temp cleanup lists all files to be deleted with total size BEFORE asking confirmation.
- **Dependencies:** Feature 3, Feature 12

---

### Feature 9: Productivity Tools (Documents, Email, Notes)
- **Priority:** P1
- **User Story:** As a user, I want the agent to create Word documents, Excel spreadsheets, draft emails, and manage my notes so that I can produce office work through plain language.
- **Acceptance Criteria:**
  - [ ] Agent can create a `.docx` Word document with title, headings, paragraphs, and tables
  - [ ] Agent can edit an existing `.docx` (find-and-replace text)
  - [ ] Agent can create an `.xlsx` Excel file with data, styled headers, and auto-fitted column widths
  - [ ] Agent can read data from an existing `.xlsx` file and return it
  - [ ] Agent can add a bar/line chart to an Excel file
  - [ ] Agent can draft an email (shows draft in UI for review) — **requires confirmation to send**
  - [ ] Agent can send an approved email draft via SMTP — **requires confirmation**
  - [ ] Agent can add notes and to-do items to a local JSON file
  - [ ] Agent can list all notes/todos
- **UI Notes:** Email drafts show a preview card in chat: To, Subject, Body preview, two buttons: "Send" and "Edit". Word/Excel files created show a clickable link to open the file.
- **API/Logic Notes:** `python-docx` for Word. `openpyxl` for Excel. `smtplib` + `email.mime` for email. SMTP credentials stored in env vars, never logged. Notes stored in `AGENT_WORKSPACE_ROOT/notes.json`. Email draft is always shown to user before SMTP send is even attempted.
- **Dependencies:** Feature 3, Feature 12 (email send)

---

### Feature 10: Media & Creative Tools
- **Priority:** P1
- **User Story:** As a user, I want the agent to convert, edit, compress, and organize my images, videos, and audio files so that I never need to open a media editing app for routine tasks.
- **Acceptance Criteria:**
  - [ ] Agent can convert any image format (JPG, PNG, WebP, GIF, BMP, TIFF)
  - [ ] Agent can resize an image to specific dimensions
  - [ ] Agent can compress an image to a target file size (KB)
  - [ ] Agent can add a text watermark to an image
  - [ ] Agent can create a thumbnail from an image
  - [ ] Agent can convert any video format (MP4, AVI, MKV, MOV, WebM)
  - [ ] Agent can trim a video to start/end timestamps
  - [ ] Agent can compress a video with configurable quality (CRF)
  - [ ] Agent can extract audio from a video as MP3
  - [ ] Agent can convert any audio format (MP3, WAV, OGG, FLAC, AAC)
  - [ ] Agent can merge multiple audio files
  - [ ] Agent can increase/decrease audio volume by dB
  - [ ] Agent reports input size vs. output size after compression operations
- **UI Notes:** Media operations show before/after file sizes. Long operations (video conversion) show elapsed time in the action stream. Output file shown as a clickable link.
- **API/Logic Notes:** `Pillow` for images. `ffmpeg-python` for video (requires FFmpeg binary installed on system — agent will offer to install it via winget if not found). `pydub` for audio (also requires FFmpeg). All output written to same directory as input unless user specifies otherwise. Never delete original — always write to new file unless explicitly asked to overwrite.
- **Dependencies:** Feature 3, Feature 7 (to install FFmpeg if missing)

---

### Feature 11: Developer & Technical Tools
- **Priority:** P1
- **User Story:** As a user/developer, I want the agent to edit code files, run scripts, manage git repositories, install packages, and execute terminal commands so that I can manage development workflows through conversation.
- **Acceptance Criteria:**
  - [ ] Agent can read any code file and display it with syntax
  - [ ] Agent can write/edit any code file
  - [ ] Agent can search for a pattern across all files in a folder (grep-like)
  - [ ] Agent can run any terminal/shell command — **requires confirmation** with explanation shown first
  - [ ] Agent can run Python scripts and return output
  - [ ] Agent can run Node.js scripts and return output
  - [ ] Agent can install pip packages
  - [ ] Agent can install npm packages in a given directory
  - [ ] Agent can run `git status`, `git clone`, `git pull`
  - [ ] Agent can `git add + commit + push` — **requires confirmation** showing the commit message
  - [ ] Agent can open any file in VS Code
  - [ ] Agent explains what a risky terminal command does BEFORE showing the confirmation prompt
- **UI Notes:** Terminal output shown in a monospace code block in the chat. Long outputs truncated at 200 lines with "Show more" button. Git commit confirmation shows: files changed, commit message, and remote URL.
- **API/Logic Notes:** `subprocess` for all terminal ops. `shell=False` by default (safer). `shell=True` only when pipe/redirect chars detected. Timeout 60s default, configurable per command. Working directory defaults to `AGENT_WORKSPACE_ROOT`. Agent prepends a plain-English explanation of any command containing `rm -rf`, `DROP`, `format`, `del /F /S`, `shutdown`, before the confirmation dialog.
- **Dependencies:** Feature 3, Feature 12

---

### Feature 12: Safety Layer — Confirmation System
- **Priority:** P0
- **User Story:** As a user, I want the agent to always ask me before doing anything risky (deleting files, installing software, sending messages, changing settings) so that I stay in full control.
- **Acceptance Criteria:**
  - [ ] The following actions ALWAYS pause and show a confirmation dialog before executing: `delete_file`, `install_app`, `uninstall_app`, `run_command` (terminal), `send_email`, `send_message`, `restart_computer`, `shutdown_computer`, `clean_temp_files`, `disable_startup_app`, `set_resolution`, `git_commit_push`, `connect_wifi`, `kill_process`, `upload_file`
  - [ ] Confirmation dialog shows: Action type, full parameters, plain-English description of what will happen, and any irreversibility warning ("This cannot be undone")
  - [ ] Two buttons: "Confirm" (green) and "Cancel" (red) — no default focused button to prevent accidental Enter-to-confirm
  - [ ] Cancelled actions are logged as "Cancelled by user" with timestamp
  - [ ] Agent loop pauses (does not take another action) while waiting for confirmation
  - [ ] Non-dangerous actions (read file, open app, take screenshot, monitor CPU) never show confirmation
  - [ ] Confirmation timeout: if no response in 5 minutes, auto-cancel
- **UI Notes:** Confirmation dialog is a modal overlay. Title in amber/orange color. Icon matches action type (🗑️ delete, 📦 install, 📧 email, ⚙️ settings). Irreversible actions show "⚠️ This action cannot be undone" in red.
- **API/Logic Notes:** Python-side: before executing any dangerous tool, emit a `waiting_confirmation` WebSocket event with full action details. Block execution coroutine with `asyncio.Event`. Frontend resolves or rejects via POST `/api/confirm/{action_id}`. Action ID is a UUID generated per dangerous action attempt.
- **Dependencies:** WebSocket (Feature 2)

---

### Feature 13: Action History & Log Viewer
- **Priority:** P1
- **User Story:** As a user, I want to see a full log of everything the agent has done so that I can review, audit, and undo actions if needed.
- **Acceptance Criteria:**
  - [ ] Every action is written to a SQLite database with: timestamp, tool name, parameters, result, success/fail, session ID
  - [ ] History page shows all sessions, filterable by date and action type
  - [ ] Each session expandable to show individual actions in order
  - [ ] "Copy command" button re-populates the command input with the original task
  - [ ] Export log as CSV button
  - [ ] Logs never deleted automatically (user can clear manually with confirmation)
- **UI Notes:** History page accessible via sidebar. Table view with columns: Time, Action, Target, Result. Colour-coded rows: green (success), red (failed), amber (cancelled). Clicking a row expands to show full parameters and output.
- **API/Logic Notes:** SQLite file at `AGENT_WORKSPACE_ROOT/action_log.db`. Schema: `(id TEXT PK, session_id TEXT, timestamp TEXT, tool_name TEXT, parameters TEXT, result TEXT, success INTEGER, cancelled INTEGER)`. Query endpoint: `GET /api/history?limit=100&offset=0&session_id=`.
- **Dependencies:** Feature 3

---

### Feature 14: Settings Page
- **Priority:** P1
- **User Story:** As a user, I want to configure my API key, choose my preferred AI model, and adjust agent behavior so that the agent works the way I want.
- **Acceptance Criteria:**
  - [ ] Fields for ANTHROPIC_API_KEY and OPENAI_API_KEY (masked, with show/hide toggle)
  - [ ] Dropdown to select active model (claude-opus-4-6-20251001, gpt-4o, local Ollama)
  - [ ] Toggle for voice input (on/off)
  - [ ] Toggle to auto-confirm low-risk terminal commands (e.g., `ls`, `dir`, `git status`)
  - [ ] Field for allowed download domains (comma-separated)
  - [ ] Field for agent workspace root directory (folder picker)
  - [ ] "Test API Key" button that makes a minimal API call and confirms success
  - [ ] Save button writes settings to `~/.personal-ai-agent/config.json`
- **UI Notes:** Clean form layout. Keys stored with `keytar` (OS credential store) — not in plain text config file. Settings page accessed via gear icon in sidebar.
- **API/Logic Notes:** Config stored at `~/.personal-ai-agent/config.json`. Sensitive keys stored in OS keychain via `keytar` npm package in Electron. Python agent reads config via `GET /api/config` on startup. POST `/api/config` to update.
- **Dependencies:** None

---

### Feature 15: Voice Input
- **Priority:** P2
- **User Story:** As a user, I want to speak my commands instead of typing them so that I can give hands-free instructions to the agent.
- **Acceptance Criteria:**
  - [ ] Microphone button in command input toggles voice capture
  - [ ] Uses browser Web Speech API (no external service, no data sent anywhere)
  - [ ] Transcribed text appears in the command input field in real time
  - [ ] Pressing Enter or clicking Send submits the transcribed command
  - [ ] Visual indicator (animated waveform) shown while listening
  - [ ] Auto-submits command after 2 seconds of silence (configurable in settings)
- **UI Notes:** Microphone button pulses red while listening. Waveform animation below input field. Auto-submit countdown shown as a small progress arc on the mic button.
- **API/Logic Notes:** `window.SpeechRecognition` or `window.webkitSpeechRecognition`. `continuous: false`, `interimResults: true`. No audio data leaves the device. Only the final transcript string is sent to the agent backend.
- **Dependencies:** Feature 1

---

## 7. DATA MODELS

### AgentSession
```typescript
interface AgentSession {
  id: string;          // UUID, auto-generated
  startedAt: string;   // ISO timestamp
  endedAt: string;     // ISO timestamp, null if active
  originalTask: string; // User's raw command text
  status: "running" | "completed" | "failed" | "cancelled";
  actionCount: number; // Total tool calls made
}
```

### ActionLog
```typescript
interface ActionLog {
  id: string;          // UUID
  sessionId: string;   // FK → AgentSession.id
  timestamp: string;   // ISO timestamp
  toolName: string;    // e.g., "delete_file", "run_command"
  parameters: string;  // JSON string of tool call params
  result: string;      // Tool output (truncated at 5000 chars)
  success: boolean;
  cancelled: boolean;  // True if user rejected confirmation
  durationMs: number;  // Time taken to execute
}
```

### ConfirmationRequest
```typescript
interface ConfirmationRequest {
  id: string;           // UUID — sent to frontend to resolve
  actionType: string;   // Tool name
  description: string;  // Plain-English "what will happen"
  parameters: object;   // Full tool call params
  isIrreversible: boolean;
  createdAt: string;    // ISO timestamp
  resolvedAt: string | null;
  resolution: "confirmed" | "cancelled" | "timeout" | null;
}
```

### AgentConfig
```typescript
interface AgentConfig {
  activeModel: string;         // "claude-opus-4-6-20251001"
  workspaceRoot: string;       // "~/agent_workspace"
  allowedDomains: string[];    // ["google.com", "github.com"]
  voiceInputEnabled: boolean;
  voiceAutoSubmitDelayMs: number; // 2000
  autoConfirmSafeTerminal: boolean; // false by default
  confirmationTimeoutMs: number;   // 300000 (5 min)
}
```

### ChatMessage
```typescript
interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  type: "command" | "response" | "action_event" | "confirmation" | "error";
  screenshotB64?: string;  // Only for screenshot events
}
```

---

## 8. API ENDPOINTS

| Method | Endpoint | Auth | Request Body | Response | Description |
|--------|----------|------|--------------|----------|-------------|
| POST | /api/command | No | `{ task: string }` | `{ sessionId: string }` | Submit a new command to agent |
| POST | /api/command/stop | No | `{ sessionId: string }` | `{ success: boolean }` | Stop currently running agent |
| GET | /api/history | No | — | `AgentSession[]` | List all past sessions |
| GET | /api/history/:sessionId | No | — | `ActionLog[]` | Get actions for a session |
| GET | /api/history/export | No | — | CSV file | Export all logs as CSV |
| DELETE | /api/history | No | — | `{ success: boolean }` | Clear all history (confirmation in UI) |
| POST | /api/confirm/:actionId | No | `{ confirmed: boolean }` | `{ success: boolean }` | Resolve a pending confirmation |
| GET | /api/confirm/:actionId | No | — | `ConfirmationRequest` | Get pending confirmation details |
| GET | /api/config | No | — | `AgentConfig` | Get current config |
| POST | /api/config | No | `Partial<AgentConfig>` | `AgentConfig` | Update config |
| POST | /api/config/test-key | No | `{ provider: string }` | `{ valid: boolean, model?: string }` | Test an API key |
| GET | /api/status | No | — | `{ status: "idle"\|"running"\|"waiting", sessionId?: string }` | Agent status |
| WebSocket | /ws | No | — | Event stream | Real-time action events |

**WebSocket Event Types (server → client):**
```typescript
type WSEvent =
  | { type: "thinking";          message: string }
  | { type: "screenshot_taken";  screenshotB64: string }
  | { type: "tool_called";       toolName: string; params: object }
  | { type: "tool_result";       toolName: string; result: string; success: boolean }
  | { type: "waiting_confirmation"; confirmationId: string; details: ConfirmationRequest }
  | { type: "confirmation_resolved"; confirmed: boolean }
  | { type: "completed";         message: string }
  | { type: "error";             message: string }
  | { type: "stopped";           reason: string }
```

---

## 9. PAGES & ROUTES

| Route | Page | Auth | Description |
|-------|------|------|-------------|
| `/` | Chat (Main) | No | Command input + action stream + screenshot panel |
| `/history` | History | No | All past sessions and action logs |
| `/history/:sessionId` | Session Detail | No | Full action log for one session |
| `/settings` | Settings | No | API keys, model, preferences |

---

## 10. UI/UX REQUIREMENTS

### 10.1 Design Principles
- **Dark mode first** — the app will be used alongside other dark-themed dev tools (VS Code, terminal)
- **Information dense but not cluttered** — show the action stream without overwhelming; collapse verbose outputs
- **Zero ambiguity on dangerous actions** — confirmation dialogs must be impossible to accidentally dismiss
- **Always show what's happening** — no silent background processing; every LLM call and tool execution is visible
- **Keyboard-first** — all primary actions reachable without mouse (Enter to send, Esc to stop, Tab to navigate)

### 10.2 Color & Theme
- **Primary Action:** `#7C3AED` (violet-600) — buttons, active states
- **Danger:** `#DC2626` (red-600) — delete/destructive confirmations
- **Warning:** `#D97706` (amber-600) — confirmation prompts for risky actions
- **Success:** `#16A34A` (green-600) — completed actions
- **Background:** `#0F172A` (slate-900) — main background
- **Surface:** `#1E293B` (slate-800) — cards, panels
- **Border:** `#334155` (slate-700) — dividers
- **Text Primary:** `#F1F5F9` (slate-100)
- **Text Secondary:** `#94A3B8` (slate-400)
- **Typography:** Inter (UI) + JetBrains Mono (code/terminal output)
- **Component Library:** shadcn/ui on Tailwind CSS v3

### 10.3 Key UI Flows

**Flow 1: Completing a Safe Task**
1. User types "Find all PDF files on my Desktop and list them"
2. Input bar shows spinner; "Stop" button appears
3. Action stream shows: `📸 Taking screenshot` → `🤔 Planning...` → `🔍 Searching files with pattern *.pdf` → `✅ Found 7 files`
4. Screenshot panel updates showing desktop
5. Agent response appears in chat: "Found 7 PDF files on your Desktop: [list]"
6. Input bar re-enables

**Flow 2: Completing a Dangerous Task (Delete)**
1. User types "Delete all .tmp files in my Downloads folder"
2. Agent searches for `.tmp` files, finds 12 (total 340 MB)
3. Action stream shows `⚠️ Waiting for your confirmation`
4. Confirmation modal appears: "🗑️ DELETE FILES — 12 .tmp files (340 MB total) in C:\Users\...\Downloads. This cannot be undone." — two buttons: "Delete 12 files" (red) and "Cancel"
5. User clicks "Delete 12 files"
6. Agent deletes files, reports "Deleted 12 .tmp files, freed 340 MB"

**Flow 3: Installing Software**
1. User types "Install Discord"
2. Agent resolves package ID to `Discord.Discord` (winget)
3. Confirmation modal: "📦 INSTALL SOFTWARE — Discord.Discord via winget from official Microsoft Store. Source: winget/official." — "Install Discord" button (green) and "Cancel" (red)
4. User confirms
5. Action stream shows winget output streaming in real time
6. Agent reports "Discord installed successfully"

---

## 11. AUTHENTICATION & AUTHORIZATION

- **Auth Method:** None — this is a local desktop app running entirely on the user's machine. No login required.
- **API Key Security:** LLM API keys stored in the OS credential store (Windows Credential Manager / macOS Keychain) via the `keytar` Electron package — never in plain-text config files or environment variables accessible to other processes.
- **No Remote Access:** The FastAPI backend listens only on `127.0.0.1:7788` — it is never exposed to the network.
- **Roles:** Single user (owner of the machine). No multi-user access.

---

## 12. ERROR HANDLING & EDGE CASES

- [ ] **LLM API key missing:** On first launch with no API key configured, redirect to Settings page with a highlighted empty key field and a link to get a key. Disable command input until a valid key is set.
- [ ] **LLM API key invalid:** `test-key` endpoint returns `{ valid: false }`. Show red banner: "API key is invalid — please check your key in Settings."
- [ ] **LLM rate limit (429):** Implement exponential backoff with up to 3 retries. Show "Rate limited — retrying in X seconds..." in action stream. After 3 failures, surface error to user.
- [ ] **Agent stuck in infinite loop:** If > 50 LLM iterations without `end_turn`, automatically stop and report: "Task could not be completed in 50 steps. Please break it into smaller commands."
- [ ] **App not found (open_app):** If app executable not found, return helpful message: "I couldn't find [AppName]. It may not be installed. Say 'install [AppName]' and I'll install it for you."
- [ ] **File not found:** Return clear message with the attempted path. Suggest searching for the file.
- [ ] **Permission denied (file/system ops):** Catch `PermissionError`, report: "I don't have permission to access [path]. You may need to run this app as administrator."
- [ ] **FFmpeg not installed (media tools):** Detect missing FFmpeg before any media operation. Offer: "FFmpeg is required for media tasks. Say 'yes' to install it now via winget."
- [ ] **WebSocket disconnected:** Frontend auto-reconnects every 2 seconds with visual indicator ("Reconnecting…"). All in-progress state preserved until reconnect or page refresh.
- [ ] **Subprocess timeout:** Commands that exceed their timeout return `{ error: "Command timed out after Xs" }`. Never leave zombie processes — `subprocess.kill()` on timeout.
- [ ] **Disk full during download:** Catch `OSError: No space left` during file writes. Report remaining free space and suggest cleanup.
- [ ] **User closes app while agent is running:** Electron `before-quit` event sends SIGTERM to Python backend. Agent writes "Session interrupted" to log and terminates cleanly.
- [ ] **Confirmation dialog left open > 5 minutes:** Auto-cancel with "Confirmation timed out — action cancelled" logged.
- [ ] **Empty command submitted:** Client-side validation — trim whitespace, show inline error "Please enter a command" if empty.

---

## 13. PERFORMANCE & SECURITY REQUIREMENTS

- [ ] App cold start (Electron + Python backend) < 5 seconds on a modern machine
- [ ] WebSocket event delivery latency < 200ms from Python event emission to React render
- [ ] Screenshot capture + encode to base64 < 300ms
- [ ] Action log SQLite writes < 10ms per entry
- [ ] FastAPI backend listens on `127.0.0.1` only — never `0.0.0.0`
- [ ] All file paths resolved and validated against allowed roots before execution — no path traversal
- [ ] `shell=True` in subprocess only when pipe/redirect characters are present — never for arbitrary user-provided strings
- [ ] API keys stored in OS keychain, never written to disk in plain text
- [ ] Screenshots stored only in memory (base64 in WebSocket events) — not written to disk
- [ ] Download URLs validated against allowlist before fetch
- [ ] No telemetry, no analytics, no external network calls except to the LLM API and explicitly user-commanded URLs
- [ ] All npm and pip dependencies pinned to exact versions in `package-lock.json` and `requirements.txt`

---

## 14. OUT OF SCOPE (v1.0)

- **Multi-user access / remote control** — single local user only; no network exposure
- **Mobile support** — desktop Windows/macOS only; no mobile app
- **Voice output (TTS)** — agent responds in text only; no text-to-speech
- **Cloud sync of action logs** — all logs stay local
- **Scheduled/recurring tasks** — no cron-style automation; all tasks triggered manually
- **Plugin system / custom tools** — no user-defined tool extensions in v1.0
- **Memory across sessions** — agent starts fresh each command; no long-term user context
- **Multiple simultaneous agents** — only one command executes at a time
- **macOS / Linux installers** — v1.0 targets Windows 10/11 only (macOS and Linux in v1.1)
- **2FA / biometric bypass** — agent cannot handle 2FA prompts; user must complete these manually
- **CAPTCHA solving** — agent pauses and asks user to solve CAPTCHAs manually

---

## 15. IMPLEMENTATION ORDER

**Phase 1: Foundation (Days 1–2)**
1. Project setup: Electron + Vite + React + TypeScript scaffold
2. Python FastAPI backend with WebSocket server
3. Electron ↔ FastAPI IPC: launch Python on app start, kill on quit
4. Settings page: API key input, keytar storage, test-key endpoint
5. Basic chat UI: message list, command input, send/stop buttons

**Phase 2: Core Agent Loop (Days 3–4)**
6. Agent loop: screenshot → Claude API → tool call → execute → repeat
7. Screen tools: screenshot capture, pyautogui click/type/scroll
8. WebSocket event streaming from Python → React UI
9. Live screenshot panel in UI
10. Safety layer: confirmation system (backend pause + frontend modal)
11. Action log: SQLite writes + History page

**Phase 3: Tool Domains (Days 5–7)**
12. File tools: create, read, write, copy, move, delete, search, zip, backup
13. Browser tools: playwright navigation, download, upload, form fill
14. App tools: open/close apps, process list, APP_MAP
15. Install tools: winget/apt/brew, .exe/.msi, uninstall, update-all
16. System tools: psutil monitor, volume, temp cleanup, startup apps

**Phase 4: Advanced Tools (Days 8–10)**
17. Productivity tools: python-docx, openpyxl, email draft/send
18. Media tools: Pillow images, ffmpeg-python video, pydub audio
19. Developer tools: terminal execution, git, pip/npm, VS Code launch

**Phase 5: Polish (Days 11–12)**
20. Error handling: all edge cases from Section 12
21. Voice input: Web Speech API integration
22. History page: filtering, CSV export
23. Electron build: installer packaging with electron-builder
24. End-to-end testing: all 50 example commands from research doc

---

## 16. OPEN QUESTIONS

- [ ] ❓ **NEEDS CLARIFICATION:** Should the agent use a visible browser (headless: false) so the user can see what it's doing, or headless for speed? Recommendation: visible by default, headless as a settings toggle.
- [ ] ❓ **NEEDS CLARIFICATION:** What happens when an app requires administrator privileges to install and triggers a UAC prompt? v1.0 approach: agent detects the UAC dialog via screenshot and instructs user "Please click Yes on the UAC prompt that appeared."
- [ ] ❓ **NEEDS CLARIFICATION:** Should the agent support local models (Ollama) in v1.0? ⚠️ ASSUMPTION: Yes, as a settings option, but with a warning that local models have significantly lower accuracy on visual tasks.
- [ ] ❓ **NEEDS CLARIFICATION:** What is the maximum command length / task complexity per session? ⚠️ ASSUMPTION: 50 LLM iterations per command, ~$0.50 max cost per command at Claude Opus pricing.
- [ ] ❓ **NEEDS CLARIFICATION:** Should downloads from URLs outside the allowlist be blocked entirely or just require extra confirmation? Recommendation: extra confirmation dialog listing the domain and asking the user to add it to the allowlist.
- [ ] ❓ **NEEDS CLARIFICATION:** macOS and Linux support timeline. ⚠️ ASSUMPTION: v1.0 = Windows 10/11 only. macOS and Linux = v1.1.

---

**END OF PRD**
