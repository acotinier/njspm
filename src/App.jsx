// App.jsx

import {useState, useEffect, useMemo} from 'react'
import ProjectCard from './components/ProjectCard'
import EmptyProjectCard from './components/EmptyProjectCard'
import ProjectForm from './components/ProjectForm'
import SearchAndFilters from './components/SearchAndFilters'
import CommandHistoryModal from './components/CommandHistoryModal'
import Button from './components/ui/Button'
import Text from './components/ui/Text'
import SettingsButton from './components/ui/SettingsButton'
import SettingsModal from './components/SettingsModal'
import {projectStore} from './services/projectStore'
import {commandHistory} from './services/commandHistory'
import {X, Maximize, Minus, Clock} from 'lucide-react'

function App() {
  const [projects, setProjects] = useState([])
  const [runningCommands, setRunningCommands] = useState([])
  const [showAddProject, setShowAddProject] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ showPinnedOnly: false, tags: [] })

  useEffect(() => {
    setProjects(projectStore.getProjects())
  }, [])

  const handleExecuteCommand = async (projectId, config, command) => {
    setRunningCommands(prev => [...prev, command.id])

    // Find project name for history
    const project = projects.find(p => p.id === projectId)
    const projectName = project?.name || 'Unknown Project'

    try {
      await window.electronAPI.executeCommand(command.command, config.directory)

      // Add to history
      commandHistory.addToHistory(
        projectName,
        command.name,
        command.command,
        config.directory
      )
    } catch (error) {
      console.error('Error executing command:', error)
    } finally {
      setRunningCommands(prev => prev.filter(id => id !== command.id))
    }
  }

  const handleExecuteFromHistory = async (command, workingDirectory) => {
    try {
      await window.electronAPI.executeCommand(command, workingDirectory)
    } catch (error) {
      console.error('Error executing command from history:', error)
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

  const handleTogglePin = (projectId) => {
    projectStore.togglePin(projectId)
    setProjects(projectStore.getProjects())
  }

  // Get all unique tags from all projects
  const availableTags = useMemo(() => {
    const tagsSet = new Set()
    projects.forEach(project => {
      if (project.tags) {
        project.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    return Array.from(tagsSet).sort()
  }, [projects])

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let result = [...projects]

    // Apply pinned filter
    if (filters.showPinnedOnly) {
      result = result.filter(p => p.isPinned)
    }

    // Apply tag filter
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(p =>
        p.tags && filters.tags.some(tag => p.tags.includes(tag))
      )
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    }

    // Sort: pinned first, then by creation date
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return result
  }, [projects, filters, searchQuery])


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

          {/* Right section - History, Settings and window controls */}
          <div className="flex items-center gap-3" style={
            {WebkitAppRegion: 'no-drag'}
          }>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistory(true)}
              title="Historique des commandes"
            >
              <Clock className="w-5 h-5" />
            </Button>
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

        {/* Search and Filters */}
        <SearchAndFilters
          onSearchChange={setSearchQuery}
          onFilterChange={setFilters}
          availableTags={availableTags}
          activeFilters={filters}
        />

        <main>
          {filteredProjects.length === 0 && projects.length > 0 ? (
            <div className="text-center py-12">
              <Text variant="h3" className="mb-2">Aucun projet trouvé</Text>
              <Text variant="bodySmall" className="text-gray-500 dark:text-gray-400">
                Essayez de modifier vos critères de recherche ou filtres
              </Text>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onExecuteCommand={handleExecuteCommand}
                  onEditProject={handleEditProject}
                  onDeleteProject={handleDeleteProject}
                  onDuplicateProject={handleDuplicateProject}
                  onTogglePin={handleTogglePin}
                  runningCommands={runningCommands}
                />
              ))}
              <EmptyProjectCard onClick={() => setShowAddProject(true)}/>
            </div>
          )}
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

        <CommandHistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onExecuteCommand={handleExecuteFromHistory}
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