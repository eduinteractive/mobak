import SafeScrollView from "@/components/common/SafeScrollView";
import LearningTasks from "@/constants/LearningTasks";
import { MaterialIcons } from "@expo/vector-icons";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import * as IntentLauncher from "expo-intent-launcher";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { convertImageToBase64, PDF_PASS } from "@/constants/PDF";
import { ImageManipulator } from "expo-image-manipulator";

const LearningTaskImages = {
	"BALANCING.ROPE_BALANCING": require("@/assets/images/l_tasks/BALANCING.ROPE_BALANCING.FOTO.jpg"),
	"BALANCING.BENCH_BALANCING": require("@/assets/images/l_tasks/BALANCING.BENCH_BALANCING.FOTO.jpg"),
	"BALANCING.WOBBLY_BENCH": require("@/assets/images/l_tasks/BALANCING.WOBBLY_BENCH.FOTO.jpg"),
	"BALANCING.MOUNTAIN_CLIMBING": require("@/assets/images/l_tasks/BALANCING.MOUNTAIN_CLIMBING.FOTO.jpg"),
	"BALANCING.OPPOSING_TRAFFIC": require("@/assets/images/l_tasks/BALANCING.OPPOSING_TRAFFIC.FOTO.jpg"),
	"BALANCING.SEESAW": require("@/assets/images/l_tasks/BALANCING.SEESAW.FOTO.jpg"),
	"BALANCING.ROPE_DANCER": require("@/assets/images/l_tasks/BALANCING.ROPE_DANCER.FOTO.jpg"),
	"BALANCING.BALANCING_ON_BALLS": require("@/assets/images/l_tasks/BALANCING.BALANCING_ON_BALLS.FOTO.jpg"),
	"BALANCING.CIRCUS_ARTISTS": require("@/assets/images/l_tasks/BALANCING.CIRCUS_ARTISTS.FOTO.jpg"),
	"BALANCING.BALANCING_ON_MATS": require("@/assets/images/l_tasks/BALANCING.BALANCING_ON_MATS.FOTO.jpg"),
	"BALANCING.DONT_WOBBLE": require("@/assets/images/l_tasks/BALANCING.DONT_WOBBLE.FOTO.jpg"),
	"BALANCING.UNSTABLE_DEVICES": require("@/assets/images/l_tasks/BALANCING.UNSTABLE_DEVICES.FOTO.jpg"),
	"ROLLING.INCLINED_PLANE": require("@/assets/images/l_tasks/ROLLING.INCLINED_PLANE.FOTO.jpg"),
	"ROLLING.FORWARD_ROLL": require("@/assets/images/l_tasks/ROLLING.FORWARD_ROLL.FOTO.jpg"),
	"ROLLING.PENDULUM": require("@/assets/images/l_tasks/ROLLING.PENDULUM.FOTO.jpg"),
	"ROLLING.JUDO_ROLLS": require("@/assets/images/l_tasks/ROLLING.JUDO_ROLLS.FOTO.jpg"),
	"ROLLING.MAT_ROLLS": require("@/assets/images/l_tasks/ROLLING.MAT_ROLLS.FOTO.jpg"),
	"ROLLING.ROLL_OFF_THE_BOX": require("@/assets/images/l_tasks/ROLLING.ROLL_OFF_THE_BOX.FOTO.jpg"),
	"ROLLING.VARIABLE_ROLLING": require("@/assets/images/l_tasks/ROLLING.VARIABLE_ROLLING.FOTO.jpg"),
	"ROLLING.ROLLING_PRECISELY": require("@/assets/images/l_tasks/ROLLING.ROLLING_PRECISELY.FOTO.jpg"),
	"ROLLING.ROLL_UP": require("@/assets/images/l_tasks/ROLLING.ROLL_UP.FOTO.jpg"),
	"ROLLING.DIVE_ROLL": require("@/assets/images/l_tasks/ROLLING.DIVE_ROLL.FOTO.jpg"),
	"ROLLING.PARTNER_ROLLS": require("@/assets/images/l_tasks/ROLLING.PARTNER_ROLLS.FOTO.jpg"),
	"JUMPING.JUMPING_1": require("@/assets/images/l_tasks/JUMPING.JUMPING_1.FOTO.jpg"),
	"JUMPING.JUMPING_2": require("@/assets/images/l_tasks/JUMPING.JUMPING_2.FOTO.jpg"),
	"JUMPING.ROPE_JUMPING_1": require("@/assets/images/l_tasks/JUMPING.ROPE_JUMPING_1.FOTO.jpg"),
	"JUMPING.ROPE_JUMPING_2": require("@/assets/images/l_tasks/JUMPING.ROPE_JUMPING_2.FOTO.jpg"),
	"JUMPING.ROPE_JUMPING_3": require("@/assets/images/l_tasks/JUMPING.ROPE_JUMPING_3.FOTO.jpg"),
	"JUMPING.ROPE_JUMPING_4": require("@/assets/images/l_tasks/JUMPING.ROPE_JUMPING_4.FOTO.jpg"),
	"JUMPING.MAT_HIGHWAY": require("@/assets/images/l_tasks/JUMPING.MAT_HIGHWAY.FOTO.jpg"),
	"JUMPING.GROUND_ROPE_JUMPING_1": require("@/assets/images/l_tasks/JUMPING.GROUND_ROPE_JUMPING_1.FOTO.jpg"),
	"JUMPING.GROUND_ROPE_JUMPING_2": require("@/assets/images/l_tasks/JUMPING.GROUND_ROPE_JUMPING_2.FOTO.jpg"),
	"JUMPING.ROPE_ROLLER": require("@/assets/images/l_tasks/JUMPING.ROPE_ROLLER.FOTO.jpg"),
	"JUMPING.MASTER_OF_RHYTHM": require("@/assets/images/l_tasks/JUMPING.MASTER_OF_RHYTHM.FOTO.jpg"),
	"JUMPING.SWINGING_KING_QUEEN": require("@/assets/images/l_tasks/JUMPING.SWINGING_KING_QUEEN.FOTO.jpg"),
	"JUMPING.JUMP_IN_AND_OUT": require("@/assets/images/l_tasks/JUMPING.JUMP_IN_AND_OUT.FOTO.jpg"),
	"JUMPING.JUMPING_COURSE": require("@/assets/images/l_tasks/JUMPING.JUMPING_COURSE.FOTO.jpg"),
	"RUNNING.RUNNING_1": require("@/assets/images/l_tasks/RUNNING.RUNNING_1.FOTO.jpg"),
	"RUNNING.RUNNING_2": require("@/assets/images/l_tasks/RUNNING.RUNNING_2.FOTO.jpg"),
	"RUNNING.RUNNING_3": require("@/assets/images/l_tasks/RUNNING.RUNNING_3.FOTO.jpg"),
	"RUNNING.RUNNING_4": require("@/assets/images/l_tasks/RUNNING.RUNNING_4.FOTO.jpg"),
	"RUNNING.GIANT_SLALOM": require("@/assets/images/l_tasks/RUNNING.GIANT_SLALOM.FOTO.jpg"),
	"RUNNING.SIDE_STEP": require("@/assets/images/l_tasks/RUNNING.SIDE_STEP.FOTO.jpg"),
	"RUNNING.RUNNING_COURSE": require("@/assets/images/l_tasks/RUNNING.RUNNING_COURSE.FOTO.jpg"),
	"RUNNING.HEY_SHARK": require("@/assets/images/l_tasks/RUNNING.HEY_SHARK.FOTO.jpg"),
	"RUNNING.STAR_RUN": require("@/assets/images/l_tasks/RUNNING.STAR_RUN.FOTO.jpg"),
	"RUNNING.VARIABLE_RUNNING": require("@/assets/images/l_tasks/RUNNING.VARIABLE_RUNNING.FOTO.jpg"),
	"BOUNCING.PUDDLES_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.PUDDLES_BOUNCING.FOTO.jpg"),
	"BOUNCING.BOUNCING_STATIONS": require("@/assets/images/l_tasks/BOUNCING.BOUNCING_STATIONS.FOTO.jpg"),
	"BOUNCING.BOUNCING_OVER_CONES": require("@/assets/images/l_tasks/BOUNCING.BOUNCING_OVER_CONES.FOTO.jpg"),
	"BOUNCING.SEAT_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.SEAT_BOUNCING.FOTO.jpg"),
	"BOUNCING.NUMBERBALL_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.NUMBERBALL_BOUNCING.FOTO.jpg"),
	"BOUNCING.SURROUNDING_HOOPS_WHILE_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.SURROUNDING_HOOPS_WHILE_BOUNCING.FOTO.jpg"),
	"BOUNCING.SHADOW_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.SHADOW_BOUNCING.FOTO.jpg"),
	"BOUNCING.BENCH_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.BENCH_BOUNCING.FOTO.jpg"),
	"BOUNCING.CIRCLE_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.CIRCLE_BOUNCING.FOTO.jpg"),
	"BOUNCING.BOUNCING_IN_DIFFERENT_POSITIONS": require("@/assets/images/l_tasks/BOUNCING.BOUNCING_IN_DIFFERENT_POSITIONS.FOTO.jpg"),
	"CATCHING.CATCHING_STATIONS": require("@/assets/images/l_tasks/CATCHING.CATCHING_STATIONS.FOTO.jpg"),
	"CATCHING.KEEP_THE_WATER_CLEAN": require("@/assets/images/l_tasks/CATCHING.KEEP_THE_WATER_CLEAN.FOTO.jpg"),
	"CATCHING.TARGET_HOOPS": require("@/assets/images/l_tasks/CATCHING.TARGET_HOOPS.FOTO.jpg"),
	"CATCHING.TIGERBALL": require("@/assets/images/l_tasks/CATCHING.TIGERBALL.FOTO.jpg"),
	"CATCHING.BOXING": require("@/assets/images/l_tasks/CATCHING.BOXING.FOTO.jpg"),
	"CATCHING.LOOKING_AT_THE_BALL": require("@/assets/images/l_tasks/CATCHING.LOOKING_AT_THE_BALL.FOTO.jpg"),
	"CATCHING.REACTING": require("@/assets/images/l_tasks/CATCHING.REACTING.FOTO.jpg"),
	"CATCHING.WALL_BALL": require("@/assets/images/l_tasks/CATCHING.WALL_BALL.FOTO.jpg"),
	"CATCHING.TRAJECTORY": require("@/assets/images/l_tasks/CATCHING.TRAJECTORY.FOTO.jpg"),
	"CATCHING.FLYING_BALL": require("@/assets/images/l_tasks/CATCHING.FLYING_BALL.FOTO.jpg"),
	"CATCHING.FISHERMAN": require("@/assets/images/l_tasks/CATCHING.FISHERMAN.FOTO.jpg"),
	"THROWING.THROWING_MASTER": require("@/assets/images/l_tasks/THROWING.THROWING_MASTER.FOTO.jpg"),
	"THROWING.THROWING_STATIONS": require("@/assets/images/l_tasks/THROWING.THROWING_STATIONS.FOTO.jpg"),
	"THROWING.KEEP_YOUR_GARDEN_CLEAN": require("@/assets/images/l_tasks/THROWING.KEEP_YOUR_GARDEN_CLEAN.FOTO.jpg"),
	"THROWING.SCORE_MASTER": require("@/assets/images/l_tasks/THROWING.SCORE_MASTER.FOTO.jpg"),
	"THROWING.FALLING_OVER": require("@/assets/images/l_tasks/THROWING.FALLING_OVER.FOTO.jpg"),
	"THROWING.HIT_THE_TARGET": require("@/assets/images/l_tasks/THROWING.HIT_THE_TARGET.FOTO.jpg"),
	"THROWING.THROWING_OFF": require("@/assets/images/l_tasks/THROWING.THROWING_OFF.FOTO.jpg"),
	"THROWING.DICE": require("@/assets/images/l_tasks/THROWING.DICE.FOTO.jpg"),
	"THROWING.ENCHANT_AND_REDEEM": require("@/assets/images/l_tasks/THROWING.ENCHANT_AND_REDEEM.FOTO.jpg"),
	"THROWING.THROWING_HOOPS": require("@/assets/images/l_tasks/THROWING.THROWING_HOOPS.FOTO.jpg"),
	"THROWING.TARGET_HOOPS": require("@/assets/images/l_tasks/THROWING.TARGET_HOOPS.FOTO.jpg"),
	"THROWING.TIGER_BALL": require("@/assets/images/l_tasks/THROWING.TIGER_BALL.FOTO.jpg"),
	"THROWING.BOXING": require("@/assets/images/l_tasks/THROWING.BOXING.FOTO.jpg"),
	"THROWING.LOOKING_AT_THE_BALL": require("@/assets/images/l_tasks/THROWING.LOOKING_AT_THE_BALL.FOTO.jpg"),
	"THROWING.WILD_PIG": require("@/assets/images/l_tasks/THROWING.WILD_PIG.FOTO.jpg"),
	"THROWING.DISTANCE_THROWING": require("@/assets/images/l_tasks/THROWING.DISTANCE_THROWING.FOTO.jpg"),
	"DRIBBLING.STOPP_BALL": require("@/assets/images/l_tasks/DRIBBLING.STOPP_BALL.FOTO.jpg"),
	"DRIBBLING.LINE_DRIBBLING": require("@/assets/images/l_tasks/DRIBBLING.LINE_DRIBBLING.FOTO.jpg"), // NOTE: This image is missing
	"DRIBBLING.WALL_OFF": require("@/assets/images/l_tasks/DRIBBLING.WALL_OFF.FOTO.jpg"),
	"DRIBBLING.LIFT_BALL": require("@/assets/images/l_tasks/DRIBBLING.LIFT_BALL.FOTO.jpg"),
	"DRIBBLING.DRIBBLING_1": require("@/assets/images/l_tasks/DRIBBLING.DRIBBLING_1.FOTO.jpg"),
	"DRIBBLING.DRIBBLING_2": require("@/assets/images/l_tasks/DRIBBLING.DRIBBLING_2.FOTO.jpg"),
	"DRIBBLING.IN_THE_LAND_OF_SHELLS_1": require("@/assets/images/l_tasks/DRIBBLING.IN_THE_LAND_OF_SHELLS_1.FOTO.jpg"),
	"DRIBBLING.IN_THE_LAND_OF_SHELLS_2": require("@/assets/images/l_tasks/DRIBBLING.IN_THE_LAND_OF_SHELLS_2.FOTO.jpg"),
	"DRIBBLING.PROTECT_YOUNG_FISH": require("@/assets/images/l_tasks/DRIBBLING.PROTECT_YOUNG_FISH.FOTO.jpg"),
	"DRIBBLING.WITHIN_SHARK_TERRITORY": require("@/assets/images/l_tasks/DRIBBLING.WITHIN_SHARK_TERRITORY.FOTO.jpg"),
	"DRIBBLING.DRIBBLING_VARIATIONS": require("@/assets/images/l_tasks/DRIBBLING.DRIBBLING_VARIATIONS.FOTO.jpg"),
	"DRIBBLING.DRIBBLING_NUMBER_BALL": require("@/assets/images/l_tasks/DRIBBLING.DRIBBLING_NUMBER_BALL.FOTO.jpg"),
	"DRIBBLING.PROTECTING_PERSON_DRIBBLING": require("@/assets/images/l_tasks/DRIBBLING.PROTECTING_PERSON_DRIBBLING.FOTO.jpg"),
};

const LearningTaskGroupScreen = () => {
	const { t } = useTranslation();
	const { taskGroup } = useLocalSearchParams();
	const [taskList, setTaskList] = useState<string[]>([]);
	const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
	const [currentMode, setCurrentMode] = useState<"select" | "view">("view");

	useEffect(() => {
		setTaskList(LearningTasks.items.find((item) => item.key === taskGroup)?.tasks || []);
	}, [taskGroup]);

	useEffect(() => {
		if (currentMode === "view") {
			setSelectedTasks([]);
		}
	}, [currentMode]);

	const exportPDF = async () => {
		let PASS_ROWS = "";
		for (const task of selectedTasks) {
			/*let image = "";
			try {
				image = await convertImageToBase64(
					LearningTaskImages[task as keyof typeof LearningTaskImages]
				);
			} catch (err) {
				console.error(err);
			}*/
			PASS_ROWS += `
                <tr>
                    <td style="max-width: 100px;">
                    <h4 style="margin-bottom: 5px;">${t(task + ".TITLE")}</h4>
                    <p style="margin: 0;">${t(task + ".BASIC_TASK")}</p>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
            `;
		}
		/*
        <td style="width: 100px;">
            <img src="${image}" style="height: 100px; object-fit: cover;" height="100" />
        </td>
        */

		const formattedHtml = PDF_PASS.replace("%%PASS_TITLE%%", "Pass from: ")
			.replace("%%REACHING_GOAL%%", "How I do it")
			.replace("%%MY_IDEA%%", "My Idea")
			.replace("%%PASS_ROWS%%", PASS_ROWS);

		try {
			const { uri } = await Print.printToFileAsync({
				html: formattedHtml,
				width: 1122, // Breite in Punkte (entspricht A4 Querformat)
				height: 793, // Höhe in Punkte (entspricht A4 Querformat)
			});
			try {
				FileSystem.getContentUriAsync(uri).then((cUri) => {
					if (Platform.OS === "ios") {
						shareAsync(uri, {
							mimeType: "application/pdf",
							dialogTitle: "Teilen",
							UTI: "com.adobe.pdf",
						});
					} else {
						IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
							data: cUri,
							flags: 1,
							type: "application/pdf",
						});
					}
				});
			} catch (err) {
				console.error(err);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<SafeScrollView>
			<View style={styles.selectContainer}>
				{currentMode === "select" && (
					<Button
						mode="text"
						icon="download"
						style={{ borderRadius: 0 }}
						onPressIn={exportPDF}
					>
						download selected
					</Button>
				)}
				<Button
					mode="text"
					style={{ borderRadius: 0 }}
					onPress={() => setCurrentMode(currentMode === "select" ? "view" : "select")}
				>
					{currentMode === "select" ? "cancel selection" : "select tasks"}
				</Button>
			</View>
			{taskList.map((task) => (
				<View
					style={styles.cardWrapper}
					key={task}
				>
					<Card
						style={{
							...styles.card,
							backgroundColor: selectedTasks.includes(task)
								? "rgba(123,210,53,0.5)"
								: "rgb(255, 255, 255)",
							borderColor:
								currentMode === "select"
									? "rgba(123,210,53,1)"
									: "rgb(255, 255, 255)",
							borderWidth: currentMode === "select" ? 1 : 0,
						}}
						mode="contained"
						onPress={() =>
							currentMode === "view"
								? router.push(
										`/(tabs)/(home)/l_tasks/${taskGroup}/${task}` as Href
								  )
								: setSelectedTasks(
										selectedTasks.includes(task)
											? selectedTasks.filter(
													(item) =>
														item !==
														task
											  )
											: selectedTasks.concat(task)
								  )
						}
					>
						<View style={styles.cardContent}>
							<Text style={styles.text}>{t(task + ".TITLE")}</Text>
							<Text style={styles.subtext}>
								{t(task + ".VARIATIONS").split(".").length}{" "}
								{t("learning_task_variations")}
							</Text>
						</View>
					</Card>

					<View style={styles.circleCutout} />

					<TouchableOpacity
						style={{
							...styles.roundButton,
							backgroundColor: `rgba(255,255,255, 1)`,
						}}
						onPressIn={() =>
							router.push(
								`/(tabs)/(home)/l_tasks/${taskGroup}/${task}` as Href
							)
						}
					>
						<MaterialIcons
							name="keyboard-double-arrow-right"
							size={24}
							color="black"
						/>
					</TouchableOpacity>
				</View>
			))}
		</SafeScrollView>
	);
};

const styles = StyleSheet.create({
	selectContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignContent: "center",
	},
	card: {
		height: 70,
		overflow: "hidden",
		position: "relative",
		backgroundColor: "rgb(255, 255, 255)",
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

export default LearningTaskGroupScreen;
