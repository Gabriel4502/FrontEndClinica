import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
   
    {
      path: '/cadastro',
      name: 'cadastro',

      component: () => import('../views/CadastroView.vue')
    },
    {
      path: '/painel',
      name: 'painel',
      component: () => import('../views/PainelView.vue')
    }
  ]
})

export default router