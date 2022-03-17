import {useState, useEffect, useCallback} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Platform, ImageBackground, Pressable, TextInput } from 'react-native';
import {Audio} from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import * as Sharing from 'expo-sharing'
import * as SplashScreen from 'expo-splash-screen'
import uploadToAnonymousFilesAsync from 'anonymous-files'
import nyancat from './assets/nyancat.gif'
import pokemonImage from './assets/pokemon/5.png'
import { useDebounce } from 'use-debounce';
import { BlurView } from 'expo-blur'
import axios from 'axios'
import AppContainer from './src/components/app-container'
import Main from './src/screens/main-screen'
import Navigator from './src'
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
    <AppContainer>
      <Navigator />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
