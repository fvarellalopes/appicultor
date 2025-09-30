import { relatorioColmeia } from './relatorioColmeia'

export type colmeia = {
  id?: string
  qtdAbelhas: number
  qtdQuadros: number
  dateInstalacao: Date
  dataInstalacao: string
  especie: string
  apiario_id?: string
  tipoQuadros: string
}
