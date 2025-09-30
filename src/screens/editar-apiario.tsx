import { Ionicons } from '@expo/vector-icons'
import { Session } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import { useState } from 'react'
import { StatusBar, TouchableOpacity } from 'react-native'
import { Input, Label, View, Text, Button } from 'tamagui'

import { supabase } from '@/utils/supabase'

interface EditarApiarioProps {
  route: {
    params: {
      session: Session
      apiarioId: string
      local: string
    }
  }
  navigation: any
}

export default function EditarApiario({
  route,
  navigation,
}: EditarApiarioProps) {
  const [localizacao, setLocalizacao] = useState(route.params.local)
  const { apiarioId, session } = route.params

  async function handleAlterar() {
    const { data, error } = await supabase
      .from('apiario')
      .update({ localizacao })
      .eq('id', apiarioId)
    if (error) {
      console.log(error)
    } else {
      navigation.navigate('Apiario')
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
      <View
        marginHorizontal={10}
        gap={15}
      >
        <View>
          <Label fontWeight='bold'>Localizacao</Label>
          <Input
            value={localizacao}
            backgroundColor='#fff'
            borderColor='$appPrimary50'
            onChangeText={setLocalizacao}
            width='100%'
            focusStyle={{ borderColor: '$appPrimary50' }}
            size='$5'
            id='localizacao'
          />
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
              Alterar Apiário
            </Text>
          </Button>
        </TouchableOpacity>
      </View>
    </View>
  )
}
