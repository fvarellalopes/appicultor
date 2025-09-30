import { Ionicons } from '@expo/vector-icons'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Session } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, StatusBar, TouchableOpacity } from 'react-native'
import { View, Text, Button, Image } from 'tamagui'

import { RootStackParamList } from '../navigation'

import { Produtor } from '@/@types/produtor'
import { supabase } from '@/utils/supabase'

type MenuSreenRouteProp = RouteProp<RootStackParamList, 'Home'>

export default function Home({ session }: { session: Session }) {
  const navigation: any = useNavigation()
  const [produtor, setProdutor] = useState<Produtor | undefined>(undefined)

  useEffect(() => {
    if (session) {
      fetchProdutor(session.user.id)
    }
  }, [session])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error logging out:', error.message)
  }

  const fetchProdutor = async (id: string) => {
    try {
      console.log(id)
      const { data, error } = await supabase
        .from('produtores')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        throw error
      }

      setProdutor(data)
    } catch (error) {
      console.error('Erro ao buscar o produtor:', error)
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

      <SafeAreaView>
        <View
          paddingTop={15}
          flexDirection='row'
          alignItems='center'
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={{ backgroundColor: '#fff', marginLeft: 10 }}
          >
            <Ionicons
              name='person'
              size={30}
              color='#FBBA25'
            />
          </TouchableOpacity>
          <Text fontSize={20}>Bem-Vindo, {produtor?.nome}!</Text>
          <View
            flex={1}
            alignItems='flex-end'
            right={10}
          >
            <TouchableOpacity
              onPress={handleLogout}
              style={{ backgroundColor: '#fff' }}
            >
              <Ionicons
                name='log-out-outline'
                size={40}
                color='#FBBA25'
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          paddingTop={150}
          paddingBottom={100}
          alignItems='center'
        >
          <View>
            <Image source={require('../../assets/logo-coofamel.png')} />
          </View>
        </View>

        <View
          paddingHorizontal={24}
          justifyContent='center'
        >
          <View
            flexDirection='row'
            justifyContent='center'
            gap={25}
          >
            <TouchableOpacity
              style={{
                width: 150,
                height: 150,
                backgroundColor: '#FBBA25',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
              }}
              onPress={() => navigation.navigate('QrCode')}
            >
              <Ionicons
                name='qr-code'
                size={65}
                style={{ paddingBottom: 10 }}
              />
              <Text
                fontWeight='bold'
                fontSize={18}
              >
                Ler QR Code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 150,
                height: 150,
                backgroundColor: '#FBBA25',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
              }}
              onPress={() => navigation.navigate('Apiario')}
            >
              <Image
                width={80}
                height={80}
                source={require('../../assets/Apiario.png')}
              />
              <Text
                fontWeight='bold'
                fontSize={18}
              >
                Meus Apiários
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
