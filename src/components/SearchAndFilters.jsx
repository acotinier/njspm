import { useState } from 'react'
import { Search, X, Filter, Star, Tag } from 'lucide-react'
import Button from './ui/Button'
import Text from './ui/Text'

const SearchAndFilters = ({ onSearchChange, onFilterChange, availableTags, activeFilters }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
    onSearchChange(value)
  }

  const clearSearch = () => {
    setSearchValue('')
    onSearchChange('')
  }

  const togglePinnedFilter = () => {
    onFilterChange({
      ...activeFilters,
      showPinnedOnly: !activeFilters.showPinnedOnly
    })
  }

  const toggleTag = (tag) => {
    const currentTags = activeFilters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]

    onFilterChange({
      ...activeFilters,
      tags: newTags
    })
  }

  const clearAllFilters = () => {
    onFilterChange({ showPinnedOnly: false, tags: [] })
  }

  const hasActiveFilters = activeFilters.showPinnedOnly || (activeFilters.tags && activeFilters.tags.length > 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Rechercher un projet par nom ou description..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <Button
          variant={showFilters ? "primary" : "secondary"}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtres
          {hasActiveFilters && (
            <span className="ml-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {(activeFilters.showPinnedOnly ? 1 : 0) + (activeFilters.tags?.length || 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Pinned Filter */}
          <div>
            <Text variant="label" className="block mb-2">Affichage</Text>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilters.showPinnedOnly ? "primary" : "secondary"}
                size="sm"
                onClick={togglePinnedFilter}
                className="flex items-center gap-2"
              >
                <Star className={`w-4 h-4 ${activeFilters.showPinnedOnly ? 'fill-current' : ''}`} />
                Favoris uniquement
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div>
              <Text variant="label" className="block mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Filtrer par tags
              </Text>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <Button
                    key={tag}
                    variant={activeFilters.tags?.includes(tag) ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="link"
                size="sm"
                onClick={clearAllFilters}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchAndFilters
