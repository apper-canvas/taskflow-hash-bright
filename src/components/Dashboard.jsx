import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, differenceInDays, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, subWeeks, addWeeks } from 'date-fns'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'
import ApperIcon from './ApperIcon'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [dashboardConfig, setDashboardConfig] = useState({
    showCompletionChart: true,
    showPriorityChart: true,
    showCategoryChart: true,
    showProgressChart: true,
    showTimeStats: true,
    showProductivityChart: true
  })
  const [showSettings, setShowSettings] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(new Date())

  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    const savedConfig = localStorage.getItem('taskflow-dashboard-config')
    if (savedConfig) {
      setDashboardConfig(JSON.parse(savedConfig))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('taskflow-dashboard-config', JSON.stringify(dashboardConfig))
  }, [dashboardConfig])

  const toggleConfigOption = (option) => {
    setDashboardConfig(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
    toast.success('Dashboard configuration updated!')
  }

  // Calculate statistics
  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, inProgress, pending, completionRate }
  }

  const getPriorityDistribution = () => {
    const priorities = { low: 0, medium: 0, high: 0, urgent: 0 }
    tasks.forEach(task => {
      priorities[task.priority]++
    })
    return priorities
  }

  const getCategoryDistribution = () => {
    const categories = { personal: 0, work: 0, urgent: 0, ideas: 0 }
    tasks.forEach(task => {
      categories[task.category]++
    })
    return categories
  }

  const getAverageCompletionTime = () => {
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.createdAt && t.updatedAt)
    if (completedTasks.length === 0) return 0

    const totalDays = completedTasks.reduce((sum, task) => {
      const created = parseISO(task.createdAt)
      const completed = parseISO(task.updatedAt)
      return sum + differenceInDays(completed, created)
    }, 0)

    return Math.round(totalDays / completedTasks.length * 10) / 10
  }

  const getWeeklyProductivity = () => {
    const weeks = []
    const productivity = []
    
    for (let i = 6; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(currentWeek, i))
      const weekEnd = endOfWeek(weekStart)
      
      const weekTasks = tasks.filter(task => {
        if (!task.updatedAt) return false
        const taskDate = parseISO(task.updatedAt)
        return isWithinInterval(taskDate, { start: weekStart, end: weekEnd })
      })
      
      const completedThisWeek = weekTasks.filter(t => t.status === 'completed').length
      
      weeks.push(format(weekStart, 'MMM dd'))
      productivity.push(completedThisWeek)
    }
    
    return { weeks, productivity }
  }

  const stats = getTaskStats()
  const priorityDist = getPriorityDistribution()
  const categoryDist = getCategoryDistribution()
  const avgCompletionTime = getAverageCompletionTime()
  const weeklyData = getWeeklyProductivity()

  // Chart configurations
  const completionChartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [stats.completed, stats.inProgress, stats.pending],
        backgroundColor: [
          '#10b981',
          '#f59e0b',
          '#6b7280'
        ],
        borderWidth: 0,
        borderRadius: 8,
      }
    ]
  }

  const priorityChartData = {
    labels: ['Low', 'Medium', 'High', 'Urgent'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [priorityDist.low, priorityDist.medium, priorityDist.high, priorityDist.urgent],
        backgroundColor: [
          '#10b981',
          '#f59e0b',
          '#f97316',
          '#ef4444'
        ],
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  }

  const categoryChartData = {
    labels: ['Personal', 'Work', 'Urgent', 'Ideas'],
    datasets: [
      {
        data: [categoryDist.personal, categoryDist.work, categoryDist.urgent, categoryDist.ideas],
        backgroundColor: [
          '#6366f1',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6'
        ],
        borderWidth: 0,
      }
    ]
  }

  const productivityChartData = {
    labels: weeklyData.weeks,
    datasets: [
      {
        label: 'Tasks Completed',
        data: weeklyData.productivity,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#6366f1',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter'
          }
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#6366f1',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 mb-8 shadow-task-card border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-surface-600 dark:text-surface-300 text-sm sm:text-base">
                Track your productivity and task management insights
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowSettings(true)}
                className="group flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-soft hover:shadow-card transition-all duration-300"
              >
                <ApperIcon name="Settings" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-sm sm:text-base">Configure</span>
              </button>
              
              <Link
                to="/"
                className="group flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl sm:rounded-2xl shadow-soft hover:shadow-card transition-all duration-300"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="text-sm sm:text-base">Back to Tasks</span>
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: 'TrendingUp', color: 'from-accent/20 to-accent/10' },
              { label: 'Total Tasks', value: stats.total, icon: 'List', color: 'from-primary/20 to-primary/10' },
              { label: 'Avg. Completion', value: `${avgCompletionTime} days`, icon: 'Clock', color: 'from-secondary/20 to-secondary/10' },
              { label: 'Active Tasks', value: stats.inProgress + stats.pending, icon: 'PlayCircle', color: 'from-purple-500/20 to-purple-500/10' }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                className={`p-4 sm:p-6 bg-gradient-to-br ${metric.color} rounded-xl sm:rounded-2xl border border-white/20 dark:border-surface-700/20`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <ApperIcon name={metric.icon} className="w-5 h-5 sm:w-6 sm:h-6 text-surface-700 dark:text-surface-300" />
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
                      {metric.value}
                    </div>
                    <div className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">
                      {metric.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Task Completion Chart */}
          {dashboardConfig.showCompletionChart && (
            <motion.div
              className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-task-card border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-4">
                Task Status Distribution
              </h3>
              <div className="h-64">
                <Pie data={completionChartData} options={pieOptions} />
              </div>
            </motion.div>
          )}

          {/* Priority Distribution Chart */}
          {dashboardConfig.showPriorityChart && (
            <motion.div
              className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-task-card border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-4">
                Tasks by Priority
              </h3>
              <div className="h-64">
                <Bar data={priorityChartData} options={chartOptions} />
              </div>
            </motion.div>
          )}

          {/* Category Distribution Chart */}
          {dashboardConfig.showCategoryChart && (
            <motion.div
              className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-task-card border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-4">
                Tasks by Category
              </h3>
              <div className="h-64">
                <Pie data={categoryChartData} options={pieOptions} />
              </div>
            </motion.div>
          )}

          {/* Weekly Productivity Chart */}
          {dashboardConfig.showProductivityChart && (
            <motion.div
              className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-task-card border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                  Weekly Productivity
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                  >
                    <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                  >
                    <ApperIcon name="ChevronRight" className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="h-64">
                <Line data={productivityChartData} options={chartOptions} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Time Statistics */}
        {dashboardConfig.showTimeStats && (
          <motion.div
            className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-task-card border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-6">
              Time & Performance Statistics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3 mb-2">
                  <ApperIcon name="Clock" className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-surface-600 dark:text-surface-300">Average Completion Time</span>
                </div>
                <div className="text-2xl font-bold text-surface-900 dark:text-white">
                  {avgCompletionTime} days
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3 mb-2">
                  <ApperIcon name="Target" className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-surface-600 dark:text-surface-300">Completion Rate</span>
                </div>
                <div className="text-2xl font-bold text-surface-900 dark:text-white">
                  {stats.completionRate}%
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-3 mb-2">
                  <ApperIcon name="Zap" className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-surface-600 dark:text-surface-300">This Week's Completed</span>
                </div>
                <div className="text-2xl font-bold text-surface-900 dark:text-white">
                  {weeklyData.productivity[weeklyData.productivity.length - 1] || 0}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.target === e.currentTarget && setShowSettings(false)}
            >
              <motion.div
                className="bg-white dark:bg-surface-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-white/20"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
                    Dashboard Configuration
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'showCompletionChart', label: 'Task Status Distribution', icon: 'PieChart' },
                    { key: 'showPriorityChart', label: 'Priority Distribution', icon: 'BarChart3' },
                    { key: 'showCategoryChart', label: 'Category Distribution', icon: 'Doughnut' },
                    { key: 'showProductivityChart', label: 'Weekly Productivity', icon: 'TrendingUp' },
                    { key: 'showTimeStats', label: 'Time Statistics', icon: 'Clock' }
                  ].map((option) => (
                    <div key={option.key} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <ApperIcon name={option.icon} className="w-5 h-5 text-surface-600 dark:text-surface-300" />
                        <span className="text-surface-900 dark:text-white font-medium">
                          {option.label}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleConfigOption(option.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          dashboardConfig[option.key] ? 'bg-primary' : 'bg-surface-300 dark:bg-surface-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            dashboardConfig[option.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
                  >
                    Save Configuration
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Dashboard