import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Session } from '@supabase/supabase-js'
import { Check } from '@tamagui/lucide-icons'
import Constants from 'expo-constants'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Keyboard,
  Pressable,
  StatusBar,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Button, Checkbox, Input, Label, View, Text } from 'tamagui'

import { apiario } from '@/@types/apiario'
import { colmeia } from '@/@types/colmeia'
import useColmeiaStore from '@/store/colmeias'
import { supabase } from '@/utils/supabase'

interface EditarColmeiaProps {
  route: {
    params: {
      session: Session
      colmeia: colmeia
      index: number
      tipo: string
      apiario: apiario
    }
  }
  navigation: any
}

export default function EditarColmeia({
  route,
  navigation,
}: EditarColmeiaProps) {
  const [dataIns, setDataIns] = useState<Date>(
    new Date(route.params.colmeia.dataInstalacao)
  )
  const [quadroNinho, setQuadroNinho] = useState(false)
  const [quadroMelgueira, setQuadroMelgueira] = useState(false)
  const [especie, setEspecie] = useState(route.params.colmeia.especie)
  const [qtdAbelhas, setQtdAbelhas] = useState(route.params.colmeia.qtdAbelhas)
  const [qtdQuadros, setQtdQuadros] = useState(route.params.colmeia.qtdQuadros)
  const { colmeias, setColmeias } = useColmeiaStore()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [index, setIndex] = useState(route.params.index)
  const [tipo, setTipo] = useState(route.params.tipo)

  useEffect(() => {
    if (route.params.colmeia.tipoQuadros == 'Quadro de Ninho')
      setQuadroNinho(true)
    else setQuadroMelgueira(true)
  }, [])

  function handleVoltar() {
    if (tipo == 'local') {
      navigation.navigate('CadastrarApiario')
    } else {
      navigation.navigate('ConsultaApiario', { apiario: route.params.apiario })
    }
  }

  function handleColmeiaNinho() {
    if (quadroMelgueira) setQuadroMelgueira(!quadroMelgueira)

    setQuadroNinho(!quadroNinho)
  }

  function handleColmeiaMelgueira() {
    if (quadroNinho) setQuadroNinho(!quadroNinho)

    setQuadroMelgueira(!quadroMelgueira)
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }
  const hideDatePicker = () => setDatePickerVisibility(false)

  const confirmarData = (date: Date) => {
    setDatePickerVisibility(false)
    setDataIns(date)
  }

  function Validar() {
    if (!dataIns) {
      Alert.alert('Data Inválida!', 'Favor inserir uma data válida!')
      return false
    } else if (!qtdAbelhas) {
      Alert.alert('Informe o campo!', 'Favor informar a quantidade de Abelhas!')
      return false
    } else if (!qtdQuadros) {
      Alert.alert('Informe o campo!', 'Favor informar a quantidade de Quadros!')
      return false
    } else if (!especie) {
      Alert.alert('Informe o campo!', 'Favor informar a especie!')
      return false
    } else if (!quadroMelgueira && !quadroNinho) {
      Alert.alert('Informe o campo!', 'Favor informar o tipo de Quadro!')
      return false
    } else {
      return true
    }
  }

  async function handleAlterar() {
    const validado = Validar()
    if (validado) {
      if (!dataIns) return

      const colmeia: any = {
        qtdAbelhas,
        qtdQuadros,
        dataInstalacao: dataIns.toISOString(),
        especie,
        tipoQuadros: quadroNinho ? `Quadro de Ninho` : `Quadro de Melgueira`,
      }

      if (tipo == 'local') {
        const arrayColmeia = colmeias
        arrayColmeia[index] = colmeia
        setColmeias(arrayColmeia)

        navigation.navigate('CadastrarApiario')
      } else {
        const { data, error } = await supabase
          .from('colmeia')
          .update(colmeia)
          .eq('id', route.params.colmeia.id)
        if (error) {
          console.log(error)
        } else {
          navigation.navigate('ConsultaApiario', {
            apiario: route.params.apiario,
          })
        }
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        <View
          marginHorizontal={10}
          gap={10}
        >
          <View>
            <Label fontWeight='bold'>Data Instalação</Label>
            <Pressable
              style={{ zIndex: 999, width: '45%' }}
              onPress={showDatePicker}
            >
              <TextInput
                numberOfLines={1}
                editable={false}
                textAlign='center'
                onPress={() => setDatePickerVisibility(true)}
                placeholder='📅 Selecione a Data'
                value={dataIns ? moment(dataIns).format('DD/MM/YYYY') : ''}
                style={{
                  height: 50,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  width: '100%',
                  borderRadius: 15,
                  borderColor: '#fbba25',
                  fontFamily: 'Inter-Medium',
                }}
              />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode='date'
                locale='pt-BR'
                onConfirm={(date) => confirmarData(date)}
                onCancel={hideDatePicker}
                isDarkModeEnabled
              />
            </Pressable>
          </View>
          <View flexDirection='row'>
            <View width='45%'>
              <Label fontWeight='bold'>Qtd. Abelhas</Label>
              <Input
                fontWeight='bold'
                value={qtdAbelhas.toString()}
                keyboardType='numeric'
                onChangeText={(text) => setQtdAbelhas(Number(text))}
                backgroundColor='#fff'
                borderColor='$appPrimary50'
                focusStyle={{ borderColor: '$appPrimary50' }}
                size='$5'
                id='qtdAbelhas'
              />
            </View>

            <View
              marginLeft={25}
              width='45%'
            >
              <Label fontWeight='bold'>Qtd. Quadros</Label>
              <Input
                fontWeight='bold'
                value={qtdQuadros.toString()}
                onChangeText={(text) => setQtdQuadros(Number(text))}
                keyboardType='numeric'
                backgroundColor='#fff'
                borderColor='$appPrimary50'
                focusStyle={{ borderColor: '$appPrimary50' }}
                size='$5'
                id='quadros'
              />
            </View>
          </View>

          <View>
            <Label fontWeight='bold'>Espécie</Label>
            <Input
              fontWeight='bold'
              value={especie}
              backgroundColor='#fff'
              onChangeText={setEspecie}
              borderColor='$appPrimary50'
              focusStyle={{ borderColor: '$appPrimary50' }}
              size='$5'
              id='especies'
            />
          </View>

          <View>
            <Label fontWeight='bold'>Tipo de Quadros</Label>
            <View flexDirection='row'>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => handleColmeiaNinho()}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={quadroNinho}
                  backgroundColor={quadroNinho ? '$appPrimary50' : '#fff'}
                  borderColor='$appPrimary50'
                  pointerEvents='none'
                >
                  <Checkbox.Indicator>
                    <Check color='#fff' />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label size='$5'>Quadro de Ninho</Label>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => handleColmeiaMelgueira()}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={quadroMelgueira}
                  backgroundColor={quadroMelgueira ? '$appPrimary50' : '#fff'}
                  borderColor='$appPrimary50'
                  pointerEvents='none'
                >
                  <Checkbox.Indicator>
                    <Check color='#fff' />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label size='$5'>Quadro de Melgueira</Label>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleAlterar}
            style={{ paddingTop: 50 }}
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
                Alterar
              </Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
