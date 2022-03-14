import {useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Platform, ImageBackground, Button, TextInput } from 'react-native';
import {Audio} from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import * as Sharing from 'expo-sharing'
import * as SplashScreen from 'expo-splash-screen'
import uploadToAnonymousFilesAsync from 'anonymous-files'
import nyancat from './assets/nyancat.gif'
import pokemonImage from './assets/pokemon/5.png'
// console.log(nyancat)
import { BlurView } from 'expo-blur'
import axios from 'axios'

type ImageUri = {
  localUri: string;
  remoteUri?: string | null;
} | null

interface IPokemon {
  id: number;
  name: string;
  image: string;
  type: string;
}

export default function App() {
  const [selectedImage, setSelectedImage] = useState<ImageUri>(null)
  const [pokemon, setPokemon] = useState<any>()
  const [sound, setSound] = useState<any>()
  const [pokemonId, setPokemonId] = useState<string>('')
  const id = 1
  const getPokemon = async (id: string) => {
    const data: Response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync(
      { uri: `https://pokemoncries.com/cries-old/${id}.mp3` },
      // {shouldPlay: true}
    );
    console.log(sound)
    setSound(sound)
    const pokemon = await data.json()
    const pokemonType: string = pokemon.types.map((poke: any) => poke.type.name).join(", ")
    const transformedPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      imageFront: pokemon.sprites.front_default,
      imageBack: pokemon.sprites.back_default,
      type: pokemonType,
      imageFrontShiny: pokemon.sprites.front_shiny
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
  }
  const playSound = () => {
    sound.replayAsync()
  }

  useEffect(() => {
    getPokemon('5')
    return() => {
      setSelectedImage(null)
    }
  }, [])

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);
  useEffect(() => {
    console.log('pokemonId is ', pokemonId)
    getPokemon(pokemonId)
  }, [pokemonId])
  // useEffect(() => {console.log(pokemon)}, [pokemon])
  const openImagePickerAsync = async() => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if(!permissionResult.granted) {
      alert("Permission to access camera roll is required!")
      return
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync()

    if(pickerResult.cancelled) {
      return
    }

    if(Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri)
      setSelectedImage({localUri: remoteUri, remoteUri})
    } else {
      setSelectedImage({localUri: pickerResult.uri, remoteUri: null})
    }
  }

  const openShareDialogAsync = async () => {
    if (Platform.OS === 'web') {
      alert(`Sharing isn't available on your platform`)
      return
    }
    await Sharing.shareAsync(selectedImage!.localUri)
  }

  // SplashScreen.preventAutoHideAsync()
  // setTimeout(SplashScreen.hideAsync, 2000)
  return (
    <View style={styles.container}>
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
      <TextInput value={pokemonId} placeholder='Please Enter Pokemon ID' onChangeText={(text) => {setPokemonId(text)}}/>
      {pokemon && 
      <>
      {/* <Image source={{uri: pokemon.image}} style={[StyleSheet.absoluteFill, styles.thumbnail]}/> */}
        <View style={styles.seal}>
          <Text style={styles.sealName}>{pokemon.name}</Text>
          <ImageBackground source={{uri: pokemon.imageFrontShiny}}style={styles.sealImage}/>
          <Button onPress={playSound} title="Cry" color="red"/>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
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
    width: 300,
    height: 300,
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    alignContent: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  sealName: {
    borderRadius: 10,
    backgroundColor: 'red',
    alignSelf: 'flex-start'
  },
  sealImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    // tintColor: '#000000',
    // opacity: 0.7
  }
});
