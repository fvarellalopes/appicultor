import 'react-native-gesture-handler'

import NetInfo from '@react-native-community/netinfo'
import { Session } from '@supabase/supabase-js'
import { useFonts } from 'expo-font'
import * as Notifications from 'expo-notifications'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect, useState, useRef } from 'react'
import { Alert } from 'react-native'
import { TamaguiProvider } from 'tamagui'

import RootStack from './src/navigation'
import config from './tamagui.config'

import Login from '@/screens/login'
import useRelatorioOfflineStore from '@/store/relatorioColmeiasOffline'
import relatorioColmeiasOffline from '@/store/relatorioColmeiasOffline'
import { registerForPushNotificationsAsync } from '@/utils/notifications'
import { supabase } from '@/utils/supabase'
SplashScreen.preventAutoHideAsync()

export default function App() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const [session, setSession] = useState<Session | null>(null)
  const {
    addRelatorioColmeia,
    loadRelatorioColmeias,
    relatorioColmeiasOffline,
    integraRelatorios,
  } = useRelatorioOfflineStore()

  const [networkChecked, setNetworkChecked] = useState(false) // Estado para verificar a conexão
  const [isConnected, setIsConnected] = useState<any>()
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('')
  const notificationListener = useRef<any>()
  const responseListener = useRef<any>()

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token)
      console.log('Expo Push Token:', token)
    })

    // Listener for notifications received while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notificação recebida:', notification)
      })

    // Listener for when user taps on notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Resposta da notificação:', response)
      })

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove()
      }
      if (responseListener.current) {
        responseListener.current.remove()
      }
    }
  }, [])

  useEffect(() => {
    // Monitorar mudanças na conexão
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected) // Atualiza o estado de conexão
    })

    return () => {
      unsubscribe() // Limpa o listener quando o componente é desmontado
    }
  }, [])

  useEffect(() => {
    if (isConnected === false) {
      Alert.alert('Conexão perdida')
      console.log('OFFLINE')
    } else if (isConnected === true) {
      loadRelatorioColmeias()
      integraRelatorios()
      console.log('ONLINE')
    }
  }, [isConnected])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <TamaguiProvider
      defaultTheme='light'
      config={config}
    >
      {session && session!.user ? (
        <RootStack
          key={session.user.id}
          session={session}
        />
      ) : (
        <Login />
      )}
    </TamaguiProvider>
  )
}
