import { Ionicons } from '@expo/vector-icons'
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'
import { Session } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import * as Sharing from 'expo-sharing'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  TouchableOpacity,
  Button,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { Input, Label, View, Text } from 'tamagui'

import { apiario } from '@/@types/apiario'
import { colmeia } from '@/@types/colmeia'
import { RootStackParamList } from '@/navigation'
import useColmeiaStore from '@/store/colmeias'
import { supabase } from '@/utils/supabase'

interface QrCodeProps {
  route: {
    params: {
      session: Session
      qrcode: string
      apiario: apiario
    }
  }
  navigation: any
}

interface QRCodeRef {
  toDataURL(callback: (data: string) => void): void
}

export default function BaixarQrCode({ route, navigation }: QrCodeProps) {
  const qrCodeRef = useRef<QRCodeRef | null>(null)

  useFocusEffect(
    useCallback(() => {
      console.log(route.params.qrcode)
    }, [])
  )

  useEffect(() => {
    console.log(route.params.qrcode)
  }, [])
  const handleDownloadQR = async () => {
    console.log(route.params.qrcode)
    try {
      if (qrCodeRef.current) {
        qrCodeRef.current.toDataURL(async (data: any) => {
          const filePath = `${FileSystem.cacheDirectory}qr_code.png`
          await FileSystem.writeAsStringAsync(filePath, data, {
            encoding: FileSystem.EncodingType.Base64,
          })
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(filePath)
          } else {
            Alert.alert('Erro', 'O compartilhamento não está disponível.')
          }
        })
      }
    } catch (error) {
      console.error('Erro ao compartilhar o QR code:', error)
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o QR code.')
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
      <View
        paddingTop={40}
        gap={50}
        alignItems='center'
        justifyContent='center'
      >
        <QRCode
          value={route.params.qrcode}
          size={250}
          getRef={(ref) => {
            qrCodeRef.current = ref as QRCodeRef
          }}
        />

        <TouchableOpacity
          onPress={handleDownloadQR}
          style={{
            backgroundColor: '#FBBA25',
            width: '60%',
            alignItems: 'center',
            height: 80,
            justifyContent: 'center',
            borderRadius: 15,
          }}
        >
          <Label
            color='#fff'
            fontWeight='bold'
            fontSize={20}
          >
            Baixar QrCode
          </Label>
        </TouchableOpacity>
      </View>
    </View>
  )
}
