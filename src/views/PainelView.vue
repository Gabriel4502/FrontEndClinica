<template>
  <div class="container-xl mt-2">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 bg-white p-4 rounded-4 shadow-sm border-0"
    >
      <div class="mb-3 mb-md-0 text-center text-md-start">
        <h3 class="fw-bold text-dark mb-0">
          <i class="bi bi-calendar-check text-primary me-2"></i>Gerenciamento de Agendamentos
        </h3>
        <p class="text-muted mb-0 mt-1">
          Acompanhe as consultas da clínica integradas com a previsão do tempo.
        </p>
      </div>
      <button
        class="btn btn-primary btn-lg fw-bold shadow-sm px-4"
        data-bs-toggle="modal"
        data-bs-target="#modalNovoAgendamento"
      >
        <i class="bi bi-plus-lg me-2"></i> Registrar Novo
      </button>
    </div>

    <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover table-striped align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="px-4 py-3">Data</th>
              <th class="py-3">Hora</th>
              <th class="py-3">Endereço Completo</th>
              <th class="py-3 text-center">Clima Previsto</th>
              <th v-if="usuario.tipo === 'secretario'" class="py-3 text-center">Paciente</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="agendamentos.length === 0">
              <td
                :colspan="usuario.tipo === 'secretario' ? 5 : 4"
                class="text-center text-muted py-5"
              >
                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                Nenhum agendamento encontrado no momento.
              </td>
            </tr>
            <tr v-for="agendamento in agendamentos" :key="agendamento.id">
              <td class="px-4 fw-medium">{{ formatarData(agendamento.dataHora) }}</td>
              <td>
                <span class="badge bg-light text-dark border">{{
                  formatarHora(agendamento.dataHora)
                }}</span>
              </td>
              <td
                class="text-muted text-truncate"
                style="max-width: 200px"
                :title="agendamento.enderecoCompleto"
              >
                {{ agendamento.enderecoCompleto }}
              </td>
              <td class="text-center">
                <span
                  class="badge px-3 py-2 rounded-pill"
                  :class="getBadgeClima(agendamento.previsaoTempo)"
                >
                  {{ agendamento.previsaoTempo }}
                </span>
              </td>
              <td v-if="usuario.tipo === 'secretario'" class="text-center fw-bold text-primary">
                {{ agendamento.paciente?.nome || 'Paciente' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal fade" id="modalNovoAgendamento" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-header bg-light border-bottom-0 rounded-top-4 pb-3">
            <h5 class="modal-title fw-bold text-primary">
              <i class="bi bi-calendar-plus me-2"></i>Marcar Nova Consulta
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body p-4">
            <form @submit.prevent="marcarConsulta">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold text-muted">Data</label>
                  <input
                    type="date"
                    v-model="novoAgendamento.data"
                    class="form-control bg-light border-0"
                    required
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold text-muted">Horário</label>
                  <input
                    type="time"
                    v-model="novoAgendamento.hora"
                    class="form-control bg-light border-0"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-muted">CEP (somente números)</label>
                <div class="input-group">
                  <span class="input-group-text border-0 bg-light"
                    ><i class="bi bi-geo-alt"></i
                  ></span>
                  <input
                    type="text"
                    v-model="novoAgendamento.cep"
                    @blur="buscarCep"
                    class="form-control bg-light border-0"
                    maxlength="8"
                    placeholder="Ex: 01001000"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-muted">Endereço Completo</label>
                <input
                  type="text"
                  v-model="novoAgendamento.enderecoCompleto"
                  class="form-control bg-light border-0"
                  required
                  readonly
                />
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold text-muted">Cidade (Para API de Clima)</label>
                <input
                  type="text"
                  v-model="novoAgendamento.cidade"
                  class="form-control bg-light border-0"
                  required
                  readonly
                />
              </div>

              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg fw-bold rounded-3"
                  :disabled="carregando"
                >
                  <i v-if="!carregando" class="bi bi-check-circle me-1"></i>
                  <span v-else class="spinner-border spinner-border-sm me-1"></span>
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const usuario = ref(
  JSON.parse(localStorage.getItem('usuario')) || { nome: 'Usuário', tipo: 'paciente' },
)
const agendamentos = ref([])
const carregando = ref(false)

const novoAgendamento = ref({ data: '', hora: '', cep: '', enderecoCompleto: '', cidade: '' })

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/')
  } else {
    carregarAgendamentos()
  }
})

const carregarAgendamentos = async () => {
  try {
    const resposta = await api.get('/agendamentos')
    agendamentos.value = resposta.data
  } catch (erro) {
    console.error('Erro ao carregar agendamentos:', erro)
  }
}

const buscarCep = async () => {
  const cepLimpo = novoAgendamento.value.cep.replace(/\D/g, '')
  if (cepLimpo.length === 8) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const dados = await res.json()
      if (!dados.erro) {
        novoAgendamento.value.enderecoCompleto = `${dados.logradouro}, ${dados.bairro} - ${dados.uf}`
        novoAgendamento.value.cidade = dados.localidade
      }
    } catch (erro) {
      console.error('Erro ao buscar CEP')
    }
  }
}

const marcarConsulta = async () => {
  try {
    carregando.value = true
    const dataHoraIso = new Date(
      `${novoAgendamento.value.data}T${novoAgendamento.value.hora}`,
    ).toISOString()
    const resposta = await api.post('/agendamentos', {
      dataHora: dataHoraIso,
      cep: novoAgendamento.value.cep,
      enderecoCompleto: novoAgendamento.value.enderecoCompleto,
      cidade: novoAgendamento.value.cidade,
    })

    agendamentos.value.push(resposta.data)
    novoAgendamento.value = { data: '', hora: '', cep: '', enderecoCompleto: '', cidade: '' }
    carregando.value = false

    const modalElement = document.getElementById('modalNovoAgendamento')
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement)
    modal.hide()
  } catch (erro) {
    carregando.value = false
    alert(erro.response?.data?.error || 'Erro ao marcar consulta.')
  }
}

const formatarData = (dataString) => {
  const data = new Date(dataString)

  return new Date(data.getTime() + data.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR')
}

const formatarHora = (dataString) => {
  const data = new Date(dataString)
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const getBadgeClima = (previsaoTempo) => {
  if (!previsaoTempo || previsaoTempo === 'A calcular...') return 'bg-secondary text-white'
  if (previsaoTempo.includes('chuva')) return 'bg-danger text-white'
  if (previsaoTempo.includes('nuvens')) return 'bg-info text-dark'
  if (previsaoTempo.includes('céu limpo') || previsaoTempo.includes('claro'))
    return 'bg-success text-white'
  return 'bg-warning text-dark'
}
</script>

<style scoped>
.table th {
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}
</style>
