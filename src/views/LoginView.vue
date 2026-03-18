<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5 col-xl-4">
      <div class="card shadow-sm border-0 rounded-4">
        <div class="card-header bg-light border-bottom-0 rounded-top-4 p-4 text-center">
          <i class="bi bi-heart-pulse-fill text-primary display-4 mb-2"></i>
          <h2 class="card-title text-primary fw-bold mb-0">Acesso ao Sistema</h2>
        </div>
        
        <div class="card-body p-4 p-md-5">
          <form @submit.prevent="fazerLogin">
            <div class="mb-4">
              <label for="email" class="form-label text-muted d-flex align-items-center mb-1">
                <i class="bi bi-envelope-fill me-2 fs-5 text-muted"></i>
                E-mail
              </label>
              <input 
                type="email" 
                v-model="email" 
                id="email" 
                class="form-control form-control-lg bg-light border-light-subtle rounded-3" 
                placeholder="seu@email.com"
                required
              />
            </div>

            <div class="mb-5">
              <label for="senha" class="form-label text-muted d-flex align-items-center mb-1">
                <i class="bi bi-lock-fill me-2 fs-5 text-muted"></i>
                Senha
              </label>
              <input 
                type="password" 
                v-model="senha" 
                id="senha" 
                class="form-control form-control-lg bg-light border-light-subtle rounded-3" 
                placeholder="********"
                required
              />
            </div>

            <div class="d-grid gap-2 mb-4">
              <button 
                type="submit" 
                class="btn btn-primary btn-lg fw-bold rounded-3 shadow-sm"
              >
                Entrar
              </button>
            </div>

            <div v-if="erroMensagem" class="alert alert-danger d-flex align-items-center rounded-3 p-2 mb-4" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
              <div>
                <strong class="me-1">Aviso:</strong> {{ erroMensagem }}
              </div>
            </div>
          </form>

          <div class="text-center mt-3">
            <p class="text-muted mb-0">
              Não tem conta? 
              <router-link to="/cadastro" class="text-primary fw-bold text-decoration-none ms-1">
                Cadastre-se aqui
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const email = ref('');
const senha = ref('');
const erroMensagem = ref('');
const router = useRouter();

const fazerLogin = async () => {
  try {
    erroMensagem.value = '';
    const resposta = await api.post('/auth/login', {
      email: email.value,
      senha: senha.value
    });

    localStorage.setItem('token', resposta.data.token);
    localStorage.setItem('usuario', JSON.stringify(resposta.data.usuario));

    window.location.href = '/painel'; 
    
  } catch (erro) {
    erroMensagem.value = erro.response?.data?.error || 'Erro ao conectar com o servidor.';
  }
};
</script>

<style scoped>

.card-header, .card-body {
  border-radius: 12px; 
}


.alert-danger {
  background-color: #f8d7da !important;
  color: #dc3545 !important;
  border-color: #f5c2c7 !important;
}
</style>