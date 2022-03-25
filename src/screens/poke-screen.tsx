import React from 'react'
import {
  Box,
  useColorModeValue,
  Text,
  Center,
  VStack,
  View
} from 'native-base'
import PokeFight from '../components/pokeFight'
import Navbar from '../components/navbar'

const PokeScreen = () => {
  return (
    <Box
      _dark={{bg: 'blueGray.900'}} _light={{bg: 'blueGray.50'}}
      w="full"
      px={5}
      h="full"
      pb={10}
    >
      <Navbar />
      <PokeFight />
    </Box>
  )
}

export default PokeScreen
