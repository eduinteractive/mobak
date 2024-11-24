import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";

const APP_FAVORITES_KEY = "app_favorites";

const favoritesState = atom({
    key: "favorites",
    default: [] as string[]
})

export const useFavorites = () => {
    const [favorites, setFavorites] = useRecoilState(favoritesState);
    
    useEffect(() => {
        // Load favorites from storage
        const loadFavorites = async () => {
            const result = await AsyncStorage.getItem(APP_FAVORITES_KEY);
            if (result) {
                setFavorites(JSON.parse(result));
            } else {
                await AsyncStorage.setItem(APP_FAVORITES_KEY, JSON.stringify([]));
                setFavorites([]);
            }
        }

        loadFavorites();

    }, [])

    const addFavorite = async (key: string) => {
        if (!favorites.includes(key)) {
            setFavorites([...favorites, key]);
            await AsyncStorage.setItem(APP_FAVORITES_KEY, JSON.stringify([...favorites, key]));
        }
    }

    const removeFavorite = async (key: string) => {
        if (favorites.includes(key)) {
            const newFavorites = favorites.filter(fav => fav !== key);
            setFavorites(newFavorites);
            await AsyncStorage.setItem(APP_FAVORITES_KEY, JSON.stringify(newFavorites));
        }
    }

    return {
        favorites,
        addFavorite,
        removeFavorite
    }
}
