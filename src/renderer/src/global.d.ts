/**
 * Global type definitions for window.api (exposed by preload script)
 */

interface Window {
  api: {
    document: {
      create: (req: { title: string; content?: string }) => Promise<any>;
      get: (req: { id: number }) => Promise<any>;
      getAll: () => Promise<any>;
      update: (req: {
        id: number;
        title?: string;
        content?: string;
        isShared?: boolean;
      }) => Promise<any>;
      delete: (req: { id: number }) => Promise<any>;
      getRecent: (limit?: number) => Promise<any>;
      getShared: () => Promise<any>;
      search: (req: { query: string }) => Promise<any>;
    };
    chat: {};
    file: {};
    peer: {};
  };
}
