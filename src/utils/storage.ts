import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeStringData = async (storageKey: string, value: string) => {
    try {
      await AsyncStorage.setItem(storageKey, value)
    } catch (e) {
      console.error(e)
      // saving error
    }
  }

export const storeObjectData = async (storageKey: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(storageKey, jsonValue)
  } catch (e) {
    console.error(e)
    // saving error
  }
}

export const getStringData = async (storageKey: string) => {
  try {
    const value = await AsyncStorage.getItem(storageKey)
    if(value !== null) {
      // value previously stored
      return value
    }
  } catch(e) {
      console.error(e)
    // error reading value
  }
}


export const getObjectData = async (storageKey: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(storageKey)
      return jsonValue !== null ? jsonValue : null;
    } catch(e) {
      console.error(e, 'Object does not exist')
      // error reading value
    }
  }

export const removeData = async (storageKey: string) => {
  try {
    await AsyncStorage.removeItem(storageKey)
  } catch(e) {
    // remove error
    console.error(e)
  }

  console.log('Done.')
}

export const clearData = async () => {
  try {
    await AsyncStorage.clear()
  } catch(e) {
    console.error(e)
  }
}

export type PokemonTypeColors = {
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

export type PokemonColorType = {
  [key in keyof PokemonTypeColors]: string;
};

export interface Pokemon {
  id: number
  name: string
  imageFront: string
  imageBack: string
  type: keyof PokemonTypeColors
  koreanName: string
  strikes: number[]
}
export interface PokeDex {
  [key: number]: Partial<Pokemon>[]
}