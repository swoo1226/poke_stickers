import React from 'react'
import {
  Box,
  useColorModeValue,
  Text,
  Center,
  VStack
} from 'native-base'
import Pokedex from '../components/pokedex'
import Navbar from '../components/navbar'

const PokeScreen = () => {
  return (
    <Box
      flex={1}
      _dark={{bg: 'blueGray.900'}} _light={{bg: 'blueGray.50'}}
      w="full"
      px={5}
      height='100%'
      pb={10}
    >
      <Navbar />
      <Pokedex />
    </Box>
  )
}

export default PokeScreen
