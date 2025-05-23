import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth, addDays, addWeeks, addMonths as addMonthsUtil, addYears, isAfter, isBefore, parseISO, startOfDay } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [viewMode, setViewMode] = useState('list') // 'list', 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showRecurringForm, setShowRecurringForm] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending',
    category: 'personal',
    attachments: [],
    assignedTo: null,
    comments: [],
    isRecurring: false,
    recurringPattern: {
      type: 'daily', // 'daily', 'weekly', 'monthly', 'yearly'
      interval: 1,
      daysOfWeek: [], // for weekly pattern
      endDate: null,
      maxOccurrences: null,
      generatedTaskIds: []
    }
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

  const allowedFileTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'text/csv', 'application/zip', 'application/x-zip-compressed'
  ]

  const recurringPatterns = [
    { value: 'daily', label: 'Daily', icon: 'Calendar' },
    { value: 'weekly', label: 'Weekly', icon: 'CalendarDays' },
    { value: 'monthly', label: 'Monthly', icon: 'CalendarRange' },
    { value: 'yearly', label: 'Yearly', icon: 'CalendarX2' }
  ]

  const teamMembers = [
    { 
      id: 'tm-1', 
      name: 'Sarah Chen', 
      email: 'sarah.chen@company.com', 
      role: 'Product Manager', 
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      initials: 'SC'
    },
    { 
      id: 'tm-2', 
      name: 'Marcus Rodriguez', 
      email: 'marcus.rodriguez@company.com', 
      role: 'Lead Developer', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      initials: 'MR'
    },
    { 
      id: 'tm-3', 
      name: 'Emma Thompson', 
      email: 'emma.thompson@company.com', 
      role: 'UI/UX Designer', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      initials: 'ET'
    },
    { 
      id: 'tm-4', 
      name: 'David Kim', 
      email: 'david.kim@company.com', 
      role: 'QA Engineer', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      initials: 'DK'
    },
    { 
      id: 'tm-5', 
      name: 'Lisa Wang', 
      email: 'lisa.wang@company.com', 
      role: 'Data Analyst', 
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      initials: 'LW'
    },
    { 
      id: 'tm-6', 
      name: 'Alex Johnson', 
      email: 'alex.johnson@company.com', 
      role: 'DevOps Engineer', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      initials: 'AJ'
    },
    { 
      id: 'tm-7', 
      name: 'Maya Patel', 
      email: 'maya.patel@company.com', 
      role: 'Marketing Specialist', 
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      initials: 'MP'
    },
    { 
      id: 'tm-8', 
      name: 'James Wilson', 
      email: 'james.wilson@company.com', 
      role: 'Backend Developer', 
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      initials: 'JW'
    }
  ]

  const daysOfWeek = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' }
  ]

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return 'Image'
    if (fileType === 'application/pdf') return 'FileText'
    if (fileType.includes('word') || fileType.includes('document')) return 'FileText'
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'FileSpreadsheet'
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'Presentation'
    if (fileType === 'text/plain') return 'FileText'
    if (fileType.includes('zip')) return 'Archive'
    return 'File'
  }

  // Current user simulation - in a real app, this would come from authentication
  const currentUser = {
    id: 'current-user',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Project Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    initials: 'JD'
  }

  const getTeamMember = (memberId) => teamMembers.find(member => member.id === memberId)

  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  // Generate recurring task instances
  const generateRecurringTasks = (template, startDate, endDate, maxOccurrences) => {
    const generatedTasks = []
    const { recurringPattern } = template
    let currentDate = new Date(startDate)
    let occurrenceCount = 0
    const endDateObj = endDate ? new Date(endDate) : null
    const maxOccur = maxOccurrences || 50 // Default limit to prevent infinite generation

    while (occurrenceCount < maxOccur) {
      // Check if we've exceeded the end date
      if (endDateObj && isAfter(currentDate, endDateObj)) break

      // Generate a new task instance
      const newTask = {
        ...template,
        id: `${template.id}-${currentDate.getTime()}`,
        dueDate: format(currentDate, 'yyyy-MM-dd'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isRecurring: false, // Individual instances are not recurring
        recurringParentId: template.id,
        title: `${template.title} (${format(currentDate, 'MMM dd, yyyy')})`,
        comments: []
      }

      generatedTasks.push(newTask)
      occurrenceCount++

      // Calculate next occurrence based on pattern
      switch (recurringPattern.type) {
        case 'daily':
          currentDate = addDays(currentDate, recurringPattern.interval)
          break
        case 'weekly':
          if (recurringPattern.daysOfWeek && recurringPattern.daysOfWeek.length > 0) {
            // Find next day of week
            let nextDate = addDays(currentDate, 1)
            let foundNext = false
            let attempts = 0
            
            while (!foundNext && attempts < 14) { // Prevent infinite loop
              if (recurringPattern.daysOfWeek.includes(nextDate.getDay())) {
                currentDate = nextDate
                foundNext = true
              } else {
                nextDate = addDays(nextDate, 1)
              }
              attempts++
            }
            
            if (!foundNext) {
              // Fallback to weekly interval
              currentDate = addWeeks(currentDate, recurringPattern.interval)
            }
          } else {
            currentDate = addWeeks(currentDate, recurringPattern.interval)
          }
          break
        case 'monthly':
          currentDate = addMonthsUtil(currentDate, recurringPattern.interval)
          break
        case 'yearly':
          currentDate = addYears(currentDate, recurringPattern.interval)
          break
        default:
          currentDate = addDays(currentDate, 1)
      }
    }

    return generatedTasks
  }

  const handleRecurringSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Task title is required!')
      return
    }

    if (!formData.dueDate) {
      toast.error('Start date is required for recurring tasks!')
      return
    }

    if (formData.recurringPattern.type === 'weekly' && formData.recurringPattern.daysOfWeek.length === 0) {
      toast.error('Please select at least one day of the week for weekly recurring tasks!')
      return
    }

    // Create the recurring template
    const recurringTemplate = {
      ...formData,
      id: editingTask ? editingTask.id : `recurring-${Date.now().toString()}`,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRecurringTemplate: true,
      isRecurring: true
    }

    // Generate task instances
    const startDate = new Date(formData.dueDate)
    const endDate = formData.recurringPattern.endDate ? new Date(formData.recurringPattern.endDate) : null
    const maxOccurrences = formData.recurringPattern.maxOccurrences || 10

    const generatedTasks = generateRecurringTasks(recurringTemplate, startDate, endDate, maxOccurrences)
    
    // Update the template with generated task IDs
    recurringTemplate.recurringPattern.generatedTaskIds = generatedTasks.map(t => t.id)

    if (editingTask) {
      // Update existing recurring template
      setTasks(prevTasks => {
        // Remove old generated tasks
        const filteredTasks = prevTasks.filter(t => !editingTask.recurringPattern.generatedTaskIds.includes(t.id))
        // Add updated template and new generated tasks
        return [...filteredTasks.filter(t => t.id !== editingTask.id), recurringTemplate, ...generatedTasks]
      })
      toast.success(`Recurring task series updated! Generated ${generatedTasks.length} task instances.`)
    } else {
      // Add new recurring template and generated tasks
      setTasks(prevTasks => [...prevTasks, recurringTemplate, ...generatedTasks])
      toast.success(`Recurring task series created! Generated ${generatedTasks.length} task instances.`)
    }

    resetForm()
  }

  const deleteRecurringSeries = (templateId) => {
    const template = tasks.find(t => t.id === templateId)
    if (!template || !template.isRecurringTemplate) return

    if (window.confirm('Are you sure you want to delete this entire recurring series? This will remove all generated task instances.')) {
      setTasks(prevTasks => {
        const generatedIds = template.recurringPattern.generatedTaskIds || []
        return prevTasks.filter(t => t.id !== templateId && !generatedIds.includes(t.id))
      })
      toast.success('Recurring task series deleted successfully!')
    }
  }

  const regenerateRecurringTasks = (templateId) => {
    const template = tasks.find(t => t.id === templateId)
    if (!template || !template.isRecurringTemplate) return

    // Remove existing generated tasks
    const generatedIds = template.recurringPattern.generatedTaskIds || []
    
    // Generate new tasks
    const startDate = new Date(template.dueDate)
    const endDate = template.recurringPattern.endDate ? new Date(template.recurringPattern.endDate) : null
    const maxOccurrences = template.recurringPattern.maxOccurrences || 10

    const newGeneratedTasks = generateRecurringTasks(template, startDate, endDate, maxOccurrences)
    
    // Update template with new generated task IDs
    const updatedTemplate = {
      ...template,
      recurringPattern: {
        ...template.recurringPattern,
        generatedTaskIds: newGeneratedTasks.map(t => t.id)
      },
      updatedAt: new Date().toISOString()
    }

    setTasks(prevTasks => {
      // Remove old generated tasks and update template
      const filteredTasks = prevTasks.filter(t => !generatedIds.includes(t.id) && t.id !== templateId)
      return [...filteredTasks, updatedTemplate, ...newGeneratedTasks]
    })

    toast.success(`Recurring series regenerated! Created ${newGeneratedTasks.length} new task instances.`)
  }

  const getRecurringSeriesInfo = (templateId) => {
    const template = tasks.find(t => t.id === templateId)
    if (!template || !template.isRecurringTemplate) return null

    const generatedIds = template.recurringPattern.generatedTaskIds || []
    const generatedTasks = tasks.filter(t => generatedIds.includes(t.id))
    const completedCount = generatedTasks.filter(t => t.status === 'completed').length

    return {
      template,
      totalGenerated: generatedTasks.length,
      completed: completedCount,
      remaining: generatedTasks.length - completedCount
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Task title is required!')
      return
    }

    // Handle recurring task submission
    if (formData.isRecurring) {
      return handleRecurringSubmit(e)
    }

    const taskData = {
      ...formData,
      id: editingTask ? editingTask.id : Date.now().toString(),
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: editingTask ? editingTask.comments || [] : []
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
      category: 'personal',
      attachments: [],
      assignedTo: null,
      comments: [],
      isRecurring: false,
      recurringPattern: {
        type: 'daily',
        interval: 1,
        daysOfWeek: [],
        endDate: null,
        maxOccurrences: null,
        generatedTaskIds: []
      }
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length === 0) return

    // Validate file count (max 5 files per task)
    if (formData.attachments.length + files.length > 5) {
      toast.error('Maximum 5 files allowed per task!')
      return
    }

    const validFiles = []
    
    files.forEach(file => {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" is too large. Maximum size is 10MB.`)
        return
      }

      // Validate file type
      if (!allowedFileTypes.includes(file.type)) {
        toast.error(`File type "${file.type}" is not supported.`)
        return
      }

      validFiles.push(file)
    })

    if (validFiles.length === 0) return

    // Convert files to base64 for storage
    Promise.all(validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            data: e.target.result
          })
        }
        reader.readAsDataURL(file)
      })
    })).then(fileData => {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileData]
      }))
      toast.success(`${fileData.length} file(s) uploaded successfully!`)
    }).catch(() => {
      toast.error('Failed to upload files. Please try again.')
    })
  }

  const removeAttachment = (attachmentId) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }))
    toast.success('File removed successfully!')
  }

  const downloadAttachment = (attachment) => {
    try {
      const link = document.createElement('a')
      link.href = attachment.data
      link.download = attachment.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success(`Downloaded: ${attachment.name}`)
    } catch (error) {
      toast.error('Failed to download file')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Comment management functions
  const addComment = (taskId, commentText, parentId = null) => {
    console.log('Adding comment:', { taskId, commentText, parentId })
    
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty!')
      return
    }

    const newComment = {
      id: Date.now().toString(),
      text: commentText.trim(),
      author: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId,
      replies: []
    }

    console.log('New comment object:', newComment)

    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedComments = [...(task.comments || [])]
        if (parentId) {
          // Add as reply to existing comment
          const addReplyToComment = (comments) => {
            return comments.map(comment => {
              if (comment.id === parentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newComment]
                }
              } else if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: addReplyToComment(comment.replies)
                }
              }
              return comment
            })
          }
          updatedComments.splice(0, updatedComments.length, ...addReplyToComment(updatedComments))
        } else {
          // Add as new top-level comment
          updatedComments.push(newComment)
        }
        
        console.log('Updated comments for task:', updatedComments)
        return {
          ...task,
          comments: updatedComments,
          updatedAt: new Date().toISOString()
        }
      }
      return task
    }))

    console.log('Tasks after comment addition:', tasks)

    toast.success(parentId ? 'Reply added successfully!' : 'Comment added successfully!')
  }

  const deleteComment = (taskId, commentId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const removeComment = (comments) => {
          return comments.filter(comment => {
            if (comment.id === commentId) {
              return false
            }
            if (comment.replies && comment.replies.length > 0) {
              comment.replies = removeComment(comment.replies)
            }
            return true
          })
        }
        return {
          ...task,
          comments: removeComment(task.comments || []),
          updatedAt: new Date().toISOString()
        }
      }
      return task
    }))
    toast.success('Comment deleted successfully!')
  }

  // Get total comment count including replies
  const getCommentCount = (comments) => {
    if (!comments || comments.length === 0) return 0
    return comments.reduce((total, comment) => {
      return total + 1 + getCommentCount(comment.replies || [])
    }, 0)
  }

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    return format(date, 'MMM dd, yyyy')
  }

  const filteredTasks = tasks.filter(task => {
    // Hide recurring templates from normal task list
    if (task.isRecurringTemplate) return false
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
    const recurringSeries = tasks.filter(t => t.isRecurringTemplate)
    const totalRecurringSeries = recurringSeries.length

    const completed = tasks.filter(t => t.status === 'completed').length
    const overdue = tasks.filter(t => isPast(new Date(t.dueDate)) && t.status !== 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    
    return { total, completed, overdue, inProgress }
  }

  const stats = getTaskStats()
  
  // Get recurring series for management
  const recurringSeries = tasks.filter(t => t.isRecurringTemplate)

  // Calendar helper functions
  const getTasksForDate = (date) => {
    return filteredTasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    )
  }

  const getCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    // Scroll to task in list view
    setTimeout(() => {
      const taskElement = document.getElementById(`task-${task.id}`)
      if (taskElement) {
        taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
    toast.info(`Selected task: ${task.title}`)
  }

  // Comment Section Component
  const CommentSection = ({ task }) => {
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyText, setReplyText] = useState('')
    const [editingComment, setEditingComment] = useState(null)
    const [editText, setEditText] = useState('')

    const handleAddComment = (e) => {
      e.preventDefault()
      addComment(task.id, newComment)
      setNewComment('')
    }

    const handleAddReply = (e, parentId) => {
      e.preventDefault()
      addComment(task.id, replyText, parentId)
      setReplyText('')
      setReplyingTo(null)
    }

    const handleEditComment = (comment) => {
      setEditingComment(comment.id)
      setEditText(comment.text)
    }

    const saveEditComment = (e) => {
      e.preventDefault()
      if (!editText.trim()) {
        toast.error('Comment cannot be empty!')
        return
      }

      setTasks(tasks.map(t => {
        if (t.id === task.id) {
          const updateComment = (comments) => {
            return comments.map(comment => {
              if (comment.id === editingComment) {
                return {
                  ...comment,
                  text: editText.trim(),
                  updatedAt: new Date().toISOString()
                }
              }
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: updateComment(comment.replies)
                }
              }
              return comment
            })
          }
          return {
            ...t,
            comments: updateComment(t.comments || []),
            updatedAt: new Date().toISOString()
          }
        }
        return t
      }))

      setEditingComment(null)
      setEditText('')
      toast.success('Comment updated successfully!')
    }

    const cancelEdit = () => {
      setEditingComment(null)
      setEditText('')
    }

    const renderComment = (comment, depth = 0) => {
      const isCurrentUser = comment.author.id === currentUser.id
      const maxDepth = 3

      return (
        <div key={comment.id} className={`${depth > 0 ? `ml-${Math.min(depth * 4, 12)} border-l-2 border-surface-200 dark:border-surface-700 pl-4` : ''}`}>
          <div className={`p-4 rounded-xl mb-3 ${
            isCurrentUser 
              ? 'bg-primary/5 border border-primary/20' 
              : 'bg-surface-50 dark:bg-surface-700/50'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                {comment.author.avatar ? (
                  <img 
                    src={comment.author.avatar} 
                    alt={comment.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium text-primary">
                    {comment.author.initials}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-sm font-medium ${isCurrentUser ? 'text-primary' : 'text-surface-900 dark:text-white'}`}>
                    {comment.author.name}
                    {isCurrentUser && <span className="text-xs text-primary ml-1">(You)</span>}
                  </span>
                  <span className="text-xs text-surface-500 dark:text-surface-400">
                    {formatRelativeTime(comment.createdAt)}
                    {comment.updatedAt !== comment.createdAt && <span className="ml-1">(edited)</span>}
                  </span>
                </div>

                {editingComment === comment.id ? (
                  <form onSubmit={saveEditComment} className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      rows="3"
                      placeholder="Edit your comment..."
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 text-xs rounded-lg hover:bg-surface-300 dark:hover:bg-surface-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-sm text-surface-700 dark:text-surface-300 mb-2">
                      {comment.text}
                    </p>
                    <div className="flex items-center space-x-3">
                      {depth < maxDepth && (
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="text-xs text-primary hover:text-primary-dark transition-colors"
                        >
                          Reply
                        </button>
                      )}
                      {isCurrentUser && (
                        <>
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="text-xs text-surface-500 hover:text-primary transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this comment?')) {
                                deleteComment(task.id, comment.id)
                              }
                            }}
                            className="text-xs text-red-500 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {replyingTo === comment.id && (
              <form onSubmit={(e) => handleAddReply(e, comment.id)} className="mt-3 ml-11">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="2"
                  placeholder="Write a reply..."
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyText('')
                    }}
                    className="px-3 py-1 bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 text-xs rounded-lg hover:bg-surface-300 dark:hover:bg-surface-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Render replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="space-y-3">
              {comment.replies.map(reply => renderComment(reply, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
        {console.log('Rendering CommentSection for task:', task.id, 'Comments:', task.comments)}
        
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-surface-900 dark:text-white">
            Comments ({getCommentCount(task.comments || [])})
          </h4>
        </div>

        {/* Add new comment form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-primary">
                  {currentUser.initials}
                </span>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                rows="3"
                placeholder="Add a comment..."
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments list */}
        {console.log('About to render comments list. Comments array:', task.comments)}
        <div className="space-y-4">
          {task.comments && task.comments.length > 0 ? (
            task.comments.map(comment => renderComment(comment))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-700 dark:to-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="MessageCircle" className="w-8 h-8 text-surface-400" />
              </div>
              <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                No comments yet
              </h3>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Be the first to add a comment to this task.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Calendar View Component
  const CalendarView = () => {
    const calendarDays = getCalendarDays()
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
      <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-task-card border border-white/20">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-surface-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
            >
              <ApperIcon name="ChevronLeft" className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
            >
              <ApperIcon name="ChevronRight" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-surface-600 dark:text-surface-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const dayTasks = getTasksForDate(date)
            const isCurrentMonth = isSameMonth(date, currentMonth)
            const isToday_ = isToday(date)

            return (
              <div
                key={index}
                className={`min-h-[80px] p-1 border border-surface-200 dark:border-surface-700 rounded-lg ${
                  isCurrentMonth ? 'bg-white dark:bg-surface-800' : 'bg-surface-50 dark:bg-surface-900'
                } ${isToday_ ? 'ring-2 ring-primary' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? 'text-surface-900 dark:text-white' : 'text-surface-400'
                } ${isToday_ ? 'text-primary font-bold' : ''}`}>
                  {format(date, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map(task => {
                    const priorityConfig = getPriorityConfig(task.priority)
                    return (
                      <button
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className={`w-full text-left p-1 rounded text-xs truncate transition-all duration-200 ${
                          selectedTask?.id === task.id ? 'ring-2 ring-primary' : ''
                        } ${priorityConfig.color} text-white hover:opacity-80`}
                      >
                        {task.title}
                      </button>
                    )
                  })}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-surface-500 dark:text-surface-400">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Recurring Task Management Component
  const RecurringTaskManager = () => {
    const [expandedSeries, setExpandedSeries] = useState(null)

    return (
      <motion.div
        className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-task-card border border-white/20 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
              Recurring Task Series ({recurringSeries.length})
            </h3>
            <p className="text-surface-600 dark:text-surface-300 text-sm">
              Manage your recurring task templates and generated instances
            </p>
          </div>
          <button
            onClick={() => setShowRecurringForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
          >
            <ApperIcon name="Repeat" className="w-4 h-4" />
            <span>Create Recurring Task</span>
          </button>
        </div>

        {recurringSeries.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Repeat" className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
              No recurring tasks yet
            </h4>
            <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
              Create recurring tasks to automate your routine work
            </p>
            <button
              onClick={() => setShowRecurringForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Create Your First Recurring Task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recurringSeries.map(series => {
              const seriesInfo = getRecurringSeriesInfo(series.id)
              const isExpanded = expandedSeries === series.id
              const priorityConfig = getPriorityConfig(series.priority)
              const categoryConfig = getCategoryConfig(series.category)

              return (
                <div
                  key={series.id}
                  className="border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-surface-50 to-primary/5 dark:from-surface-700 dark:to-surface-800">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-surface-900 dark:text-white">
                            {series.title}
                          </h4>
                          <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs">
                            <ApperIcon name="Repeat" className="w-3 h-3" />
                            <span>{series.recurringPattern.type}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div className={`flex items-center space-x-1 px-2 py-1 ${priorityConfig.color} text-white rounded-lg text-xs`}>
                            <ApperIcon name={priorityConfig.icon} className="w-3 h-3" />
                            <span>{priorityConfig.label}</span>
                          </div>
                          <div className={`flex items-center space-x-1 px-2 py-1 ${categoryConfig.color} text-white rounded-lg text-xs`}>
                            <ApperIcon name="Tag" className="w-3 h-3" />
                            <span>{categoryConfig.label}</span>
                          </div>
                        </div>

                        {seriesInfo && (
                          <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400">
                            <span>{seriesInfo.totalGenerated} tasks generated</span>
                            <span>{seriesInfo.completed} completed</span>
                            <span>{seriesInfo.remaining} remaining</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setExpandedSeries(isExpanded ? null : series.id)}
                          className="p-2 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-lg transition-colors"
                        >
                          <ApperIcon 
                            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                            className="w-4 h-4 text-surface-500" 
                          />
                        </button>
                        <button
                          onClick={() => handleEdit(series)}
                          className="p-2 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Edit2" className="w-4 h-4 text-surface-500 hover:text-primary" />
                        </button>
                        <button
                          onClick={() => regenerateRecurringTasks(series.id)}
                          className="p-2 hover:bg-surface-100 dark:hover:bg-surface-600 rounded-lg transition-colors"
                          title="Regenerate task instances"
                        >
                          <ApperIcon name="RefreshCw" className="w-4 h-4 text-surface-500 hover:text-primary" />
                        </button>
                        <button
                          onClick={() => deleteRecurringSeries(series.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4 text-surface-500 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && seriesInfo && (
                    <div className="p-4 border-t border-surface-200 dark:border-surface-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="text-sm font-semibold text-surface-900 dark:text-white mb-2">
                            Recurrence Details
                          </h5>
                          <div className="space-y-1 text-sm text-surface-600 dark:text-surface-400">
                            <p>Pattern: {series.recurringPattern.type} every {series.recurringPattern.interval} {series.recurringPattern.type}(s)</p>
                            {series.recurringPattern.daysOfWeek && series.recurringPattern.daysOfWeek.length > 0 && (
                              <p>Days: {series.recurringPattern.daysOfWeek.map(day => daysOfWeek.find(d => d.value === day)?.short).join(', ')}</p>
                            )}
                            {series.recurringPattern.endDate && (
                              <p>End Date: {format(new Date(series.recurringPattern.endDate), 'MMM dd, yyyy')}</p>
                            )}
                            {series.recurringPattern.maxOccurrences && (
                              <p>Max Occurrences: {series.recurringPattern.maxOccurrences}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-semibold text-surface-900 dark:text-white mb-2">
                            Progress Overview
                          </h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-surface-600 dark:text-surface-400">Completion Rate</span>
                              <span className="font-medium text-surface-900 dark:text-white">
                                {seriesInfo.totalGenerated > 0 ? Math.round((seriesInfo.completed / seriesInfo.totalGenerated) * 100) : 0}%
                              </span>
                            </div>
                            <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                              <div 
                                className="bg-accent rounded-full h-2 transition-all duration-300"
                                style={{ 
                                  width: `${seriesInfo.totalGenerated > 0 ? (seriesInfo.completed / seriesInfo.totalGenerated) * 100 : 0}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                </div>

                        <h5 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">
                          Generated Tasks (Last 5)
                        </h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {tasks
                            .filter(t => series.recurringPattern.generatedTaskIds.includes(t.id))
                            .slice(-5)
                            .map(task => {
                              const taskPriorityConfig = getPriorityConfig(task.priority)
                              const taskStatusConfig = getStatusConfig(task.status)
                              
                              return (
                                <div
                                  key={task.id}
                                  className="flex items-center justify-between p-2 bg-surface-50 dark:bg-surface-700 rounded-lg"
                                >
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <div className={`w-3 h-3 rounded-full ${taskStatusConfig.color}`}></div>
                                    <span className="text-sm text-surface-900 dark:text-white truncate">
                                      {task.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-surface-500 dark:text-surface-400">
                                      {task.dueDate && format(new Date(task.dueDate), 'MMM dd')}
                                    </span>
                                    <button
                                      onClick={() => setSelectedTask(task)}
                                      className="p-1 hover:bg-surface-200 dark:hover:bg-surface-600 rounded transition-colors"
                                    >
                                      <ApperIcon name="Eye" className="w-3 h-3 text-surface-500" />
                                    </button>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </motion.div>
    )
  }

  // Recurring Task Form Component
  const RecurringTaskForm = () => {
    return (
      <AnimatePresence>
        {showRecurringForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowRecurringForm(false)}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl border border-white/20 mx-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
                  Create Recurring Task Series
                </h3>
                <button
                  onClick={() => setShowRecurringForm(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>
              <form onSubmit={(e) => {
                setFormData(prev => ({ ...prev, isRecurring: true }))
                handleSubmit(e)
              }} className="space-y-6">
                {/* Basic Task Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-surface-900 dark:text-white border-b border-surface-200 dark:border-surface-700 pb-2">
                    Basic Information
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter recurring task title..."
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
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter task description..."
                      rows="3"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
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
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                </div>
    )
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-surface-900 dark:text-white border-b border-surface-200 dark:border-surface-700 pb-2">
                    Recurrence Pattern
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Repeat Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {recurringPatterns.map(pattern => (
                          <button
                            key={pattern.value}
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              recurringPattern: { ...formData.recurringPattern, type: pattern.value }
                            })}
                            className={`flex items-center space-x-2 p-3 rounded-xl text-sm font-medium transition-all ${
                              formData.recurringPattern.type === pattern.value
                                ? 'bg-primary text-white shadow-soft'
                                : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                            }`}
                          >
                            <ApperIcon name={pattern.icon} className="w-4 h-4" />
                            <span>{pattern.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Repeat Every
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={formData.recurringPattern.interval}
                          onChange={(e) => setFormData({
                            ...formData,
                            recurringPattern: { ...formData.recurringPattern, interval: parseInt(e.target.value) || 1 }
                          })}
                          className="flex-1 px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-surface-600 dark:text-surface-400">
                          {formData.recurringPattern.type}(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Days Selection */}
                  {formData.recurringPattern.type === 'weekly' && (
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Days of the Week *
                      </label>
                      <div className="grid grid-cols-7 gap-2">
                        {daysOfWeek.map(day => (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() => {
                              const currentDays = formData.recurringPattern.daysOfWeek || []
                              const newDays = currentDays.includes(day.value)
                                ? currentDays.filter(d => d !== day.value)
                                : [...currentDays, day.value]
                              
                              setFormData({
                                ...formData,
                                recurringPattern: { ...formData.recurringPattern, daysOfWeek: newDays }
                              })
                            }}
                            className={`p-2 rounded-lg text-xs font-medium transition-all ${
                              formData.recurringPattern.daysOfWeek?.includes(day.value)
                                ? 'bg-primary text-white shadow-soft'
                                : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                            }`}
                          >
                            {day.short}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* End Conditions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.recurringPattern.endDate || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          recurringPattern: { ...formData.recurringPattern, endDate: e.target.value || null }
                        })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Max Occurrences (Optional)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={formData.recurringPattern.maxOccurrences || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          recurringPattern: { ...formData.recurringPattern, maxOccurrences: parseInt(e.target.value) || null }
                        })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., 10"
                      />
                    </div>
                  </div>
                </div>

                {/* Assignment */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Assign to Team Member
                  </label>
                  <select
                    value={formData.assignedTo || ''}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value || null })}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
                  >
                    Create Recurring Task Series
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRecurringForm(false)}
                    className="px-6 py-3 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 font-semibold rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Task Detail Modal Component
  const TaskDetailModal = ({ task, onClose }) => {
    if (!task) return null

    const priorityConfig = getPriorityConfig(task.priority)
    const statusConfig = getStatusConfig(task.status)
    const categoryConfig = getCategoryConfig(task.category)
    const isOverdue = isPast(new Date(task.dueDate)) && task.status !== 'completed'

    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="bg-white dark:bg-surface-800 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl border border-white/20 mx-4"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
                  {task.title}
                </h3>
                {getCommentCount(task.comments || []) > 0 && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                    <ApperIcon name="MessageCircle" className="w-4 h-4" />
                    <span>{getCommentCount(task.comments || [])}</span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Task details content */}
            <div className="mb-6">
              <p className="text-surface-600 dark:text-surface-300 mb-4">
                {task.description || 'No description provided.'}
              </p>
              
              {/* Task meta information */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className={`flex items-center space-x-1 px-3 py-1 ${priorityConfig.color} text-white rounded-lg text-sm`}>
                  <ApperIcon name={priorityConfig.icon} className="w-4 h-4" />
                  <span>{priorityConfig.label}</span>
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1 ${statusConfig.color} text-white rounded-lg text-sm`}>
                  <ApperIcon name={statusConfig.icon} className="w-4 h-4" />
                  <span>{statusConfig.label}</span>
                </div>
              </div>
            </div>

            {/* Comment Section */}
            <CommentSection task={task} />
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Recurring Task Form */}
      <RecurringTaskForm />

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetailModal 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
          />
        )}
      </AnimatePresence>

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

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Link
              to="/dashboard"
              className="group flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-soft hover:shadow-card transition-all duration-300"
            >
              <ApperIcon name="BarChart3" className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm sm:text-base">Dashboard</span>
            </Link>
            
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
        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                viewMode === 'list' ? 'bg-primary text-white shadow-soft' : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
              }`}
            >
              <ApperIcon name="List" className="w-4 h-4 inline mr-2" />
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                viewMode === 'calendar' ? 'bg-primary text-white shadow-soft' : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
              }`}
            >
              <ApperIcon name="Calendar" className="w-4 h-4 inline mr-2" />
              Calendar View
            </button>
          </div>
        </div>

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

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <CalendarView />
        </motion.div>
      )}

      {/* Recurring Task Manager */}
      <RecurringTaskManager />

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
              className="bg-white dark:bg-surface-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl border border-white/20 mx-4"
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

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Assign to Team Member
                  </label>
                  <select
                    value={formData.assignedTo || ''}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value || null })}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Attachments
                  </label>
                  <div className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl p-4 hover:border-primary dark:hover:border-primary transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                      <ApperIcon name="Upload" className="w-8 h-8 text-surface-400 dark:text-surface-500 mb-2" />
                      <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">
                        Click to upload files or drag and drop
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-500">
                        Maximum 5 files, 10MB each. Supports images, PDFs, documents, and archives.
                      </p>
                    </label>
                  </div>

                  {/* Uploaded Files Preview */}
                  {formData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-surface-700 dark:text-surface-300">
                        Uploaded Files ({formData.attachments.length}/5)
                      </p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {formData.attachments.map(attachment => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700 rounded-lg"
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <ApperIcon 
                                name={getFileIcon(attachment.type)} 
                                className="w-5 h-5 text-primary flex-shrink-0" 
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                                  {attachment.name}
                                </p>
                                <p className="text-xs text-surface-500 dark:text-surface-400">
                                  {formatFileSize(attachment.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(attachment.id)}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                            >
                              <ApperIcon name="X" className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                  id={`task-${task.id}`}
                  key={task.id}
                  className={`group relative bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft hover:shadow-task-card border border-white/20 transition-all duration-300 ${
                    task.status === 'completed' ? 'opacity-75' : ''
                  } ${isOverdue ? 'border-red-300 dark:border-red-600' : ''} ${
                    selectedTask?.id === task.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  {/* Recurring Task Indicator */}
                  {task.recurringParentId && (
                    <div className="absolute top-2 left-2 flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs">
                      <ApperIcon name="Repeat" className="w-3 h-3" />
                      <span>Recurring</span>
                    </div>
                  )}

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
                    <div className="flex-1 min-w-0 flex space-x-4">
                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                          <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className={`text-lg sm:text-xl font-semibold ${
                                task.status === 'completed' ? 'line-through text-surface-500' : 'text-surface-900 dark:text-white'
                              }`}>
                                {task.title}
                              </h4>
                              {task.assignedTo && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-surface-500 dark:text-surface-400">assigned to</span>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                      {getTeamMember(task.assignedTo)?.avatar ? (
                                        <img 
                                          src={getTeamMember(task.assignedTo).avatar} 
                                          alt={getTeamMember(task.assignedTo).name}
                                          className="w-5 h-5 rounded-full object-cover"
                                        />
                                      ) : (
                                        <span className="text-xs font-medium text-primary">
                                          {getTeamMember(task.assignedTo)?.initials}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                                      {getTeamMember(task.assignedTo)?.name.split(' ')[0]}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            {task.description && (
                              <p className="text-sm sm:text-base text-surface-600 dark:text-surface-300 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </div>

                          {/* Task Actions */}
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <button
                              onClick={() => setSelectedTask(task)}
                              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                            >
                              <ApperIcon name="Eye" className="w-4 h-4 text-surface-500 hover:text-primary" />
                            </button>
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

                          {/* Comment Count Badge */}
                          {getCommentCount(task.comments || []) > 0 && (
                            <div className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs sm:text-sm font-medium">
                              <ApperIcon name="MessageCircle" className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{getCommentCount(task.comments || [])}</span>
                              <span className="hidden sm:inline">comments</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Assigned Team Member Display */}
                      {task.assignedTo && (
                        <div className="flex-shrink-0">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-white dark:border-surface-800 shadow-soft">
                              {getTeamMember(task.assignedTo)?.avatar ? (
                                <img 
                                  src={getTeamMember(task.assignedTo).avatar} 
                                  alt={getTeamMember(task.assignedTo).name}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <span className="text-sm sm:text-base font-bold text-primary">
                                  {getTeamMember(task.assignedTo)?.initials}
                                </span>
                              )}
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium text-surface-700 dark:text-surface-300">
                                {getTeamMember(task.assignedTo)?.name.split(' ')[0]}
                              </p>
                              <p className="text-xs text-surface-500 dark:text-surface-400">
                                {getTeamMember(task.assignedTo)?.role.split(' ')[0]}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Team Member Details - Expanded when viewing task details */}
                  {selectedTask?.id === task.id && task.assignedTo && (
                    <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                      <h5 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">
                        Assigned Team Member
                      </h5>
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-surface-50 to-primary/5 dark:from-surface-700 dark:to-surface-800 rounded-xl">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-white dark:border-surface-700 shadow-soft">
                          {getTeamMember(task.assignedTo)?.avatar ? (
                            <img 
                              src={getTeamMember(task.assignedTo).avatar} 
                              alt={getTeamMember(task.assignedTo).name}
                              className="w-14 h-14 rounded-xl object-cover"
                            />
                          ) : (
                            <span className="text-lg font-bold text-primary">
                              {getTeamMember(task.assignedTo)?.initials}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h6 className="text-lg font-bold text-surface-900 dark:text-white">
                            {getTeamMember(task.assignedTo)?.name}
                          </h6>
                          <p className="text-sm text-primary font-medium">
                            {getTeamMember(task.assignedTo)?.role}
                          </p>
                          <p className="text-sm text-surface-600 dark:text-surface-400">
                            {getTeamMember(task.assignedTo)?.email}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(getTeamMember(task.assignedTo)?.email)
                              toast.success('Email copied to clipboard!')
                            }}
                            className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                          >
                            <ApperIcon name="Mail" className="w-4 h-4 text-primary" />
                          </button>
                          <button
                            onClick={() => toast.info(`Contact ${getTeamMember(task.assignedTo)?.name} for task updates`)}
                            className="p-2 bg-surface-100 dark:bg-surface-600 hover:bg-surface-200 dark:hover:bg-surface-500 rounded-lg transition-colors"
                          >
                            <ApperIcon name="MessageCircle" className="w-4 h-4 text-surface-600 dark:text-surface-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attachments Display */}
                  {task.attachments && task.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                      <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Attachments ({task.attachments.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {task.attachments.map(attachment => (
                          <button
                            key={attachment.id}
                            onClick={() => downloadAttachment(attachment)}
                            className="flex items-center space-x-2 px-3 py-2 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-lg transition-colors text-sm group"
                          >
                            <ApperIcon name={getFileIcon(attachment.type)} className="w-4 h-4 text-primary" />
                            <span className="text-surface-700 dark:text-surface-300 truncate max-w-[120px]">
                              {attachment.name}
                            </span>
                            <ApperIcon name="Download" className="w-3 h-3 text-surface-500 group-hover:text-primary transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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