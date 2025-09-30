import { Feather, Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Session } from '@supabase/supabase-js'
import React from 'react'
import { Button, Text, View, Image } from 'tamagui'

import CadastroColmeia from '@/screens/adicionar-colmeias'
import CadastroRelatorio from '@/screens/cadastro-relatorio';
import CadastroRelatorioColmeia from '@/screens/adicionar-relatorio-colmeia';
import Apiario from '@/screens/apiarios';
import BaixarQrCode from '@/screens/baixar-qr-code';
import CadastroApiario from '@/screens/cadastro-apiario'
import ConsultaRelatorio from '@/screens/consulta-relatorio'
import ConsultaRelatorioColmeia from '@/screens/consulta-relatorio-colmeia'
import ConsultaApiario from '@/screens/consultar-apirario'
import ConsultaColmeia from '@/screens/consultar-colmeias';
import EditarApiario from '@/screens/editar-apiario'
import EditarColmeia from '@/screens/editar-colmeias'
import EditaRelatorio from '@/screens/editar-relatorio'
import EditarRelatorioColmeia from '@/screens/editar-relatorio-colmeia'
import Home from '@/screens/home'
import Login from '@/screens/login'
import QrCode from '@/screens/qr-code'

export type RootStackParamList = {
  Overview: undefined
  Home: { name: string }
  Apiario: { name: string }
  Menu: { name: string }
  QrCode: { name: string }
  CadastrarApiario: { name: string }
  CadastrarColmeia: { name: string }
  EditarApiario: { name: string }
  EditarColmeia: { name: string }
  ConsultaApiario: { name: string }
  BaixarQrCode: { name: string }
  ConsultaColmeia: { name: string }
  CadastroRelatorio: { name: string }
  CadastroRelatorioColmeia: { name: string }
  ConsultaRelatorio: { name: string }
  ConsultaRelatorioColmeia: { name: string }
  EditaRelatorio: { name: string }
  EditarRelatorioColmeia: { name: string }
}

const Stack = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

export default function RootStack({ session }: { session: Session }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Menu'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='Menu'>
          {() => (
            <Tab.Navigator
              screenOptions={{
                tabBarStyle: {
                  borderTopWidth: 0,
                },
                tabBarActiveTintColor: '#FBBA25',
              }}
            >
              <Tab.Screen
                name='Home'
                options={{
                  headerShown: false,
                  tabBarIcon: ({ color, focused }) => (
                    <Ionicons
                      name={focused ? 'home' : 'home-outline'}
                      size={32}
                      color={color}
                    />
                  ),
                }}
              >
                {(props) => (
                  <Home
                    {...props}
                    session={session}
                  />
                )}
              </Tab.Screen>

              <Tab.Screen
                name='QrCode'
                options={{
                  headerShown: false,
                  tabBarLabel: '',
                  tabBarIcon: () => (
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: '#FBBA25',
                        borderRadius: 100,

                        marginBottom: 100,
                      }}
                      width={60}
                      height={60}
                      marginBottom={24}
                      borderRadius={100}
                      backgroundColor='#FBBA25'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Ionicons
                        name='qr-code'
                        size={30}
                      />
                    </View>
                  ),
                }}
                component={QrCode}
              />

              <Tab.Screen
                name='Apiario'
                options={{
                  tabBarLabel: 'Meus Apiários',
                  headerShown: false,
                  tabBarIcon: ({ color, focused }) => {
                    if (focused) {
                      return (
                        <Image
                          width={40}
                          height={32}
                          source={require('../../assets/apiarioAtivo.png')}
                        />
                      )
                    } else {
                      return (
                        <Image
                          width={40}
                          height={32}
                          source={require('../../assets/Apiario.png')}
                        />
                      )
                    }
                  },
                }}
              >
                {(props) => (
                  <Apiario
                    {...props}
                    session={session}
                  />
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name='CadastrarApiario'>
          {(props) => (
            <CadastroApiario
              {...props}
              session={session}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name='CadastrarColmeia' //@ts-ignore
          component={CadastroColmeia}
        />

        <Stack.Screen
          name='EditarApiario' // @ts-ignore
          component={EditarApiario}
        />
        <Stack.Screen
          name='EditarColmeia' // @ts-ignore
          component={EditarColmeia}
        />
        <Stack.Screen
          name='ConsultaApiario' // @ts-ignore
          component={ConsultaApiario}
        />
        <Stack.Screen
          name='BaixarQrCode' // @ts-ignore
          component={BaixarQrCode}
        />

        <Stack.Screen
          name='ConsultaColmeia' // @ts-ignore
          component={ConsultaColmeia}
        />

        <Stack.Screen
          name='CadastroRelatorio' // @ts-ignore
          component={CadastroRelatorio}
        />

        <Stack.Screen
          name='CadastroRelatorioColmeia' // @ts-ignore
          component={CadastroRelatorioColmeia}
        />

        <Stack.Screen
          name='ConsultaRelatorio' // @ts-ignore
          component={ConsultaRelatorio}
        />

        <Stack.Screen
          name='ConsultaRelatorioColmeia' // @ts-ignore
          component={ConsultaRelatorioColmeia}
        />

        <Stack.Screen
          name='EditaRelatorio' // @ts-ignore
          component={EditaRelatorio}
        />

        <Stack.Screen
          name='EditarRelatorioColmeia' // @ts-ignore
          component={EditarRelatorioColmeia}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
