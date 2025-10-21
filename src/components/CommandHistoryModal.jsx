import { useState, useEffect } from 'react'
import { X, Trash2, Clock, Play, Terminal } from 'lucide-react'
import Button from './ui/Button'
import Text from './ui/Text'
import Modal from './ui/Modal'
import { commandHistory } from '../services/commandHistory'

const CommandHistoryModal = ({ isOpen, onClose, onExecuteCommand }) => {
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (isOpen) {
      loadHistory()
    }
  }, [isOpen])

  const loadHistory = () => {
    setHistory(commandHistory.getHistory())
  }

  const handleClearHistory = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
      commandHistory.clearHistory()
      loadHistory()
    }
  }

  const handleDeleteItem = (id) => {
    commandHistory.deleteHistoryItem(id)
    loadHistory()
  }

  const handleReExecute = (item) => {
    if (onExecuteCommand) {
      onExecuteCommand(item.command, item.workingDirectory)
    }
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <Text variant="h2">Historique des commandes</Text>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <Terminal className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <Text variant="bodySmall" className="text-gray-500 dark:text-gray-400">
              Aucune commande dans l'historique
            </Text>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Text variant="h5" className="truncate">
                        {item.projectName}
                      </Text>
                      <Text variant="bodySmall" className="text-gray-500 dark:text-gray-400">
                        • {item.commandName}
                      </Text>
                    </div>
                    <Text variant="monoSmall" className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded mb-2 block">
                      {item.command}
                    </Text>
                    <Text variant="bodySmall" className="text-gray-500 dark:text-gray-400 truncate">
                      {item.workingDirectory}
                    </Text>
                    <Text variant="bodySmall" className="text-gray-400 dark:text-gray-500 mt-1">
                      {formatDate(item.executedAt)}
                    </Text>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleReExecute(item)}
                      title="Ré-exécuter"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <Button
          variant="danger"
          onClick={handleClearHistory}
          disabled={history.length === 0}
        >
          Effacer tout l'historique
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </Modal>
  )
}

export default CommandHistoryModal
