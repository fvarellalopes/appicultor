import Constants from 'expo-constants'
import React, { useState } from 'react'
import {
  Alert,
  Keyboard,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native'
import { Button, Image, Input, Label, View } from 'tamagui'

import { supabase } from '@/utils/supabase'

export default function Login() {
  const [keepLogin, setKeepLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      console.log(error)
      Alert.alert('Erro de login', error.message)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View flex={1}>
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
          flex={1}
          paddingHorizontal={24}
          alignItems='center'
        >
          <View
            marginBottom={80}
            marginTop={124}
            width='400'
          >
            <Image source={require('../../assets/logo-coofamel.png')} />
          </View>
          <View
            gap={15}
            width='100%'
          >
            <View>
              <Label fontWeight='bold'>Login</Label>
              <Input
                backgroundColor='#fff'
                borderColor='$appPrimary50'
                onChangeText={setEmail}
                focusStyle={{ borderColor: '$appPrimary50' }}
                size='$5'
                id='email'
              />
            </View>
            <View>
              <Label fontWeight='bold'>Senha</Label>
              <Input
                backgroundColor='#fff'
                onChangeText={setSenha}
                borderColor='$appPrimary50'
                secureTextEntry
                focusStyle={{ borderColor: '$appPrimary50' }}
                size='$5'
                id='password'
              />
            </View>
            <View>
              <Button
                onPress={handleLogin}
                color='#fff'
                size='$5'
                backgroundColor='$appPrimary50'
                pressStyle={{ backgroundColor: '$appSecondary100' }}
              >
                Logar
              </Button>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
