import { useCallback, useState } from "react";
import { Box, VStack, Center, HStack, Text, ScrollView } from "native-base";
import { Image, StyleSheet, Dimensions, VirtualizedList, SafeAreaView } from 'react-native'
import NavBar from "../components/navbar";
import { getObjectData, PokeDex, Pokemon, PokemonColorType } from "../utils/storage";
import pokemonKorean from '../../assets/pokemon/pokemon-korean.json'
import { useFocusEffect } from "@react-navigation/core";
const WIN = Dimensions.get('window')

async function getPokedex(): Promise<PokeDex|null> {
  const pokedex = await getObjectData('pokedex')
  if(pokedex) {
    return JSON.parse(pokedex)
  }
  return null
}

async function setPokedex(callback: (dex: PokeDex) => void) {
  const pokedex = await getPokedex()
  if(pokedex){
    await callback(pokedex)
  }
}
const PokemonTypeColor: PokemonColorType = {
  normal: '#bdbdaf',
  poison: '#a95c9f',
  psychic: '#f461af',
  grass: '#8bd54f',
  ground: '#ebc856',
  ice: '#97f1ff',
  fire: '#fa5543',
  rock: '#ccbc71',
  dragon: '#8574ff',
  water: '#56adf3',
  bug: '#c4d11f',
  dark: '#7c5f4c',
  fighting: '#894c3b',
  ghost: '#736fcd',
  steel: '#c4c2db',
  flying: '#79a3ff',
  electric: '#fee33a',
  fairy: '#f9adff',
}

const koreanNameChip = (pokemon: Pokemon) => {
  return (
    <HStack style={{alignItems: 'center', borderRadius: 15, borderWidth: 0.5, borderColor: 'gray', alignSelf: 'flex-start'}} shadow={2}>
      <HStack style={{alignItems: 'center'}}>
        <Box borderRadius={15} backgroundColor={PokemonTypeColor[pokemon!.type]} pl={2} pr={2}>
        {pokemonKorean[pokemon.id].num}
      </Box>
      <Center pl={1} pr={2}>
        <Text fontWeight='bold' _dark={{color: 'dark.50'}}>
        {pokemon!.koreanName}
        </Text>
      </Center>
      </HStack>
    </HStack>
  )
}

export default function DexScreen() {
  const [caughtPokemons, setCaughtPokemons] = useState<PokeDex>()
  useFocusEffect(
    useCallback(() => {
      setPokedex(setCaughtPokemons)
    }, [])
  )
  return(
    <Box _dark={{bg: 'blueGray.900'}} _light={{bg: 'blueGray.50'}} px={5} flex={1} w='full'>
      <NavBar /> 
      <ScrollView w='full'>
        <VStack space={5} alignItems='center' w='full'>
          {caughtPokemons && Object.entries(caughtPokemons).map(([id, seals]) => 
            seals.map((pokemon: Pokemon) => 
            <Box shadow={1} style={styles.seal}>
              {koreanNameChip(pokemon)}
              <Image source={{uri: pokemon.imageFront}} style={styles.sealImage} resizeMethod='scale' />
            </Box>
            )
          )}
        </VStack> 
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  seal: {
    width: 150,
    height: 150,
    borderColor: '#000',
    borderWidth: 0.2,
    paddingTop: 10,
    paddingLeft: 10,
    backgroundColor: '#fff'
  },
  sealImage: {
    flex: 1,
  },
})