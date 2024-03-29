import React, { useCallback } from 'react'
import {
  HStack,
  VStack,
  Center,
  Avatar,
  Heading,
  IconButton,
  useColorModeValue,
  Box,
} from 'native-base'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import ThemeToggle from './theme-toggle'
import { Feather, Foundation } from '@expo/vector-icons'
import MenuButton from './menu-button'

const Sidebar = (props: DrawerContentComponentProps) => {
  const { state, navigation } = props
  const currentRoute = state.routeNames[state.index]

  const handlePressBackButton = useCallback(() => {
    navigation.closeDrawer()
  }, [navigation])
  const handlePressMenuMain = useCallback(() => {
    navigation.navigate('Main')
  }, [navigation])
  const handlePressMenuAbout = useCallback(() => {
    navigation.navigate('About')
  }, [navigation])
  // const handlePressMenuWordle = useCallback(() => {
  //   navigation.navigate('Wordle')
  // }, [navigation])
  const handlePressMenuPoke = useCallback(() => {
    navigation.navigate('Poke')
  }, [navigation])
  const handlePressMenuPedo = useCallback(() => {
    navigation.navigate('Pedo')
  }, [navigation])
  const handlePressMenuDex = useCallback(() => {
    navigation.navigate('Dex')
  }, [navigation])

  return (
    <Box
      safeArea
      flex={1}
      bg={useColorModeValue('blue.50', 'darkBlue.800')}
      p={7}
    >
      <VStack flex={1} space={2}>
        <HStack justifyContent="flex-end">
          <IconButton
            onPress={handlePressBackButton}
            borderRadius={100}
            variant="outline"
            borderColor={useColorModeValue('blue.300', 'darkBlue.700')}
            _icon={{
              as: Feather,
              name: 'chevron-left',
              size: 5,
              color: useColorModeValue('blue.800', 'darkBlue.700')
            }}
          />
        </HStack>
        <Avatar
          source={require('../../assets/profile.png')}
          size="xl"
          borderRadius={100}
          mb={6}
          borderColor="primary.500"
          borderWidth={3}
        />
        <Heading mb={4} size="xl">
          Sangwoo Kim
        </Heading>
        <MenuButton
          active={currentRoute === 'Main'}
          onPress={handlePressMenuMain}
          icon="inbox"
        >
          Tasks
        </MenuButton>
        <MenuButton
          active={currentRoute === 'About'}
          onPress={handlePressMenuAbout}
          icon="info"
        >
          About
        </MenuButton>
        {/* <MenuButton
          active={currentRoute === 'Wordle'}
          onPress={handlePressMenuWordle}
          icon="book"
        >
          Wordle
        </MenuButton> */}
        <MenuButton
          active={currentRoute === 'Dex'}
          onPress={handlePressMenuDex}
          icon="book"
        >
          Dex
        </MenuButton>
        <MenuButton
          active={currentRoute === 'Poke'}
          onPress={handlePressMenuPoke}
          icon="meh"
        >
          Poke
        </MenuButton>
        <MenuButton
          active={currentRoute === 'Pedo'}
          onPress={handlePressMenuPedo}
          icon="foot"
          iconGroup='Foundation'
        >
          Pedometer
        </MenuButton>
      </VStack>
      <Center>
        <ThemeToggle />
      </Center>
    </Box>
  )
}

export default Sidebar
