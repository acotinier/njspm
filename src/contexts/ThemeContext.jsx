import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system')
  const [systemTheme, setSystemTheme] = useState('light')

  // Détecter le thème système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateSystemTheme = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    // Listen for changes
    mediaQuery.addEventListener('change', updateSystemTheme)

    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme)
    }
  }, [])

  // Charger le thème depuis localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('electron-monit-theme')
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  // Appliquer le thème au document
  useEffect(() => {
    const effectiveTheme = theme === 'system' ? systemTheme : theme
    
    console.log('Applying theme:', theme, 'effective:', effectiveTheme)
    
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    localStorage.setItem('electron-monit-theme', theme)
  }, [theme, systemTheme])

  const setThemeMode = (newTheme) => {
    console.log('Changing theme to:', newTheme)
    setTheme(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setThemeMode(newTheme)
  }

  const effectiveTheme = theme === 'system' ? systemTheme : theme

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      effectiveTheme,
      systemTheme,
      setTheme: setThemeMode, 
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}