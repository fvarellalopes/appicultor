import { Ionicons } from '@expo/vector-icons'
import NetInfo from '@react-native-community/netinfo'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { Session } from '@supabase/supabase-js'
import { Check } from '@tamagui/lucide-icons'
import Constants from 'expo-constants'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
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
import { RootStackParamList } from '@/navigation'
import useColmeiaStore from '@/store/colmeias'
import useRelatorioColmeiaStore from '@/store/relatorioColmeias'
import useRelatorioOfflineStore from '@/store/relatorioColmeiasOffline'
import {
  scheduleVisitReminder,
  sendImmediateNotification,
} from '@/utils/notifications'
import { supabase } from '@/utils/supabase'

interface CadastrarRelatorioProps {
  route: {
    params: {
      session: Session
      apiario: apiario
    }
  }
  navigation: any
}

export default function CadastroRelatorio({
  route,
  navigation,
}: CadastrarRelatorioProps) {
  const [localizacao, setLocalizacao] = useState(
    route.params.apiario.localizacao
  )
  const [colmeias, setColmeias] = useState(route.params.apiario.colmeias)
  const [qtdColmeias, setQtdColmeias] = useState(
    route.params.apiario.colmeias?.length
  )
  const [rotina, setRotina] = useState(false)
  const [coletaMel, setColetaMel] = useState(false)
  const [outra, setOutra] = useState(false)
  const [objVisita, setObjVisita] = useState('')
  const [dataVisita, setDataVisita] = useState<Date | null>(new Date())
  const [boa, setBoa] = useState(false)
  const [regular, setRegular] = useState(false)
  const [ruim, setRuim] = useState(false)
  const [sitApiario, setSitApiario] = useState('')
  const [tarefasRealizadas, setTarefasRealizadas] = useState('')
  const [ocorrenciaMortalidade, setOcorrenciaMortalidade] = useState(false)
  const [ocorrenciaSintomas, setOcorrenciaSintomas] = useState(false)
  const [sintomas, setSintomas] = useState('')
  const [situacao, setSituacao] = useState('')
  const [tratamento, setTratamento] = useState(false)
  const [especifique, setEspecifique] = useState('')
  const [limpeza, setLimpeza] = useState(false)
  const [veiculo, setVeiculo] = useState(false)
  const [situacaoColmeias, setSituacaoColmeias] = useState()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const { relatorioColmeias, setRelatorioColmeias } = useRelatorioColmeiaStore()
  const [selectedColmeias, setSelectedColmeias] = useState<string[]>([])
  const { addRelatorioColmeia } = useRelatorioOfflineStore()
  const [enviarNotificacao, setEnviarNotificacao] = useState(true)

  useEffect(() => {
    console.log(route.params.apiario.colmeias)
  }, [])

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }
  const hideDatePicker = () => setDatePickerVisibility(false)

  const confirmarData = (date: Date) => {
    setDatePickerVisibility(false)
    setDataVisita(date)
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

  async function CadastrarRelatorio() {
    const state = await NetInfo.fetch()

    if (state.isConnected) {
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
        .insert([body])
        .select()

      if (error) {
        console.log(error)
      } else {
        // Enviar notificação de confirmação
        await sendImmediateNotification(
          '✅ Relatório Cadastrado',
          `Relatório de visita ao apiário ${localizacao} foi cadastrado com sucesso!`
        )

        // Agendar notificação para próxima visita (se a data for futura)
        if (
          enviarNotificacao &&
          dataVisita &&
          dataVisita.getTime() > Date.now()
        ) {
          try {
            await scheduleVisitReminder(
              localizacao,
              dataVisita,
              24 // Lembrete 24 horas antes
            )
            console.log('Notificação de lembrete agendada')
          } catch (err) {
            console.log('Erro ao agendar notificação:', err)
          }
        }

        if (relatorioColmeias.length > 0) {
          relatorioColmeias.forEach((col) => {
            col.relatorio_id = data[0].id
          })

          const { data: retRelatorioColmeia, error } = await supabase
            .from('relatorioColmeia')
            .insert(relatorioColmeias)
            .select()

          if (error) console.log(error)
          else {
            navigation.navigate('Menu')
            setRelatorioColmeias([])
          }
        } else {
          navigation.navigate('Menu')
        }
      }
    } else {
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
        relatorioColmeias,
      }
      addRelatorioColmeia(JSON.stringify(body))

      navigation.navigate('Menu')
      setRelatorioColmeias([])
    }
  }

  function excluirRelatorioColmeia(index: number) {
    const array = relatorioColmeias.filter((_, i) => i !== index)
    setRelatorioColmeias(array)
  }

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

  const cardRelatorioColmeia = ({ item, index }: any) => (
    <TouchableOpacity
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
        <View flexDirection='row'>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditarRelatorioColmeia', {
                relatorioColmeia: item,
                index,
                tipo: 'local',
                apiario: route.params.apiario,
              })
            }
            style={{
              backgroundColor: '#FFBC00',
              marginRight: 15,
              borderRadius: 5,
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name='pencil'
              size={30}
              color='#fff'
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => excluirRelatorioColmeia(index)}
            style={{
              backgroundColor: '#F11010',
              borderRadius: 5,
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name='trash'
              size={30}
              color='#fff'
            />
          </TouchableOpacity>
        </View>
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
        onPress={() => navigation.navigate('Apiario')}
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
              style={{ zIndex: 999, width: '100%' }}
              onPress={showDatePicker}
            >
              <TextInput
                numberOfLines={1}
                editable={false}
                textAlign='center'
                onPress={() => setDatePickerVisibility(true)}
                placeholder='📅 Selecione a Data'
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
            id='localizacao'
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

        <View paddingBottom={15}>
          <Label fontWeight='bold'>🔔 Enviar Notificação de Lembrete</Label>
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
                onPress={() => setEnviarNotificacao(true)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={enviarNotificacao}
                  backgroundColor={enviarNotificacao ? '$appPrimary50' : '#fff'}
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
                onPress={() => setEnviarNotificacao(false)}
              >
                <Checkbox
                  size='$9'
                  borderWidth={2}
                  checked={!enviarNotificacao}
                  backgroundColor={
                    !enviarNotificacao ? '$appPrimary50' : '#fff'
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
          <Text
            fontSize={12}
            color='#666'
            paddingHorizontal={5}
          >
            Receba um lembrete 24 horas antes da próxima visita
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CadastroRelatorioColmeia', {
              colmeia: colmeias,
              apiario: route.params.apiario,
            })
          }}
        >
          <Button
            disabled
            borderRadius={100}
            width='100%'
            maxWidth={300}
            backgroundColor='#FBBA25'
            marginHorizontal='auto'
            icon={
              <Ionicons
                name='add'
                color='#fff'
                size={35}
              />
            }
          >
            <Text
              color='#fff'
              fontWeight='bold'
              fontSize={20}
            >
              Adicionar Colmeias
            </Text>
          </Button>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={CadastrarRelatorio}
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
      </ScrollView>
    </View>
  )
}
