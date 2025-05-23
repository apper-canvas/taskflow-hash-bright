import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <ApperIcon name="Search" className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
          </div>
          
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            404
          </h1>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 mb-8 leading-relaxed">
            The page you're looking for seems to have wandered off. 
            Let's get you back to organizing your tasks!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            to="/"
            className="group inline-flex items-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl shadow-soft hover:shadow-card transform hover:scale-105 transition-all duration-300"
          >
            <ApperIcon name="Home" className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-base sm:text-lg">Back to TaskFlow</span>
          </Link>
        </motion.div>

        <motion.div
          className="mt-12 flex justify-center space-x-8 sm:space-x-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-surface-800 rounded-2xl flex items-center justify-center shadow-soft mb-3">
              <ApperIcon name="CheckSquare" className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400">Task Manager</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-surface-800 rounded-2xl flex items-center justify-center shadow-soft mb-3">
              <ApperIcon name="Users" className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400">Team Collaboration</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-surface-800 rounded-2xl flex items-center justify-center shadow-soft mb-3">
              <ApperIcon name="BarChart3" className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400">Progress Tracking</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound