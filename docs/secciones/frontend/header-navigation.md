# Header Navigation - Módulo de Navegación del Header

[El módulo Header Navigation implementa un sistema de navegación completo y responsivo que incluye menú principal, búsqueda global, navegación por usuario, carrito de comparación y notificaciones, con un diseño moderno y accesible.]

## 📁 Estructura del Módulo

`
modules/header-navigation/
├── components/
│   ├── HeaderNavigation.tsx    # Componente principal
│   ├── MainMenu.tsx           # Menú principal
│   ├── UserMenu.tsx           # Menú de usuario
│   ├── SearchBar.tsx          # Barra de búsqueda
│   ├── ComparisonCartButton.tsx # Botón del carrito
│   ├── NotificationsBell.tsx  # Campana de notificaciones
│   ├── MobileMenu.tsx         # Menú móvil
│   ├── Breadcrumbs.tsx        # Migas de pan
│   └── LanguageSelector.tsx   # Selector de idioma
├── hooks/
│   ├── useHeaderNavigation.ts # Hook principal
│   ├── useSearch.ts           # Hook de búsqueda
│   ├── useNotifications.ts    # Hook de notificaciones
│   └── useMobileMenu.ts       # Hook de menú móvil
├── styles/
│   ├── header.module.css      # Estilos principales
│   ├── menu.css               # Estilos de menús
│   ├── search.css             # Estilos de búsqueda
│   ├── mobile.css             # Estilos móviles
│   └── animations.css         # Animaciones
├── types/
│   ├── navigation.ts          # Tipos de navegación
│   ├── search.ts              # Tipos de búsqueda
│   └── notifications.ts       # Tipos de notificaciones
├── utils/
│   ├── navigationConfig.ts    # Configuración
│   ├── searchHelpers.ts       # Helpers de búsqueda
│   ├── menuHelpers.ts         # Helpers de menú
│   └── responsiveHelpers.ts   # Helpers responsivos
├── index.ts                   # Export principal
└── README.md                  # Documentación
`

## 🎯 Funcionalidades

- **Navegación Principal**: Menú jerárquico con categorías
- **Búsqueda Global**: Búsqueda inteligente con autocompletado
- **Menú de Usuario**: Gestión de cuenta y preferencias
- **Carrito de Comparación**: Acceso rápido al carrito
- **Notificaciones**: Sistema de notificaciones en tiempo real
- **Navegación Móvil**: Menú adaptativo para móviles
- **Migas de Pan**: Navegación contextual
- **Selector de Idioma**: Soporte multiidioma

## 🛠 Tecnologías Utilizadas

- **React**: Componentes con estado complejo
- **TypeScript**: Tipado fuerte para navegación
- **Tailwind CSS**: Estilos responsivos
- **Framer Motion**: Animaciones fluidas
- **React Context**: Estado global de navegación
- **React Router**: Navegación SPA
- **Headless UI**: Componentes accesibles

## 📋 Componentes Principales

### HeaderNavigation (Componente Principal)

`	ypescript
// modules/header-navigation/components/HeaderNavigation.tsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHeaderNavigation } from '../hooks/useHeaderNavigation'
import MainMenu from './MainMenu'
import UserMenu from './UserMenu'
import SearchBar from './SearchBar'
import ComparisonCartButton from './ComparisonCartButton'
import NotificationsBell from './NotificationsBell'
import MobileMenu from './MobileMenu'
import Breadcrumbs from './Breadcrumbs'
import LanguageSelector from './LanguageSelector'
import styles from '../styles/header.module.css'

interface HeaderNavigationProps {
  user?: User
  cartItemsCount?: number
  notificationsCount?: number
  currentPath?: string
  onSearch?: (query: string) => void
  onCartClick?: () => void
  onLogin?: () => void
  onLogout?: () => void
  className?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isPremium: boolean
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  user,
  cartItemsCount = 0,
  notificationsCount = 0,
  currentPath = '/',
  onSearch,
  onCartClick,
  onLogin,
  onLogout,
  className = ''
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const {
    navigationItems,
    searchSuggestions,
    notifications,
    handleSearch,
    handleNavigation,
    markNotificationAsRead,
    clearNotifications
  } = useHeaderNavigation()

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        className={${styles.header}  }
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.headerContainer}>
          {/* Logo y navegación principal */}
          <div className={styles.headerLeft}>
            <motion.div
              className={styles.logo}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className={styles.logoLink}>
                <img src="/logo.svg" alt="Caminando Online" className={styles.logoImage} />
                <span className={styles.logoText}>Caminando Online</span>
              </Link>
            </motion.div>

            <div className={styles.desktopNav}>
              <MainMenu
                items={navigationItems}
                onNavigate={handleNavigation}
              />
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className={styles.headerCenter}>
            <SearchBar
              onSearch={handleSearch}
              suggestions={searchSuggestions}
              placeholder="Buscar productos, supermercados..."
              onSuggestionClick={(suggestion) => {
                handleSearch(suggestion)
                onSearch?.(suggestion)
              }}
            />
          </div>

          {/* Acciones del usuario */}
          <div className={styles.headerRight}>
            <LanguageSelector />

            <NotificationsBell
              count={notificationsCount}
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onClearAll={clearNotifications}
            />

            <ComparisonCartButton
              itemCount={cartItemsCount}
              onClick={onCartClick}
            />

            {user ? (
              <UserMenu
                user={user}
                onLogout={onLogout}
              />
            ) : (
              <motion.button
                className={styles.loginButton}
                onClick={onLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Iniciar Sesión
              </motion.button>
            )}

            {/* Botón menú móvil */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <motion.div
                className={styles.hamburger}
                animate={isMobileMenuOpen ? 'open' : 'closed'}
                variants={{
                  open: { rotate: 45 },
                  closed: { rotate: 0 }
                }}
              >
                <span></span>
                <span></span>
                <span></span>
              </motion.div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Migas de pan */}
      <Breadcrumbs
        currentPath={currentPath}
        onNavigate={handleNavigation}
      />

      {/* Menú móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            user={user}
            navigationItems={navigationItems}
            notifications={notifications}
            cartItemsCount={cartItemsCount}
            onNavigate={(path) => {
              handleNavigation(path)
              setIsMobileMenuOpen(false)
            }}
            onSearch={onSearch}
            onLogin={onLogin}
            onLogout={onLogout}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default HeaderNavigation
`

### SearchBar

`	ypescript
// modules/header-navigation/components/SearchBar.tsx
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '../hooks/useSearch'
import styles from '../styles/search.css'

interface SearchBarProps {
  onSearch: (query: string) => void
  suggestions?: string[]
  placeholder?: string
  onSuggestionClick?: (suggestion: string) => void
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  suggestions = [],
  placeholder = 'Buscar...',
  onSuggestionClick,
  className = ''
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const {
    searchResults,
    isSearching,
    performSearch,
    clearSearch
  } = useSearch()

  useEffect(() => {
    if (query.length > 2) {
      performSearch(query)
    } else {
      clearSearch()
    }
  }, [query, performSearch, clearSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setIsFocused(false)
      setSelectedIndex(-1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          handleSubmit(e)
        }
        break
      case 'Escape':
        setIsFocused(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onSuggestionClick?.(suggestion)
    setIsFocused(false)
    setSelectedIndex(-1)
  }

  return (
    <div className={${styles.searchContainer} }>
      <motion.form
        onSubmit={handleSubmit}
        className={styles.searchForm}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.searchInputWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay to allow suggestion clicks
              setTimeout(() => setIsFocused(false), 150)
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={styles.searchInput}
          />

          <button
            type="submit"
            className={styles.searchButton}
            disabled={!query.trim() || isSearching}
          >
            {isSearching ? (
              <div className={styles.searchSpinner} />
            ) : (
              <span className={styles.searchIcon}>🔍</span>
            )}
          </button>
        </div>
      </motion.form>

      <AnimatePresence>
        {isFocused && (suggestions.length > 0 || searchResults.length > 0) && (
          <motion.div
            ref={suggestionsRef}
            className={styles.suggestionsDropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                className={${styles.suggestionItem} }
                onClick={() => handleSuggestionClick(suggestion)}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              >
                <span className={styles.suggestionIcon}>🔍</span>
                <span className={styles.suggestionText}>{suggestion}</span>
              </motion.button>
            ))}

            {searchResults.map((result, index) => (
              <motion.button
                key={result.id}
                className={${styles.suggestionItem} }
                onClick={() => handleSuggestionClick(result.name)}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              >
                <img
                  src={result.image}
                  alt={result.name}
                  className={styles.resultImage}
                />
                <div className={styles.resultInfo}>
                  <span className={styles.resultName}>{result.name}</span>
                  <span className={styles.resultCategory}>{result.category}</span>
                </div>
                <span className={styles.resultPrice}>
                  
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar
`

### MainMenu

`	ypescript
// modules/header-navigation/components/MainMenu.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import styles from '../styles/menu.css'

interface MainMenuProps {
  items: NavigationItem[]
  onNavigate: (path: string) => void
}

export interface NavigationItem {
  id: string
  label: string
  path: string
  icon?: string
  children?: NavigationItem[]
  badge?: string | number
  external?: boolean
}

const MainMenu: React.FC<MainMenuProps> = ({ items, onNavigate }) => {
  const location = useLocation()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleMouseEnter = (itemId: string, hasChildren: boolean) => {
    if (hasChildren) {
      setActiveDropdown(itemId)
    }
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  const handleItemClick = (item: NavigationItem) => {
    if (item.external) {
      window.open(item.path, '_blank')
    } else {
      onNavigate(item.path)
    }
    setActiveDropdown(null)
  }

  return (
    <nav className={styles.mainMenu}>
      <ul className={styles.menuList}>
        {items.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.children && item.children.some(child => location.pathname === child.path))
          const hasChildren = item.children && item.children.length > 0

          return (
            <li
              key={item.id}
              className={styles.menuItem}
              onMouseEnter={() => handleMouseEnter(item.id, !!hasChildren)}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                className={${styles.menuLink} }
                onClick={() => handleItemClick(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon && <span className={styles.menuIcon}>{item.icon}</span>}
                <span className={styles.menuLabel}>{item.label}</span>
                {item.badge && (
                  <span className={styles.menuBadge}>{item.badge}</span>
                )}
                {hasChildren && (
                  <motion.span
                    className={styles.dropdownArrow}
                    animate={{ rotate: activeDropdown === item.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.span>
                )}
              </motion.div>

              <AnimatePresence>
                {activeDropdown === item.id && hasChildren && (
                  <motion.div
                    className={styles.dropdownMenu}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.children!.map((child) => (
                      <motion.button
                        key={child.id}
                        className={styles.dropdownItem}
                        onClick={() => handleItemClick(child)}
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      >
                        {child.icon && <span className={styles.dropdownIcon}>{child.icon}</span>}
                        <span className={styles.dropdownLabel}>{child.label}</span>
                        {child.badge && (
                          <span className={styles.dropdownBadge}>{child.badge}</span>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default MainMenu
`

## 🎣 Hooks Personalizados

### useHeaderNavigation

`	ypescript
// modules/header-navigation/hooks/useHeaderNavigation.ts
import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSearch } from './useSearch'
import { useNotifications } from './useNotifications'
import { navigationConfig } from '../utils/navigationConfig'

export const useHeaderNavigation = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [navigationItems, setNavigationItems] = useState(navigationConfig.items)
  const [currentPath, setCurrentPath] = useState(location.pathname)

  const {
    searchSuggestions,
    performSearch,
    clearSearch
  } = useSearch()

  const {
    notifications,
    unreadCount,
    markAsRead,
    clearAll
  } = useNotifications()

  // Actualizar path actual
  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location.pathname])

  const handleNavigation = useCallback((path: string) => {
    navigate(path)
  }, [navigate])

  const handleSearch = useCallback((query: string) => {
    // Navegar a página de resultados de búsqueda
    navigate(/search?q=)
  }, [navigate])

  const markNotificationAsRead = useCallback((notificationId: string) => {
    markAsRead(notificationId)
  }, [markAsRead])

  const clearNotifications = useCallback(() => {
    clearAll()
  }, [clearAll])

  // Actualizar badges en tiempo real
  useEffect(() => {
    const updateBadges = () => {
      setNavigationItems(prev =>
        prev.map(item => ({
          ...item,
          badge: getItemBadge(item.id)
        }))
      )
    }

    updateBadges()
    const interval = setInterval(updateBadges, 30000) // Actualizar cada 30s

    return () => clearInterval(interval)
  }, [])

  return {
    navigationItems,
    searchSuggestions,
    notifications,
    unreadCount,
    currentPath,
    handleSearch,
    handleNavigation,
    markNotificationAsRead,
    clearNotifications
  }
}
`

### useSearch

`	ypescript
// modules/header-navigation/hooks/useSearch.ts
import { useState, useEffect, useCallback } from 'react'
import { debounce } from '../utils/searchHelpers'

export const useSearch = () => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Búsqueda debounced
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([])
        setResults([])
        return
      }

      setIsSearching(true)

      try {
        // Buscar sugerencias
        const suggestionsResponse = await fetch(/api/search/suggestions?q=)
        const suggestionsData = await suggestionsResponse.json()
        setSuggestions(suggestionsData)

        // Buscar resultados
        const resultsResponse = await fetch(/api/search?q=&limit=5)
        const resultsData = await resultsResponse.json()
        setResults(resultsData)
      } catch (error) {
        console.error('Search error:', error)
        setSuggestions([])
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  const performSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery)
  }, [])

  const clearSearch = useCallback(() => {
    setQuery('')
    setSuggestions([])
    setResults([])
  }, [])

  return {
    searchQuery: query,
    searchSuggestions: suggestions,
    searchResults: results,
    isSearching,
    performSearch,
    clearSearch
  }
}
`

## 🎨 Estilos del Módulo

### header.module.css

`css
/* modules/header-navigation/styles/header.module.css */
.header {
  @apply fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-all duration-300;
}

.header.scrolled {
  @apply shadow-lg backdrop-blur-sm bg-white/95;
}

.headerContainer {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  @apply flex items-center justify-between h-16;
}

.headerLeft {
  @apply flex items-center space-x-8;
}

.logo {
  @apply flex items-center space-x-2;
}

.logoLink {
  @apply flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors;
}

.logoImage {
  @apply h-8 w-8;
}

.logoText {
  @apply hidden sm:block;
}

.desktopNav {
  @apply hidden lg:block;
}

.headerCenter {
  @apply flex-1 max-w-lg mx-8;
}

.headerRight {
  @apply flex items-center space-x-4;
}

.loginButton {
  @apply bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors;
}

.mobileMenuButton {
  @apply lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors;
}

.hamburger {
  @apply w-6 h-6 relative;
}

.hamburger span {
  @apply block w-full h-0.5 bg-gray-600 transition-all duration-300;
}

.hamburger span:nth-child(1) {
  @apply absolute top-0;
}

.hamburger span:nth-child(2) {
  @apply absolute top-2;
}

.hamburger span:nth-child(3) {
  @apply absolute top-4;
}
`

### search.css

`css
/* modules/header-navigation/styles/search.css */
.searchContainer {
  @apply relative w-full;
}

.searchForm {
  @apply w-full;
}

.searchInputWrapper {
  @apply relative flex items-center;
}

.searchInput {
  @apply w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}

.searchButton {
  @apply absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50;
}

.searchIcon {
  @apply text-lg;
}

.searchSpinner {
  @apply w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin;
}

.suggestionsDropdown {
  @apply absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto;
}

.suggestionItem {
  @apply w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors;
}

.suggestionItem.selected {
  @apply bg-blue-50;
}

.suggestionIcon {
  @apply text-gray-400;
}

.suggestionText {
  @apply flex-1 text-gray-900;
}

.resultImage {
  @apply w-10 h-10 object-cover rounded;
}

.resultInfo {
  @apply flex-1;
}

.resultName {
  @apply block text-gray-900 font-medium;
}

.resultCategory {
  @apply block text-sm text-gray-500;
}

.resultPrice {
  @apply text-blue-600 font-semibold;
}
`

## 🔧 Utilidades

### navigationConfig.ts

`	ypescript
// modules/header-navigation/utils/navigationConfig.ts
import { NavigationItem } from '../types/navigation'

export const navigationConfig = {
  items: [
    {
      id: 'home',
      label: 'Inicio',
      path: '/',
      icon: '🏠'
    },
    {
      id: 'categories',
      label: 'Categorías',
      path: '/categories',
      icon: '📂',
      children: [
        {
          id: 'food',
          label: 'Alimentos',
          path: '/categories/food',
          icon: '🍎'
        },
        {
          id: 'beverages',
          label: 'Bebidas',
          path: '/categories/beverages',
          icon: '🥤'
        },
        {
          id: 'household',
          label: 'Hogar',
          path: '/categories/household',
          icon: '🏡'
        },
        {
          id: 'personal-care',
          label: 'Cuidado Personal',
          path: '/categories/personal-care',
          icon: '🧴'
        }
      ]
    },
    {
      id: 'supermarkets',
      label: 'Supermercados',
      path: '/supermarkets',
      icon: '🏪'
    },
    {
      id: 'comparisons',
      label: 'Comparaciones',
      path: '/comparisons',
      icon: '📊'
    },
    {
      id: 'about',
      label: 'Acerca de',
      path: '/about',
      icon: 'ℹ️'
    }
  ] as NavigationItem[]
}

export const getItemBadge = (itemId: string): string | number | undefined => {
  // Lógica para obtener badges dinámicos
  switch (itemId) {
    case 'comparisons':
      return 3 // Número de comparaciones activas
    case 'supermarkets':
      return 'Nuevo' // Badge de nuevo
    default:
      return undefined
  }
}

export const getBreadcrumbs = (path: string): Array<{ label: string; path: string }> => {
  const segments = path.split('/').filter(Boolean)
  const breadcrumbs = [{ label: 'Inicio', path: '/' }]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += /
    const item = findNavigationItemByPath(currentPath)

    if (item) {
      breadcrumbs.push({
        label: item.label,
        path: currentPath
      })
    } else {
      // Crear breadcrumb genérico
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath
      })
    }
  })

  return breadcrumbs
}

const findNavigationItemByPath = (path: string): NavigationItem | undefined => {
  const findInItems = (items: NavigationItem[]): NavigationItem | undefined => {
    for (const item of items) {
      if (item.path === path) return item
      if (item.children) {
        const found = findInItems(item.children)
        if (found) return found
      }
    }
    return undefined
  }

  return findInItems(navigationConfig.items)
}
`

### searchHelpers.ts

`	ypescript
// modules/header-navigation/utils/searchHelpers.ts
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text

  const regex = new RegExp((), 'gi')
  return text.replace(regex, '<mark></mark>')
}

export const getSearchSuggestions = (query: string): string[] => {
  if (query.length < 2) return []

  const commonSearches = [
    'leche',
    'pan',
    'arroz',
    'aceite',
    'azúcar',
    'café',
    'yerba',
    'coca cola',
    'papel higiénico',
    'detergente'
  ]

  return commonSearches.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)
}

export const formatSearchQuery = (query: string): string => {
  return query
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
}

export const getSearchFilters = (query: string) => {
  const filters: Record<string, any> = {}

  // Detectar filtros en la query
  const brandMatch = query.match(/marca:(\w+)/i)
  if (brandMatch) {
    filters.brand = brandMatch[1]
  }

  const categoryMatch = query.match(/categoria:(\w+)/i)
  if (categoryMatch) {
    filters.category = categoryMatch[1]
  }

  const priceMatch = query.match(/precio:(\d+)-(\d+)/i)
  if (priceMatch) {
    filters.priceRange = {
      min: parseInt(priceMatch[1]),
      max: parseInt(priceMatch[2])
    }
  }

  return filters
}
`

## 📋 Tipos TypeScript

### navigation.ts

`	ypescript
// modules/header-navigation/types/navigation.ts
export interface NavigationItem {
  id: string
  label: string
  path: string
  icon?: string
  children?: NavigationItem[]
  badge?: string | number
  external?: boolean
  requiresAuth?: boolean
  permissions?: string[]
}

export interface BreadcrumbItem {
  label: string
  path: string
  isActive?: boolean
}

export interface NavigationState {
  currentPath: string
  previousPath?: string
  breadcrumbs: BreadcrumbItem[]
  activeItem?: NavigationItem
  expandedItems: string[]
}

export interface NavigationConfig {
  items: NavigationItem[]
  homePath: string
  loginPath: string
  dashboardPath: string
  maxNestedLevels: number
}
`

### search.ts

`	ypescript
// modules/header-navigation/types/search.ts
export interface SearchResult {
  id: string
  name: string
  category: string
  brand: string
  image: string
  price: number
  supermarket: string
  relevance: number
  tags: string[]
}

export interface SearchFilters {
  category?: string
  brand?: string
  priceRange?: {
    min: number
    max: number
  }
  supermarket?: string
  inStock?: boolean
  onSale?: boolean
}

export interface SearchState {
  query: string
  filters: SearchFilters
  results: SearchResult[]
  suggestions: string[]
  isLoading: boolean
  hasMore: boolean
  totalResults: number
}

export interface SearchAnalytics {
  query: string
  resultsCount: number
  timeTaken: number
  clickedResult?: string
  filtersUsed: SearchFilters
  timestamp: string
}
`

## 🧪 Testing

### Tests de Componentes

`	ypescript
// modules/header-navigation/__tests__/SearchBar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchBar from '../components/SearchBar'

const mockOnSearch = jest.fn()
const mockOnSuggestionClick = jest.fn()

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render search input', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        suggestions={[]}
        onSuggestionClick={mockOnSuggestionClick}
      />
    )

    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument()
  })

  it('should call onSearch when form is submitted', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        suggestions={[]}
        onSuggestionClick={mockOnSuggestionClick}
      />
    )

    const input = screen.getByPlaceholderText('Buscar...')
    const button = screen.getByRole('button')

    fireEvent.change(input, { target: { value: 'test query' } })
    fireEvent.click(button)

    expect(mockOnSearch).toHaveBeenCalledWith('test query')
  })

  it('should show suggestions when provided', async () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        suggestions={['suggestion 1', 'suggestion 2']}
        onSuggestionClick={mockOnSuggestionClick}
      />
    )

    const input = screen.getByPlaceholderText('Buscar...')
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByText('suggestion 1')).toBeInTheDocument()
      expect(screen.getByText('suggestion 2')).toBeInTheDocument()
    })
  })

  it('should handle keyboard navigation', async () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        suggestions={['suggestion 1', 'suggestion 2']}
        onSuggestionClick={mockOnSuggestionClick}
      />
    )

    const input = screen.getByPlaceholderText('Buscar...')
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByText('suggestion 1')).toBeInTheDocument()
    })

    // Navigate down
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnSuggestionClick).toHaveBeenCalledWith('suggestion 1')
  })
})
`

## 🚀 Integración

### Uso en la Aplicación

`	ypescript
// src/components/Layout.tsx
import HeaderNavigation from '@/modules/header-navigation'
import { useAuth } from '@/hooks/useAuth'
import { useComparisonCart } from '@/modules/comparison-cart'

const Layout = ({ children }) => {
  const { user, login, logout } = useAuth()
  const { cartItems } = useComparisonCart()

  const handleSearch = (query) => {
    // Navegar a resultados de búsqueda
    navigate(/search?q=)
  }

  const handleCartClick = () => {
    // Abrir modal del carrito
    setIsCartOpen(true)
  }

  return (
    <div>
      <HeaderNavigation
        user={user}
        cartItemsCount={cartItems.length}
        notificationsCount={5}
        onSearch={handleSearch}
        onCartClick={handleCartClick}
        onLogin={login}
        onLogout={logout}
      />
      
      <main>{children}</main>
    </div>
  )
}
`

## 📝 Notas Importantes

- **Performance**: Búsqueda debounced y lazy loading
- **Accesibilidad**: Navegación completa por teclado
- **SEO**: URLs amigables para búsqueda
- **Responsive**: Diseño móvil-first
- **i18n**: Soporte completo multiidioma
- **Analytics**: Tracking de búsquedas y navegación

## 🔄 Próximas Mejoras

- [ ] Búsqueda por voz
- [ ] Filtros avanzados en búsqueda
- [ ] Historial de búsquedas
- [ ] Búsqueda por imagen
- [ ] Sugerencias personalizadas con IA
- [ ] Modo búsqueda sin conexión
