import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const stats = [
    { icon: 'CheckCircle2', label: 'Tasks Completed', value: '1,247' },
    { icon: 'Clock', label: 'Hours Saved', value: '892' },
    { icon: 'Users', label: 'Team Members', value: '24' },
    { icon: 'TrendingUp', label: 'Productivity Boost', value: '67%' }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <nav className="relative container py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2 sm:space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-soft">
                <ApperIcon name="CheckSquare" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </motion.div>

            <motion.button
              onClick={toggleDarkMode}
              className="p-2 sm:p-3 rounded-xl bg-white dark:bg-surface-800 shadow-soft hover:shadow-card transition-all duration-300 group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon 
                name={darkMode ? 'Sun' : 'Moon'} 
                className="w-4 h-4 sm:w-5 sm:h-5 text-surface-600 dark:text-surface-300 group-hover:text-primary transition-colors" 
              />
            </motion.button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative container pb-12 sm:pb-16 lg:pb-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-surface-900 dark:text-white mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Organize Your Tasks with 
              <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Unmatched Efficiency
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl text-surface-600 dark:text-surface-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Experience the future of task management with intelligent prioritization, 
              seamless collaboration, and crystal-clear progress tracking.
            </motion.p>

            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="group p-4 sm:p-6 bg-white/70 dark:bg-surface-800/70 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/20 dark:border-surface-700/20 hover:shadow-task-card transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ApperIcon name={stat.icon} className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Feature Section */}
      <main className="container pb-12 sm:pb-16 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <MainFeature />
        </motion.div>
      </main>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-24 h-24 sm:w-36 sm:h-36 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  )
}

export default Home