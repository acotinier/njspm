import { useState, useRef } from 'react'
import { Download, Upload, Monitor, Sun, Moon } from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Text from './ui/Text'
import { useTheme } from '../contexts/ThemeContext'
import { projectStore } from '../services/projectStore'

const SettingsModal = ({ isOpen, onClose, onProjectsUpdate }) => {
  const { theme, setTheme } = useTheme()
  const [importMode, setImportMode] = useState('replace')
  const fileInputRef = useRef(null)

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  const handleExport = () => {
    const projects = projectStore.getProjects()
    const dataStr = JSON.stringify(projects, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `projects-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const handleImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedProjects = JSON.parse(e.target.result)
        
        // Validation basique du format
        if (!Array.isArray(importedProjects)) {
          alert('Format de fichier invalide. Le fichier doit contenir un tableau de projets.')
          return
        }

        // Validation de la structure des projets
        const isValidProject = (project) => {
          return project.id && project.name && project.createdAt &&
                 (project.app || project.api)
        }

        if (!importedProjects.every(isValidProject)) {
          alert('Format de projet invalide. Vérifiez la structure de vos données.')
          return
        }

        let finalProjects
        if (importMode === 'replace') {
          finalProjects = importedProjects
        } else {
          // Merge: keep existing, add new ones with new IDs to avoid conflicts
          const existingProjects = projectStore.getProjects()
          const newProjects = importedProjects.map(project => ({
            ...project,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            name: `${project.name} (Import)`
          }))
          finalProjects = [...existingProjects, ...newProjects]
        }

        projectStore.saveProjects(finalProjects)
        onProjectsUpdate()
        
        alert(`${importedProjects.length} projet(s) importé(s) avec succès !`)
        onClose()
        
      } catch (error) {
        console.error('Import error:', error)
        alert('Erreur lors de l\'import du fichier. Vérifiez le format JSON.')
      }
    }
    
    reader.readAsText(file)
    event.target.value = ''
  }

  const themeOptions = [
    { value: 'light', label: 'Clair', icon: Sun },
    { value: 'dark', label: 'Sombre', icon: Moon },
    { value: 'system', label: 'Système', icon: Monitor }
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Paramètres" size="md">
      <div className="p-6 space-y-8">
        {/* Section Thème */}
        <div>
          <Text variant="h3" className="mb-4">Apparence</Text>
          <div className="space-y-3">
            {themeOptions.map((option) => {
              const Icon = option.icon
              return (
                <label 
                  key={option.value}
                  className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={theme === option.value}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="mr-3"
                  />
                  <Icon className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
                  <Text>{option.label}</Text>
                </label>
              )
            })}
          </div>
        </div>

        {/* Section Import/Export */}
        <div>
          <Text variant="h3" className="mb-4">Données des projets</Text>
          
          {/* Export */}
          <div className="mb-6">
            <Text className="mb-2 font-medium">Export</Text>
            <Button
              variant="outline"
              onClick={handleExport}
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter tous les projets
            </Button>
          </div>

          {/* Import */}
          <div>
            <Text className="mb-2 font-medium">Import</Text>
            
            {/* Import mode selection */}
            <div className="mb-3 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={(e) => setImportMode(e.target.value)}
                  className="mr-2"
                />
                <Text size="sm">Remplacer tous les projets existants</Text>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={(e) => setImportMode(e.target.value)}
                  className="mr-2"
                />
                <Text size="sm">Ajouter aux projets existants</Text>
              </label>
            </div>

            {/* Import button */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full justify-start"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importer des projets
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </Modal>
  )
}

export default SettingsModal