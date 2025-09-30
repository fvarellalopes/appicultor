import { Ionicons } from '@expo/vector-icons'
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'
import { Session } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StatusBar, TouchableOpacity } from 'react-native'
import { Input, Label, View, Text, Button, ScrollView } from 'tamagui'

import { apiario } from '@/@types/apiario'
import { colmeia } from '@/@types/colmeia'
import { relatorio } from '@/@types/relatorio'
import { RootStackParamList } from '@/navigation'
import useColmeiaStore from '@/store/colmeias'
import { supabase } from '@/utils/supabase'

interface ConsultarApiarioProps {
  route: {
    params: {
      session: Session
      apiario: apiario
    }
  }
  navigation: any
}

export default function ConsultaApiario({
  route,
  navigation,
}: ConsultarApiarioProps) {
  const [localizacao, setLocalizacao] = useState(
    route.params.apiario.localizacao
  )
  const [colmeias, setColmeias] = useState<colmeia[]>([])
  const [qrCode, setQrCode] = useState('')
  const [apiario, setApiario] = useState<apiario>(route.params.apiario)
  const [relatorios, setRelatorios] = useState<relatorio[]>([])

  useFocusEffect(
    useCallback(() => {
      consultarColmeias()
      consultarRelatorio()
    }, [])
  )

  useEffect(() => {
    consultarColmeias()
  }, [])

  async function excluirColmeia(id: string) {
    const { data, error } = await supabase
      .from('colmeia')
      .update({ status: false })
      .eq('id', id)
    if (error) {
      console.log(error)
      Alert.alert(
        'Erro ao excluir!',
        'Infelizmente não foi possivel excluir a colmeia desejada'
      )
    } else {
      consultarColmeias()
    }
  }

  async function consultarColmeias() {
    const { data, error: postError } = await supabase
      .from('colmeia')
      .select('*')
      .eq('apiario_id', route.params.apiario.id)
      .eq('status', true)
      .order('created_at', { ascending: true })
    if (postError) console.log(postError)
    else {
      setColmeias(data)
      const qrCode = {
        id: apiario.id,
        localizacao: apiario.localizacao,
        colmeias,
      }
      console.log(qrCode)
      setQrCode(JSON.stringify(qrCode))
    }
  }
  async function consultarRelatorio() {
    const { data, error: postError } = await supabase
      .from('relatorio')
      .select('*')
      .eq('apiario_id', route.params.apiario.id)
      .order('created_at', { ascending: false })

    console.log(data)

    if (postError) console.log(postError)
    else {
      setRelatorios(data)
    }
  }

  function showAlert(id: string) {
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja excluir a Colmeia?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => excluirColmeia(id) },
      ],
      { cancelable: true }
    )
  }

  function converteData(date: string) {
    const data = new Date(date)
    const dia = String(data.getUTCDate()).padStart(2, '0') // Adiciona zero à esquerda se necessário
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0') // Os meses são baseados em zero
    const ano = data.getUTCFullYear()

    // Formata no padrão DD/MM/AAAA
    return `${dia}/${mes}/${ano}`
  }

  const cardColmeia = ({ item, index }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ConsultaColmeia', {
          colmeia: item,
          apiario,
        })
      }
      style={{
        width: 350,
        height: 150,
        justifyContent: 'center',
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
          Colmeia {index + 1}
        </Text>
        <View flexDirection='row'>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditarColmeia', {
                colmeia: item,
                index,
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
            onPress={() => showAlert(item.id)}
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
      <Text>Qtd. Abelhas: {item.qtdAbelhas}</Text>
      <Text>Qtd. Quadros: {item.qtdQuadros}</Text>
      <Text>Tipo Quadro: {item.tipoQuadros}</Text>
      <Text>Espécie: {item.especie}</Text>
    </TouchableOpacity>
  )

  const cardRelatorio = ({ item, index }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ConsultaRelatorio', {
          apiario,
          relatorio: item,
          colmeias,
        })
      }
      style={{
        width: 350,
        height: 150,
        justifyContent: 'center',
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
          {converteData(item.dataVisita)}
        </Text>
        <View flexDirection='row'>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditaRelatorio', {
                relatorio: item,
                apiario,
                colmeias,
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
        </View>
      </View>
      <Text>Objetivo da Visita: {item.objVisita}</Text>
      <Text>Situação do Apiário: {item.sitApiario}</Text>
      <Text>Mortalidade: {item.mortalidade ? 'Sim' : 'Não'}</Text>
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
      <View
        flexDirection='row'
        alignItems='center'
      >
        <View alignItems='flex-start'>
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
        </View>

        <View
          flex={1}
          alignItems='flex-end'
          right={10}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('BaixarQrCode', {
                apiario,
                qrcode: qrCode,
              })
            }
          >
            <Ionicons
              name='qr-code'
              color='#FBBA25'
              size={40}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        marginHorizontal={10}
        gap={15}
      >
        <View>
          <Label fontWeight='bold'>Localizacao</Label>
          <Input
            value={localizacao}
            disabled
            backgroundColor='#fff'
            borderColor='$appPrimary50'
            onChangeText={setLocalizacao}
            width='100%'
            focusStyle={{ borderColor: '$appPrimary50' }}
            size='$5'
            id='localizacao'
          />
        </View>

        <View>
          <Label fontWeight='bold'>Colmeias</Label>
          {colmeias!.length > 0 ? (
            <View
              alignItems='center'
              paddingTop={20}
            >
              <FlatList
                data={colmeias}
                renderItem={cardColmeia}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <View />
          )}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('CadastrarColmeia', { apiario })}
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

        <View>
          <Label fontWeight='bold'>Relatórios</Label>
          {relatorios!.length > 0 ? (
            <View
              alignItems='center'
              paddingTop={20}
            >
              <FlatList
                data={relatorios}
                renderItem={cardRelatorio}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <View />
          )}
        </View>
      </ScrollView>
    </View>
  )
}
