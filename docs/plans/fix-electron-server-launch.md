# Fix Electron Server Launch Error

## Problem

When running `pnpm dev` in the minidesk project, the Electron app fails to launch with:

```
Error launching app
Cannot find module '/home/kyran/Sync/workspace/projects/2025/LLMs/claude_code/personal-development/projects/minidesk/dist/main/index.js'
```

**Root Cause:** Path mismatch between build output and expected entry point:
- **package.json:5** specifies `"main": "dist/main/index.js"`
- **vite-plugin-electron** outputs to `dist-electron/index.js` and `dist-electron/preload.mjs`

## Solution

Update `vite.config.ts` to configure vite-plugin-electron to output files to the correct directory structure that matches package.json expectations.

## Implementation Plan

### Step 1: Configure Vite Plugin Output Paths
Update `vite.config.ts` to add output configuration for the electron plugin:

```typescript
electron({
  main: {
    entry: 'src/main/index.ts',
    vite: {
      build: {
        outDir: 'dist/main',
        rollupOptions: {
          output: {
            entryFileNames: 'index.js'
          }
        }
      }
    }
  },
  preload: {
    input: 'src/preload/preload.ts',
    vite: {
      build: {
        outDir: 'dist/preload',
        rollupOptions: {
          output: {
            entryFileNames: 'preload.js'
          }
        }
      }
    }
  },
  renderer: {}
})
```

This will output:
- Main process: `dist/main/index.js` ✓
- Preload script: `dist/preload/preload.js` ✓

### Step 2: Update Preload Path Reference
Update `src/main/index.ts` to reference the correct preload script path. The preload path should be updated from referencing the old location to the new location at `dist/preload/preload.js`.

## Critical Files

- `/home/kyran/Sync/workspace/projects/2025/LLMs/claude_code/personal-development/projects/minidesk/vite.config.ts` - Configure output paths
- `/home/kyran/Sync/workspace/projects/2025/LLMs/claude_code/personal-development/projects/minidesk/src/main/index.ts` - Update preload path reference
- `/home/kyran/Sync/workspace/projects/2025/LLMs/claude_code/personal-development/projects/minidesk/package.json` - Entry point configuration (no changes needed)

## Verification

After implementing the fix:

1. **Clean old build artifacts:**
   ```bash
   rm -rf dist-electron dist
   ```

2. **Run development server:**
   ```bash
   pnpm dev
   ```

3. **Verify successful launch:**
   - Vite should build files to `dist/main/index.js` and `dist/preload/preload.js`
   - Electron window should open successfully
   - DevTools should be visible
   - No module resolution errors should appear

4. **Test basic functionality:**
   - Window renders correctly
   - No console errors in DevTools
   - App title shows "MiniDesk"

## Expected Outcome

The Electron app will launch successfully with `pnpm dev`, with proper file paths matching the package.json configuration. The project will be ready to proceed to Phase 1.2 implementation.
