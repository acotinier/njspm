import CommandButton from './CommandButton'
import Button from './ui/Button'
import Text from './ui/Text'
import { Pencil, Copy, Trash2, Package, Star, Tag } from 'lucide-react'

const ProjectCard = ({project, onExecuteCommand, onEditProject, onDeleteProject, onDuplicateProject, onTogglePin, runningCommands = []}) => {
  const formatPath = (path) => {
    if (!path) return ''
    return path.length > 40 ? `...${path.slice(-37)}` : path
  }

  const isCommandRunning = (commandId) => {
    return runningCommands.includes(commandId)
  }

  const renderConfigSection = (config, label) => {
    if (!config) return null

    return (
      <div className="space-y-3">
        <div className="flex flex-col start-0 justify-between">
          <Text variant="h5">{label}</Text>
          <Text variant="monoSmall" className="bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
            {formatPath(config.directory)}
          </Text>
        </div>

        <div className="flex flex-wrap gap-2">
          {config.commands.map(command => (
            <CommandButton
              key={command.id}
              command={command}
              onExecute={() => onExecuteCommand(project.id, config, command)}
              isRunning={isCommandRunning(command.id)}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 hover:shadow-md transition-all duration-200 ${
        project.isPinned
          ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900'
          : 'border-gray-100 dark:border-gray-700'
      }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col start-0 justify-between space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Text variant="h3" className="truncate">{project.name}</Text>
            {project.isPinned && (
              <Star className="w-5 h-5 text-yellow-500 fill-current flex-shrink-0" />
            )}
          </div>
          {project.description && (
            <Text variant="bodySmall" className="mt-1">{project.description}</Text>
          )}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md text-xs"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-2 flex-shrink-0 ml-2">
          <Button
            variant={project.isPinned ? "primary" : "ghost"}
            size="icon"
            onClick={() => onTogglePin(project.id)}
            title={project.isPinned ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Star className={`w-5 h-5 ${project.isPinned ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditProject(project)}
            title="Modifier le projet"
          >
            <Pencil className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDuplicateProject(project.id)}
            title="Dupliquer le projet"
          >
            <Copy className="w-5 h-5" />
          </Button>
          <Button
            variant="danger"
            size="icon"
            onClick={() => onDeleteProject(project.id)}
            title="Supprimer le projet"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {renderConfigSection(project.app, 'Application')}
        {renderConfigSection(project.api, 'API')}
      </div>

      {!project.app && !project.api && (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <Text variant="bodySmall">Aucune configuration</Text>
        </div>
      )}
    </div>
  )
}

export default ProjectCard