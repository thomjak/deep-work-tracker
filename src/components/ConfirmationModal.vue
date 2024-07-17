<template>
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="bg-white p-5 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
        <p class="mb-4">{{ message }}</p>
        <div class="flex justify-end">
          <button @click="$emit('confirm')" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            {{ confirmText }}
          </button>
          <button @click="$emit('cancel')" class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ConfirmationModal',
    props: {
      title: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      confirmText: {
        type: String,
        default: 'Confirm'
      },
      cancelText: {
        type: String,
        default: 'Cancel'
      }
    },
    emits: ['confirm', 'cancel']
  }
  </script>