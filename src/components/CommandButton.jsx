import { useState } from 'react'
import Button from './ui/Button'
import Text from './ui/Text'

const CommandButton = ({ command, onExecute, isRunning = false }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (!isRunning) {
      onExecute(command)
    }
  }

  return (
    <div className="relative">
      <Button
        variant={isRunning ? "secondary" : "secondary"}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isRunning}
        className={`
          ${isRunning 
            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50' 
            : 'hover:shadow-md'
          }
        `}
      >
        <div className="flex items-center space-x-2">
          {isRunning && (
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          )}
          <Text variant="mono">{command.command}</Text>
        </div>
      </Button>
      
      {isHovered && !isRunning && command.description && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
          {command.description}
        </div>
      )}
    </div>
  )
}

export default CommandButton