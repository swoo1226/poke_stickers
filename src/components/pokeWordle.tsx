import {useState, useEffect, useCallback} from 'react'
import { StyleSheet, View, Image, Dimensions, TouchableOpacity, Platform, ImageBackground, TextInput, Keyboard } from 'react-native';
import pokemonKorean from '../../assets/pokemon/pokemon-korean.json'
import { useDebounce } from 'use-debounce';
import {Audio} from 'expo-av'
import { FontAwesome} from '@expo/vector-icons'
import { Center, HStack, useColorModeValue, Box, Text, Icon, PresenceTransition, VStack, ScrollView, Pressable, Input } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { alignProperty } from '@mui/material/styles/cssUtils';
import shortid from 'shortid';
//https://docs.nativebase.io/default-theme
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

export default function Pokedex() {
    const [pokemon, setPokemon] = useState<Pokemon|null>()
    const [sound, setSound] = useState<any>()
    const [pokemonId, setPokemonId] = useState<string>('1')
    const [debouncedIdValue] = useDebounce(pokemonId, 700)
    const charBackgroundColor = useColorModeValue('muted.50', 'warmGray.200')
    const [guess, setGuess] = useState<string>('')
    const [expectations, setExpectations] = useState<Expectation[][]>([])

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
          // imageFront: pokemon.sprites.front_default,
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

      // const pokemonNumbering = (pokemonId: string) => {
      //   switch (pokemonId.length) {
      //     case 1:
      //       return `00${pokemonId}`
      //     case 2:
      //       return `0${pokemonId}`
      //     default:
      //       return pokemonId
      //   }
      // }

      const koreanNameChip = () => {
        if (debouncedIdValue) {
          return (
           <HStack style={{alignItems: 'center', borderRadius: 15, borderWidth: 0.5, borderColor: 'gray', alignSelf: 'flex-start'}} shadow={2}>
             <HStack style={{alignItems: 'center'}}>
               <Box borderRadius={15} backgroundColor={PokemonTypeColor[pokemon!.type]} pl={2} pr={2}>
                {pokemonKorean[parseInt(debouncedIdValue) - 1].num}
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
        console.log('현재 추측 단어 ', char)
        let newGuessResult: Expectation = {
          char,
          guessed: []
        }
        answerChars?.map((answerChar: string, answerIndex: number) => {
          if(char === answerChar) {
            console.log(char, index, answerIndex)
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
      console.log(guessResults)
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

    return (
      <>
      <KeyboardAwareScrollView style={{height: '90%', width: '100%'}} contentContainerStyle={{alignItems: 'center'}} extraScrollHeight={50}>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        {expectations && guessedViews(expectations)}
        {pokemon && <HStack mt={1} space={2} py={5}>{nameSplitter(pokemon?.koreanName)}</HStack>}
        <Pressable onPress={playSound} style={styles.cry}>
          <Text>Cry</Text>
        </Pressable>
        {pokemon && 
        <>
        {/* <Image source={{uri: pokemon.image}} style={[StyleSheet.absoluteFill, styles.thumbnail]}/> */}
          <Box shadow={1} style={styles.seal}>
            {koreanNameChip()}
            <Image source={{uri: pokemon.imageFront}} style={styles.sealImage} resizeMethod='scale' />
          </Box>
          {/* <View style={styles.seal}>
            {koreanNameChip()}
            <Image source={{uri: pokemon.imageBack}} style={[styles.sealImage, styles.sealImageVeiled]} resizeMethod='scale' />
          </View> */}
        </>
        }
        {/* <Text>{guess??''}</Text> */}
        {/* <BlurView intensity={50} style={styles.blurContainer} tint='light'>
          <Text style={[styles.buttonText, {color: '#fff'}]}>Blurred?</Text>
        </BlurView>
        <BlurView intensity={50} style={styles.blurContainer} >
          <Text style={[styles.buttonText, {color: '#fff'}]}>Blurred?</Text>
        </BlurView>
        <BlurView intensity={50} style={[styles.blurContainer]} tint='dark'>
          <Text style={[styles.buttonText, {color: '#fff'}]}>Blurred?</Text>
        </BlurView> */}
        <Input variant='rounded' w='80%' mt={10} style={styles.input} value={pokemonId} placeholder='Please Enter Pokemon ID' onChangeText={(text) => {if(parseInt(text) <= 151 || !text) {setPokemonId(text)}}}/>
        <Input variant='rounded' w='80%' mt={10} mb={20} style={styles.input} value={guess} placeholder='이번 포켓몬의 이름은 뭘까요?' onChangeText={(text) => {setGuess(text)}} 
        InputRightElement={<Icon mr={3} size={5} as={<FontAwesome name={guess ? 'send' : 'send-o'} />}/>} autoCorrect={false} onSubmitEditing={() =>{onGuess()}}/>
        {/* <TextInput style={styles.input} value={guess} placeholder='이번 포켓몬의 이름은 뭘까요?' onChangeText={(text) => {setGuess(text)}} /> */}
        {/* </TouchableWithoutFeedback> */}
        </KeyboardAwareScrollView>
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: '600'
  }, 
  thumbnail: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  nyancat: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    resizeMode: 'cover'
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    width: '100%'
  },
  seal: {
    width: 170,
    height: 170,
    borderColor: '#000',
    borderWidth: 0.2,
    paddingTop: 10,
    paddingLeft: 10,
    backgroundColor: '#fff'
  },
  sealName: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: 'bold',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 8,
    paddingRight: 8,
    borderColor: '#fff',
    backgroundColor: '#68a0cf',
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sealImage: {
    flex: 1,
  },
  sealImageVeiled: {
    tintColor: '#000',
    opacity: 0.1  
  },
  input : {
    width: 250,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: '#e8e8e8',
    borderRadius: 10
  },
  cry: {
    marginTop: 50,
    marginBottom: 50,
  }
});
