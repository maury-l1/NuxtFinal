<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-center">Mis Tasks</h1>

    <div v-if="loading" class="text-center">Cargando...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else class="space-y-6">
      <div
        v-for="task in data"
        :key="task.id"
        class="p-6 border rounded flex flex-col md:flex-row md:items-start justify-between bg-white shadow-md max-w-xl mx-auto"
      >
        <!-- Task info -->
        <div class="mb-4 md:mb-0">
          <p class="font-semibold text-gray-800 text-lg">{{ task.title }}</p>
          <p class="text-gray-600">{{ task.description }}</p>
          <p class="text-gray-500 text-sm mt-1">Final: {{ task.finalDate }}</p>
        </div>

        <!-- Botones Editar / Eliminar -->
        <div class="flex gap-3 md:ml-4">
          <button
            @click="editTask(task)"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            @click="deleteTask(task.id)"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>

      <!-- Formulario inline para editar task -->
      <div
        v-if="editingTask"
        class="mt-6 p-6 border rounded bg-gray-100 max-w-xl mx-auto space-y-3"
      >
        <h2 class="font-bold mb-2 text-lg">Editar Task</h2>
        <input
          v-model="editingTask.title"
          placeholder="Título"
          class="border p-3 w-full rounded"
        />
        <textarea
          v-model="editingTask.description"
          placeholder="Descripción"
          class="border p-3 w-full rounded"
        ></textarea>
        <input
          v-model="editingTask.finalDate"
          placeholder="Fecha final"
          type="date"
          class="border p-3 w-full rounded"
        />
        <div class="flex gap-3 justify-end">
          <button
            @click="saveTask"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Guardar
          </button>
          <button
            @click="cancelEdit"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
});
import { ref, onMounted } from "vue";

const error = ref(null);
const loading = ref(true);
const data = ref([]);
const editingTask = ref(null); // task que estamos editando

// Cargar todas las tasks
async function fetchTasks() {
  loading.value = true;
  try {
    const res = await fetch("/api/tasks");
    if (!res.ok) throw new Error("No autorizado");
    const json = await res.json();
    data.value = json;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchTasks();
});

// Editar task
function editTask(task) {
  editingTask.value = { ...task }; // clonar
}

// Cancelar edición
function cancelEdit() {
  editingTask.value = null;
}

// Guardar cambios
async function saveTask() {
  try {
    const res = await fetch(`/api/tasks/${editingTask.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editingTask.value.title,
        description: editingTask.value.description,
        finalDate: editingTask.value.finalDate,
      }),
    });
    if (!res.ok) throw new Error("Error al actualizar task");

    const updated = await res.json();
    // actualizar lista local
    const index = data.value.findIndex(t => t.id === updated.id);
    if (index !== -1) data.value[index] = updated;

    editingTask.value = null;
  } catch (err) {
    alert(err.message);
  }
}

// Eliminar task
async function deleteTask(id) {
  if (!confirm("¿Seguro que quieres eliminar esta task?")) return;

  try {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar task");

    // quitar de la lista local
    data.value = data.value.filter(t => t.id !== id);
  } catch (err) {
    alert(err.message);
  }
}
</script>