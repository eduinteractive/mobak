import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext } from "react";

const APP_CONFIG_KEY = "app_config";

export type AppConfig = {
	lang: string;
};

export const AppContext = createContext<AppConfig | null>(null);

export const setAppConfig = async (appConfig: AppConfig): Promise<AppConfig> => {
	try {
		await AsyncStorage.setItem(
			APP_CONFIG_KEY,
			JSON.stringify({
				lang: appConfig.lang,
			})
		);
		return {
			lang: appConfig.lang,
		};
	} catch (e) {
		throw new Error(`Failed to set app config: ${e}`);
	}
};

export const getAppConfig = async (): Promise<AppConfig | null> => {
	try {
		const result = await AsyncStorage.getItem(APP_CONFIG_KEY);

		if (result === null) {
			return null;
		}

		if (JSON.parse(result)) {
			const res = JSON.parse(result);

			return res;
		}

		return null;
	} catch (e) {
		throw new Error(`Failed to get app config: ${e}`);
	}
};

AsyncStorage.clear();
