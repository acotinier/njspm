export const ProjectType = {
  APP: 'app',
  API: 'api'
}

export const createProject = (name, description = '') => ({
  id: crypto.randomUUID(),
  name,
  description,
  createdAt: new Date().toISOString(),
  tags: [],
  isPinned: false,
  app: null,
  api: null
})

export const createProjectConfig = (type, directory, commands = []) => ({
  type,
  directory,
  commands: commands.map(cmd => ({
    id: crypto.randomUUID(),
    name: cmd.name,
    command: cmd.command,
    description: cmd.description || ''
  }))
})