import { Ionicons } from '@expo/vector-icons'
import { Session } from '@supabase/supabase-js'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import Constants from 'expo-constants'
import React, { useEffect, useState } from 'react'
import { Alert, StatusBar, TouchableOpacity } from 'react-native'
import {
  Checkbox,
  Input,
  Label,
  View,
  Button,
  Text,
  Adapt,
  FontSizeTokens,
  Select,
  SelectProps,
  Sheet,
  YStack,
  getFontSize,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { apiario } from '@/@types/apiario'
import { colmeia } from '@/@types/colmeia'
import { relatorio } from '@/@types/relatorio'
import { relatorioColmeia } from '@/@types/relatorioColmeia'
import useRelatorioColmeiaStore from '@/store/relatorioColmeias'
import { supabase } from '@/utils/supabase'

interface EditarRelatorioColmeiaProps {
  route: {
    params: {
      session: Session
      colmeias: colmeia[]
      apiario: apiario
      relatorioColmeia: relatorioColmeia
      tipo: string
      colmeia: colmeia
      relatorio: relatorio
      relatoriosColmeias: relatorioColmeia[]
      index: number
    }
  }
  navigation: any
}

export default function EditarRelatorioColmeia({
  route,
  navigation,
}: EditarRelatorioColmeiaProps) {
  const [val, setVal] = useState(
    `Colmeia ${route.params.relatorioColmeia.index}`
  )
  const [qtdQuadrosColetados, setQtdQuadrosColetados] = useState(
    route.params.relatorioColmeia.quaColetados
  )
  const [orfao, setOrfao] = useState(false)
  const [boa, setBoa] = useState(false)
  const [regular, setRegular] = useState(false)
  const [fraca, setFraca] = useState(false)
  const [alimentar, setAlimentar] = useState(false)
  const [doente, setDoente] = useState(false)
  const [abandono, setAbandono] = useState(false)
  const [situacao, setSituacao] = useState(
    route.params.relatorioColmeia.situacao
  )
  const [colmeia, setColmeia] = useState<relatorioColmeia[]>([])
  const { relatorioColmeias, setRelatorioColmeias } = useRelatorioColmeiaStore()
  const [id, setId] = useState(route.params.relatorioColmeia.id)

  useEffect(() => {
    prepararDados()
    colmeia.push(route.params.relatorioColmeia)
  }, [])

  function prepararDados() {
    switch (situacao) {
      case 'Órfão':
        setOrfao(true)
        break
      case 'Boa':
        setBoa(true)
        break
      case 'Regular':
        setRegular(true)
        break
      case 'Fraca':
        setFraca(true)
        break
      case 'Alimentar':
        setAlimentar(true)
        break
      case 'Doente':
        setDoente(true)
        break
      case 'Abandono':
        setAbandono(true)
        break
    }
  }

  function handleVoltar() {
    switch (route.params.tipo) {
      case 'local':
        navigation.navigate('CadastroRelatorio', {
          apiario: route.params.apiario,
        })
        break
      case 'online':
        navigation.navigate('ConsultaRelatorio', {
          colmeia: route.params.colmeia,
          apiario: route.params.colmeia,
          relatorio: route.params.relatorio,
        })
        break
    }
  }

  function handleSituacao({
    orfao,
    boa,
    regular,
    fraca,
    alimentar,
    doente,
    abandono,
  }: {
    orfao?: boolean
    boa?: boolean
    regular?: boolean
    fraca?: boolean
    alimentar?: boolean
    doente?: boolean
    abandono?: boolean
  } = {}) {
    if (orfao !== undefined) {
      if (!orfao) {
        setBoa(false)
        setRegular(false)
        setFraca(false)
        setAlimentar(false)
        setDoente(false)
        setAbandono(false)
        setSituacao('Órfão')
      }
      setOrfao(!orfao)
    } else if (boa !== undefined) {
      if (!boa) {
        setOrfao(false)
        setRegular(false)
        setFraca(false)
        setAlimentar(false)
        setDoente(false)
        setAbandono(false)
        setSituacao('Boa')
      }
      setBoa(!boa)
    } else if (regular !== undefined) {
      if (!regular) {
        setOrfao(false)
        setBoa(false)
        setFraca(false)
        setAlimentar(false)
        setDoente(false)
        setAbandono(false)
        setSituacao('Regular')
      }
      setRegular(!regular)
    } else if (fraca !== undefined) {
      if (!fraca) {
        setOrfao(false)
        setBoa(false)
        setRegular(false)
        setAlimentar(false)
        setDoente(false)
        setAbandono(false)
        setSituacao('Fraca')
      }
      setFraca(!fraca)
    } else if (alimentar !== undefined) {
      if (!alimentar) {
        setOrfao(false)
        setBoa(false)
        setRegular(false)
        setFraca(false)
        setDoente(false)
        setAbandono(false)
        setSituacao('Alimentar')
      }
      setAlimentar(!alimentar)
    } else if (doente !== undefined) {
      if (!doente) {
        setOrfao(false)
        setBoa(false)
        setRegular(false)
        setFraca(false)
        setAlimentar(false)
        setAbandono(false)
        setSituacao('Doente')
      }
      setDoente(!doente)
    } else {
      if (!abandono) {
        setOrfao(false)
        setBoa(false)
        setRegular(false)
        setFraca(false)
        setAlimentar(false)
        setDoente(false)
        setSituacao('Abandono')
      }
      setAbandono(!abandono)
    }
  }

  function Validar() {
    if (val == '') {
      Alert.alert('Selecione uma Colmeia!')
      return false
    }
    if (
      !orfao &&
      !boa &&
      !regular &&
      !fraca &&
      !alimentar &&
      !doente &&
      abandono
    ) {
      Alert.alert('Selecione uma Situação!')
      return false
    }

    return true
  }

  async function handleAdicionar() {
    console.log(val)
    const [id, index] = val.split(';')

    console.log(situacao)

    const validado = Validar()
    if (validado) {
      const relatorioColmeia: relatorioColmeia = {
        colmeia_id: route.params.relatorioColmeia.colmeia_id,
        relatorio_id: route.params.relatorioColmeia.relatorio_id,
        quaColetados: qtdQuadrosColetados,
        situacao,
        index: (route.params.index + 1).toString(),
      }

      if (route.params.tipo == 'local') {
        const arrayRelatorioColmeia = relatorioColmeias
        arrayRelatorioColmeia[route.params.index] = relatorioColmeia
        setRelatorioColmeias(arrayRelatorioColmeia)

        navigation.navigate('CadastroRelatorio', {
          apiario: route.params.apiario,
        })
      } else {
        const { data, error } = await supabase
          .from('relatorioColmeia')
          .update(relatorioColmeia)
          .eq('id', route.params.relatorioColmeia.id)
        if (error) {
          console.log(error)
        } else {
          navigation.navigate('ConsultaRelatorio', {
            colmeias: route.params.colmeias,
            apiario: route.params.apiario,
            relatorio: route.params.relatorio,
          })
        }
      }
    }
  }

  return (
    <View
      flex={1}
      backgroundColor='#fff'
    >
      <View
        backgroundColor='#FBBA25'
        height={Constants.statusBarHeight}
      />
      <StatusBar
        barStyle='dark-content'
        backgroundColor='#FBBA25'
        translucent
      />

      <TouchableOpacity
        onPress={handleVoltar}
        style={{
          backgroundColor: '#fff',
          width: 55,
          borderRadius: 60,
          marginLeft: 5,
        }}
      >
        <Ionicons
          name='arrow-back'
          color='#FBBA25'
          size={55}
        />
      </TouchableOpacity>
      <View marginHorizontal={10}>
        <View
          flexDirection='row'
          gap={20}
        >
          <View width='45%'>
            <Label fontWeight='bold'>Colmeia</Label>
            <Input
              fontWeight='bold'
              disabled
              value={`Colmeia ${route.params.relatorioColmeia.index}`}
              keyboardType='numeric'
              onChangeText={(text) => setQtdQuadrosColetados(Number(text))}
              backgroundColor='#fff'
              borderColor='$appPrimary50'
              focusStyle={{ borderColor: '$appPrimary50' }}
              size='$5'
              id='colmeia'
            />
          </View>

          <View width='45%'>
            <Label fontWeight='bold'>Qtd. Quadros Coletados</Label>
            <Input
              fontWeight='bold'
              value={qtdQuadrosColetados.toString()}
              keyboardType='numeric'
              onChangeText={(text) => setQtdQuadrosColetados(Number(text))}
              backgroundColor='#fff'
              borderColor='$appPrimary50'
              focusStyle={{ borderColor: '$appPrimary50' }}
              size='$5'
              id='abelhas'
            />
          </View>
        </View>

        <View
          paddingTop={10}
          width='100%'
        >
          <Label fontWeight='bold'>Situação</Label>
          <View flexDirection='row'>
            <View flexDirection='row'>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '35%',
                }}
                onPress={() => handleSituacao({ orfao })}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={orfao}
                  backgroundColor={orfao ? '$appPrimary50' : '#fff'}
                  borderColor='$appPrimary50'
                  pointerEvents='none'
                >
                  <Checkbox.Indicator>
                    <Check color='#fff' />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label size='$5'>Órfão</Label>
              </TouchableOpacity>
            </View>
            <View flexDirection='row'>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '40%',
                }}
                onPress={() => handleSituacao({ boa })}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={boa}
                  backgroundColor={boa ? '$appPrimary50' : '#fff'}
                  borderColor='$appPrimary50'
                  pointerEvents='none'
                >
                  <Checkbox.Indicator>
                    <Check color='#fff' />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label
                  size='$5'
                  lineHeight={25}
                >
                  Boa
                </Label>
              </TouchableOpacity>
            </View>
            <View flexDirection='row'>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '60%',
                }}
                onPress={() => handleSituacao({ regular })}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={regular}
                  backgroundColor={regular ? '$appPrimary50' : '#fff'}
                  borderColor='$appPrimary50'
                  pointerEvents='none'
                >
                  <Checkbox.Indicator>
                    <Check color='#fff' />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label size='$5'>Regular</Label>
              </TouchableOpacity>
            </View>
          </View>
          <View flexDirection='row'>
            <View flexDirection='row'>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '35%',
                }}
                onPress={() => handleSituacao({ fraca })}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={fraca}
                  backgroundColor={fraca ? '$appPrimary50' : '#fff'}
                  borderColor='$appPrimary50'
                  pointerEvents='none'
                >
                  <Checkbox.Indicator>
                    <Check color='#fff' />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label size='$5'>Fraca</Label>
              </TouchableOpacity>
            </View>
            <View
              width='40%'
              flexDirection='row'
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  width: '100%',
                }}
                onPress={() => handleSituacao({ alimentar })}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={alimentar}
                  backgroundColor={alimentar ? '$appPrimary50' : '#fff'}
                  borderColor='$appPrimary50'
                  pointerEvents='none'
                >
                  <Checkbox.Indicator>
                    <Check color='#fff' />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label
                  size='$5'
                  width='100%'
                  lineHeight={25}
                >
                  Alimentar
                </Label>
              </TouchableOpacity>
            </View>
            <View flexDirection='row'>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '100%',
                }}
                onPress={() => handleSituacao({ doente })}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={doente}
                  backgroundColor={doente ? '$appPrimary50' : '#fff'}
                  borderColor='$appPrimary50'
                  pointerEvents='none'
                >
                  <Checkbox.Indicator>
                    <Check color='#fff' />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label size='$5'>Doente</Label>
              </TouchableOpacity>
            </View>
          </View>
          <View flexDirection='row'>
            <View flexDirection='row'>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => handleSituacao({ abandono })}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={abandono}
                  backgroundColor={abandono ? '$appPrimary50' : '#fff'}
                  borderColor='$appPrimary50'
                  pointerEvents='none'
                >
                  <Checkbox.Indicator>
                    <Check color='#fff' />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label size='$5'>Abandono</Label>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleAdicionar()}
            style={{ paddingTop: 50, paddingBottom: 70 }}
          >
            <Button
              disabled
              width='100%'
              height={60}
              backgroundColor='#31DD42'
              marginHorizontal='auto'
            >
              <Text
                color='#fff'
                fontWeight='bold'
                fontSize={20}
              >
                Adicionar
              </Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
