<template>
  <div>
    <button @click="showAddModal = true" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 w-full">
      Add Deep Work...
    </button>

    <AddDeepWorkModal v-if="showAddModal" :editWork="editingWork" @close="closeModal" @save="saveWork" />

    <ConfirmationModal 
      v-if="showConfirmationModal"
      :title="confirmationModalData.title"
      :message="confirmationModalData.message"
      :confirmText="confirmationModalData.confirmText"
      :cancelText="confirmationModalData.cancelText"
      @confirm="confirmationModalData.onConfirm"
      @cancel="closeConfirmationModal"
    />

    <DeepWorkItem 
      v-for="work in store.works" 
      :key="work.id" 
      :work="work"
      @edit="editWork"
      @toggleComplete="toggleComplete"
      @reset="confirmReset"
      @delete="confirmDelete"
      @toggle="toggleWork"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useDeepWorkStore, initializeStore } from '../store/deepWork'
import AddDeepWorkModal from './AddDeepWorkModal.vue'
import DeepWorkItem from './DeepWorkItem.vue'
import ConfirmationModal from './ConfirmationModal.vue'

export default {
  name: 'DeepWorkTracker',
  components: {
    AddDeepWorkModal,
    DeepWorkItem,
    ConfirmationModal
  },
  setup() {
    const showAddModal = ref(false)
    const showConfirmationModal = ref(false)
    const store = useDeepWorkStore()
    const editingWork = ref(null)
    const confirmationModalData = reactive({
      title: '',
      message: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm: () => {}
    })

    onMounted(() => {
      initializeStore()
    })

    onUnmounted(() => {
      store.stopTimeTracking()
    })

    const closeModal = () => {
      showAddModal.value = false
      editingWork.value = null
    }

    const saveWork = (workData) => {
      if (editingWork.value) {
        store.updateWork(editingWork.value.id, workData)
      } else {
        store.addDeepWork(workData)
      }
      closeModal()
    }

    const editWork = (work) => {
      editingWork.value = work
      showAddModal.value = true
    }

    const toggleComplete = (work) => {
      store.toggleComplete(work.id)
    }

    const confirmReset = (work) => {
      showConfirmationModal.value = true
      confirmationModalData.title = 'Reset Deep Work'
      confirmationModalData.message = `Are you sure you want to reset "${work.name}"? This will set the time spent back to 0.`
      confirmationModalData.onConfirm = () => {
        store.resetWork(work.id)
        closeConfirmationModal()
      }
    }

    const confirmDelete = (work) => {
      showConfirmationModal.value = true
      confirmationModalData.title = 'Delete Deep Work'
      confirmationModalData.message = `Are you sure you want to delete "${work.name}"? This action cannot be undone.`
      confirmationModalData.onConfirm = () => {
        store.deleteWork(work.id)
        closeConfirmationModal()
      }
    }

    const toggleWork = (work) => {
      const activeWork = store.works.find(w => w.isActive && w.id !== work.id)
      if (activeWork) {
        showConfirmationModal.value = true
        confirmationModalData.title = 'Switch Active Deep Work'
        confirmationModalData.message = `Do you want to pause "${activeWork.name}" and start "${work.name}"?`
        confirmationModalData.onConfirm = () => {
          store.toggleWork(work.id)
          closeConfirmationModal()
        }
      } else {
        store.toggleWork(work.id)
      }
    }

    const closeConfirmationModal = () => {
      showConfirmationModal.value = false
    }

    return {
      showAddModal,
      showConfirmationModal,
      store,
      editingWork,
      confirmationModalData,
      closeModal,
      saveWork,
      editWork,
      toggleComplete,
      confirmReset,
      confirmDelete,
      toggleWork,
      closeConfirmationModal
    }
  }
}
</script>