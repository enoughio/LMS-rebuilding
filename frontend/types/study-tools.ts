export type StudySession = {
  id: string
  userId: string
  date: string
  duration: number // in minutes
  subject: string
  notes?: string
  startTime: string
  endTime: string
}

export type TaskPriority = "low" | "medium" | "high"
export type TaskStatus = "pending" | "in-progress" | "completed"

export type Task = {
  id: string
  userId: string
  title: string
  description?: string
  dueDate?: string
  priority: TaskPriority
  status: TaskStatus
  createdAt: string
}

export type HabitFrequency = "daily" | "weekdays" | "weekly"
export type TimeOfDay = "morning" | "afternoon" | "evening"

export type HabitCompletionEntry = {
  date: string
  completed: boolean
}

export type Habit = {
  id: string
  userId: string
  title: string
  description?: string
  frequency: HabitFrequency
  timeOfDay: TimeOfDay
  streak: number
  createdAt: string
  completionHistory: HabitCompletionEntry[]
}

export type StreakHistoryEntry = {
  date: string
  hours: number
  goalMet: boolean
}

export type StudyStreak = {
  userId: string
  currentStreak: number
  longestStreak: number
  totalStudyDays: number
  totalStudyHours: number
  dailyGoalHours: number
  streakHistory: StreakHistoryEntry[]
}
