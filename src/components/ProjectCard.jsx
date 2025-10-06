import CommandButton from './CommandButton'
import Button from './ui/Button'
import Text from './ui/Text'

const ProjectCard = ({project, onExecuteCommand, onEditProject, onDeleteProject, onDuplicateProject, runningCommands = []}) => {
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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col start-0 justify-between space-y-1.5">
          <Text variant="h3">{project.name}</Text>
          {project.description && (
            <Text variant="bodySmall" className="mt-1">{project.description}</Text>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditProject(project)}
            title="Modifier le projet"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDuplicateProject(project.id)}
            title="Dupliquer le projet"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </Button>
          <Button
            variant="danger"
            size="icon"
            onClick={() => onDeleteProject(project.id)}
            title="Supprimer le projet"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {renderConfigSection(project.app, 'Application')}
        {renderConfigSection(project.api, 'API')}
      </div>

      {!project.app && !project.api && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <Text variant="bodySmall">Aucune configuration</Text>
        </div>
      )}
    </div>
  )
}

export default ProjectCard