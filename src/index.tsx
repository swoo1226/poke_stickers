import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import MainScreen from './screens/main-screen'
import AbountScreen from './screens/about-screen'
import PokeScreen from './screens/poke-screen'
import Sidebar from './components/sidebar'
const Drawer = createDrawerNavigator()

const App = () => {
    return (
        <Drawer.Navigator
        initialRouteName="Main"
        drawerContent={props => <Sidebar {...props} />}
        screenOptions={{
            headerShown: false,
            drawerType: 'back',
            overlayColor: '#00000000'
        }}
        >
            <Drawer.Screen name='Main' component={MainScreen} />
            <Drawer.Screen name='About' component={AbountScreen} />
            <Drawer.Screen name='Poke' component={PokeScreen} />
        </Drawer.Navigator>
    )
}

export default App