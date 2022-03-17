import React from 'react'
import {
  Box,
  useColorModeValue,
  Text,
  Center
} from 'native-base'
import Pokedex from '../components/pokedex'
import Navbar from '../components/navbar'

const PokeScreen = () => {
  return (
    <Box
      flex={1}
      bg={useColorModeValue('warmGray.50', 'warmGray.900')}
      w="full"
    >
        <Navbar />
        <Pokedex />
    </Box>
  )
}

export default PokeScreen
