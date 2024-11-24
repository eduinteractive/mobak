import Accordion from "@/components/common/Accordion";
import SafeScrollView from "@/components/common/SafeScrollView";
import { convertImageToBase64, PDF_TASK } from "@/constants/PDF";
import TasksOverview from "@/constants/TasksOverview";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Icon, Text } from "react-native-paper";
import * as IntentLauncher from "expo-intent-launcher";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

const LearningTaskImages = {
	"BALANCING.ROPE_BALANCING": require("@/assets/images/l_tasks/BALANCING.ROPE_BALANCING.FOTO.jpg"),
	"BALANCING.BENCH_BALANCING": require("@/assets/images/l_tasks/BALANCING.BENCH_BALANCING.FOTO.jpg"),
	"BALANCING.WOBBLY_BENCH": require("@/assets/images/l_tasks/BALANCING.WOBBLY_BENCH.FOTO.jpeg"),
	"BALANCING.MOUNTAIN_CLIMBING": require("@/assets/images/l_tasks/BALANCING.MOUNTAIN_CLIMBING.FOTO.jpg"),
	"BALANCING.OPPOSING_TRAFFIC": require("@/assets/images/l_tasks/BALANCING.OPPOSING_TRAFFIC.FOTO.jpg"),
	"BALANCING.SEESAW": require("@/assets/images/l_tasks/BALANCING.SEESAW.FOTO.jpg"),
	"BALANCING.ROPE_DANCER": require("@/assets/images/l_tasks/BALANCING.ROPE_DANCER.FOTO.jpg"),
	"BALANCING.BALANCING_ON_BALLS": require("@/assets/images/l_tasks/BALANCING.BALANCING_ON_BALLS.FOTO.jpg"),
	"BALANCING.CIRCUS_ARTISTS": require("@/assets/images/l_tasks/BALANCING.CIRCUS_ARTISTS.FOTO.jpg"),
	"BALANCING.BALANCING_ON_MATS": require("@/assets/images/l_tasks/BALANCING.BALANCING_ON_MATS.FOTO.jpeg"),
	"BALANCING.DONT_WOBBLE": require("@/assets/images/l_tasks/BALANCING.DONT_WOBBLE.FOTO.jpeg"),
	"BALANCING.UNSTABLE_DEVICES": require("@/assets/images/l_tasks/BALANCING.UNSTABLE_DEVICES.FOTO.jpeg"),
	"ROLLING.INCLINED_PLANE": require("@/assets/images/l_tasks/ROLLING.INCLINED_PLANE.FOTO.jpg"),
	"ROLLING.FORWARD_ROLL": require("@/assets/images/l_tasks/ROLLING.FORWARD_ROLL.FOTO.jpg"),
	"ROLLING.PENDULUM": require("@/assets/images/l_tasks/ROLLING.PENDULUM.FOTO.jpg"),
	"ROLLING.JUDO_ROLLS": require("@/assets/images/l_tasks/ROLLING.JUDO_ROLLS.FOTO.jpg"),
	"ROLLING.MAT_ROLLS": require("@/assets/images/l_tasks/ROLLING.MAT_ROLLS.FOTO.jpg"),
	"ROLLING.ROLL_OFF_THE_BOX": require("@/assets/images/l_tasks/ROLLING.ROLL_OFF_THE_BOX.FOTO.jpeg"),
	"ROLLING.VARIABLE_ROLLING": require("@/assets/images/l_tasks/ROLLING.VARIABLE_ROLLING.FOTO.jpeg"),
	"ROLLING.ROLLING_PRECISELY": require("@/assets/images/l_tasks/ROLLING.ROLLING_PRECISELY.FOTO.jpeg"),
	"ROLLING.ROLL_UP": require("@/assets/images/l_tasks/ROLLING.ROLL_UP.FOTO.jpeg"),
	"ROLLING.DIVE_ROLL": require("@/assets/images/l_tasks/ROLLING.DIVE_ROLL.FOTO.jpeg"),
	"ROLLING.PARTNER_ROLLS": require("@/assets/images/l_tasks/ROLLING.PARTNER_ROLLS.FOTO.jpeg"),
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
	"JUMPING.JUMP_IN_AND_OUT": require("@/assets/images/l_tasks/JUMPING.JUMP_IN_AND_OUT.FOTO.jpeg"),
	"JUMPING.JUMPING_COURSE": require("@/assets/images/l_tasks/JUMPING.JUMPING_COURSE.FOTO.jpeg"),
	"RUNNING.RUNNING_1": require("@/assets/images/l_tasks/RUNNING.RUNNING_1.FOTO.jpg"),
	"RUNNING.RUNNING_2": require("@/assets/images/l_tasks/RUNNING.RUNNING_2.FOTO.jpg"),
	"RUNNING.RUNNING_3": require("@/assets/images/l_tasks/RUNNING.RUNNING_3.FOTO.jpg"),
	"RUNNING.RUNNING_4": require("@/assets/images/l_tasks/RUNNING.RUNNING_4.FOTO.jpg"),
	"RUNNING.GIANT_SLALOM": require("@/assets/images/l_tasks/RUNNING.GIANT_SLALOM.FOTO.jpg"),
	"RUNNING.SIDE_STEP": require("@/assets/images/l_tasks/RUNNING.SIDE_STEP.FOTO.jpg"),
	"RUNNING.RUNNING_COURSE": require("@/assets/images/l_tasks/RUNNING.RUNNING_COURSE.FOTO.jpeg"),
	"RUNNING.HEY_SHARK": require("@/assets/images/l_tasks/RUNNING.HEY_SHARK.FOTO.jpeg"),
	"RUNNING.STAR_RUN": require("@/assets/images/l_tasks/RUNNING.STAR_RUN.FOTO.jpeg"),
	"RUNNING.VARIABLE_RUNNING": require("@/assets/images/l_tasks/RUNNING.VARIABLE_RUNNING.FOTO.jpeg"),
	"BOUNCING.PUDDLES_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.PUDDLES_BOUNCING.FOTO.jpg"),
	"BOUNCING.BOUNCING_STATIONS": require("@/assets/images/l_tasks/BOUNCING.BOUNCING_STATIONS.FOTO.jpg"),
	"BOUNCING.BOUNCING_OVER_CONES": require("@/assets/images/l_tasks/BOUNCING.BOUNCING_OVER_CONES.FOTO.jpg"),
	"BOUNCING.SEAT_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.SEAT_BOUNCING.FOTO.jpg"),
	"BOUNCING.NUMBERBALL_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.NUMBERBALL_BOUNCING.FOTO.jpeg"),
	"BOUNCING.SURROUNDING_HOOPS_WHILE_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.SURROUNDING_HOOPS_WHILE_BOUNCING.FOTO.jpg"),
	"BOUNCING.SHADOW_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.SHADOW_BOUNCING.FOTO.jpeg"),
	"BOUNCING.BENCH_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.BENCH_BOUNCING.FOTO.jpeg"),
	"BOUNCING.CIRCLE_BOUNCING": require("@/assets/images/l_tasks/BOUNCING.CIRCLE_BOUNCING.FOTO.jpg"),
	"BOUNCING.BOUNCING_IN_DIFFERENT_POSITIONS": require("@/assets/images/l_tasks/BOUNCING.BOUNCING_IN_DIFFERENT_POSITIONS.FOTO.jpeg"),
	"CATCHING.CATCHING_STATIONS": require("@/assets/images/l_tasks/CATCHING.CATCHING_STATIONS.FOTO.jpg"),
	"CATCHING.KEEP_THE_WATER_CLEAN": require("@/assets/images/l_tasks/CATCHING.KEEP_THE_WATER_CLEAN.FOTO.jpg"),
	"CATCHING.TARGET_HOOPS": require("@/assets/images/l_tasks/CATCHING.TARGET_HOOPS.FOTO.jpg"),
	"CATCHING.TIGERBALL": require("@/assets/images/l_tasks/CATCHING.TIGERBALL.FOTO.jpg"),
	"CATCHING.BOXING": require("@/assets/images/l_tasks/CATCHING.BOXING.FOTO.jpg"),
	"CATCHING.LOOKING_AT_THE_BALL": require("@/assets/images/l_tasks/CATCHING.LOOKING_AT_THE_BALL.FOTO.jpg"),
	"CATCHING.REACTING": require("@/assets/images/l_tasks/CATCHING.REACTING.FOTO.jpeg"),
	"CATCHING.WALL_BALL": require("@/assets/images/l_tasks/CATCHING.WALL_BALL.FOTO.jpeg"),
	"CATCHING.TRAJECTORY": require("@/assets/images/l_tasks/CATCHING.TRAJECTORY.FOTO.jpeg"),
	"CATCHING.FLYING_BALL": require("@/assets/images/l_tasks/CATCHING.FLYING_BALL.FOTO.jpeg"),
	"CATCHING.FISHERMAN": require("@/assets/images/l_tasks/CATCHING.FISHERMAN.FOTO.jpeg"),
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
	"THROWING.WILD_PIG": require("@/assets/images/l_tasks/THROWING.WILD_PIG.FOTO.jpeg"),
	"THROWING.DISTANCE_THROWING": require("@/assets/images/l_tasks/THROWING.DISTANCE_THROWING.FOTO.jpeg"),
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
	"DRIBBLING.DRIBBLING_VARIATIONS": require("@/assets/images/l_tasks/DRIBBLING.DRIBBLING_VARIATIONS.FOTO.jpeg"),
	"DRIBBLING.DRIBBLING_NUMBER_BALL": require("@/assets/images/l_tasks/DRIBBLING.DRIBBLING_NUMBER_BALL.FOTO.jpeg"),
	"DRIBBLING.PROTECTING_PERSON_DRIBBLING": require("@/assets/images/l_tasks/DRIBBLING.PROTECTING_PERSON_DRIBBLING.FOTO.jpeg"),
};

const LearningTaskFields = [
	["BASIC_TASK", "learning_task_basic_task"],
	["MATERIALS", "learning_task_materials"],
	["KNOWLEDGE_AND_UNDERSTANDING", "learning_task_knowledge"],
	["WILLINGNESS", "learning_task_willingness"],
	["VARIATIONS", "learning_task_variations_skills"],
];

const LearningTaskScreen = () => {
	const { t } = useTranslation();
	const { taskGroup, task } = useLocalSearchParams();
	const [taskColor, setTaskColor] = useState<string | undefined>();

	useEffect(() => {
		const color =
			TasksOverview.SELF_MOVE.find((task) => task.key === taskGroup)?.color ||
			TasksOverview.OBJECT_MOVE.find((task) => task.key === taskGroup)?.color;
		setTaskColor(color);
	}, [taskGroup, task]);

	const exportPDF = async () => {
		const imageBase64 = await convertImageToBase64(
			LearningTaskImages[task as keyof typeof LearningTaskImages]
		);

		const formattedHtml = PDF_TASK.replace(
			"%%BODY%%",
			`
            <h1>${t(task + ".TITLE")}</h1>
            <div class="image-container">
                <img src="${imageBase64}" alt="Learning Task Image">
            </div>
            ${LearningTaskFields.map(
			(field, index) => `
                <div class="section ${index > 0 ? "section--page-break" : ""}">
                    <h4>${t(field[1])}</h4>
                    <div class="accordion-content">${t(task + "." + field[0])}</div>
                </div>
                `
		).join("")}`
		);

		const { uri } = await Print.printToFileAsync({
			html: formattedHtml,
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
	};

	return (
		<SafeScrollView>
			<Card style={styles.cardWrapper}>
				<View style={styles.imageContainer}>
					<Image
						source={LearningTaskImages[task as keyof typeof LearningTaskImages]}
						style={styles.image}
						resizeMode="stretch"
					/>
					<View style={styles.downloadIcon}>
						<TouchableOpacity onPress={exportPDF}>
							<Icon
								source="download"
								size={30}
								color="black"
							/>
						</TouchableOpacity>
					</View>
				</View>
			</Card>
			{LearningTaskFields.map((field) => (
				<View
					key={field[0]}
					style={styles.fieldContainer}
				>
					<Accordion
						title={t(field[1])}
						buttonColor={taskColor}
					>
						<Text>{t(task + "." + field[0])}</Text>
					</Accordion>
				</View>
			))}
		</SafeScrollView>
	);
};

const styles = StyleSheet.create({
	fieldContainer: {
		marginVertical: 10,
	},
	cardWrapper: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 10, // Entferne das Padding für volle Bildbreite
		overflow: "hidden",
		width: "100%",
	},
	imageContainer: {
		flex: 1,
	},
	image: {
		width: "100%",
		height: undefined, // Das Bild wird seine natürliche Höhe beibehalten
		aspectRatio: 1.5, // Passen Sie das Seitenverhältnis nach Bedarf an
	},
	downloadIcon: {
		backgroundColor: "rgba(255, 255, 255, 0.75)",
		position: "absolute",
		right: 0,
		top: 0,
		padding: 5,
	},
});

export default LearningTaskScreen;
