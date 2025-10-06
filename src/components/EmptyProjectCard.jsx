import Text from './ui/Text'

const EmptyProjectCard = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-transparent rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-solid hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 cursor-pointer min-h-[200px] flex items-center justify-center"
    >
      <div className="text-center">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
        </svg>
        <Text variant="bodySmall" className="text-gray-500 dark:text-gray-400">
          Nouveau projet
        </Text>
      </div>
    </div>
  )
}

export default EmptyProjectCard