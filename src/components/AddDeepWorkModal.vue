<template>
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="bg-white p-5 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">{{ editWork ? 'Edit Deep Work' : 'Add New Deep Work' }}</h2>
        <input v-model="newWork.name" placeholder="Name" class="border p-2 mb-2 w-full rounded">
        <p v-if="showNameValidation" class="text-red-500 text-sm mb-2">Please enter a name for your Deep Work.</p>
        <textarea v-model="newWork.description" placeholder="Description" class="border p-2 mb-2 w-full rounded" rows="3"></textarea>
        <div class="mb-4">
          <p class="mb-2">Select hours:</p>
          <div class="flex space-x-2">
            <button 
              v-for="hour in [5, 20, 100]" 
              :key="hour"
              @click="setHours(hour)" 
              :class="[
                'py-1 px-3 rounded transition-colors duration-200',
                newWork.hours === hour 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              ]"
            >
              {{ hour }}
            </button>
            <button 
              @click="toggleCustomHours" 
              :class="[
                'py-1 px-3 rounded transition-colors duration-200',
                showCustomHours 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              ]"
            >
              Custom
            </button>
          </div>
        </div>
        <div v-if="showCustomHours" class="mb-4">
          <input 
            v-model.number="newWork.hours" 
            type="number" 
            min="1" 
            max="1000" 
            class="border p-2 w-full rounded" 
            placeholder="Enter custom hours (1-1000)"
          >
        </div>
        <div class="flex justify-end">
          <button @click="saveDeepWork" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
            {{ editWork ? 'Save' : 'Add' }}
          </button>
          <button @click="$emit('close')" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue'
  
  export default {
    name: 'AddDeepWorkModal',
    props: {
      editWork: {
        type: Object,
        default: null
      }
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
      const newWork = ref({ name: '', description: '', hours: 20 })
      const showNameValidation = ref(false)
      const showCustomHours = ref(false)
  
      watch(() => props.editWork, (work) => {
        if (work) {
          newWork.value = { ...work }
          showCustomHours.value = ![5, 20, 100].includes(work.hours)
        } else {
          newWork.value = { name: '', description: '', hours: 20 }
          showCustomHours.value = false
        }
      }, { immediate: true })
  
      const setHours = (hours) => {
        newWork.value.hours = hours
        showCustomHours.value = false
      }
  
      const toggleCustomHours = () => {
        showCustomHours.value = !showCustomHours.value
        if (showCustomHours.value) {
          newWork.value.hours = null
        } else {
          newWork.value.hours = 20
        }
      }
  
      const saveDeepWork = () => {
        if (newWork.value.name && newWork.value.hours > 0) {
          emit('save', newWork.value)
        } else {
          showNameValidation.value = true
        }
      }
  
      return {
        newWork,
        showNameValidation,
        showCustomHours,
        setHours,
        toggleCustomHours,
        saveDeepWork
      }
    }
  }
  </script>