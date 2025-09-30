import { colmeia } from './colmeia'
import { relatorio } from './relatorio'

export type apiario = {
  id: number
  produtor_id: string
  localizacao: string
  colmeias?: colmeia[]
}
