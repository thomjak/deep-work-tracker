<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-visible transition-all duration-300 hover:shadow-lg relative">
    <div class="p-4">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">{{ work.name }}</h2>
        <div class="flex items-center space-x-2">
          <button @click="$emit('toggle', work)" 
            :class="[
              'transition-colors duration-300 rounded-full p-2',
              work.isActive ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
            ]">
            <svg v-if="work.isActive" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <div class="relative">
            <button @click="toggleDropdown" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 dark:bg-gray-700 origin-top-right">
              <a @click="emitAction('edit')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer">Edit</a>
              <a @click="emitAction('toggleComplete')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                {{ work.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete' }}
              </a>
              <a @click="emitAction('reset')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer">Reset</a>
              <a @click="emitAction('delete')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer">Delete</a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-gray-600 dark:text-gray-300 mb-4">
        <div class="whitespace-pre-wrap" :class="{ 'line-clamp-3': !showFullDescription }">
          {{ work.description }}
        </div>
        <button 
          v-if="isDescriptionTruncated" 
          @click="showFullDescription = !showFullDescription" 
          class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mt-1"
        >
          {{ showFullDescription ? 'Read less' : 'Read more...' }}
        </button>
      </div>
      
      <div class="mb-2">
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
               :style="{ width: `${(work.timeSpent / (work.hours * 3600)) * 100}%` }"></div>
        </div>
      </div>
      
      <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>{{ formatTime(work.timeSpent) }} / {{ work.hours }} hours</span>
        <span>{{ remainingTimeText }}</span>
      </div>
    </div>

    <div v-if="work.isCompleted" class="absolute top-2 right-10 text-green-500 dark:text-green-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'DeepWorkItem',
  props: {
    work: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'toggleComplete', 'reset', 'delete', 'toggle'],
  setup(props, { emit }) {
    const showDropdown = ref(false)
    const showFullDescription = ref(false)

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }

    const emitAction = (action) => {
      emit(action, props.work)
      showDropdown.value = false
    }

    const isDescriptionTruncated = computed(() => {
      return props.work.description.split('\n').length > 3 || props.work.description.length > 200
    })

    const remainingTimeText = computed(() => {
      const remainingSeconds = props.work.hours * 3600 - props.work.timeSpent
      const hours = Math.floor(remainingSeconds / 3600)
      const minutes = Math.floor((remainingSeconds % 3600) / 60)

      let text = ''
      if (hours > 0) {
        text += `${hours}h`
      }
      if (minutes > 0 || (hours === 0 && minutes === 0)) {
        if (text) text += ' '
        text += `${minutes}m`
      }
      return text ? `${text} remaining` : 'Completed'
    })

    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours}h ${minutes}m`
    }

    return {
      showDropdown,
      showFullDescription,
      toggleDropdown,
      emitAction,
      isDescriptionTruncated,
      remainingTimeText,
      formatTime
    }
  }
}
</script>

<style>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>