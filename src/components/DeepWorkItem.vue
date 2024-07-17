<template>
    <div class="mb-6 p-4 border rounded relative shadow-md">
      <h2 class="text-2xl font-bold mb-2">{{ work.name }}</h2>
      <p class="mb-2">
        {{ truncatedDescription }}
        <a v-if="isDescriptionTruncated" @click="showFullDescription = !showFullDescription" class="text-blue-500 cursor-pointer">
          {{ showFullDescription ? 'Read less' : 'Read more' }}
        </a>
      </p>
      <p v-if="showFullDescription" class="mb-2">{{ work.description }}</p>
      <div class="flex items-center mb-2">
        <div class="w-full bg-gray-200 rounded-full h-2.5 mr-4 overflow-hidden">
          <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" :style="{ width: `${(work.timeSpent / (work.hours * 3600)) * 100}%` }"></div>
        </div>
        <span class="whitespace-nowrap w-40 text-right">{{ (work.timeSpent / 3600).toFixed(5) }} / {{ work.hours }} hours</span>
      </div>
      <div class="flex items-center justify-between">
        <button @click="$emit('toggle', work)" class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
          {{ work.isActive ? 'Pause' : 'Work' }}
        </button>
        <span class="text-sm text-gray-600">{{ remainingTimeText }}</span>
      </div>
      
      <!-- Dropdown menu -->
      <div class="absolute top-2 right-2">
        <button @click="toggleDropdown" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <a @click="emitAction('edit')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
          <a @click="emitAction('toggleComplete')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            {{ work.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete' }}
          </a>
          <a @click="emitAction('reset')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Reset</a>
          <a @click="emitAction('delete')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</a>
        </div>
      </div>
  
      <div v-if="work.isCompleted" class="absolute top-2 right-10 text-green-500">
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
  
      const truncatedDescription = computed(() => {
        return props.work.description.length > 100
          ? props.work.description.slice(0, 100) + '...'
          : props.work.description
      })
  
      const isDescriptionTruncated = computed(() => {
        return props.work.description.length > 100
      })
  
      const remainingTimeText = computed(() => {
        const remainingSeconds = props.work.hours * 3600 - props.work.timeSpent
        const hours = Math.floor(remainingSeconds / 3600)
        const minutes = Math.floor((remainingSeconds % 3600) / 60)
  
        let text = ''
        if (hours > 0) {
          text += `${hours} hour${hours > 1 ? 's' : ''}`
        }
        if (minutes > 0) {
          if (text) text += ' '
          text += `${minutes} minute${minutes > 1 ? 's' : ''}`
        }
        return text ? `${text} remaining` : 'Completed'
      })
  
      return {
        showDropdown,
        showFullDescription,
        toggleDropdown,
        emitAction,
        truncatedDescription,
        isDescriptionTruncated,
        remainingTimeText
      }
    }
  }
  </script>