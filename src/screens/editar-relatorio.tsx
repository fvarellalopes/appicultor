import { Ionicons } from '@expo/vector-icons'
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'
import { Session } from '@supabase/supabase-js'
import { Check } from '@tamagui/lucide-icons'
import Constants from 'expo-constants'
import { saveToLibraryAsync } from 'expo-media-library'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Input, Label, View, Text, Button, Checkbox, TextArea } from 'tamagui'

import { apiario } from '@/@types/apiario'
import { colmeia } from '@/@types/colmeia'
import { relatorio } from '@/@types/relatorio'
import { relatorioColmeia } from '@/@types/relatorioColmeia'
import { RootStackParamList } from '@/navigation'
import useColmeiaStore from '@/store/colmeias'
import useRelatorioColmeiaStore from '@/store/relatorioColmeias'
import { supabase } from '@/utils/supabase'

interface EditarRelatorioProps {
  route: {
    params: {
      session: Session
      apiario: apiario
      relatorio: relatorio
      colmeias: colmeia[]
    }
  }
  navigation: any
}

export default function EditaRelatorio({
  route,
  navigation,
}: EditarRelatorioProps) {
  const [localizacao, setLocalizacao] = useState(
    route.params.apiario.localizacao
  )
  const [colmeias, setColmeias] = useState(route.params.colmeias)
  const [qtdColmeias, setQtdColmeias] = useState(route.params.colmeias.length)
  const [rotina, setRotina] = useState(false)
  const [coletaMel, setColetaMel] = useState(false)
  const [outra, setOutra] = useState(false)
  const [objVisita, setObjVisita] = useState(route.params.relatorio.objVisita)
  const [dataVisita, setDataVisita] = useState<Date | null>(
    new Date(route.params.relatorio.dataVisita)
  )
  const [boa, setBoa] = useState(false)
  const [regular, setRegular] = useState(false)
  const [ruim, setRuim] = useState(false)
  const [sitApiario, setSitApiario] = useState(
    route.params.relatorio.sitApiario
  )
  const [tarefasRealizadas, setTarefasRealizadas] = useState(
    route.params.relatorio.tarRealizadas
  )
  const [ocorrenciaMortalidade, setOcorrenciaMortalidade] = useState(
    route.params.relatorio.mortalidade
  )
  const [ocorrenciaSintomas, setOcorrenciaSintomas] = useState(
    route.params.relatorio.ocorrenciaSintomas
  )
  const [sintomas, setSintomas] = useState(route.params.relatorio.descSintomas)
  const [situacao, setSituacao] = useState(route.params.relatorio.descSituacao)
  const [tratamento, setTratamento] = useState(
    route.params.relatorio.tratamento
  )
  const [especifique, setEspecifique] = useState(
    route.params.relatorio.descTratamento
  )
  const [limpeza, setLimpeza] = useState(route.params.relatorio.limpeza)
  const [veiculo, setVeiculo] = useState(route.params.relatorio.conformidade)
  const [situacaoColmeias, setSituacaoColmeias] = useState()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [relatorioColmeias, setRelatorioColmeias] = useState<
    relatorioColmeia[]
  >([])
  const [selectedColmeias, setSelectedColmeias] = useState<string[]>(
    JSON.parse(route.params.relatorio.colmeiasAfetadas)
  )

  useFocusEffect(
    useCallback(() => {
      consultarRelatorioColmeia()
      prepararDados()
    }, [])
  )

  useEffect(() => {
    consultarRelatorioColmeia()
    prepararDados()
    console.log('Colmeias')
    console.log(route.params.apiario.colmeias)
  }, [])

  const confirmarData = (date: Date) => {
    setDatePickerVisibility(false)
    setDataVisita(date)
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }
  const hideDatePicker = () => setDatePickerVisibility(false)

  function handleObjVisita(
    rotina?: boolean,
    coletaMel?: boolean,
    outra?: boolean
  ) {
    if (rotina !== undefined) {
      if (!rotina) {
        setRotina(!rotina)
        setObjVisita('Rotina')
        setColetaMel(false)
        setOutra(false)
      } else {
        setRotina(!rotina)
      }
    } else if (coletaMel !== undefined) {
      if (!coletaMel) {
        setColetaMel(!coletaMel)
        setObjVisita('Coleta de Mel')
        setRotina(false)
        setOutra(false)
      } else {
        setColetaMel(!coletaMel)
      }
    } else {
      if (!outra) {
        setOutra(!outra)
        setColetaMel(false)
        setObjVisita('Outra')
        setRotina(false)
      } else {
        setOutra(!outra)
      }
    }
  }

  function handleSitApiario(boa?: boolean, regular?: boolean, ruim?: boolean) {
    if (boa !== undefined) {
      if (!boa) {
        setBoa(!boa)
        setSitApiario('Boa')
        setRegular(false)
        setRuim(false)
      } else {
        setBoa(!boa)
      }
    } else if (regular !== undefined) {
      if (!regular) {
        setRegular(!regular)
        setSitApiario('Regular')
        setBoa(false)
        setRuim(false)
      } else {
        setRegular(!regular)
      }
    } else {
      if (!ruim) {
        setRuim(!ruim)
        setSitApiario('Ruim')
        setBoa(false)
        setRegular(false)
      } else {
        setRuim(!ruim)
      }
    }
  }

  async function EditarRelatorio() {
    const body = {
      dataVisita: dataVisita!.toISOString(),
      apiario_id: route.params.apiario.id,
      objVisita,
      sitApiario,
      tarRealizadas: tarefasRealizadas,
      mortalidade: ocorrenciaMortalidade,
      descSituacao: situacao,
      tratamento,
      descTratamento: especifique,
      limpeza,
      conformidade: veiculo,
      colmeiasAfetadas: JSON.stringify(selectedColmeias),
      ocorrenciaSintomas,
      descSintomas: sintomas,
    }

    console.log(body)
    console.log(relatorioColmeias)
    const { data, error } = await supabase
      .from('relatorio')
      .update(body)
      .eq('id', route.params.relatorio.id)

    if (error) {
      console.log(error)
    } else {
      console.log('ALTERADO COM SUCESSO')
      navigation.navigate('ConsultaApiario', { apiario: route.params.apiario })
    }
  }

  function prepararDados() {
    switch (sitApiario) {
      case 'Boa':
        setBoa(true)
        break
      case 'Regular':
        setRegular(true)
        break
      case 'Ruim':
        setRuim(true)
        break
    }

    switch (objVisita) {
      case 'Rotina':
        setRotina(true)
        break
      case 'Coleta de Mel':
        setColetaMel(true)
        break
      case 'Outro':
        setOutra(true)
        break
    }

    console.log(dataVisita)
    setDataVisita(dataVisita)
  }

  async function consultarRelatorioColmeia() {
    const { data, error: postError } = await supabase
      .from('relatorioColmeia')
      .select('*')
      .eq('relatorio_id', route.params.relatorio.id)
      .order('created_at', { ascending: false })

    console.log(data)
    console.log(moment(dataVisita).utc().format('DD/MM/YYYY'))

    if (postError) console.log(postError)
    else {
      setRelatorioColmeias(data)
    }
  }

  const toggleSelection = (id: number) => {
    if (selectedColmeias.includes(id.toString())) {
      setSelectedColmeias(
        selectedColmeias.filter((colmeiaId) => colmeiaId !== id.toString())
      )
    } else {
      setSelectedColmeias([...selectedColmeias, id.toString()])
    }
  }

  const renderColmeia = ({ item, index }: any) => (
    <TouchableOpacity
      onPress={() => toggleSelection(Number(index) + 1)}
      style={[
        {
          padding: 15,
          marginVertical: 8,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#FBBA25',
          borderRadius: 5,
        },
        selectedColmeias.includes((Number(index) + 1).toString())
          ? {
              backgroundColor: '#FBBA25',
            }
          : null,
      ]}
    >
      <Text>{`Colmeia ${index + 1}`}</Text>
    </TouchableOpacity>
  )

  const cardRelatorioColmeia = ({ item, index }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ConsultaRelatorioColmeia', {
          apiario: route.params.apiario,
          relatorioColmeia: item,
          tipo: 'relatorio',
          relatorio: route.params.relatorio,
          colmeias: route.params.colmeias,
          relatorioColmeias,
        })
      }
      style={{
        width: 350,
        height: 150,
        paddingVertical: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
        margin: 10,
        backgroundColor: '#F5E6C3',
      }}
    >
      <View
        flexDirection='row'
        justifyContent='space-between'
      >
        <Text
          fontWeight='bold'
          fontSize={20}
          paddingBottom={20}
        >
          Colmeia {item.index}
        </Text>
      </View>
      <Text paddingTop={20}>Situação: {item.situacao}</Text>
      <Text>Quadros Coletados: {item.quaColetados}</Text>
    </TouchableOpacity>
  )

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
          navigation.navigate('ConsultaApiario', {
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
      <ScrollView style={{ marginHorizontal: 10, gap: 15 }}>
        <View
          flexDirection='row'
          gap={20}
        >
          <View width='45%'>
            <Label fontWeight='bold'>Data Visita</Label>
            <Pressable
              onPress={showDatePicker}
              style={{ zIndex: 999, width: '100%' }}
            >
              <TextInput
                numberOfLines={1}
                editable={false}
                textAlign='center'
                placeholder='📅 Selecione a Data'
                onPress={() => setDatePickerVisibility(true)}
                value={
                  dataVisita
                    ? moment(dataVisita).utc().format('DD/MM/YYYY')
                    : ''
                }
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

          <View
            paddingBottom={15}
            width='30%'
          >
            <Label fontWeight='bold'>Qtd Colmeias</Label>
            <Input
              disabled
              value={qtdColmeias?.toString()}
              backgroundColor='#ccc'
              borderColor='$appPrimary50'
              width='100%'
              focusStyle={{ borderColor: '$appPrimary50' }}
              size='$5'
              id='qtdColmeias'
            />
          </View>
        </View>

        <View paddingBottom={15}>
          <Label fontWeight='bold'>Localizacao</Label>
          <Input
            disabled
            value={localizacao}
            backgroundColor='#ccc'
            borderColor='$appPrimary50'
            onChangeText={setLocalizacao}
            width='100%'
            focusStyle={{ borderColor: '$appPrimary50' }}
            size='$5'
            id='loc'
          />
        </View>

        <View>
          <Label fontWeight='bold'>Objetivo da Visita</Label>
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
                onPress={() => handleObjVisita(rotina)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={rotina}
                  backgroundColor={rotina ? '$appPrimary50' : '#fff'}
                  borderColor='$appPrimary50'
                  pointerEvents='none'
                >
                  <Checkbox.Indicator>
                    <Check color='#fff' />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label size='$5'>Rotina</Label>
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
                onPress={() => handleObjVisita(undefined, coletaMel, undefined)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={coletaMel}
                  backgroundColor={coletaMel ? '$appPrimary50' : '#fff'}
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
                  Coleta de Mel
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
                onPress={() => handleObjVisita(undefined, undefined, outra)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={outra}
                  backgroundColor={outra ? '$appPrimary50' : '#fff'}
                  borderColor='$appPrimary50'
                  pointerEvents='none'
                >
                  <Checkbox.Indicator>
                    <Check color='#fff' />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label size='$5'>Outro</Label>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <Label fontWeight='bold'>Situação do Apiário</Label>
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
                onPress={() => handleSitApiario(boa)}
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
                <Label size='$5'>Boa</Label>
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
                onPress={() => handleSitApiario(undefined, regular, undefined)}
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
                <Label
                  size='$5'
                  lineHeight={25}
                >
                  Regular
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
                onPress={() => handleSitApiario(undefined, undefined, ruim)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={ruim}
                  backgroundColor={ruim ? '$appPrimary50' : '#fff'}
                  borderColor='$appPrimary50'
                  pointerEvents='none'
                >
                  <Checkbox.Indicator>
                    <Check color='#fff' />
                  </Checkbox.Indicator>
                </Checkbox>
                <Label size='$5'>Ruim</Label>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View paddingBottom={15}>
          <Label fontWeight='bold'>Tarefas Realizadas</Label>
          <TextArea
            value={tarefasRealizadas}
            onChangeText={setTarefasRealizadas}
            borderColor='$appPrimary50'
            backgroundColor='#fff'
            size='$7'
            fontSize={15}
            paddingHorizontal={5}
            paddingVertical={2}
            borderRadius={15}
          />
        </View>

        <View paddingBottom={15}>
          <Label fontWeight='bold'>Ocorrência Mortalidade</Label>
          <View
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
          >
            <View
              flexDirection='row'
              justifyContent='center'
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => setOcorrenciaMortalidade(true)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={ocorrenciaMortalidade}
                  backgroundColor={
                    ocorrenciaMortalidade ? '$appPrimary50' : '#fff'
                  }
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
                  Sim
                </Label>
              </TouchableOpacity>
            </View>

            <View
              justifyContent='center'
              flexDirection='row'
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => setOcorrenciaMortalidade(false)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={!ocorrenciaMortalidade}
                  backgroundColor={
                    !ocorrenciaMortalidade ? '$appPrimary50' : '#fff'
                  }
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
                  Não
                </Label>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View paddingBottom={15}>
          <Label fontWeight='bold'>Ocorrência de Sintomas e Pragas</Label>
          <View
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
          >
            <View
              flexDirection='row'
              justifyContent='center'
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => setOcorrenciaSintomas(true)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={ocorrenciaSintomas}
                  backgroundColor={
                    ocorrenciaSintomas ? '$appPrimary50' : '#fff'
                  }
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
                  Sim
                </Label>
              </TouchableOpacity>
            </View>

            <View
              justifyContent='center'
              flexDirection='row'
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => setOcorrenciaSintomas(false)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={!ocorrenciaSintomas}
                  backgroundColor={
                    !ocorrenciaSintomas ? '$appPrimary50' : '#fff'
                  }
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
                  Não
                </Label>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View paddingBottom={15}>
          <Label fontWeight='bold'>Sintomas/Doenças ou Pragas</Label>
          <TextArea
            value={sintomas}
            onChangeText={setSintomas}
            borderColor='$appPrimary50'
            backgroundColor='#fff'
            size='$7'
            fontSize={15}
            paddingHorizontal={5}
            paddingVertical={2}
            borderRadius={15}
          />
        </View>

        <View paddingBottom={15}>
          <Label fontWeight='bold'>Colmeias Afetadas</Label>
          <FlatList
            data={colmeias}
            renderItem={renderColmeia}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>

        <View paddingBottom={15}>
          <Label fontWeight='bold'>Situação</Label>
          <TextArea
            value={situacao}
            disabled
            onChangeText={setSituacao}
            borderColor='$appPrimary50'
            backgroundColor='#fff'
            size='$7'
            fontSize={15}
            paddingHorizontal={5}
            paddingVertical={2}
            borderRadius={15}
          />
        </View>

        <View paddingBottom={15}>
          <Label fontWeight='bold'>
            Realizou Tratamento ou Medida de manejo
          </Label>
          <View
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
          >
            <View
              flexDirection='row'
              justifyContent='center'
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => setTratamento(true)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={tratamento}
                  backgroundColor={tratamento ? '$appPrimary50' : '#fff'}
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
                  Sim
                </Label>
              </TouchableOpacity>
            </View>

            <View
              justifyContent='center'
              flexDirection='row'
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => setTratamento(false)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={!tratamento}
                  backgroundColor={!tratamento ? '$appPrimary50' : '#fff'}
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
                  Não
                </Label>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View paddingBottom={15}>
          <Label fontWeight='bold'>Especifique</Label>
          <TextArea
            value={especifique}
            onChangeText={setEspecifique}
            borderColor='$appPrimary50'
            backgroundColor='#fff'
            size='$7'
            fontSize={15}
            paddingHorizontal={5}
            paddingVertical={2}
            borderRadius={15}
          />
        </View>

        <View paddingBottom={15}>
          <Label fontWeight='bold'>
            Os procedimentos de limpeza foram seguidos
          </Label>
          <View
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
          >
            <View
              flexDirection='row'
              justifyContent='center'
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => setLimpeza(true)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={limpeza}
                  backgroundColor={limpeza ? '$appPrimary50' : '#fff'}
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
                  Sim
                </Label>
              </TouchableOpacity>
            </View>

            <View
              justifyContent='center'
              flexDirection='row'
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => setLimpeza(false)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={!limpeza}
                  backgroundColor={!limpeza ? '$appPrimary50' : '#fff'}
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
                  Não
                </Label>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View paddingBottom={15}>
          <Label fontWeight='bold'>Veículo estava em conformidade</Label>
          <View
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
          >
            <View
              flexDirection='row'
              justifyContent='center'
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => setVeiculo(true)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={veiculo}
                  backgroundColor={veiculo ? '$appPrimary50' : '#fff'}
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
                  Sim
                </Label>
              </TouchableOpacity>
            </View>

            <View
              justifyContent='center'
              flexDirection='row'
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginVertical: 10,
                  width: '50%',
                }}
                onPress={() => setVeiculo(false)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={!veiculo}
                  backgroundColor={!veiculo ? '$appPrimary50' : '#fff'}
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
                  Não
                </Label>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <Label fontWeight='bold'>Situação das Colmeias ou da Coleta</Label>
          {relatorioColmeias!.length > 0 ? (
            <View
              alignItems='center'
              paddingTop={20}
            >
              <FlatList
                data={relatorioColmeias}
                renderItem={cardRelatorioColmeia}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <View />
          )}
        </View>

        <TouchableOpacity
          onPress={EditarRelatorio}
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
              Alterar
            </Text>
          </Button>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
