import { defineStore } from 'pinia'

export const useDeepWorkStore = defineStore('deepWork', {
  state: () => ({
    works: [],
    lastUpdateTime: Date.now(),
    intervalId: null,
  }),

  actions: {
    addDeepWork(newWork) {
      this.works.push({
        id: Date.now(),
        name: newWork.name,
        description: newWork.description,
        hours: newWork.hours,
        timeSpent: 0,
        isActive: false,
        isCompleted: false,
        startTime: null,
      })
      this.saveToLocalStorage()
    },

    updateWork(id, updatedWork) {
      const index = this.works.findIndex(w => w.id === id)
      if (index !== -1) {
        this.works[index] = { ...this.works[index], ...updatedWork }
        this.saveToLocalStorage()
      }
    },

    toggleComplete(id) {
      const work = this.works.find(w => w.id === id)
      if (work) {
        work.isCompleted = !work.isCompleted
        if (work.isCompleted) {
          work.isActive = false
          work.startTime = null
        }
        this.saveToLocalStorage()
      }
    },

    resetWork(id) {
      const work = this.works.find(w => w.id === id)
      if (work) {
        work.timeSpent = 0
        work.isCompleted = false
        work.isActive = false
        work.startTime = null
        this.saveToLocalStorage()
      }
    },

    deleteWork(id) {
      const index = this.works.findIndex(w => w.id === id)
      if (index !== -1) {
        this.works.splice(index, 1)
        this.saveToLocalStorage()
      }
    },

    toggleWork(id) {
      const work = this.works.find(w => w.id === id)
      if (work) {
        if (work.isActive) {
          // Pause the work
          work.isActive = false
          work.timeSpent += (Date.now() - work.startTime) / 1000
          work.startTime = null
        } else {
          // Start the work
          // First, pause any other active work
          this.works.forEach(w => {
            if (w.isActive) {
              w.isActive = false
              w.timeSpent += (Date.now() - w.startTime) / 1000
              w.startTime = null
            }
          })
          work.isActive = true
          work.startTime = Date.now()
        }
        this.saveToLocalStorage()
      }
    },

    updateActiveWorks() {
      const now = Date.now()
      const timeDiff = (now - this.lastUpdateTime) / 1000
      this.lastUpdateTime = now

      this.works.forEach(work => {
        if (work.isActive) {
          work.timeSpent += timeDiff
          if (work.timeSpent >= work.hours * 3600) {
            work.isCompleted = true
            work.isActive = false
            work.startTime = null
          }
        }
      })

      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('deepWorks', JSON.stringify(this.works))
      localStorage.setItem('lastUpdateTime', this.lastUpdateTime.toString())
    },

    loadFromLocalStorage() {
      const savedWorks = localStorage.getItem('deepWorks')
      const savedLastUpdateTime = localStorage.getItem('lastUpdateTime')
      if (savedWorks) {
        this.works = JSON.parse(savedWorks)
      }
      if (savedLastUpdateTime) {
        this.lastUpdateTime = parseInt(savedLastUpdateTime, 10)
      }
      this.updateActiveWorks() // Update times on load
    },

    startTimeTracking() {
      if (typeof window !== 'undefined') {
        // Browser environment
        this.intervalId = setInterval(() => this.updateActiveWorks(), 1000)

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            // Clear the interval when the tab is not visible
            clearInterval(this.intervalId)
          } else {
            // When the tab becomes visible again, update times and restart the interval
            this.updateActiveWorks()
            this.intervalId = setInterval(() => this.updateActiveWorks(), 1000)
          }
        })
      }
    },

    stopTimeTracking() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }
    },
  },
})

// Initialize the store
export function initializeStore() {
  const store = useDeepWorkStore()
  store.loadFromLocalStorage()
  store.startTimeTracking()
  return store
}