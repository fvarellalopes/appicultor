import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Menu } from '@tamagui/lucide-icons'
import React from 'react'

import Apiario from '@/screens/apiarios'

const Tab = createBottomTabNavigator()

export default function TabRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Menu'
        component={Menu}
      />
      <Tab.Screen
        name='Apiario'
        component={Apiario}
      />
    </Tab.Navigator>
  )
}
