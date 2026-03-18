<template>
  <div id="app" class="bg-light min-vh-100 d-flex flex-column">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid px-4">
        <router-link class="navbar-brand fw-bold fs-4" to="/painel">
          <i class="bi bi-heart-pulse-fill me-2"></i>Clínica Médica UVA
        </router-link>
        
        <div class="d-flex ms-auto align-items-center">
          <template v-if="!usuario">
            <router-link class="btn btn-outline-light border-2 fw-bold me-2" to="/">Fazer Login</router-link>
            <router-link class="btn btn-light text-primary fw-bold" to="/cadastro">Cadastrar-se</router-link>
          </template>
          
          <template v-else>
            <span class="text-white me-3 fw-medium d-none d-md-block">
              <i class="bi bi-person-circle me-1"></i> Olá, {{ usuario.nome }}
            </span>
            <button @click="fazerLogout" class="btn btn-danger btn-sm fw-bold px-3">
              <i class="bi bi-box-arrow-right me-1"></i> Sair
            </button>
          </template>
        </div>
      </div>
    </nav>

    <main class="flex-grow-1 p-3 p-md-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const usuario = ref(null);

onMounted(() => {
  const userStorage = localStorage.getItem('usuario');
  if (userStorage) {
    usuario.value = JSON.parse(userStorage);
  }
});

const fazerLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/'; 
};
</script>

<style>

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}
</style>