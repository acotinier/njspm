import Text from './ui/Text'
import { Plus } from 'lucide-react'

const EmptyProjectCard = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-transparent rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-solid hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 cursor-pointer min-h-[200px] flex items-center justify-center"
    >
      <div className="text-center">
        <Plus className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
        <Text variant="bodySmall" className="text-gray-500 dark:text-gray-400">
          Nouveau projet
        </Text>
      </div>
    </div>
  )
}

export default EmptyProjectCard