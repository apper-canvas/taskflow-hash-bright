import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending',
    category: 'personal'
  })

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-accent', icon: 'ArrowDown' },
    { value: 'medium', label: 'Medium', color: 'bg-secondary', icon: 'Minus' },
    { value: 'high', label: 'High', color: 'bg-orange-500', icon: 'ArrowUp' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500', icon: 'AlertTriangle' }
  ]

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-surface-400', icon: 'Clock' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-secondary', icon: 'PlayCircle' },
    { value: 'completed', label: 'Completed', color: 'bg-accent', icon: 'CheckCircle2' }
  ]

  const categories = [
    { value: 'personal', label: 'Personal', color: 'bg-primary' },
    { value: 'work', label: 'Work', color: 'bg-secondary' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
    { value: 'ideas', label: 'Ideas', color: 'bg-purple-500' }
  ]

  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Task title is required!')
      return
    }

    const taskData = {
      ...formData,
      id: editingTask ? editingTask.id : Date.now().toString(),
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? taskData : task))
      toast.success('Task updated successfully!')
    } else {
      setTasks([...tasks, taskData])
      toast.success('Task created successfully!')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'pending',
      category: 'personal'
    })
    setShowForm(false)
    setEditingTask(null)
  }

  const handleEdit = (task) => {
    setFormData(task)
    setEditingTask(task)
    setShowForm(true)
  }

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 
                         task.status === 'pending' ? 'in-progress' : 'completed'
        return { ...task, status: newStatus, updatedAt: new Date().toISOString() }
      }
      return task
    }))
    toast.success('Task status updated!')
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'completed') return task.status === 'completed'
    if (filter === 'pending') return task.status !== 'completed'
    if (filter === 'overdue') return isPast(new Date(task.dueDate)) && task.status !== 'completed'
    return task.priority === filter || task.category === filter
  })

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate)
    if (sortBy === 'priority') {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    if (sortBy === 'created') return new Date(b.createdAt) - new Date(a.createdAt)
    return 0
  })

  const getPriorityConfig = (priority) => priorities.find(p => p.value === priority)
  const getStatusConfig = (status) => statuses.find(s => s.value === status)
  const getCategoryConfig = (category) => categories.find(c => c.value === category)

  const formatDueDate = (dateString) => {
    const date = new Date(dateString)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM dd, yyyy')
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const overdue = tasks.filter(t => isPast(new Date(t.dueDate)) && t.status !== 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    
    return { total, completed, overdue, inProgress }
  }

  const stats = getTaskStats()

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header with Stats */}
      <motion.div 
        className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 mb-8 shadow-task-card border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-2">
              Task Management Center
            </h2>
            <p className="text-surface-600 dark:text-surface-300 text-sm sm:text-base">
              Organize, prioritize, and track your tasks with intelligent workflows
            </p>
          </div>
          
          <motion.button
            onClick={() => setShowForm(true)}
            className="group flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl sm:rounded-2xl shadow-soft hover:shadow-card transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="Plus" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm sm:text-base">Create Task</span>
          </motion.button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Total Tasks', value: stats.total, icon: 'List', color: 'from-primary/20 to-primary/10' },
            { label: 'Completed', value: stats.completed, icon: 'CheckCircle2', color: 'from-accent/20 to-accent/10' },
            { label: 'In Progress', value: stats.inProgress, icon: 'PlayCircle', color: 'from-secondary/20 to-secondary/10' },
            { label: 'Overdue', value: stats.overdue, icon: 'AlertTriangle', color: 'from-red-500/20 to-red-500/10' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`p-4 sm:p-6 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl border border-white/20 dark:border-surface-700/20`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <ApperIcon name={stat.icon} className="w-5 h-5 sm:w-6 sm:h-6 text-surface-700 dark:text-surface-300" />
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filters and Sort */}
      <motion.div 
        className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 shadow-soft border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'completed', 'overdue', 'urgent', 'high'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  filter === filterOption
                    ? 'bg-primary text-white shadow-soft'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 sm:px-4 py-2 bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="created">Sort by Created</option>
          </select>
        </div>
      </motion.div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && resetForm()}
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
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    placeholder="Enter task description..."
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    >
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300 text-sm sm:text-base"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <AnimatePresence>
          {sortedTasks.length === 0 ? (
            <motion.div
              className="text-center py-12 sm:py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="ListTodo" className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white mb-2">
                No tasks found
              </h3>
              <p className="text-surface-600 dark:text-surface-300 mb-6">
                {filter === 'all' ? 'Create your first task to get started!' : `No tasks match the "${filter}" filter.`}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
              >
                Create Your First Task
              </button>
            </motion.div>
          ) : (
            sortedTasks.map((task, index) => {
              const priorityConfig = getPriorityConfig(task.priority)
              const statusConfig = getStatusConfig(task.status)
              const categoryConfig = getCategoryConfig(task.category)
              const isOverdue = isPast(new Date(task.dueDate)) && task.status !== 'completed'

              return (
                <motion.div
                  key={task.id}
                  className={`group relative bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft hover:shadow-task-card border border-white/20 transition-all duration-300 ${
                    task.status === 'completed' ? 'opacity-75' : ''
                  } ${isOverdue ? 'border-red-300 dark:border-red-600' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    {/* Task Status Toggle */}
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`flex-shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                        task.status === 'completed'
                          ? 'bg-accent border-accent text-white'
                          : task.status === 'in-progress'
                          ? 'bg-secondary border-secondary text-white'
                          : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                      }`}
                    >
                      <ApperIcon 
                        name={task.status === 'completed' ? 'Check' : task.status === 'in-progress' ? 'Play' : 'Circle'} 
                        className="w-4 h-4" 
                      />
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                        <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                          <h4 className={`text-lg sm:text-xl font-semibold mb-1 ${
                            task.status === 'completed' ? 'line-through text-surface-500' : 'text-surface-900 dark:text-white'
                          }`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm sm:text-base text-surface-600 dark:text-surface-300 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Task Actions */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(task)}
                            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Edit2" className="w-4 h-4 text-surface-500 hover:text-primary" />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4 text-surface-500 hover:text-red-500" />
                          </button>
                        </div>
                      </div>

                      {/* Task Meta */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {/* Priority Badge */}
                        <div className={`flex items-center space-x-1 px-2 sm:px-3 py-1 ${priorityConfig.color} text-white rounded-lg text-xs sm:text-sm font-medium`}>
                          <ApperIcon name={priorityConfig.icon} className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{priorityConfig.label}</span>
                        </div>

                        {/* Category Badge */}
                        <div className={`flex items-center space-x-1 px-2 sm:px-3 py-1 ${categoryConfig.color} text-white rounded-lg text-xs sm:text-sm font-medium`}>
                          <ApperIcon name="Tag" className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{categoryConfig.label}</span>
                        </div>

                        {/* Status Badge */}
                        <div className={`flex items-center space-x-1 px-2 sm:px-3 py-1 ${statusConfig.color} text-white rounded-lg text-xs sm:text-sm font-medium`}>
                          <ApperIcon name={statusConfig.icon} className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{statusConfig.label}</span>
                        </div>

                        {/* Due Date */}
                        {task.dueDate && (
                          <div className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${
                            isOverdue
                              ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                              : isToday(new Date(task.dueDate))
                              ? 'bg-secondary/20 text-secondary-dark'
                              : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
                          }`}>
                            <ApperIcon name="Calendar" className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatDueDate(task.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Overdue Warning */}
                  {isOverdue && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default MainFeature