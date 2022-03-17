import {useState, useEffect, useCallback} from 'react'
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Platform, ImageBackground, Pressable, TextInput } from 'react-native';
import pokemonKorean from '../../assets/pokemon/pokemon-korean.json'
import { useDebounce } from 'use-debounce';
import {Audio} from 'expo-av'
import { Center, HStack, useColorModeValue } from 'native-base';
//https://docs.nativebase.io/default-theme
type ImageUri = {
    localUri: string;
    remoteUri?: string | null;
  } | null


export default function Pokedex() {
    const [pokemon, setPokemon] = useState<any>()
    const [sound, setSound] = useState<any>()
    const [pokemonId, setPokemonId] = useState<string>('1')
    const [value] = useDebounce(pokemonId, 500)

    useEffect(() => {
        return sound
          ? () => {
              console.log('Unloading Sound');
              sound.unloadAsync(); }
          : undefined;
      }, [sound]);

    useEffect(() => {
      if(value) {
        console.log('pokemon id', value)
        getPokemon(value)
      }
    }, [value])

    const id = 1
    const getPokemon = useCallback(async (id: string) => {
        const data: Response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          { uri: `https://pokemoncries.com/cries-old/${id}.mp3` },
          // {shouldPlay: true}
        );
        setSound(sound)
        const pokemon = await data.json()
        const pokemonType: string = pokemon.types.map((poke: any) => poke.type.name).join(", ")
        const transformedPokemon = {
          id: pokemon.id,
          name: pokemon.name,
          imageFront: pokemon.sprites.front_default,
          imageBack: pokemon.sprites.back_default,
          type: pokemonType,
          koreanName: pokemonKorean[parseInt(id) - 1].name
          // imageFront: pokemon.sprites.front_shiny
          // back_default:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/132.png"
          // back_female:null
          // back_shiny:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/132.png"
          // back_shiny_female:null
          // front_default:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png"
          // front_female:null
          // front_shiny:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/132.png"
          // front_shiny_female:null
        }
        console.log(transformedPokemon.type.split(', ')[0])
        setPokemon(transformedPokemon)
      }, [id])


      const playSound = () => {
        sound.replayAsync()
      }

      const pokemonNumbering = (pokemonId: string) => {
        switch (pokemonId.length) {
          case 1:
            return `00${pokemonId}`
          case 2:
            return `0${pokemonId}`
          default:
            return pokemonId
        }
      }

      const koreanNameChip = () => {
        if (value) {
          return (
            <Text style={styles.sealName}>{value ? `No. ${pokemonNumbering(value)} ${pokemon.koreanName}` : ''}</Text>
          )
        }
      }

    return (
      <>
        {/* <Image source={nyancat} style={ [styles.nyancat, StyleSheet.absoluteFill]}/>
        {selectedImage && <Image source={{uri: selectedImage.localUri}} style={styles.thumbnail}/>}
        <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
          <Text style={styles.buttonText}>Pick a photo</Text>
        </TouchableOpacity>
        {selectedImage && 
          <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
            <Text style={styles.buttonText}>Share this photo</Text>
          </TouchableOpacity>
        } */}
        {pokemon && 
        <HStack 
        alignItems="center"
        w="full"
        justifyContent="center"
        space={2}
        py={5}
        >
          {pokemon.koreanName.split('').map((char: string) => <Center h="50" w="50" rounded="md" shadow={2} bg={useColorModeValue('muted.50', 'muted.100')}>{char}</Center>)}
        </HStack>
        }
        <TextInput style={styles.input} value={pokemonId} placeholder='Please Enter Pokemon ID' onChangeText={(text) => {if(parseInt(text) <= 151) {setPokemonId(text)}}}/>
        <Pressable onPress={playSound} style={styles.cry}>
          <Text>Cry</Text>
        </Pressable>
        {pokemon && 
        <>
        {/* <Image source={{uri: pokemon.image}} style={[StyleSheet.absoluteFill, styles.thumbnail]}/> */}
          <View style={styles.seal}>
            {/* <Text style={styles.sealName}>{pokemon.name}</Text> */}
              {koreanNameChip()}
            <Image source={{uri: pokemon.imageFront}} style={styles.sealImage} resizeMethod='scale' />
          </View>
        </>
        }
        
        {/* <BlurView intensity={50} style={styles.blurContainer} tint='light'>
          <Text style={[styles.buttonText, {color: '#fff'}]}>Blurred?</Text>
        </BlurView>
        <BlurView intensity={50} style={styles.blurContainer} >
          <Text style={[styles.buttonText, {color: '#fff'}]}>Blurred?</Text>
        </BlurView>
        <BlurView intensity={50} style={[styles.blurContainer]} tint='dark'>
          <Text style={[styles.buttonText, {color: '#fff'}]}>Blurred?</Text>
        </BlurView> */}
        {/* <StatusBar style="auto" /> */}
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
    borderWidth: 1,
    paddingTop: 10,
    paddingLeft: 10,
    backgroundColor: '#fff'
    // alignContent: 'center',
    // justifyContent: 'space-between',
    // flexDirection: 'column',
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
    // tintColor: '#000000',
    // opacity: 0.7
  },
  input : {
    width: 250,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: '#e8e8e8'
  },
  cry: {
    marginBottom: 50,
  }
});
