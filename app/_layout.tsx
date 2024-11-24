import '@/lang/i18n';
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ActivityIndicator, PaperProvider } from "react-native-paper";
import { AppConfig, AppContext, getAppConfig, setAppConfig } from "@/context/AppConfig";
import LanguageList from "@/components/features/lang/LanguageList";
import { RecoilRoot } from "recoil";
import i18next from "i18next";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});
    const [appState, setAppState] = useState<AppConfig | null>(null);
    const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

    useEffect(() => {
        const fetchAppConfig = async () => {
            const config = await getAppConfig();
            if (config) {
                setAppState(config);
            }
            setLoading(false);
        }
        fetchAppConfig();
    }, [])

    useEffect(() => {
        if (appState) {
            i18next.changeLanguage(appState.lang);
        }
    }, [appState])

    const handleSetAppConfig = async (lang: string) => {
        const config = await setAppConfig({ lang });
        setAppState(config);
    }

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<PaperProvider>
                <RecoilRoot>
                    {!loading && appState && (
                        <AppContext.Provider value={appState}>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="(tabs)" />
                            </Stack>
                        </AppContext.Provider>
                    )}
                    {!loading && !appState && (
                        <LanguageList
                            onSubmit={handleSetAppConfig}
                        />
                    )}
                    {(loading || !loaded) && <ActivityIndicator animating={true}/>}
                </RecoilRoot>
			</PaperProvider>
		</ThemeProvider>
	);
}

export default RootLayout;
