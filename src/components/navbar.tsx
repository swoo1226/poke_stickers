import React, { useCallback, useState, useEffect } from 'react'
import { HStack, IconButton, useColorMode } from 'native-base'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'

const NavBar = () => {
    const navigation = useNavigation<DrawerNavigationProp<{}>>()
    const [currColorMode, setCurrColorMode] = useState<string|null|undefined>('light')
    const handlePressMenuButton = useCallback(() => {navigation.openDrawer()}, [navigation])
    const {colorMode} = useColorMode()
    useEffect(() => {
        setCurrColorMode(colorMode)
    }, [colorMode])
    return (
        <HStack w="full" h={20} alignItems="center" alignContent="center" p={1} pt={10}>
            <IconButton onPress={handlePressMenuButton} borderRadius={100} _icon={{
                as: Feather,
                name: 'menu',
                size: 6,
                color: currColorMode === 'light' ? 'blue.400' : 'white'
            }}
            />
        </HStack>
    )
}
export default NavBar