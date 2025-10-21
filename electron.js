// electron.js

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const createWindow = () => {
  const iconPath = path.join(__dirname, 'icon.ico')

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: true
    }
  })

  const isDev = process.env.NODE_ENV === 'development'
  
  if (isDev) {
    win.loadURL('http://localhost:5173').then(r => r)
  } else {
    win.loadFile('dist/index.html').then(r => r)
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ==========================================
// IPC HANDLERS
// ==========================================

// Window Management Handlers
ipcMain.handle('minimize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window) window.minimize()
})

ipcMain.handle('maximize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window) {
    window.isMaximized() ? window.unmaximize() : window.maximize()
  }
})

ipcMain.handle('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window) window.close()
})

// File System Handlers
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return result.canceled ? null : result.filePaths[0]
})

// Command Execution Handler
ipcMain.handle('execute-command', async (event, command, workingDirectory) => {
  try {
    const isWindows = process.platform === 'win32'

    if (isWindows) {
      const batchContent = `@echo off
cd /d "${workingDirectory}"
${command}
pause`
      const uniqueId = Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      const tempBatFile = path.join(os.tmpdir(), `njspm_command_${uniqueId}.bat`)
      fs.writeFileSync(tempBatFile, batchContent)

      const terminal = spawn('cmd', ['/c', 'start', 'cmd', '/k', tempBatFile], {
        detached: true,
        stdio: 'ignore'
      })
      terminal.unref()

      setTimeout(() => {
        try {
          fs.unlinkSync(tempBatFile)
        } catch (e) {
          // Silently fail - temp file cleanup is not critical
        }
      }, 10000)

      return { success: true, message: 'Terminal ouvert avec succès' }
    } else {
      const isMac = process.platform === 'darwin'

      if (isMac) {
        spawn('osascript', [
          '-e',
          `tell application "Terminal" to do script "cd '${workingDirectory}' && ${command}"`
        ], {
          detached: true,
          stdio: 'ignore'
        })
      } else {
        spawn('gnome-terminal', ['--', 'bash', '-c', `cd '${workingDirectory}' && ${command}; exec bash`], {
          detached: true,
          stdio: 'ignore'
        })
      }

      return { success: true, message: 'Terminal ouvert avec succès' }
    }
  } catch (error) {
    console.error('Error executing command:', error)
    return { success: false, error: error.message }
  }
})