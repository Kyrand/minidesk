# MiniDesk

Lightweight P2P collaboration suite with markdown editor, file sharing, and chat.

## Features

- **Markdown Editor**: Solid editor with drag-drop image support and live preview (Milkdown)
- **File Navigator**: Private and shared document management
- **P2P Chat**: Real-time messaging over WebRTC
- **File Sharing**: Drag-and-drop file sharing between peers
- **End-to-End Encrypted**: Privacy-first approach (Phase 2)
- **Cross-Platform**: Windows, macOS, Linux support

## Tech Stack

- **Electron 28+**: Cross-platform desktop app
- **Svelte 5**: Modern reactive UI with runes
- **Vite**: Fast build tool
- **TypeScript**: Type-safe development
- **Tailwind CSS + DaisyUI**: Styling
- **SQLite**: Local data persistence
- **WebRTC**: P2P communication
- **Milkdown**: Markdown editor

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui
```

### Project Structure

```
minidesk/
├── src/
│   ├── main/              # Electron main process
│   ├── preload/           # Preload script (IPC bridge)
│   ├── renderer/          # Svelte UI
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   │   ├── stores/
│   │   │   │   └── types/
│   │   │   └── utils/
│   └── test/              # Test setup
├── signaling-server/      # WebRTC signaling server
└── plans/                 # Planning documents
```

## Roadmap

### Phase 1: MVP (Current)
- [x] Phase 1.1: Project Setup
- [ ] Phase 1.2: Database Layer
- [ ] Phase 1.3: UI Foundation
- [ ] Phase 1.4: Markdown Editor
- [ ] Phase 1.5: Chat UI
- [ ] Phase 1.6: Signaling Server
- [ ] Phase 1.7: WebRTC P2P Networking
- [ ] Phase 1.8: File Sharing
- [ ] Phase 1.9: Integration & Testing
- [ ] Phase 1.10: Build & Package

### Phase 2: Enhanced Features
- End-to-End Encryption
- Collaborative Editing (CRDT with Yjs)
- Enhanced File Sharing
- Improved Presence

### Phase 3: Video Integration
- Jitsi Video Integration

## License

MIT
