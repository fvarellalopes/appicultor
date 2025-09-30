import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'
import { create } from 'zustand'

import { supabase } from '@/utils/supabase'

// Interface do estado com strings
interface ColmeiaState {
  relatorioColmeiasOffline: string[]
  addRelatorioColmeia: (newRelatorio: string) => Promise<void>
  loadRelatorioColmeias: () => Promise<void>
  integraRelatorios: () => Promise<void>
}

// Store Zustand com persistência assíncrona e adição de elementos no array
const useRelatorioOfflineStore = create<ColmeiaState>((set, get) => ({
  relatorioColmeiasOffline: [],

  // Função para adicionar um novo relatório ao array e salvar no AsyncStorage
  addRelatorioColmeia: async (newRelatorio: string) => {
    const currentRelatorios = get().relatorioColmeiasOffline
    const updatedRelatorios = [...currentRelatorios, newRelatorio]

    set({ relatorioColmeiasOffline: updatedRelatorios })

    try {
      await AsyncStorage.setItem(
        'relatorioColmeias',
        JSON.stringify(updatedRelatorios)
      )
    } catch (error) {
      console.error('Erro ao salvar relatorioColmeias no AsyncStorage:', error)
    }
  },

  // Função para carregar os dados salvos do AsyncStorage
  loadRelatorioColmeias: async () => {
    console.log('CARREGANDO DADOS')
    try {
      const storedRelatorios = await AsyncStorage.getItem('relatorioColmeias')
      if (storedRelatorios) {
        set({ relatorioColmeiasOffline: JSON.parse(storedRelatorios) })
      }
    } catch (error) {
      console.error(
        'Erro ao carregar relatorioColmeias do AsyncStorage:',
        error
      )
    }
  },

  integraRelatorios: async () => {
    try {
      const storedRelatorios = await AsyncStorage.getItem('relatorioColmeias')
      if (storedRelatorios) {
        set({ relatorioColmeiasOffline: JSON.parse(storedRelatorios) })
      }
    } catch (error) {
      console.error(
        'Erro ao carregar relatorioColmeias do AsyncStorage:',
        error
      )
    }

    const currentRelatorios = get().relatorioColmeiasOffline
    if (currentRelatorios.length > 0) {
      try {
        currentRelatorios.forEach(async (relatorio: string) => {
          const r = JSON.parse(relatorio)
          const body = {
            dataVisita: r.dataVisita,
            apiario_id: r.apiario_id,
            objVisita: r.objVisita,
            sitApiario: r.sitApiario,
            tarRealizadas: r.tarRealizadas,
            mortalidade: r.mortalidade,
            descSituacao: r.descSituacao,
            tratamento: r.tratamento,
            descTratamento: r.descTratamento,
            limpeza: r.limpeza,
            conformidade: r.conformidade,
            colmeiasAfetadas: r.colmeiasAfetadas,
            ocorrenciaSintomas: r.ocorrenciaSintomas,
            descSintomas: r.descSintomas,
          }

          // Alert.alert(JSON.stringify(body))

          const { data, error } = await supabase
            .from('relatorio')
            .insert([body])
            .select()

          if (error) {
            Alert.alert(JSON.stringify(error))
          } else {
            if (r.relatorioColmeias.length > 0) {
              r.relatorioColmeias.forEach((col: any) => {
                col.relatorio_id = data[0].id
              })

              const { data: retRelatorioColmeia, error } = await supabase
                .from('relatorioColmeia')
                .insert(r.relatorioColmeias)
                .select()

              if (error) Alert.alert(JSON.stringify(error))
              else {
                Alert.alert('DADOS OFFLINE CADASTRADOS COM SUCESSO!')
                set({ relatorioColmeiasOffline: [] })

                try {
                  await AsyncStorage.setItem(
                    'relatorioColmeias',
                    JSON.stringify([])
                  )
                } catch (error) {
                  console.error(
                    'Erro ao salvar relatorioColmeias no AsyncStorage:',
                    error
                  )
                }
              }
            }
          }
        })
      } catch (error) {
        Alert.alert('Erro ao tentar integrar:', JSON.stringify(error))
      }
    }
  },
}))

export default useRelatorioOfflineStore
