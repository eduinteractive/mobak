import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, SegmentedButtons, Text } from "react-native-paper";
import TasksOverview from "@/constants/TasksOverview";
import { useState } from "react";
import { router } from "expo-router";
import SafeScrollView from "@/components/common/SafeScrollView";
import { useTranslation } from "react-i18next";

const taskImages = {
	task_balancing: require("@/assets/images/tasks/BALANCING_1_2.FOTO.jpg"),
	task_rolling: require("@/assets/images/tasks/ROLLING_1_2.FOTO.jpg"),
	task_jumping: require("@/assets/images/tasks/JUMPING_1_2.FOTO.jpg"),
	task_running: require("@/assets/images/tasks/RUNNING_1_2.FOTO.jpg"),
	task_bouncing: require("@/assets/images/tasks/BOUNCING_1_2.FOTO.jpg"),
	task_catching: require("@/assets/images/tasks/CATCHING_1_2.FOTO.jpg"),
	task_throwing: require("@/assets/images/tasks/THROWING_1_2.FOTO.jpg"),
	task_dribbling: require("@/assets/images/tasks/DRIBBLING_1_2.FOTO.jpg"),
};

const HomeScreen = () => {
    const { t } = useTranslation()
	const [currentTaskGroup, setCurrentTaskGroup] = useState<"SELF_MOVE" | "OBJECT_MOVE">("SELF_MOVE");

	return (
		<SafeScrollView>
			<Text style={styles.title}>{t("dashboard_title")}</Text>
			<Text style={styles.subtitle}>{t("dashboard_subtitle")}</Text>
			<SegmentedButtons
				density="regular"
				style={styles.segmentedButtons}
				value={currentTaskGroup}
				onValueChange={(value) => setCurrentTaskGroup(value as "SELF_MOVE" | "OBJECT_MOVE")}
				buttons={[
					{
						value: "SELF_MOVE",
						label: t("task_self_movement"),
						style: styles.segmentedButton,
					},
					{
						value: "OBJECT_MOVE",
						label: t("task_object_movement"),
						style: styles.segmentedButton,
					},
				]}
			/>
			{TasksOverview[currentTaskGroup].map((task) => (
				<View
					style={styles.cardWrapper}
					key={task.key}
				>
					<Card
						style={styles.card}
						mode="contained"
						onPress={() => router.push(`/(tabs)/(home)/l_tasks/${task.key}`)}
					>
						<View style={styles.cardContent}>
							<Image
								source={taskImages[task.key as keyof typeof taskImages]}
								style={styles.image}
								resizeMode="cover"
							/>

							<BlurView
								intensity={50}
								style={styles.blurView}
							/>

							<LinearGradient
								colors={[
									`rgba(${task.color}, 1)`,
									`rgba(${task.color}, 1)`,
									"transparent",
								]}
								style={styles.gradient}
								start={{ x: 0, y: 0 }}
								end={{ x: 1.2, y: 0 }}
							/>

							<Text style={styles.text}>{t(task.key)}</Text>
						</View>
					</Card>

					<View style={styles.circleCutout} />

					<TouchableOpacity
						style={{
							...styles.roundButton,
							backgroundColor: `rgba(${task.color}, 1)`,
						}}
						onPress={() => router.push(`/(tabs)/(home)/l_tasks/${task.key}`)}
					>
						<MaterialIcons
							name="keyboard-double-arrow-right"
							size={24}
							color="black"
						/>
					</TouchableOpacity>
				</View>
			))}
			<View style={styles.testContainer}>
				<Text style={styles.testTitle}>{t('dashboard_test_title')}</Text>
				<Text>{t('dashboard_test_subtitle')}</Text>
				<Button
					mode="contained"
					buttonColor="rgba(123,210,53,1)"
					rippleColor={"rgba(0,0,0,0.1)"}
					style={styles.testButton}
					contentStyle={styles.testButtonInner}
					onPress={() => router.push(`/(tabs)/(home)/d_tasks`)}
				>
					<Text>{t('dashboard_test_button')}</Text>
				</Button>
			</View>
			<View style={styles.aboutContainer}>
				<Text style={styles.aboutTitle}>{t('dashboard_about_title')}</Text>
				<Text style={styles.aboutSubtitle}>{t('dashboard_about_subtitle')}</Text>
				<View style={styles.aboutLinkContainer}>
					<TouchableOpacity
						onPress={() => {
							// Open external Link
							Linking.openURL("https://mobak.info/en/bmc-eu-digpro/");
						}}
					>
						<Text style={styles.aboutLink}>{t('dashboard_about_description')}</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View>
				<Text style={styles.erasmusTitle}>{t('dashboard_above_erasmus_title')}</Text>
				<View style={styles.imageContainer}>
					<Image
						style={{ objectFit: "contain", flex: 1 }}
						resizeMethod="resize"
						source={require("@/assets/images/ERASMUS_LOGO.png")}
					/>
				</View>
			</View>
		</SafeScrollView>
	);
}

export default HomeScreen;

const styles = StyleSheet.create({
	title: {
		marginTop: 0,
		fontSize: 18,
	},
	subtitle: {
		fontSize: 24,
		fontWeight: "bold",
	},
	segmentedButtons: {
		marginVertical: 25,
		backgroundColor: "white",
		borderRadius: 5,
	},
	segmentedButton: {
		borderRadius: 5,
		borderWidth: 0,
		paddingVertical: 5,
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
	blurView: {
		position: "absolute",
		width: "60%", // Blurre die linke Hälfte des Bildes
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
	text: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#000",
		position: "absolute",
		left: 10,
		top: 10,
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
	testContainer: {
		padding: 10,
		backgroundColor: "rgba(221,242,177,1)",
		borderRadius: 10,
		paddingVertical: 15,
		marginVertical: 20,
	},
	testTitle: {
		fontSize: 18,
		fontWeight: "bold",
	},
	testButton: {
		borderRadius: 15,
		marginVertical: 10,
	},
	testButtonInner: {
		paddingVertical: 7.5,
	},
	aboutContainer: {
		marginVertical: 20,
		marginBottom: 40,
	},
	aboutTitle: {
		fontSize: 18,
	},
	aboutSubtitle: {
		fontSize: 24,
		fontWeight: "bold",
	},
	aboutLinkContainer: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	aboutLink: {
		fontSize: 16,
		color: "rgba(166, 180, 215, 1)",
		marginTop: 15,
	},
	erasmusTitle: {
		fontSize: 24,
		fontWeight: "condensed",
		marginBottom: 10,
	},
	imageContainer: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		height: 60,
	},
});
