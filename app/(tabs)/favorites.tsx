import SafeScrollView from "@/components/common/SafeScrollView";
import { getTaskGroupByTask } from "@/constants/LearningTasks";
import { getColorByTaskGroup } from "@/constants/TasksOverview";
import { useFavorites } from "@/hooks/useFavorites";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "react-native-paper";

const FavoritesScreen = () => {
    const { t } = useTranslation();
	const { favorites } = useFavorites();

	const renderFavorites = useCallback(() => {
		return favorites.map((fav) => (
			<View
				style={styles.cardWrapper}
				key={fav}
			>
				<Card
					style={{
                        ...styles.card,
                        backgroundColor: `rgba(${getColorByTaskGroup(getTaskGroupByTask(fav)!)} , 1)`,
                    }}
					mode="contained"
					onPress={() => router.push(`/(tabs)/(home)/l_tasks/${getTaskGroupByTask(fav)}/${fav}`)}
				>
					<View style={styles.cardContent}>
						<Text style={styles.text}>{t(fav + ".TITLE")}</Text>
						<Text style={styles.subtext}>
							{t(fav + ".VARIATIONS").split(".").length}{" "}
							{t("learning_task_variations")}
						</Text>
					</View>
				</Card>

				<View style={styles.circleCutout} />

				<TouchableOpacity
					style={{
						...styles.roundButton,
						backgroundColor: `rgba(${getColorByTaskGroup(getTaskGroupByTask(fav)!)}, 1)`,
					}}
					onPress={() => router.push(`/(tabs)/(home)/l_tasks/${getTaskGroupByTask(fav)}/${fav}`)}
				>
					<MaterialIcons
						name="keyboard-double-arrow-right"
						size={24}
						color="black"
					/>
				</TouchableOpacity>
			</View>
		));
	}, [favorites]);

	return (
		<SafeScrollView
			header={
				<View style={styles.header}>
					<ImageBackground
						source={require("@/assets/images/l_tasks/THROWING.WILD_PIG.FOTO.jpeg")}
						style={{ width: "100%", height: "100%" }}
					>
						<LinearGradient
							colors={[
								`rgba(255, 255, 255, 1)`,
								`rgba(255, 255, 255, 0.9)`,
								"transparent",
							]}
							style={styles.gradient}
							start={{ x: 0, y: 1 }}
							end={{ x: 0, y: 0.1 }}
						/>

						<Text style={styles.headerText}>{t("navigation_favorite")}</Text>
					</ImageBackground>
				</View>
			}
		>
			{renderFavorites()}
		</SafeScrollView>
	);
};

export default FavoritesScreen;

const styles = StyleSheet.create({
	header: {
		backgroundColor: "rgb(255, 255, 255)",
		height: 250,
		width: "100%",
		position: "relative",
	},
	blurView: {
		position: "absolute",
		width: "100%", // Blurre die linke Hälfte des Bildes
		height: "100%",
		left: 0,
		top: 0,
		zIndex: 1, // Blur über dem Bild
	},
	gradient: {
		position: "absolute",
		width: "100%", // Gradient über der linken Hälfte des Bildes
		height: "100%",
		right: 0,
		top: 0,
		zIndex: 2, // Gradient über dem BlurView
	},
	headerText: {
		position: "absolute",
		bottom: 20,
		left: 20,
		fontSize: 24,
		fontWeight: "bold",
		zIndex: 3,
	},
	card: {
		height: 80,
		overflow: "hidden",
		position: "relative",
		borderRadius: 7.5,
	},
	cardWrapper: {
		position: "relative",
		marginVertical: 5,
	},
	cardContent: {
		position: "relative",
		width: "100%",
		height: "100%",
		justifyContent: "center",
		zIndex: 0,
        padding: 10,
	},
	circleCutout: {
		position: "absolute",
		transform: [{ translateY: -25 }],
		right: -25,
		top: "50%",
		width: 70,
		height: 50,
		backgroundColor: "rgb(242, 242, 242)",
		borderRadius: 15,
		zIndex: 1,
	},
	image: {
		width: "40%",
		height: "100%",
		position: "absolute",
		right: 0,
	},
	text: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#000",
		zIndex: 3, // Text über allem
	},
    subtext: {
		fontSize: 12,
		color: "#000",
		zIndex: 3, // Text über allem
	},
	roundButton: {
		position: "absolute",
		right: 0, // Um den Button in die Einbuchtung zu schieben
		top: "50%",
		transform: [{ translateY: -17.5 }], // Button zentrieren
		width: 37.5,
		height: 35,
		borderRadius: 10, // Kreisförmiger Button
		justifyContent: "center",
		alignItems: "center",
		zIndex: 4,
	},
});
