<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5 col-xl-4">
      <div class="card shadow-sm border-0 rounded-4">
        <div class="card-header bg-light border-bottom-0 rounded-top-4 p-4 text-center">
          <i class="bi bi-person-plus-fill text-primary display-4 mb-2"></i>
          <h2 class="card-title text-primary fw-bold mb-0">Criar Nova Conta</h2>
        </div>
        
        <div class="card-body p-4 p-md-5">
          <form @submit.prevent="fazerCadastro">
            <div class="mb-4">
              <label for="nome" class="form-label text-muted d-flex align-items-center mb-1">
                <i class="bi bi-person-fill me-2 fs-5 text-muted"></i>
                Nome Completo
              </label>
              <input 
                type="text" 
                v-model="nome" 
                id="nome" 
                class="form-control form-control-lg bg-light border-light-subtle rounded-3" 
                placeholder="Seu Nome Completo"
                required
              />
            </div>

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

            <div class="mb-4">
              <label for="senha" class="form-label text-muted d-flex align-items-center mb-1">
                <i class="bi bi-lock-fill me-2 fs-5 text-muted"></i>
                Senha
              </label>
              <input 
                type="password" 
                v-model="senha" 
                id="senha" 
                class="form-control form-control-lg bg-light border-light-subtle rounded-3" 
                placeholder="Crie uma senha forte"
                required
              />
            </div>

            <div class="mb-5">
              <label for="tipo" class="form-label text-muted d-flex align-items-center mb-1">
                <i class="bi bi-person-badge me-2 fs-5 text-muted"></i>
                Tipo de Conta
              </label>
              <select 
                v-model="tipo" 
                id="tipo" 
                class="form-select form-select-lg bg-light border-light-subtle rounded-3 text-muted" 
                required
              >
                <option value="" disabled selected>Selecione o tipo de conta</option>
                <option value="paciente">Paciente</option>
                <option value="secretario">Secretário(a)</option>
              </select>
            </div>

            <div v-if="erroMensagem" class="alert alert-danger d-flex align-items-center rounded-3 p-2 mb-4" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
              <div>
                <strong class="me-1">Aviso:</strong> {{ erroMensagem }}
              </div>
            </div>

            <div v-if="sucessoMensagem" class="alert alert-success d-flex align-items-center rounded-3 p-2 mb-4" role="alert">
              <i class="bi bi-check-circle-fill me-2 fs-5"></i>
              <div>{{ sucessoMensagem }}</div>
            </div>

            <div class="d-grid gap-2 mb-4">
              <button 
                type="submit" 
                class="btn btn-primary btn-lg fw-bold rounded-3 shadow-sm"
              >
                Cadastrar
              </button>
            </div>
          </form>

          <div class="text-center mt-3">
            <p class="text-muted mb-0">
              Já possui uma conta? 
             <router-link to="/" class="...">Faça login aqui</router-link>
                Faça login aqui
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

const nome = ref('');
const email = ref('');
const senha = ref('');
const tipo = ref('');
const erroMensagem = ref('');
const sucessoMensagem = ref('');
const router = useRouter();

const fazerCadastro = async () => {
  try {
    erroMensagem.value = '';
    sucessoMensagem.value = 'Cadastrando usuário...';
    
    await api.post('/auth/registrar', {
      nome: nome.value,
      email: email.value,
      senha: senha.value,
      tipo: tipo.value
    });

    sucessoMensagem.value = "Cadastro realizado com sucesso! Redirecionando...";
    
    setTimeout(() => {
      router.push('/');
    }, 2000);
    
  } catch (erro) {
    sucessoMensagem.value = '';
    erroMensagem.value = erro.response?.data?.error || 'Erro ao realizar o cadastro.';
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

.form-select.form-select-lg {
  color: #444 !important; 
}
</style>
