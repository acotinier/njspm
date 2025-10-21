import {useState} from 'react'
import Button from './ui/Button'
import Text from './ui/Text'
import {createProject, createProjectConfig} from '../types/project'
import { Trash2, X, Plus } from 'lucide-react'

const ProjectForm = ({project, onSave, onCancel}) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    tags: project?.tags || [],
    isPinned: project?.isPinned || false,
    app: project?.app || {
      "type": "app",
      "directory": "",
      "commands": [
        {
          "name": "",
          "command": "",
          "description": ""
        }
      ]
    },
    api: project?.api || {
      "type": "api",
      "directory": "",
      "commands": [
        {
          "name": "",
          "command": "",
          "description": ""
        }
      ]
    }
  })

  const [activeTab, setActiveTab] = useState('general')
  const [newTag, setNewTag] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('Le nom du projet est requis')
      return
    }

    const projectData = project
      ? {...project, ...formData}
      : createProject(formData.name, formData.description)

    if (formData.app) projectData.app = formData.app
    if (formData.api) projectData.api = formData.api

    onSave(projectData)
  }

  const handleConfigChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }))
  }

  const addCommand = (type) => {
    const newCommand = {
      id: crypto.randomUUID(),
      name: '',
      command: '',
      description: ''
    }

    setFormData(prev => {
      const config = prev[type] || createProjectConfig(type, '', [])
      return {
        ...prev,
        [type]: {
          ...config,
          commands: [...config.commands, newCommand]
        }
      }
    })
  }

  const updateCommand = (type, commandId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        commands: prev[type].commands.map(cmd =>
          cmd.id === commandId ? {...cmd, [field]: value} : cmd
        )
      }
    }))
  }

  const removeCommand = (type, commandId) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        commands: prev[type].commands.filter(cmd => cmd.id !== commandId)
      }
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const removeConfig = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: null
    }))
  }

  const selectDirectory = async (type) => {
    try {
      if (!window.electronAPI) {
        alert('La sélection de répertoire n\'est disponible qu\'en mode Electron')
        return
      }

      const directory = await window.electronAPI.selectDirectory()
      if (directory) {
        handleConfigChange(type, 'directory', directory)
      }
    } catch (error) {
      console.error('Error selecting directory:', error)
      alert('Erreur lors de la sélection du répertoire')
    }
  }

  const renderConfigTab = (type, label) => {
    const config = formData[type]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Text variant="h3">Configuration {label}</Text>
          {config ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => removeConfig(type)}
            >
              Supprimer la configuration
            </Button>
          ) : (
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setFormData(prev => ({
                ...prev,
                [type]: createProjectConfig(type, '', [])
              }))}
            >
              Ajouter une configuration
            </Button>
          )}
        </div>

        {config && (
          <div className="space-y-4">
            <div>
              <Text variant="label" as="label" className="block mb-2">
                Répertoire
              </Text>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={config.directory || ''}
                  onChange={(e) => handleConfigChange(type, 'directory', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  placeholder="/path/to/project"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => selectDirectory(type)}
                >
                  Parcourir
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Text variant="label" as="label" className="block">
                  Commandes
                </Text>
              </div>

              <div className="space-y-3">
                {config.commands.map((command) => (
                  <div key={command.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <input
                        type="text"
                        value={command.name}
                        onChange={(e) => updateCommand(type, command.id, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base mr-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                        placeholder="Nom de la commande"
                      />
                      <Button
                        type="button"
                        variant="danger"
                        size="icon"
                        onClick={() => removeCommand(type, command.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                    <input
                      type="text"
                      value={command.command}
                      onChange={(e) => updateCommand(type, command.id, 'command', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base font-mono mb-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                      placeholder="pnpm run dev"
                    />
                    <input
                      type="text"
                      value={command.description}
                      onChange={(e) => updateCommand(type, command.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                      placeholder="Description (optionnel)"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => addCommand(type)}
                  className="w-full"
                >
                  + Ajouter une commande
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Text variant="h2">
            {project ? 'Modifier le projet' : 'Nouveau projet'}
          </Text>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {[
                  {id: 'general', label: 'Général'},
                  {id: 'app', label: 'Application'},
                  {id: 'api', label: 'API'}
                ].map(tab => (
                  <Button
                    key={tab.id}
                    type="button"
                    variant="tab"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 text-sm font-medium border-b-2 rounded-none ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent'
                    }`}
                  >
                    {tab.label}
                  </Button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <Text variant="label" as="label" className="block mb-2">
                      Nom du projet *
                    </Text>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Mon Super Projet"
                      required
                    />
                  </div>

                  <div>
                    <Text variant="label" as="label" className="block mb-2">
                      Description
                    </Text>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Une description de votre projet..."
                    />
                  </div>

                  <div>
                    <Text variant="label" as="label" className="block mb-2">
                      Tags
                    </Text>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleTagKeyPress}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="Ajouter un tag..."
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={addTag}
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter
                        </Button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md text-sm"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-blue-900 dark:hover:text-blue-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'app' && renderConfigTab('app', 'Application')}
              {activeTab === 'api' && renderConfigTab('api', 'API')}
            </div>
          </div>

          <div
            className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 flex-shrink-0">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Annuler
            </Button>
            <Button
              type="submit"
            >
              {project ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectForm