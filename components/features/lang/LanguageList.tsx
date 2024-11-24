import Language from "@/constants/Language";
import { useState } from "react";
import { StyleSheet, FlatList, TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-ico-flags";
import { Button, Card, Text } from "react-native-paper";

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
						<Icon
							name={lang.icon}
							width={100}
							height={100}
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
		<>
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
				mode="contained"
				onPress={() => {
                    setLoading(true)
                    props.onSubmit(selectedLang!)
                        .then(() => setLoading(false))
                        .catch(() => setLoading(false))
                }}
				style={styles.button}
				textColor="white"
				disabled={!selectedLang}
                loading={loading}
			>
				Get Started
			</Button>
		</>
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
