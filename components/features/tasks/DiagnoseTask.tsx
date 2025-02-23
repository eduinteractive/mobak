import Accordion from "@/components/common/Accordion";
import SafeScrollView from "@/components/common/SafeScrollView";
import TasksOverview from "@/constants/TasksOverview";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Icon, Text, Title } from "react-native-paper";
import * as IntentLauncher from "expo-intent-launcher";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { convertImageToBase64, PDF_TASK } from "@/constants/PDF";
import { useVideoPlayer, VideoView } from "expo-video";

const TaskImages = {
	MOBAK_1_2: {
		BALANCING_1_2: require("@/assets/images/tasks/BALANCING_1_2.FOTO.jpg"),
		ROLLING_1_2: require("@/assets/images/tasks/ROLLING_1_2.FOTO.jpg"),
		JUMPING_1_2: require("@/assets/images/tasks/JUMPING_1_2.FOTO.jpg"),
		RUNNING_1_2: require("@/assets/images/tasks/RUNNING_1_2.FOTO.jpg"),
		BOUNCING_1_2: require("@/assets/images/tasks/BOUNCING_1_2.FOTO.jpg"),
		CATCHING_1_2: require("@/assets/images/tasks/CATCHING_1_2.FOTO.jpg"),
		THROWING_1_2: require("@/assets/images/tasks/THROWING_1_2.FOTO.jpg"),
		DRIBBLING_1_2: require("@/assets/images/tasks/DRIBBLING_1_2.FOTO.jpg"),
	},
	MOBAK_3_4: {
		BALANCING_3_4: require("@/assets/images/tasks/BALANCING_3_4.FOTO.jpg"),
		ROLLING_3_4: require("@/assets/images/tasks/ROLLING_3_4.FOTO.jpg"),
		JUMPING_3_4: require("@/assets/images/tasks/JUMPING_3_4.FOTO.jpg"),
		RUNNING_3_4: require("@/assets/images/tasks/RUNNING_3_4.FOTO.jpg"),
		BOUNCING_3_4: require("@/assets/images/tasks/BOUNCING_3_4.FOTO.jpg"),
		CATCHING_3_4: require("@/assets/images/tasks/CATCHING_3_4.FOTO.jpg"),
		THROWING_3_4: require("@/assets/images/tasks/THROWING_3_4.FOTO.jpg"),
		DRIBBLING_3_4: require("@/assets/images/tasks/DRIBBLING_3_4.FOTO.jpg"),
	},
};

const TaskVideos = {
	MOBAK_1_2: {
		BALANCING_1_2: require("@/assets/videos/BALANCING_1_2.VIDEO_1_1.mp4"),
		ROLLING_1_2: require("@/assets/videos/ROLLING_1_2.VIDEO_1_1.mp4"),
		JUMPING_1_2: require("@/assets/videos/JUMPING_1_2.VIDEO_1_1.mp4"),
		RUNNING_1_2: require("@/assets/videos/RUNNING_1_2.VIDEO_1_1.mp4"),
		BOUNCING_1_2: require("@/assets/videos/BOUNCING_1_2.VIDEO_1_1.mp4"),
		CATCHING_1_2: require("@/assets/videos/CATCHING_1_2.VIDEO_1_1.mp4"),
		THROWING_1_2: require("@/assets/videos/THROWING_1_2.VIDEO_1_1.mp4"),
		DRIBBLING_1_2: require("@/assets/videos/DRIBBLING_1_2.VIDEO_1_1.mp4"),
	},
	MOBAK_3_4: {
		BALANCING_3_4: require("@/assets/videos/BALANCING_3_4.VIDEO_1_1.mp4"),
		ROLLING_3_4: require("@/assets/videos/ROLLING_3_4.VIDEO_1_1.mp4"),
		JUMPING_3_4: require("@/assets/videos/JUMPING_3_4.VIDEO_1_1.mp4"),
		RUNNING_3_4: require("@/assets/videos/RUNNING_3_4.VIDEO_1_1.mp4"),
		BOUNCING_3_4: require("@/assets/videos/BOUNCING_3_4.VIDEO_1_1.mp4"),
		CATCHING_3_4: require("@/assets/videos/CATCHING_3_4.VIDEO_1_1.mp4"),
		THROWING_3_4: require("@/assets/videos/THROWING_3_4.VIDEO_1_1.mp4"),
		DRIBBLING_3_4: require("@/assets/videos/DRIBBLING_3_4.VIDEO_1_1.mp4"),
	},
};

const DiagnoseTaskFields = [
	["MATERIAL", "rate_detail_material"],
	["TEST_SET-UP", "rate_detail_set_up"],
	["TEST_ITEM", "rate_detail_item"],
	["CRITERIA", "rate_detail_criteria"],
	["VALUATION", "rate_detail_valuation"],
    ["INSTRUCTION_DEMONSTRATION", "rate_detail_instruction_demonstration"],
	["INFORMATION_FOR_THE_TEST_LEADER", "rate_detail_info_test_leader"],
];

interface DiagnoseTaskProps {
	task: string;
}

const DiagnoseTask = (props: DiagnoseTaskProps) => {
	const { t } = useTranslation();
	const [taskColor, setTaskColor] = useState<string | undefined>();
	const [currentMode, setCurrentMode] = useState<"image" | "video">("image");

	const player = useVideoPlayer(
		TaskVideos[props.task.includes("3_4") ? "MOBAK_3_4" : "MOBAK_1_2"][
			props.task as keyof (typeof TaskVideos)["MOBAK_1_2" | "MOBAK_3_4"]
		],
		(player) => {
			player.loop = true;
		}
	);

	useEffect(() => {
		const color =
			TasksOverview.SELF_MOVE.find((t) => props.task.includes(t.d_key))?.color ||
			TasksOverview.OBJECT_MOVE.find((t) => props.task.includes(t.d_key))?.color;
		setTaskColor(color);
	}, [props.task]);

	const exportPDF = async () => {
		/*const imageBase64 = await convertImageToBase64(
			TaskImages[props.task.includes("3_4") ? "MOBAK_3_4" : "MOBAK_1_2"][
				props.task as keyof (typeof TaskImages)["MOBAK_1_2" | "MOBAK_3_4"]
			]
		);*/

		const formattedHtml = PDF_TASK.replace(
			"%%BODY%%",
			`
            <h1>${t(props.task + ".TASK")}</h1>
            ${DiagnoseTaskFields.map(
			(field, index) => `
                <div class="section ${index > 0 ? "section--page-break" : ""}">
                    <h4>${t(field[1])}</h4>
                    <div class="accordion-content">${t(props.task + "." + field[0])}</div>
                </div>
                `
		).join("")}`
		);
        /*
        <div class="image-container">
            <img src="${imageBase64}" alt="Learning Task Image">
        </div>
        */

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
					{currentMode === "image" ? (
						<Image
							source={
								TaskImages[
									props.task.includes("3_4")
										? "MOBAK_3_4"
										: "MOBAK_1_2"
								][
									props.task as keyof (typeof TaskImages)[
										| "MOBAK_1_2"
										| "MOBAK_3_4"]
								]
							}
							style={styles.image}
							resizeMode="stretch"
						/>
					) : (
						<VideoView
							player={player}
                            style={styles.image}
							allowsFullscreen
							allowsPictureInPicture
						/>
					)}
					<View style={styles.downloadIcon}>
						<TouchableOpacity onPress={exportPDF}>
							<Icon
								source="download"
								size={30}
								color="black"
							/>
						</TouchableOpacity>
					</View>
					<View style={styles.videoIcon}>
						<TouchableOpacity
							onPress={() =>
								setCurrentMode(
									currentMode === "image" ? "video" : "image"
								)
							}
						>
							<Icon
								source={currentMode === "image" ? "video" : "image"}
								size={30}
								color="black"
							/>
						</TouchableOpacity>
					</View>
				</View>
			</Card>
			<View style={styles.fieldHeader}>
				<Title style={styles.fieldTitle}>{t("rate_detail_qualification_title")}</Title>
				<Text>{t(props.task + ".TASK")}</Text>
			</View>
			{DiagnoseTaskFields.map((field) => (
				<View
					key={field[0]}
					style={styles.fieldContainer}
				>
					<Accordion
						title={t(field[1])}
						buttonColor={taskColor}
					>
						<Text>{t(props.task + "." + field[0])}</Text>
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
	fieldHeader: {
		marginVertical: 30,
	},
	fieldTitle: {
		fontSize: 20,
		fontWeight: "bold",
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
	videoIcon: {
		backgroundColor: "rgba(255, 255, 255, 0.75)",
		position: "absolute",
		left: 0,
		top: 0,
		padding: 5,
	},
});

export default DiagnoseTask;
