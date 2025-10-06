const PROJECTS_KEY = 'electron-monit-projects'

export const projectStore = {
  getProjects() {
    try {
      const projects = localStorage.getItem(PROJECTS_KEY)
      return projects ? JSON.parse(projects) : []
    } catch (error) {
      console.error('Error loading projects:', error)
      return []
    }
  },

  saveProjects(projects) {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
      return true
    } catch (error) {
      console.error('Error saving projects:', error)
      return false
    }
  },

  addProject(project) {
    const projects = this.getProjects()
    projects.push(project)
    return this.saveProjects(projects)
  },

  updateProject(projectId, updatedProject) {
    const projects = this.getProjects()
    const index = projects.findIndex(p => p.id === projectId)
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updatedProject }
      return this.saveProjects(projects)
    }
    return false
  },

  deleteProject(projectId) {
    const projects = this.getProjects()
    const filteredProjects = projects.filter(p => p.id !== projectId)
    return this.saveProjects(filteredProjects)
  },

  duplicateProject(projectId) {
    const projects = this.getProjects()
    const projectToDuplicate = projects.find(p => p.id === projectId)
    
    if (!projectToDuplicate) {
      return false
    }

    const duplicatedProject = {
      ...projectToDuplicate,
      id: crypto.randomUUID(),
      name: `${projectToDuplicate.name} (Copie)`,
      createdAt: new Date().toISOString(),
      app: projectToDuplicate.app ? {
        ...projectToDuplicate.app,
        commands: projectToDuplicate.app.commands.map(cmd => ({
          ...cmd,
          id: crypto.randomUUID()
        }))
      } : null,
      api: projectToDuplicate.api ? {
        ...projectToDuplicate.api,
        commands: projectToDuplicate.api.commands.map(cmd => ({
          ...cmd,
          id: crypto.randomUUID()
        }))
      } : null
    }

    projects.push(duplicatedProject)
    return this.saveProjects(projects) ? duplicatedProject : false
  }
}