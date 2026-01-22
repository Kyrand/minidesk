import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // Document API
  document: {
    create: (req: { title: string; content?: string }) =>
      ipcRenderer.invoke('document:create', req),
    get: (req: { id: number }) =>
      ipcRenderer.invoke('document:get', req),
    getAll: () =>
      ipcRenderer.invoke('document:getAll'),
    update: (req: { id: number; title?: string; content?: string; isShared?: boolean }) =>
      ipcRenderer.invoke('document:update', req),
    delete: (req: { id: number }) =>
      ipcRenderer.invoke('document:delete', req),
    getRecent: (limit?: number) =>
      ipcRenderer.invoke('document:getRecent', limit),
    getShared: () =>
      ipcRenderer.invoke('document:getShared'),
    search: (req: { query: string }) =>
      ipcRenderer.invoke('document:search', req),
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
