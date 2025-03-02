import SafeScrollView from "@/components/common/SafeScrollView";
import TestCard from "@/components/common/TestCard";
import { getTaskObjectByTaskGroup } from "@/constants/TasksOverview";
import { useClasses } from "@/hooks/useClasses";
import { MaterialIcons } from "@expo/vector-icons";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text, Title } from "react-native-paper";
import * as Device from "expo-device";

const taskKeyMap = {
	task_balancing: "balance",
	task_rolling: "roll",
	task_jumping: "jump",
	task_running: "walk",
	task_bouncing: "bouncing",
	task_catching: "catch",
	task_throwing: "throw",
	task_dribbling: "dribble",
};

const ClassTestresultsTasks = () => {
	const { t } = useTranslation();
	const { getClass, updateClass } = useClasses();
	const { task, classId, testresultId } = useLocalSearchParams();

	const currentClass = getClass(classId as string);
	const currentTestresult = currentClass?.testresults.find((testresult) => testresult.id === testresultId);

	const taskObject = getTaskObjectByTaskGroup(task as string);

	let taskKey = taskObject.d_key;

	if (currentClass?.grade === "first" || currentClass?.grade === "second") {
		taskKey = taskKey + "_1_2";
	} else {
		taskKey = taskKey + "_3_4";
	}

	const handleTestresultUpdate = async (studentId: string, value: number | null) => {
		const newResults = currentTestresult?.results.map((result) => {
			if (result.studentId === studentId) {
				return {
					...result,
					[taskKeyMap[task as keyof typeof taskKeyMap]]: value,
				};
			}
			return result;
		});

		if (newResults) {
			await updateClass(classId as string, {
				testresults: currentClass!.testresults.map((testresult) => {
					if (testresult.id === testresultId) {
						return {
							...testresult,
							results: newResults,
						};
					}
					return testresult;
				}),
			});
		}
	};

	return (
		<SafeScrollView
			header={
				<View
					style={{
						...styles.headerContainer,
						backgroundColor: `rgba(${taskObject.color},1)`,
					}}
				>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.headerIconWrapper}
					>
						<MaterialIcons
							name="keyboard-double-arrow-left"
							size={24}
							color="black"
						/>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>{t(task)}</Text>
				</View>
			}
		>
			<View>
				<Title style={styles.title}>{t("rate_classroom_task_description")}</Title>
				<View style={styles.cardWrapper}>
					<Card
						style={{
							...styles.card,
							backgroundColor: `rgba(${taskObject.color},1)`,
						}}
						mode="contained"
						onPress={() =>
							router.push(
								`/(tabs)/(classes)/${classId}/testresults/${testresultId}/${task}/detail` as Href
							)
						}
					>
						<View style={styles.cardContent}>
							<View style={styles.textWrapper}>
								<Text style={styles.text}>{t(task)}</Text>
								<Text style={styles.subtext}>
									{t(taskKey + ".TASK")}
								</Text>
							</View>
						</View>
					</Card>

					<View style={styles.circleCutout} />

					<TouchableOpacity
						style={{
							...styles.roundButton,
							backgroundColor: `rgba(${taskObject.color}, 1)`,
						}}
						onPress={() =>
							router.push(
								`/(tabs)/(classes)/${classId}/testresults/${testresultId}/${task}/detail` as Href
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
			</View>
			<Text style={styles.valuationText}>{t(taskKey + ".VALUATION")}</Text>
			<Title
				style={{
					...styles.title,
					marginTop: 40,
				}}
			>
				{t("rate_classroom_rate_student")}
			</Title>
			{currentTestresult?.results.map((result, index) => (
				<TestCard
					key={result.studentId}
					student={
						{
							...currentClass?.students.find(
								(student) => student.id === result.studentId
							),
							index: index + 1,
						} as any
					}
					value={
						result[
							taskKeyMap[
								task as keyof typeof taskKeyMap
							] as keyof typeof result
						] as number | null
					}
					onChange={(value) => handleTestresultUpdate(result.studentId, value)}
				/>
			))}
		</SafeScrollView>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
        paddingTop: Device.deviceType === Device.DeviceType.PHONE ? 50 : 30,
		paddingLeft: 20,
        height: Device.deviceType === Device.DeviceType.PHONE ? 110 : 100,
		flexDirection: "row",
		alignItems: "center",
	},
	headerFull: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerIconWrapper: {
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 20,
		width: 40,
		height: 40,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 2.5,
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
	textWrapper: {
		marginLeft: 10,
	},
	text: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#000",
		zIndex: 3, // Text über allem
	},
	subtext: {
		fontSize: 12,
		color: "#000",
		zIndex: 3,
        width: "90%",
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
	valuationText: {
		marginTop: 20,
	},
	title: {
		fontWeight: "bold",
	},
});

export default ClassTestresultsTasks;
