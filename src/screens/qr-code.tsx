import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import Constants from 'expo-constants'
import React, { useEffect, useState } from 'react'
import { Alert, Button, Linking, StatusBar } from 'react-native'
import { View, Text } from 'tamagui'

import { RootStackParamList } from '../navigation'

export default function QrCode() {
  const [type, setType] = useState('back')
  const navigation: any = useNavigation()
  const [scanned, setScanned] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()

  if (!permission) {
    return <View />
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text style={{ textAlign: 'center' }}>
          Precisamos da sua permissão para utilizar a sua câmera para continuar!
        </Text>
        <Button
          onPress={requestPermission}
          title='Permitir'
        />
      </View>
    )
  }

  const handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
    setScanned(true)

    data = JSON.parse(data)
    if (data.id) {
      navigation.navigate('CadastroRelatorio', { apiario: data })
    } else {
      Alert.alert(
        'Qr-Code Inválido, favor verificar e caso persista, baixe novamente o QR-Code!'
      )
    }
    setScanned(false)
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
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        style={{ flex: 1 }}
        facing='back'
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
    </View>
  )
}
