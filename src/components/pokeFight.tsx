import {useState, useEffect, useCallback} from 'react'
import { StyleSheet, Image, Dimensions, Animated, Easing } from 'react-native';
import pokemonKorean from '../../assets/pokemon/pokemon-korean.json'
import { useDebounce } from 'use-debounce';
import {Audio} from 'expo-av'
import { FontAwesome} from '@expo/vector-icons'
import { Center, HStack, useColorModeValue, Box, Text, ScrollView, Pressable, Input, VStack, View, useColorMode } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import shortid from 'shortid';
import { useFonts } from 'expo-font'

const win = Dimensions.get('window')
type ImageUri = {
    localUri: string;
    remoteUri?: string | null;
  } | null

type PokemonTypeColors = {
  normal: string
  poison: string
  psychic: string
  grass: string
  ground: string
  ice: string
  fire: string
  rock: string
  dragon: string
  water: string
  bug: string
  dark: string
  fighting: string
  ghost: string
  steel: string
  flying: string
  electric: string
  fairy: string
}

type PokemonColorType = {
  [key in keyof PokemonTypeColors]: string;
};

interface Pokemon {
  id: number
  name: string
  imageFront: string
  imageBack: string
  type: keyof PokemonTypeColors
  koreanName: string
}

type Guess = 'strike' | 'ball' | 'out' | 'left' | 'right'
type Expectation = {
  char: string;
  guessed:  Guess[]
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

export default function PokeFight() {
    const [pokemon, setPokemon] = useState<Pokemon|null>()
    const [sound, setSound] = useState<any>()
    const [pokemonId, setPokemonId] = useState<string>('6')
    const [debouncedIdValue] = useDebounce(pokemonId, 700)
    const charBackgroundColor = useColorModeValue('muted.50', 'warmGray.200')
    const gameBoxColor = useColorModeValue('muted.50', 'indigo.400')
    const [guess, setGuess] = useState<string>('')
    const [expectations, setExpectations] = useState<Expectation[][]>([])
    const [loaded, error] = useFonts({
        PokeGold: require('../../assets/fonts/gsc.ttf')
      })
    let opacity = new Animated.Value(0);
    const animate = easing => {
        opacity.setValue(0);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1200,
          easing,
        }).start();
      };
    useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync(); }
          : undefined;
      }, [sound]);

    useEffect(() => {
      if(debouncedIdValue) {
        getPokemon(debouncedIdValue)
      }
    }, [debouncedIdValue])

    useEffect(() => {
      return() => {
        setPokemon(null)
        setGuess('')
        setExpectations([])
      }
    }, [])
    const getPokemon = useCallback(async (id: string) => {
        const data: Response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          { uri: `https://pokemoncries.com/cries-old/${id}.mp3` },
          // {shouldPlay: true}
        );
        setSound(sound)
        const pokemon = await data.json()
        const pokemonType: keyof PokemonTypeColors = pokemon.types.map((info: any) => info.type.name)[0]
        const transformedPokemon: Pokemon = {
          id: pokemon.id,
          name: pokemon.name,
        //   imageFront: pokemon.sprites.front_default,
          imageBack: pokemon.sprites.back_default,
          type: pokemonType,
          koreanName: pokemonKorean[parseInt(id) - 1].name,
          imageFront: pokemon.sprites.front_shiny
          // back_default:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/132.png"
          // back_female:null
          // back_shiny:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/132.png"
          // back_shiny_female:null
          // front_default:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png"
          // front_female:null
          // front_shiny:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/132.png"
          // front_shiny_female:null
        }
        setPokemon(transformedPokemon)
      }, [pokemonId])

      const playSound = () => {
        sound.replayAsync()
      }

    const nameSplitter = (name: string) => (
      name.split('').map((char: string) => <Center key={shortid.generate()} h="50" w="50" rounded="md" shadow={2} bg={charBackgroundColor}><Text _dark={{color: 'coolGray.800'}}>?</Text></Center>)
    )
      const guessCheckedColors = (guessed: Guess[]) => {
        const guess = guessed.join(',')
        console.log('guess on check colors ', guess)
        const checkColors = {
          'strike': 'green.300',
          'left': 'yellow.300',
          'right': 'yellow.300',
          'strike,left': 'lime.200',
          'strike,right': 'lime.200',
          'left,right': 'yellow.200',
          'left,strike': 'lime.200'
        }
        return checkColors[guess]??'red.400'
      }
    const expectationJoiner = (expectation: Expectation[]) => (
      expectation.map((guessed) => <Center bg={guessCheckedColors(guessed.guessed)} key={shortid.generate()} h="50" w="50" rounded="md" shadow={2}>{guessed.char}</Center>)
      )
    const guessedViews = (expectations: Expectation[][]) => {
      return (
        <ScrollView w='full' h='50%'>
          {expectations.map((expectation, index) => 
            <HStack 
              alignItems="center"
              w="full"
              justifyContent="center"
              space={2}
              py={5}
              key={`expectation${index}`}
            >
            {expectationJoiner(expectation)}
            </HStack>
          )}
        </ScrollView>
      )
    }
    const onGuess = useCallback(() => {
      const koreanName = pokemon?.koreanName
      /**
       * 1. 도감에 존재하는 guess인지?
       * 2. 단어 하나씩 분석해서,
       * 2-1) 위치와 단어가 모두 일치하는지? => green
       * 2-2) 위치가 다르고 포함되는지? => yellow
       * 2-3) 포함되지 않는지? => gray or black
       */
      //1
      if(!pokemonKorean.find((pokemon) => pokemon.name === guess)) {
        alert('도감에 존재하지 않는 포켓몬이에요')
        return
      }
      if(koreanName?.length !== guess.length) {
        alert(`${koreanName?.length}글자 이름을 가진 포켓몬이에요`)
        return
      }
      if(guess === koreanName) {
        const guessResults: Expectation[] = koreanName.split('').map((char) => {return {char, guessed: ['strike']}})
        setExpectations(prev => {
          let orgExpectations = [...prev]
          orgExpectations.push(guessResults)
          return orgExpectations
        })
        return
      }
      const guessChars = guess.split('')
      const answerChars = koreanName?.split('')
      let guessResults: Expectation[] = []
      guessChars.map((char: string, index: number) => {
        let newGuessResult: Expectation = {
          char,
          guessed: []
        }
        answerChars?.map((answerChar: string, answerIndex: number) => {
          if(char === answerChar) {
            if(index === answerIndex) {
              newGuessResult.guessed.push('strike')
            } else {
              newGuessResult.guessed.push(index < answerIndex ? 'right' : 'left')
            }
          }
        })
        guessResults.push(newGuessResult)
      })
      setExpectations(prev => {
        let orgExpectations = [...prev]
        orgExpectations.push(guessResults)
        return orgExpectations
      })
      //guessResults의 길이에 따라서 strike, ball 결정될 듯
      //2-1
      // guessChars.map((char: string, index: number) => {
      //   const answer = koreanName![index]
      //   let guessResult: Expectation = {char, guessed: []}
      //   if(answer === char) {
      //     //strike
      //     guessResult.guessed.push('strike')
      //   } else {
      //     if (koreanName!.includes(char)) {
      //       //ball
      //       if(koreanName!.indexOf(char) > index) {
      //       //right ball
      //       } else { 
      //       //left ball
      //       }
      //     } else {
      //       //out
      //     }
      //   } 
      // })
    },[guess])
    if(loaded) {
        return (
        <View h='full'>
            <KeyboardAwareScrollView style={{zIndex: 3}}>
                <Box justifyContent='space-around' h='full' position='relative'>
                    {pokemon && 
                    <VStack>
                        <VStack w='80%'>
                            <HStack>
                                <Box flex={1}></Box>
                                <Text fontFamily="PokeGold" fontSize={35} flex={2}>
                                    {pokemon!.koreanName}
                                </Text>
                            </HStack>
                            <Box bg={gameBoxColor} borderLeftWidth='8' borderBottomWidth='3' p={2} pb={5} borderBottomLeftRadius='20'>
                                <HStack borderBottomWidth='3' borderColor='black' w='full' borderRightWidth='8'>
                                    <Center bg="black" pl={1} pr={1} flex={1}>
                                        <Text color='yellow.400'  fontWeight='extrabold' fontSize={18}>HP : </Text>
                                    </Center>
                                    <Box flex={5} bg='green.500' h='40%' mt='2.5'>
                                    </Box>
                                </HStack>
                            </Box>
                        </VStack>
                        <Center  w='full'>
                            <Image source={{uri: pokemon.imageFront}} style={{width: win.width/1.7, height: win.width/1.7, shadowColor: '#000', shadowOffset: {width: 8, height: 3}, shadowOpacity: 0.3, shadowRadius: 5}} />
                        </Center>
                    </VStack>
                    }
                </Box>
            </KeyboardAwareScrollView>
            <Box zIndex={5} borderStyle='solid' borderWidth='2' w='full' borderRadius='5' p={1}  mt={5} style={{position: 'absolute', bottom: '10%', left: 0, right: 0}} bg={gameBoxColor}>
                <VStack borderStyle='solid' borderWidth='4' borderRadius='5' p={3} pl={8}>
                    <HStack w='full' alignItems='center'>
                        <Input p={0} flex={1}><Text fontSize={35} fontFamily="PokeGold" onPress={()=>{console.log('Fight')}}>싸우다</Text></Input>
                        <Box flex={1}><Text fontSize={35} fontFamily="PokeGold">가방</Text></Box>
                    </HStack>
                    <HStack w='full' alignItems='center'>
                        <Box flex={1}><Text fontSize={35} fontFamily="PokeGold">포켓몬</Text></Box>
                        <Box flex={1}><Text fontSize={35} fontFamily="PokeGold">도망치다</Text></Box>
                    </HStack>
                </VStack>
            </Box>
        </View>
        )
    }
    return null
}
