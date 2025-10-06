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
  console.log('Trying to use icon at:', iconPath)

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
  
  console.log('BrowserWindow created with icon')

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

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  
  if (result.canceled) {
    return null
  }
  
  return result.filePaths[0]
})

ipcMain.handle('execute-command', async (event, command, workingDirectory) => {
  console.log('Executing command:', command)
  console.log('Working directory:', workingDirectory)
  
  try {
    const isWindows = process.platform === 'win32'

    if (isWindows) {
      // Utiliser le dossier temporaire système
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

      // Nettoyage du fichier temporaire après 10 secondes (plus de temps pour éviter les conflits)
      setTimeout(() => {
        try {
          fs.unlinkSync(tempBatFile)
        } catch (e) {
          console.log('Could not delete temp file:', tempBatFile, e.message)
        }
      }, 10000)

      return { success: true, message: 'Terminal ouvert avec succès' }
    } else {
      // Pour macOS/Linux
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
        // Linux
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

// ADD these new IPC handlers
ipcMain.handle('minimize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window) {
    window.minimize()
  }
})

ipcMain.handle('maximize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window) {
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  }
})

ipcMain.handle('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window) {
    window.close()
  }
})