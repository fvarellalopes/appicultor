import { apiario } from './apiario'

export type Usuario = {
  id: string
  nome: string
  produtor: boolean
  cooperativa: boolean
  apiario: apiario
  cidade: string
  estado: string
  matricula: number
}
