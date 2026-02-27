<script setup lang="ts">
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();
</script>
<template>
  <UCard class="flex justify-end">
    <div v-if="!loggedIn" class="flex items-center gap-4">
      {{ user?.login }}
      <UButton @click="
        clear();
      navigateTo('/login');
      ">Login</UButton>
      <UButton @click="
        clear();
      navigateTo('/register');
      ">Register</UButton>
    </div>
    <div v-else>
      <UButton>
        <NuxtLink to="/createTask">Crear Tarea</NuxtLink>
        <NuxtLink to="/taskList">Mis tareas</NuxtLink>
        <UButton @click="
          clear();
        navigateTo('/login');
        ">Logout</UButton>
      </UButton>
    </div>
  </UCard>
</template>
