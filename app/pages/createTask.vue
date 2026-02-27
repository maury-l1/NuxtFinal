<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-8">Crear Task</h1>

    <UForm
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      class="space-y-8"
    >
      <!-- Title -->
      <UFormGroup label="Títol" name="title" class="mb-4">
        <UInput
          v-model="state.title"
          placeholder="Escriu el títol de la task..."
          class="px-4 py-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </UFormGroup>

      <!-- Description -->
      <UFormGroup label="Descripció" name="description" class="mb-4">
        <UInput
          v-model="state.description"
          placeholder="Opcional: afegeix una descripció..."
          class="px-4 py-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </UFormGroup>

      <!-- Final Date -->
      <UFormGroup label="Data final" name="finalDate" class="mb-4">
        <UInput
          type="date"
          v-model="state.finalDate"
          placeholder="Selecciona una data final"
          class="px-4 py-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </UFormGroup>

      <!-- Submit -->
      <UButton
        type="submit"
        :loading="loading"
        block
        class="py-3 px-4 rounded-md text-white font-semibold"
      >
        Crear Task
      </UButton>
    </UForm>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
import { z } from "zod";
import { ref, reactive } from "vue";

const toast = useToast();
const loading = ref(false);

// ✅ Esquema Zod
const schema = z.object({
  title: z.string().min(3, "El títol ha de tenir mínim 3 caràcters"),
  description: z.string().optional(),
  finalDate: z.string().optional(),
});

// ✅ Estat reactiu
const state = reactive({
  title: "",
  description: "",
  finalDate: "",
});

// ✅ Submit
async function onSubmit() {
  loading.value = true;
  try {
    await $fetch("/api/tasks", {
      method: "POST",
      body: state,
    });

    toast.add({
      title: "Task creada",
      description: "La task s'ha creat correctament ✅",
      color: "success",
    });

    state.title = "";
    state.description = "";
    state.finalDate = "";

  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error?.data?.statusMessage || "Error en crear la task",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>