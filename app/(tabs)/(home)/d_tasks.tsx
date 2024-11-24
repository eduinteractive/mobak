import SafeScrollView from "@/components/common/SafeScrollView";
import TasksOverview from "@/constants/TasksOverview";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, SegmentedButtons, Text, Title } from "react-native-paper";

const taskImages = {
	MOBAK_1_2: {
		task_balancing: require("@/assets/images/tasks/BALANCING_1_2.FOTO.jpg"),
		task_rolling: require("@/assets/images/tasks/ROLLING_1_2.FOTO.jpg"),
		task_jumping: require("@/assets/images/tasks/JUMPING_1_2.FOTO.jpg"),
		task_running: require("@/assets/images/tasks/RUNNING_1_2.FOTO.jpg"),
		task_bouncing: require("@/assets/images/tasks/BOUNCING_1_2.FOTO.jpg"),
		task_catching: require("@/assets/images/tasks/CATCHING_1_2.FOTO.jpg"),
		task_throwing: require("@/assets/images/tasks/THROWING_1_2.FOTO.jpg"),
		task_dribbling: require("@/assets/images/tasks/DRIBBLING_1_2.FOTO.jpg"),
	},
	MOBAK_3_4: {
		task_balancing: require("@/assets/images/tasks/BALANCING_3_4.FOTO.jpg"),
		task_rolling: require("@/assets/images/tasks/ROLLING_3_4.FOTO.jpg"),
		task_jumping: require("@/assets/images/tasks/JUMPING_3_4.FOTO.jpg"),
		task_running: require("@/assets/images/tasks/RUNNING_3_4.FOTO.jpg"),
		task_bouncing: require("@/assets/images/tasks/BOUNCING_3_4.FOTO.jpg"),
		task_catching: require("@/assets/images/tasks/CATCHING_3_4.FOTO.jpg"),
		task_throwing: require("@/assets/images/tasks/THROWING_3_4.FOTO.jpg"),
		task_dribbling: require("@/assets/images/tasks/DRIBBLING_3_4.FOTO.jpg"),
	},
};

const DiagnoseTasksScreen = () => {
    const { t } = useTranslation();
	const [currentTaskGroup, setCurrentTaskGroup] = useState<"MOBAK_1_2" | "MOBAK_3_4">("MOBAK_1_2");

	const renderTaskGroup = (taskGroup: "SELF_MOVE" | "OBJECT_MOVE") => {
		return TasksOverview[taskGroup].map((task) => (
			<View
				style={styles.cardWrapper}
				key={task.key}
			>
				<Card
					style={styles.card}
					mode="contained"
					onPress={() => router.push(`/(tabs)/(home)/d_tasks/${task.d_key + currentTaskGroup.split("MOBAK")[1]}`)}
				>
					<View style={styles.cardContent}>
						<Image
							source={
								taskImages[currentTaskGroup][
									task.key as keyof typeof taskImages.MOBAK_1_2
								]
							}
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
					onPress={() => router.push(`/(tabs)/(home)/d_tasks/${task.d_key + currentTaskGroup.split("MOBAK")[1]}`)}
				>
					<MaterialIcons
						name="keyboard-double-arrow-right"
						size={24}
						color="black"
					/>
				</TouchableOpacity>
			</View>
		));
	};

	return (
		<SafeScrollView>
			<SegmentedButtons
				density="regular"
				style={styles.segmentedButtons}
				value={currentTaskGroup}
				onValueChange={(value) => setCurrentTaskGroup(value as "MOBAK_1_2" | "MOBAK_3_4")}
				buttons={[
					{
						value: "MOBAK_1_2",
						label: "MOBAK 1-2",
						style: styles.segmentedButton,
					},
					{
						value: "MOBAK_3_4",
						label: "MOBAK 3-4",
						style: styles.segmentedButton,
					},
				]}
			/>
			<Title style={styles.title}>{t("task_self_movement")}</Title>
			{renderTaskGroup("SELF_MOVE")}
			<Title style={{ ...styles.title, marginTop: 40 }}>{t("task_object_movement")}</Title>
			{renderTaskGroup("OBJECT_MOVE")}
		</SafeScrollView>
	);
};

const styles = StyleSheet.create({
	title: {
		marginTop: 10,
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
});

export default DiagnoseTasksScreen;
