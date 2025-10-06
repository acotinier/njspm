import { Settings } from 'lucide-react'
import Button from './Button'

const SettingsButton = ({ onClick }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      title="Paramètres"
    >
      <Settings className="w-5 h-5" />
    </Button>
  )
}

export default SettingsButton