import Language from "@/constants/Language";
import React from "react";
import { useState } from "react";
import {View, StyleSheet, FlatList, TouchableWithoutFeedback, Image } from "react-native";
import { Button, Card, Text } from "react-native-paper";

const LANG_IMAGES = {
	"united-kingdom": require("@/assets/lang/united-kingdom.png"),
    "germany": require("@/assets/lang/germany.png"),
    "netherlands": require("@/assets/lang/netherlands.png"),
    "slovakia": require("@/assets/lang/slovakia.png"),
    "france": require("@/assets/lang/france.png"),
    "italy": require("@/assets/lang/italy.png"),
    "spain": require("@/assets/lang/spain.png"),
    "finland": require("@/assets/lang/finland.png"),
    "republic-of-macedonia": require("@/assets/lang/republic-of-macedonia.png"),
    "czech-republic": require("@/assets/lang/czech-republic.png"),
    "portugal": require("@/assets/lang/portugal.png"),
    "slovenia": require("@/assets/lang/slovenia.png"),
};

interface LanguageListProps {
	onSubmit: (lang: string) => Promise<void>;
}

const LanguageList = (props: LanguageListProps) => {
	const [selectedLang, setSelectedLang] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const renderLanguage = (lang: { icon: string; lang: string; langText: string }) => {
		return (
			<TouchableWithoutFeedback
				onPress={() => setSelectedLang(selectedLang === lang.lang ? null : lang.lang)}
			>
				<Card
					style={
						selectedLang === lang.lang
							? {
									...styles.card,
									...styles.cardSelected,
							  }
							: { ...styles.card }
					}
				>
					<Card.Content style={styles.cardContent}>
						<Image source={LANG_IMAGES[lang.icon as keyof typeof LANG_IMAGES]}
                            height={50}
                            style={{ width: 140, height: 110 }}
                        />
						<Text
							variant="labelLarge"
							style={styles.cardText}
						>
							{lang.langText}
						</Text>
					</Card.Content>
				</Card>
			</TouchableWithoutFeedback>
		);
	};

	return (
		<View style={{flex: 1, backgroundColor: "white"}}>
			<Text
				variant="titleLarge"
				style={styles.title}
			>
				Please select a language
			</Text>
			<FlatList
				data={Language}
				renderItem={(item) => renderLanguage(item.item)}
				keyExtractor={(lang) => lang.lang}
				numColumns={2}
				contentContainerStyle={styles.contentContainer}
			/>
			<Button
				key={selectedLang ? "disabled" : "enabled"}
				mode="contained"
				onPress={() => {
					setLoading(true);
					props.onSubmit(selectedLang!)
						.then(() => setLoading(false))
						.catch(() => setLoading(false));
				}}
				style={styles.button}
				textColor="white"
				disabled={!selectedLang}
				loading={loading}
			>
				Get Started
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	title: {
		marginTop: 60,
		paddingBottom: 10,
		textAlign: "center",
	},
	contentContainer: {
		padding: 20,
		gap: 20,
	},
	card: {
		marginHorizontal: 10,
		flex: 0.5,
		height: 175,
		width: "100%",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	cardContent: {
		flex: 1,
		width: "100%",
	},
	cardSelected: {
		borderColor: "green",
		borderWidth: 2,
	},
	cardText: {
		textAlign: "center",
	},
	button: {
		marginTop: 20,
		bottom: 20,
		width: "95%",
		height: 60,
		alignSelf: "center",
		justifyContent: "center",
		alignContent: "center",
	},
});

export default LanguageList;
