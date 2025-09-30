import { Ionicons } from '@expo/vector-icons'
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { Session } from '@supabase/supabase-js'
import { AlignCenter } from '@tamagui/lucide-icons'
import Constants from 'expo-constants'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StatusBar } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text } from 'tamagui'

import { RootStackParamList } from '../navigation'

import { apiario } from '@/@types/apiario'
import { supabase } from '@/utils/supabase'

export default function Apiario({ session }: { session: Session }) {
  const navigation: any = useNavigation()
  const [apiarios, setApiarios] = useState<apiario[]>([])

  useFocusEffect(
    useCallback(() => {
      consultarApiarios()
    }, [])
  )

  useEffect(() => {
    consultarApiarios()
  }, [])

  async function excluirApiarios(id: string) {
    const { data, error } = await supabase
      .from('apiario')
      .update({ status: false })
      .eq('id', id)
    if (error) {
      console.log(error)
      Alert.alert(
        'Erro ao excluir!',
        'Infelizmente não foi possivel excluir o apiário desejado'
      )
    } else {
      consultarApiarios()
    }
  }

  function showAlert(id: string) {
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja excluir o Apiário?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => excluirApiarios(id) },
      ],
      { cancelable: true }
    )
  }

  async function consultarApiarios() {
    const { data, error: postError } = await supabase
      .from('apiario')
      .select('*, colmeia (id)')
      .eq('produtor_id', session.user.id)
      .eq('status', true)
      .order('created_at', { ascending: true })
    if (postError) console.log(postError)
    else {
      setApiarios(data!)
    }
  }

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ConsultaApiario', { apiario: item })}
      style={{
        width: 350,
        height: 100,
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
          Apiário {index + 1}
        </Text>
        <View flexDirection='row'>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditarApiario', {
                apiarioId: item.id,
                local: item.localizacao,
                session,
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
      <Text>Qtd. Colmeias: {item.colmeia.length}</Text>
      <Text>Localização: {item.localizacao}</Text>
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
        justifyContent='space-between'
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
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

        <TouchableOpacity
          onPress={() => navigation.navigate('CadastrarApiario')}
          style={{
            backgroundColor: '#fff',
            width: 55,
            borderRadius: 60,
            marginRight: 5,
          }}
        >
          <Ionicons
            name='add'
            color='#FBBA25'
            size={55}
          />
        </TouchableOpacity>
      </View>
      <View
        alignItems='center'
        paddingTop={20}
      >
        <FlatList
          data={apiarios}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  )
}
