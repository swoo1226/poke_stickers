import {
  Box
} from 'native-base'
import PokeFight from '../components/pokeFight'
import Navbar from '../components/navbar'

export default function PokeScreen () {
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
