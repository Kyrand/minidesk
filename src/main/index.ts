import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseService } from './database/connection.js';
import { DocumentService } from './database/services/documentService.js';
import { registerDocumentHandlers } from './ipc/documentHandlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // In development, load from Vite dev server
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    // Initialize database
    const dbPath = path.join(app.getPath('userData'), 'minidesk.db');
    console.log(`Database path: ${dbPath}`);

    const dbService = DatabaseService.getInstance(dbPath);
    dbService.initialize();

    // Initialize document service and register IPC handlers
    const documentService = new DocumentService(dbService.getConnection());
    registerDocumentHandlers(documentService);

    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
      if ('cause' in error) {
        console.error('Caused by:', error.cause);
      }
    }
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('quit', () => {
  // Close database connection gracefully on quit
  DatabaseService.getInstance().close();
});
