const HISTORY_KEY = 'njspm-command-history'
const MAX_HISTORY_ITEMS = 100

export const commandHistory = {
  getHistory() {
    try {
      const history = localStorage.getItem(HISTORY_KEY)
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('Error loading command history:', error)
      return []
    }
  },

  addToHistory(projectName, commandName, command, workingDirectory) {
    try {
      const history = this.getHistory()
      const newEntry = {
        id: crypto.randomUUID(),
        projectName,
        commandName,
        command,
        workingDirectory,
        executedAt: new Date().toISOString()
      }

      // Add to beginning of array (most recent first)
      history.unshift(newEntry)

      // Keep only last MAX_HISTORY_ITEMS entries
      const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS)

      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory))
      return true
    } catch (error) {
      console.error('Error adding to command history:', error)
      return false
    }
  },

  clearHistory() {
    try {
      localStorage.removeItem(HISTORY_KEY)
      return true
    } catch (error) {
      console.error('Error clearing command history:', error)
      return false
    }
  },

  deleteHistoryItem(id) {
    try {
      const history = this.getHistory()
      const filteredHistory = history.filter(item => item.id !== id)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory))
      return true
    } catch (error) {
      console.error('Error deleting history item:', error)
      return false
    }
  }
}
