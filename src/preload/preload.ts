import { contextBridge } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // Document API
  document: {
    // Placeholder methods - will be implemented in Phase 1.2
  },
  // Chat API
  chat: {
    // Placeholder methods - will be implemented in Phase 1.5
  },
  // File API
  file: {
    // Placeholder methods - will be implemented in Phase 1.8
  },
  // Peer API
  peer: {
    // Placeholder methods - will be implemented in Phase 1.7
  },
});
