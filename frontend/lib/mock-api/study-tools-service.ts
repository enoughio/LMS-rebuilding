import type { StudySession, Task, Habit, StudyStreak } from "@/types/study-tools"

// Mock study sessions
const studySessions: StudySession[] = [
  {
    id: "session-1",
    userId: "user-1",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Yesterday
    duration: 120, // 2 hours in minutes
    subject: "Mathematics",
    notes: "Worked on calculus problems",
    startTime: "10:00",
    endTime: "12:00",
  },
  {
    id: "session-2",
    userId: "user-1",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 days ago
    duration: 90, // 1.5 hours in minutes
    subject: "Physics",
    notes: "Read chapter 5 on thermodynamics",
    startTime: "14:00",
    endTime: "15:30",
  },
  {
    id: "session-3",
    userId: "user-1",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 days ago
    duration: 180, // 3 hours in minutes
    subject: "Computer Science",
    notes: "Practiced algorithms and data structures",
    startTime: "09:00",
    endTime: "12:00",
  },
  {
    id: "session-4",
    userId: "user-1",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 days ago
    duration: 150, // 2.5 hours in minutes
    subject: "English Literature",
    notes: "Analyzed Shakespeare's Hamlet",
    startTime: "16:00",
    endTime: "18:30",
  },
]

// Mock tasks
const tasks: Task[] = [
  {
    id: "task-1",
    userId: "user-1",
    title: "Complete calculus assignment",
    description: "Solve problems 1-10 from chapter 4",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 days from now
    priority: "high",
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "task-2",
    userId: "user-1",
    title: "Read physics textbook",
    description: "Chapter 6 on electromagnetism",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 days from now
    priority: "medium",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "task-3",
    userId: "user-1",
    title: "Prepare presentation",
    description: "Group presentation on renewable energy",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
    priority: "high",
    status: "in-progress",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "task-4",
    userId: "user-1",
    title: "Submit research paper",
    description: "Final draft of research paper on climate change",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 day ago
    priority: "high",
    status: "completed",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock habits
const habits: Habit[] = [
  {
    id: "habit-1",
    userId: "user-1",
    title: "Read for 30 minutes",
    description: "Read educational content for at least 30 minutes",
    frequency: "daily",
    timeOfDay: "evening",
    streak: 5,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completionHistory: [
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: true },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: true },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: true },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: true },
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: true },
      { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: false },
      { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: true },
    ],
  },
  {
    id: "habit-2",
    userId: "user-1",
    title: "Solve practice problems",
    description: "Solve at least 5 practice problems",
    frequency: "weekdays",
    timeOfDay: "afternoon",
    streak: 3,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    completionHistory: [
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: true },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: true },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: true },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: false },
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: true },
    ],
  },
  {
    id: "habit-3",
    userId: "user-1",
    title: "Review notes",
    description: "Review class notes and summarize key points",
    frequency: "weekly",
    timeOfDay: "evening",
    streak: 2,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    completionHistory: [
      { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: true },
      { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: true },
      { date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], completed: false },
    ],
  },
]

// Mock study streaks
const studyStreaks: StudyStreak = {
  userId: "user-1",
  currentStreak: 3,
  longestStreak: 7,
  totalStudyDays: 15,
  totalStudyHours: 45,
  dailyGoalHours: 2,
  streakHistory: [
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], hours: 2, goalMet: true },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], hours: 1.5, goalMet: false },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], hours: 3, goalMet: true },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], hours: 0, goalMet: false },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], hours: 2.5, goalMet: true },
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], hours: 2, goalMet: true },
    { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], hours: 2, goalMet: true },
  ],
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockStudyToolsService = {
  // Get study sessions for a user
  getStudySessions: async (userId: string): Promise<StudySession[]> => {
    await delay(600) // Simulate network delay
    return studySessions.filter((session) => session.userId === userId)
  },

  // Add a new study session
  addStudySession: async (sessionData: Omit<StudySession, "id">): Promise<StudySession> => {
    await delay(800) // Simulate network delay

    const newSession: StudySession = {
      id: `session-${studySessions.length + 1}`,
      ...sessionData,
    }

    studySessions.push(newSession)
    return newSession
  },

  // Get tasks for a user
  getTasks: async (userId: string, filter?: "all" | "pending" | "in-progress" | "completed"): Promise<Task[]> => {
    await delay(500) // Simulate network delay

    let userTasks = tasks.filter((task) => task.userId === userId)

    if (filter && filter !== "all") {
      userTasks = userTasks.filter((task) => task.status === filter)
    }

    return userTasks
  },

  // Add a new task
  addTask: async (taskData: Omit<Task, "id" | "createdAt">): Promise<Task> => {
    await delay(700) // Simulate network delay

    const newTask: Task = {
      id: `task-${tasks.length + 1}`,
      createdAt: new Date().toISOString(),
      ...taskData,
    }

    tasks.push(newTask)
    return newTask
  },

  // Update a task
  updateTask: async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
    await delay(600) // Simulate network delay

    const taskIndex = tasks.findIndex((t) => t.id === taskId)
    if (taskIndex === -1) {
      throw new Error("Task not found")
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...taskData,
    }

    return tasks[taskIndex]
  },

  // Get habits for a user
  getHabits: async (userId: string): Promise<Habit[]> => {
    await delay(500) // Simulate network delay
    return habits.filter((habit) => habit.userId === userId)
  },

  // Add a new habit
  addHabit: async (habitData: Omit<Habit, "id" | "createdAt" | "streak" | "completionHistory">): Promise<Habit> => {
    await delay(800) // Simulate network delay

    const newHabit: Habit = {
      id: `habit-${habits.length + 1}`,
      createdAt: new Date().toISOString(),
      streak: 0,
      completionHistory: [],
      ...habitData,
    }

    habits.push(newHabit)
    return newHabit
  },

  // Update habit completion
  updateHabitCompletion: async (habitId: string, date: string, completed: boolean): Promise<Habit> => {
    await delay(500) // Simulate network delay

    const habitIndex = habits.findIndex((h) => h.id === habitId)
    if (habitIndex === -1) {
      throw new Error("Habit not found")
    }

    const habit = habits[habitIndex]

    // Check if there's already an entry for this date
    const existingEntryIndex = habit.completionHistory.findIndex((entry) => entry.date === date)

    if (existingEntryIndex !== -1) {
      // Update existing entry
      habit.completionHistory[existingEntryIndex].completed = completed
    } else {
      // Add new entry
      habit.completionHistory.push({ date, completed })
    }

    // Update streak
    if (completed) {
      // Sort completion history by date (newest first)
      const sortedHistory = [...habit.completionHistory].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )

      // Calculate current streak
      let currentStreak = 0
      for (const entry of sortedHistory) {
        if (entry.completed) {
          currentStreak++
        } else {
          break
        }
      }

      habit.streak = currentStreak
    } else if (date === new Date().toISOString().split("T")[0]) {
      // If marking today as not completed, reset streak
      habit.streak = 0
    }

    return habit
  },

  // Get study streak for a user
  getStudyStreak: async (userId: string): Promise<StudyStreak> => {
    await delay(400) // Simulate network delay

    if (userId === studyStreaks.userId) {
      return studyStreaks
    }

    // Return empty streak data for other users
    return {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      totalStudyDays: 0,
      totalStudyHours: 0,
      dailyGoalHours: 2,
      streakHistory: [],
    }
  },

  // Update study streak
  updateStudyStreak: async (userId: string, date: string, hours: number): Promise<StudyStreak> => {
    await delay(600) // Simulate network delay

    if (userId !== studyStreaks.userId) {
      throw new Error("User not found")
    }

    const streak = studyStreaks

    // Check if there's already an entry for this date
    const existingEntryIndex = streak.streakHistory.findIndex((entry) => entry.date === date)
    const goalMet = hours >= streak.dailyGoalHours

    if (existingEntryIndex !== -1) {
      // Update existing entry
      streak.streakHistory[existingEntryIndex].hours = hours
      streak.streakHistory[existingEntryIndex].goalMet = goalMet
    } else {
      // Add new entry
      streak.streakHistory.push({ date, hours, goalMet })
    }

    // Sort streak history by date (newest first)
    streak.streakHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Update current streak
    let currentStreak = 0
    for (const entry of streak.streakHistory) {
      if (entry.goalMet) {
        currentStreak++
      } else {
        break
      }
    }

    streak.currentStreak = currentStreak

    // Update longest streak if needed
    if (currentStreak > streak.longestStreak) {
      streak.longestStreak = currentStreak
    }

    // Update total study hours
    streak.totalStudyHours = streak.streakHistory.reduce((total, entry) => total + entry.hours, 0)

    // Update total study days
    streak.totalStudyDays = streak.streakHistory.filter((entry) => entry.hours > 0).length

    return streak
  },
}
