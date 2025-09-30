import { Ionicons } from '@expo/vector-icons'
import { Session } from '@supabase/supabase-js'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import Constants from 'expo-constants'
import React, { useState } from 'react'
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

interface AdicionarRelatorioColmeiaProps {
  route: {
    params: {
      session: Session
      colmeia: colmeia[]
      apiario: apiario
      relatorio: relatorio
      tipo: string
    }
  }
  navigation: any
}

export default function CadastroRelatorioColmeia({
  route,
  navigation,
}: AdicionarRelatorioColmeiaProps) {
  const [val, setVal] = useState('')
  const [qtdQuadrosColetados, setQtdQuadrosColetados] = useState(0)
  const [orfao, setOrfao] = useState(false)
  const [boa, setBoa] = useState(false)
  const [regular, setRegular] = useState(false)
  const [fraca, setFraca] = useState(false)
  const [alimentar, setAlimentar] = useState(false)
  const [doente, setDoente] = useState(false)
  const [abandono, setAbandono] = useState(false)
  const [situacao, setSituacao] = useState('')
  const { relatorioColmeias, setRelatorioColmeias } = useRelatorioColmeiaStore()
  function SelectItem(props: SelectProps) {
    return (
      <Select
        value={val}
        onValueChange={setVal}
        disablePreventBodyScroll
        {...props}
      >
        <Select.Trigger
          height='$5'
          borderColor='#FBBA25'
          width='100%'
          iconAfter={ChevronDown}
        >
          <Select.Value placeholder='Selecione a Colmeia' />
        </Select.Trigger>

        <Adapt
          when='md'
          platform='touch'
        >
          <Sheet
            native={!!props.native}
            modal
            dismissOnSnapToBottom
            animationConfig={{
              type: 'spring',
              damping: 20,
              mass: 1.2,
              stiffness: 250,
            }}
          >
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              animation='lazy'
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems='center'
            justifyContent='center'
            position='relative'
            width='100%'
            height='$3'
          >
            <YStack zIndex={10}>
              <ChevronUp size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['$background', 'transparent']}
              borderRadius='$4'
            />
          </Select.ScrollUpButton>

          <Select.Viewport
            // to do animations:
            // animation="quick"
            // animateOnly={['transform', 'opacity']}
            // enterStyle={{ o: 0, y: -10 }}
            // exitStyle={{ o: 0, y: 10 }}
            minWidth={200}
          >
            <Select.Group>
              <Select.Label>Colmeias</Select.Label>
              {React.useMemo(
                () =>
                  route.params.colmeia.map((item, i) => {
                    return (
                      <Select.Item
                        index={i}
                        key={i}
                        value={`${item.id};${i}`}
                      >
                        <Select.ItemText>{`Colmeia ${i + 1}`}</Select.ItemText>
                        <Select.ItemIndicator marginLeft='auto'>
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    )
                  }),
                [route.params.colmeia]
              )}
            </Select.Group>
            {/* Native gets an extra icon */}
            {props.native && (
              <YStack
                position='absolute'
                right={0}
                top={0}
                bottom={0}
                alignItems='center'
                justifyContent='center'
                width='$4'
                pointerEvents='none'
              >
                <ChevronDown
                  size={getFontSize((props.size as FontSizeTokens) ?? '$true')}
                />
              </YStack>
            )}
          </Select.Viewport>

          <Select.ScrollDownButton
            alignItems='center'
            justifyContent='center'
            position='relative'
            width='100%'
            height='$3'
          >
            <YStack zIndex={10}>
              <ChevronDown size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['transparent', '$background']}
              borderRadius='$4'
            />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    )
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
    const colmeia = Number(index) + 1
    if (validado) {
      const relatorioColmeia: relatorioColmeia = {
        colmeia_id: id,
        quaColetados: qtdQuadrosColetados,
        situacao,
        index: colmeia.toString(),
      }

      relatorioColmeias.push(relatorioColmeia)
      navigation.navigate('CadastroRelatorio', {
        apiario: route.params.apiario,
      })
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
        onPress={() =>
          navigation.navigate('CadastroRelatorio', {
            apiario: route.params.apiario,
          })
        }
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
            <SelectItem id='select-demo-1' />
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
