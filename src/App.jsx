// App.jsx

import {useState, useEffect} from 'react'
import ProjectCard from './components/ProjectCard'
import EmptyProjectCard from './components/EmptyProjectCard'
import ProjectForm from './components/ProjectForm'
import Button from './components/ui/Button'
import Text from './components/ui/Text'
import SettingsButton from './components/ui/SettingsButton'
import SettingsModal from './components/SettingsModal'
import {projectStore} from './services/projectStore'
import {X, Maximize, Minus} from 'lucide-react'

function App() {
  const [projects, setProjects] = useState([])
  const [runningCommands, setRunningCommands] = useState([])
  const [showAddProject, setShowAddProject] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    setProjects(projectStore.getProjects())
  }, [])

  const handleExecuteCommand = async (projectId, config, command) => {
    setRunningCommands(prev => [...prev, command.id])

    try {
      await window.electronAPI.executeCommand(command.command, config.directory)
    } catch (error) {
      console.error('Error executing command:', error)
    } finally {
      setRunningCommands(prev => prev.filter(id => id !== command.id))
    }
  }

  const handleDeleteProject = (projectId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      projectStore.deleteProject(projectId)
      setProjects(projectStore.getProjects())
    }
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
  }

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      projectStore.updateProject(editingProject.id, projectData)
    } else {
      projectStore.addProject(projectData)
    }

    setProjects(projectStore.getProjects())
    setShowAddProject(false)
    setEditingProject(null)
  }

  const handleCancelForm = () => {
    setShowAddProject(false)
    setEditingProject(null)
  }

  const handleDuplicateProject = (projectId) => {
    const duplicatedProject = projectStore.duplicateProject(projectId)
    if (duplicatedProject) {
      setProjects(projectStore.getProjects())
    } else {
      alert('Erreur lors de la duplication du projet')
    }
  }

  const handleProjectsUpdate = () => {
    setProjects(projectStore.getProjects())
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Fixed navbar with app drag region */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left section - Logo and title - draggable area */}
          <div className="flex items-center gap-4 flex-1" style={
            {WebkitAppRegion: 'drag'}
          }>
            <img src="./favicon.ico" alt="Logo" className="h-10 w-10 drop-shadow-lg"/>
            <div className="flex flex-col">
              <Text variant="h3"
                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Node.js PM
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                Projects Dashboard
              </Text>
            </div>
          </div>

          {/* Right section - Settings and window controls */}
          <div className="flex items-center gap-3" style={
            {WebkitAppRegion: 'no-drag'}
          }>
            <SettingsButton onClick={() => setShowSettings(true)}/>

            {/* Window controls */}
            <div className="flex items-center gap-1 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
              <button
                className="h-8 w-8 flex items-center justify-center rounded-md bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                onClick={() => window.electronAPI.minimizeWindow()}
              >
                <Minus className="h-4 w-4"/>
              </button>
              <button
                className="h-8 w-8 flex items-center justify-center rounded-md bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                onClick={() => window.electronAPI.maximizeWindow()}
              >
                <Maximize className="h-4 w-4"/>
              </button>
              <button
                className="h-8 w-8 flex items-center justify-center rounded-md bg-transparent hover:bg-red-500 text-gray-700 dark:text-gray-300 hover:text-white transition-colors"
                onClick={() => window.electronAPI.closeWindow()}
              >
                <X className="h-4 w-4"/>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content with padding-top to account for fixed navbar and padding-bottom for footer */}
      <div className="pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onExecuteCommand={handleExecuteCommand}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
                onDuplicateProject={handleDuplicateProject}
                runningCommands={runningCommands}
              />
            ))}
            <EmptyProjectCard onClick={() => setShowAddProject(true)}/>
          </div>
        </main>

        {(showAddProject || editingProject) && (
          <ProjectForm
            project={editingProject}
            onSave={handleSaveProject}
            onCancel={handleCancelForm}
          />
        )}

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onProjectsUpdate={handleProjectsUpdate}
        />
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <div className="px-6 py-2">
          <Text className="text-xs text-center text-gray-600 dark:text-gray-400">
            Made by DevCot • v1.1.2
          </Text>
        </div>
      </footer>
    </div>
  )
}

export default App