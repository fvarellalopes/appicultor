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

interface ConsultarRelatorioColmeiaProps {
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
    }
  }
  navigation: any
}

export default function ConsultaRelatorioColmeia({
  route,
  navigation,
}: ConsultarRelatorioColmeiaProps) {
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
      case 'relatorio':
        navigation.navigate('ConsultaRelatorio', {
          colmeias: route.params.colmeias,
          apiario: route.params.apiario,
          relatorio: route.params.relatorio,
        })
        break
      case 'colmeia':
        navigation.navigate('ConsultaColmeia', {
          colmeia: route.params.colmeia,
          apiario: route.params.colmeia,
        })
        break
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
              disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
        </View>
      </View>
    </View>
  )
}
