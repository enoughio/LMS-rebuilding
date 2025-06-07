// Enums matching backend schema
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH"

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED"

export type HabitFrequency = "DAILY" | "WEEKDAYS" | "WEEKLY"

export type TimeOfDay = "MORNING" | "AFTERNOON" | "EVENING"

// Main types matching backend schema
export type StudySession = {
  id: string
  date: string
  startTime: string // Format: "HH:MM"
  endTime: string // Format: "HH:MM"
  duration: number // in minutes
  subject: string
  notes?: string
  createdAt?: string
  updatedAt?: string
  userId: string
}

export type Task = {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority: TaskPriority
  status: TaskStatus
  createdAt?: string
  updatedAt?: string
  userId: string
}

export type HabitCompletion = {
  id: string
  date: string
  completed?: boolean
  habitId: string
}

export type Habit = {
  id: string
  title: string
  description?: string
  frequency: HabitFrequency
  timeOfDay: TimeOfDay
  streak?: number
  createdAt?: string
  updatedAt?: string
  userId: string
  // Relations (optional)
  completionHistory?: HabitCompletion[]
}

export type StreakHistory = {
  id: string
  date: string
  hours: number
  goalMet?: boolean
  streakId: string
}

export type StudyStreak = {
  id: string
  currentStreak?: number
  longestStreak?: number
  totalStudyDays?: number
  totalStudyHours?: number
  dailyGoalHours?: number
  createdAt?: string
  updatedAt?: string
  userId: string
  // Relations (optional)
  streakHistory?: StreakHistory[]
}

// Legacy types for backwards compatibility
export type HabitCompletionEntry = {
  date: string
  completed: boolean
}

export type StreakHistoryEntry = {
  date: string
  hours: number
  goalMet: boolean
}
