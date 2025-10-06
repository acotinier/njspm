# Node.JS Project Manager (n.js-pm)

> A modern desktop application for managing and executing commands across multiple Node.js projects with ease.

<img width="1425" height="802" alt="Main application window showing the project dashboard with multiple project cards" src="https://github.com/user-attachments/assets/b646a677-964c-4178-9b6e-0073a5ee93a4" />


## Overview

**n.js-pm** is an Electron-based desktop application that helps developers manage their Node.js projects efficiently. Instead of juggling multiple terminal windows and remembering different commands for each project, n.js-pm provides a centralized dashboard where you can organize, configure, and execute commands with a single click.

## Features

- **📁 Multi-Project Management** - Organize multiple Node.js projects in one dashboard
- **⚡ Quick Command Execution** - Execute project commands with a single click
- **🔧 Dual Configuration** - Separate configurations for app and API projects
- **🎨 Modern UI** - Clean interface built with React and Tailwind CSS
- **🌓 Theme Support** - Light, dark, and system theme modes
- **💾 Import/Export** - Backup and restore your project configurations
- **🖥️ Cross-Platform** - Works on Windows, macOS, and Linux

<img width="675" height="654" alt="Project configuration modal showing directory selection and command setup" src="https://github.com/user-attachments/assets/6bcf5115-0034-4711-b20a-729b7c1af777" />

## Installation

### Download Pre-built Binaries

Download the latest release for your platform:
- **Windows**: `n.js-pm-Setup-x.x.x.exe` (NSIS installer)
- **macOS**: `n.js-pm-x.x.x.dmg`
- **Linux**: `n.js-pm-x.x.x.AppImage`

### Build from Source

Requirements:
- Node.js (v16 or higher)
- pnpm (v10.12.2 or higher)

```bash
# Clone the repository
git clone https://github.com/acotinier/njspm.git
cd njspm

# Install dependencies
pnpm install

# Run in development mode
pnpm run dev

# Build for production
pnpm run build:electron
```

The built application will be in the `dist-electron/` directory.

## Usage

### Adding a Project

1. Click the **"Add project"** card
2. Enter a project name
3. Configure your **App** and/or **API** settings:
   - Click **"Select Directory"** to choose the project folder
   - Add commands with name, command, and optional description
4. Click **"Save Project"**

### Executing Commands

Simply click any command button on a project card. The command will execute in a new terminal window in the project's directory.

<img width="1430" height="801" alt="Multiple terminal windows opened from executing commands" src="https://github.com/user-attachments/assets/7d51a967-aed1-4f34-b832-191db25be658" />


### Managing Projects

Each project card provides quick actions:
- **✏️ Edit** - Modify project configuration
- **📋 Duplicate** - Create a copy of the project
- **🗑️ Delete** - Remove the project (with confirmation)

### Settings

Access settings via the gear icon in the top-right corner:
- **Theme Selection** - Choose between light, dark, or system theme
- **Import Projects** - Load projects from a JSON file
- **Export Projects** - Save all projects to a JSON file

<img width="518" height="745" alt="Settings modal showing theme options and import/export buttons" src="https://github.com/user-attachments/assets/eca728a1-1531-4df1-a14b-7533bea013b3" />


## Project Structure

```
electron-monit/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectForm.jsx
│   │   └── SettingsModal.jsx
│   ├── contexts/        # React contexts (Theme)
│   ├── services/        # Data layer (localStorage)
│   ├── types/           # Type factories and models
│   ├── App.jsx          # Main application component
│   └── main.jsx         # React entry point
├── electron.js          # Electron main process
├── preload.cjs          # Preload script (IPC bridge)
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies and electron-builder config
```

## Technology Stack

- **Electron** - Desktop application framework
- **React** - UI library (lucide-react)
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **pnpm** - Fast, disk space efficient package manager

## Development

### Available Scripts

```bash
# Start development mode (Vite + Electron)
pnpm run dev

# Start only Vite dev server
pnpm run dev:vite

# Start only Electron
pnpm run dev:electron

# Build React app
pnpm run build

# Build complete Electron app
pnpm run build:electron

# Preview production build
pnpm run preview
```

### IPC Communication

The app uses Electron's IPC (Inter-Process Communication) for secure communication between the renderer and main process:

- `select-directory` - Opens native directory picker
- `execute-command` - Spawns terminal with command
- `minimize-window`, `maximize-window`, `close-window` - Window controls

### Data Persistence

Projects are stored in `localStorage` under the key `electron-monit-projects`. The data structure includes:
- Project name
- App configuration (directory + commands)
- API configuration (directory + commands)

## Security

The application follows Electron security best practices:
- Context isolation enabled
- Node integration disabled in renderer
- Remote module disabled
- Preload script for controlled IPC exposure

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI powered by [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/acotinier/njspm/issues) on GitHub.

---

Made with ❤️ by developers, for developers
