import { useState, useEffect, useCallback, useRef } from 'react'
import { StyleSheet, Image, Dimensions } from 'react-native'
import pokemonKorean from '../../assets/pokemon/pokemon-korean.json'
import { Audio } from 'expo-av'
import { FontAwesome } from '@expo/vector-icons'
import {
  Center,
  HStack,
  useColorModeValue,
  Box,
  Text,
  ScrollView,
  Input,
  VStack,
  View,
  PresenceTransition,
  Icon
} from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import shortid from 'shortid'
import { useFonts } from 'expo-font'
import usePrevious from '../utils/usePrevious'
import {
  storeObjectData,
  getObjectData,
  PokemonTypeColors,
  PokemonColorType,
  Pokemon,
  PokeDex
} from '../utils/storage'
import ConfettiCannon from 'react-native-confetti-cannon'
const win = Dimensions.get('window')

type Guess = 'strike' | 'ball' | 'out' | 'left' | 'right'
type Expectation = {
  char: string
  guessed: Guess[]
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
  fairy: '#f9adff'
}

async function getPokedex(): Promise<PokeDex | null> {
  const pokedex = await getObjectData('pokedex')
  if (pokedex) {
    return JSON.parse(pokedex)
  }
  return null
}
async function setPokedex(pokemon: Pokemon) {
  const pokedex = (await getPokedex()) ?? {}
  if (pokedex) {
    await storeObjectData('pokedex', {
      ...pokedex,
      [pokemon.id]: pokedex[pokemon.id]
        ? [...pokedex[pokemon.id], pokemon]
        : [pokemon]
    })
  }
}
export default function PokeFight() {
  const [pokemon, setPokemon] = useState<Pokemon | null>()
  const [sound, setSound] = useState<any>()
  const gameBoxColor = useColorModeValue('muted.50', 'indigo.400')
  const [guess, setGuess] = useState<string>('')
  const [expectations, setExpectations] = useState<Expectation[][]>([])
  const [accuracy, setAccuracy] = useState<[number, string]>([100, 'green.500'])
  const [loaded, error] = useFonts({
    PokeGold: require('../../assets/fonts/gsc.ttf')
  })
  const guessRef = useRef(null)
  const [showGuessResult, setShowGuessResult] = useState<boolean>(false)
  const [showSoundEffect, setShowSoundEffect] = useState<boolean>(false)
  const [reveal, setReveal] = useState<boolean>(false)
  const [accuracyDiff, setAccuracyDiff] = useState<boolean>(false)
  const [showConfetti, setShowConfetti] = useState<boolean>(false)

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  useEffect(() => {
    const randomPokemonId = Math.ceil(Math.random() * 151)
    getPokemon(String(randomPokemonId))
    return () => {
      resetPokemon()
    }
  }, [])

  useEffect(() => {
    if (pokemon) {
      const pokemonNameLength = pokemon!.koreanName.length
      const strikeCount = pokemon.strikes.filter(strike => strike === 1).length
      const newAccuracy = (pokemonNameLength - strikeCount) / pokemonNameLength
      let hpColor = 'green.500'
      if (newAccuracy <= 0.5) {
        hpColor = 'amber.400'
      }
      if (newAccuracy <= 0.25) {
        hpColor = 'red.600'
      }
      setAccuracy([newAccuracy * 100, hpColor])
    }
  }, [expectations])

  const prevAccuracy = usePrevious(accuracy)

  useEffect(() => {
    if (prevAccuracy && prevAccuracy![0] !== accuracy[0]) {
      //정답률 변경에 따른 애니메이션 효과
      // setAccuracyDiff(true)
      // setTimeout(() => {setAccuracyDiff(true)}, 500)
    }
    if (accuracy[0] === 0) {
      setShowConfetti(true)
    }
  }, [accuracy])

  useEffect(() => {
    if (showConfetti) {
      setPokedex(pokemon!)
    }
  }, [showConfetti])
  const getPokemon = async (id: string) => {
    const data: Response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    )
    const pokemon = await data.json()
    const pokemonType: keyof PokemonTypeColors = pokemon.types.map(
      (info: any) => info.type.name
    )[0]
    const koreanName = pokemonKorean[parseInt(id) - 1].name
    const transformedPokemon: Pokemon = {
      id: pokemon.id,
      name: pokemon.name,
      imageFront: pokemon.sprites.front_default,
      imageBack: pokemon.sprites.back_default,
      type: pokemonType,
      koreanName,
      strikes: koreanName.split('').map(() => 0)
      //   imageFront: pokemon.sprites.front_shiny
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
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
    const { sound } = await Audio.Sound.createAsync(
      { uri: `https://pokemoncries.com/cries-old/${id}.mp3` },
      { shouldPlay: true }
    )
    setSound(sound)
  }

  const playSound = () => {
    setShowSoundEffect(true)
    sound.replayAsync()
    setTimeout(() => setShowSoundEffect(false), 1000)
  }

  const checkColors: any = {
    strike: 'green.300',
    left: 'yellow.300',
    right: 'yellow.300',
    'strike,left': 'lime.200',
    'strike,right': 'lime.200',
    'left,right': 'yellow.200',
    'left,strike': 'lime.200'
  }

  const guessCheckedColors = useCallback((guessed: Guess[]) => {
    const guess = guessed.join(',')
    return checkColors[guess] ?? 'red.400'
  }, [])

  const expectationJoiner = (expectation: Expectation[]) => {
    return expectation.map(guessed => (
      <Center
        bg={guessCheckedColors(guessed.guessed)}
        key={shortid.generate()}
        h={35}
        w={35}
        rounded="md"
        shadow={2}
      >
        <Text fontSize={20} fontFamily="PokeGold">
          {guessed.char}
        </Text>
      </Center>
    ))
  }

  const onInputGuess = () => {
    setGuess('')
    guessRef.current?.focus()
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
    if (!pokemonKorean.find(pokemon => pokemon.name === guess)) {
      alert('도감에 존재하지 않는 포켓몬이에요')
      return
    }
    if (koreanName?.length !== guess.length) {
      alert(`${koreanName?.length}글자 이름을 가진 포켓몬이에요`)
      return
    }
    const guessChars = guess.split('')
    const answerChars = koreanName?.split('')
    if (guess === koreanName) {
      const guessResults: Expectation[] = koreanName.split('').map(char => {
        return { char, guessed: ['strike'] }
      })
      setExpectations([guessResults])
      answerChars.map((char, index) => {
        setPokemon(prev => {
          let newStrikesPokemon = { ...prev }
          newStrikesPokemon.strikes![index] = 1
          return newStrikesPokemon
        })
      })
      setReveal(true)
    } else {
      let guessResults: Expectation[] = []
      guessChars.map((char: string, index: number) => {
        let newGuessResult: Expectation = {
          char,
          guessed: []
        }
        answerChars?.map((answerChar: string, answerIndex: number) => {
          if (char === answerChar) {
            if (index === answerIndex) {
              newGuessResult.guessed.push('strike')
              setPokemon(prev => {
                let newStrikesPokemon = { ...prev }
                newStrikesPokemon.strikes![answerIndex] = 1
                return newStrikesPokemon
              })
            } else {
              newGuessResult.guessed.push(
                index < answerIndex ? 'right' : 'left'
              )
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
    }
    setShowGuessResult(true)
    setTimeout(() => {
      setShowGuessResult(false)
    }, 1500)
  }, [guess])

  const resetPokemon = () => {
    setPokemon(null)
    setGuess('')
    setExpectations([])
    setShowConfetti(false)
    setAccuracy([100, 'green.500'])
    setReveal(false)
    const randomPokemonId = Math.ceil(Math.random() * 151)
    getPokemon(String(randomPokemonId))
  }

  if (loaded) {
    return (
      <View h="full">
        {showConfetti && (
          <ConfettiCannon
            count={200}
            origin={{ x: win.width / 2, y: win.height / 2 }}
            fadeOut={true}
          />
        )}
        <KeyboardAwareScrollView style={{ zIndex: 3 }} extraScrollHeight={30}>
          <Box justifyContent="space-around" h="full" position="relative">
            {pokemon && (
              <VStack>
                <VStack w="80%" mt={5}>
                  <HStack>
                    <Box flex={1}></Box>
                    <Text fontFamily="PokeGold" fontSize={35} flex={2}>
                      {pokemon!.strikes.map((strike, index) =>
                        strike ? pokemon.koreanName[index] : '?'
                      )}
                    </Text>
                  </HStack>
                  <Box
                    bg={gameBoxColor}
                    borderLeftWidth="8"
                    borderBottomWidth="3"
                    p={2}
                    pb={5}
                    borderBottomLeftRadius="20"
                  >
                    <HStack
                      borderBottomWidth="3"
                      borderColor="black"
                      w="full"
                      borderRightWidth="8"
                    >
                      <Center bg="black" pl={1} pr={1} flex={1}>
                        <Text
                          color="yellow.400"
                          fontWeight="extrabold"
                          fontSize={18}
                        >
                          HP :{' '}
                        </Text>
                      </Center>
                      <Box flex={5} justifyContent="flex-start">
                        {/* <PresenceTransition 
                                          visible={accuracyDiff} 
                                          initial={{
                                            opacity: 0,
                                          }} 
                                          animate={{
                                              opacity: 1,
                                              transition: {
                                                  duration: 300,
                                              }
                                        }}> */}
                        <Box
                          bg={accuracy[1]}
                          w={`${accuracy[0]}%`}
                          h="2.5"
                          mt="2.5"
                        ></Box>
                        {/* </PresenceTransition> */}
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
                <HStack w="full">
                  <Box flex={1}>
                    <PresenceTransition
                      visible={showGuessResult}
                      initial={{
                        opacity: 0,
                        scale: 0
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                          duration: 250
                        }
                      }}
                    >
                      {expectations.length > 0 && (
                        <HStack w="full" py={5} space={2} flex={1}>
                          {expectationJoiner(
                            expectations[expectations.length - 1]
                          )}
                        </HStack>
                      )}
                    </PresenceTransition>
                    <PresenceTransition
                      visible={showSoundEffect}
                      initial={{
                        opacity: 0,
                        scale: 0,
                        translateX: 100,
                        translateY: 70
                      }}
                      animate={{
                        opacity: 1,
                        scale: 0.8,
                        translateX: 30,
                        transition: {
                          duration: 250
                        }
                      }}
                    >
                      <Icon size={20} as={<FontAwesome name={'music'} />} />
                    </PresenceTransition>
                  </Box>
                  <Box flex={2}>
                    <PresenceTransition
                      visible={pokemon.imageFront !== null}
                      initial={{
                        opacity: 0,
                        translateX: 100
                      }}
                      animate={{
                        opacity: 1,
                        translateX: 0,
                        transition: {
                          duration: 500
                        }
                      }}
                    >
                      <Image
                        blurRadius={(accuracy[0] / 100) * 3}
                        source={{ uri: pokemon.imageFront }}
                        style={[
                          {
                            width: win.width / 1.7,
                            height: win.width / 1.7,
                            shadowColor: '#000',
                            shadowOffset: { width: 8, height: 3 },
                            shadowOpacity: 0.3,
                            shadowRadius: 5
                          },
                          reveal ? styles.reveal : styles.veil
                        ]}
                      />
                    </PresenceTransition>
                  </Box>
                </HStack>
              </VStack>
            )}
            <Center w="full">
              <Input
                ref={guessRef}
                fontFamily="PokeGold"
                fontSize={25}
                borderWidth={0}
                onChangeText={setGuess}
                autoCorrect={false}
                onSubmitEditing={() => {
                  onGuess()
                }}
                onFocus={() => {
                  setGuess('')
                }}
              >
                {guess}
              </Input>
            </Center>
          </Box>
        </KeyboardAwareScrollView>
        <Box
          zIndex={5}
          borderStyle="solid"
          borderWidth="2"
          w="full"
          borderRadius={reveal ? 0 : 7}
          p={1}
          mt={5}
          style={{ position: 'absolute', bottom: '10%', left: 0, right: 0 }}
          bg={gameBoxColor}
        >
          <VStack
            borderStyle="solid"
            borderWidth="4"
            borderRadius="5"
            p={3}
            pl={8}
          >
            <HStack w="full" alignItems="center">
              <Box flex={1}>
                <Text
                  fontSize={35}
                  fontFamily="PokeGold"
                  onPress={onInputGuess}
                >
                  싸우다
                </Text>
              </Box>
              <Box flex={1}>
                <Text fontSize={35} fontFamily="PokeGold">
                  가방
                </Text>
              </Box>
            </HStack>
            <HStack w="full" alignItems="center">
              <Box flex={1}>
                <Text fontSize={35} fontFamily="PokeGold" onPress={playSound}>
                  포켓몬
                </Text>
              </Box>
              <Box flex={1}>
                <Text
                  fontSize={35}
                  fontFamily="PokeGold"
                  onPress={resetPokemon}
                >
                  도망치다
                </Text>
              </Box>
            </HStack>
          </VStack>
        </Box>
      </View>
    )
  }
  return null
}

const styles = StyleSheet.create({
  veil: {
    tintColor: '#000',
    opacity: 0.8
  },
  reveal: {
    opacity: 1
  }
})
