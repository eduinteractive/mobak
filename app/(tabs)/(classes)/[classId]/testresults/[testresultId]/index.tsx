import SafeScrollView from "@/components/common/SafeScrollView";
import { parseStudentSex, parseStudentSexIcon } from "@/constants/ClassParser";
import TasksOverview from "@/constants/TasksOverview";
import { useClasses } from "@/hooks/useClasses";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Href, router, useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, Dialog, Portal, Text, Title } from "react-native-paper";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { Platform } from "react-native";
import { PDF_TESTRESULT } from "@/constants/PDF";

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

const selfMoveKeys = ["balance", "roll", "jump", "walk"];
const objectMoveKeyd = ["bouncing", "catch", "throw", "dribble"];

const ClassStudentTestresults = () => {
	const { classId, testresultId } = useLocalSearchParams();
	const { getClass, updateClass } = useClasses();
	const { t } = useTranslation();
	const [endDialogVisible, setEndDialogVisible] = useState(false);

	const currentClass = getClass(classId as string);

	const currentTestresult = getClass(classId as string)?.testresults.find(
		(testresult) => testresult.id === testresultId
	);

	const createPDF = async () => {
		// Berechnet den Durchschnitt für ein bestimmtes Feld (z. B. balance, roll, etc.)
		const calculateItemAverage = (key: string) => {
			const total = currentTestresult!.results.reduce((sum, result) => {
				if (result[key as keyof typeof result] === null) return sum;
				return sum + ((result[key as keyof typeof result] as number) || 0);
			}, 0);
			const average = total /
				currentTestresult!.results.filter(
					(result) => result[key as keyof typeof result] !== null
				).length;
            if (isNaN(average)) return "0";
            return average.toFixed(2);
		};

		// Berechnet den Prozentsatz für einen bestimmten Wert (z. B. 0, 1, 2) eines Feldes
		const calculatePercentage = (value: number | null, key: string) => {
            // Filter nur für gültige Werte, also keine null
            const validResults = currentTestresult!.results.filter(
                (result) => result[key as keyof typeof result] !== null
            );
        
            const total = validResults.length; // Anzahl gültiger Werte
            const count = validResults.filter((result) => {
                const item = result[key as keyof typeof result];
                return item === value; // Exakte Übereinstimmung
            }).length;
        
            return total > 0 ? ((count / total) * 100).toFixed(2) + "%" : "0.00%";
        };

		// Zählt nur die vorhandenen Werte (nicht null) für ein bestimmtes Feld
		const calculateTotalCount = (key: string) => {
			return currentTestresult!.results.filter(
				(result) => result[key as keyof typeof result] !== null
			).length;
		};

		// Generiert die Zeilen für die Schülerdaten
		const studentRows = currentTestresult!.results
			.map((result, index) => {
				const student = currentClass?.students.find(
					(student) => student.id === result.studentId
				);
				if (!student) return null;

				const selfMoveTotal =
					(result.balance || 0) +
					(result.roll || 0) +
					(result.jump || 0) +
					(result.walk || 0);
				const objectMoveTotal =
					(result.bouncing || 0) +
					(result.catch || 0) +
					(result.throw || 0) +
					(result.dribble || 0);

				return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${parseStudentSex(student.sex)}</td>
                        <td>${student.firstName} ${student.lastName}</td>
                        <td>${result.balance !== null ? result.balance : "—"}</td>
                        <td>${result.roll !== null ? result.roll : "—"}</td>
                        <td>${result.jump !== null ? result.jump : "—"}</td>
                        <td>${result.walk !== null ? result.walk : "—"}</td>
                        <td>${selfMoveTotal}</td>
                        <td>${result.bouncing !== null ? result.bouncing : "—"}</td>
                        <td>${result.catch !== null ? result.catch : "—"}</td>
                        <td>${result.throw !== null ? result.throw : "—"}</td>
                        <td>${result.dribble !== null ? result.dribble : "—"}</td>
                        <td>${objectMoveTotal}</td>
                    </tr>
                `;
			})
			.join("");

		// Generiert die Zeilen für Durchschnittswerte und Gesamtzahlen
		const averageRows = `
            <tr>
                <td></td>
                <td></td>
                <td><strong>Klassendurchschnitt</strong></td>
                <td>${calculateItemAverage("balance")}</td>
                <td>${calculateItemAverage("roll")}</td>
                <td>${calculateItemAverage("jump")}</td>
                <td>${calculateItemAverage("walk")}</td>
                <td>${["balance", "roll", "jump", "walk"]
			.reduce((sum, key) => {
				return sum + parseFloat(calculateItemAverage(key));
			}, 0)
			.toFixed(2)}</td>
                <td>${calculateItemAverage("bouncing")}</td>
                <td>${calculateItemAverage("catch")}</td>
                <td>${calculateItemAverage("throw")}</td>
                <td>${calculateItemAverage("dribble")}</td>
                <td>${["bouncing", "catch", "throw", "dribble"]
			.reduce((sum, key) => {
				return sum + parseFloat(calculateItemAverage(key));
			}, 0)
			.toFixed(2)}</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td>0 (%)</td>
                <td>${calculatePercentage(0, "balance")}</td>
                <td>${calculatePercentage(0, "roll")}</td>
                <td>${calculatePercentage(0, "jump")}</td>
                <td>${calculatePercentage(0, "walk")}</td>
                <td>—</td>
                <td>${calculatePercentage(0, "bouncing")}</td>
                <td>${calculatePercentage(0, "catch")}</td>
                <td>${calculatePercentage(0, "throw")}</td>
                <td>${calculatePercentage(0, "dribble")}</td>
                <td>—</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td>1 (%)</td>
                <td>${calculatePercentage(1, "balance")}</td>
                <td>${calculatePercentage(1, "roll")}</td>
                <td>${calculatePercentage(1, "jump")}</td>
                <td>${calculatePercentage(1, "walk")}</td>
                <td>—</td>
                <td>${calculatePercentage(1, "bouncing")}</td>
                <td>${calculatePercentage(1, "catch")}</td>
                <td>${calculatePercentage(1, "throw")}</td>
                <td>${calculatePercentage(1, "dribble")}</td>
                <td>—</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td>2 (%)</td>
                <td>${calculatePercentage(2, "balance")}</td>
                <td>${calculatePercentage(2, "roll")}</td>
                <td>${calculatePercentage(2, "jump")}</td>
                <td>${calculatePercentage(2, "walk")}</td>
                <td>—</td>
                <td>${calculatePercentage(2, "bouncing")}</td>
                <td>${calculatePercentage(2, "catch")}</td>
                <td>${calculatePercentage(2, "throw")}</td>
                <td>${calculatePercentage(2, "dribble")}</td>
                <td>—</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td><strong>Total (N)</strong></td>
                <td>${calculateTotalCount("balance")}</td>
                <td>${calculateTotalCount("roll")}</td>
                <td>${calculateTotalCount("jump")}</td>
                <td>${calculateTotalCount("walk")}</td>
                <td>—</td>
                <td>${calculateTotalCount("bouncing")}</td>
                <td>${calculateTotalCount("catch")}</td>
                <td>${calculateTotalCount("throw")}</td>
                <td>${calculateTotalCount("dribble")}</td>
                <td>—</td>
            </tr>
        `;

		const formattedHtml = PDF_TESTRESULT
			.replace("%%STUDENT_ROWS%%", studentRows)
			.replace("%%AVERAGE_ROWS%%", averageRows)
			.replace("%%TEST_DATE%%", currentTestresult!.createdAt)
            .replace("%%INSTRUCTION%%", t("PDF_TESTRESULT.INSTRUCTION"))
            .replace("%%INSTRUCTION_1%%", t("PDF_TESTRESULT.INSTRUCTION_1"))
            .replace("%%INSTRUCTION_2%%", t("PDF_TESTRESULT.INSTRUCTION_2"))
            .replace("%%INSTRUCTION_3%%", t("PDF_TESTRESULT.INSTRUCTION_3"))
            .replace("%%INSTRUCTION_4%%", t("PDF_TESTRESULT.INSTRUCTION_4"))
            .replace("%%INSTRUCTION_END%%", t("PDF_TESTRESULT.INSTRUCTION_END"))
            .replace("%%student_textfield_gender%%", t("student_textfield_gender"))
            .replace("%%student_textfield_name%%", t("student_textfield_name"))
            .replace("%%task_balancing%%", t("task_balancing"))
            .replace("%%task_rolling%%", t("task_rolling"))
            .replace("%%task_jumping%%", t("task_jumping"))
            .replace("%%task_running%%", t("task_running"))
            .replace("%%task_self_movement%%", t("task_self_movement"))
            .replace("%%task_bouncing%%", t("task_bouncing"))
            .replace("%%task_catching%%", t("task_catching"))
            .replace("%%task_throwing%%", t("task_throwing"))
            .replace("%%task_dribbling%%", t("task_dribbling"))
            .replace("%%task_object_movement%%", t("task_object_movement"))
            .replace("%%rate_detail_valuation%%", t("rate_detail_valuation"))
            .replace("%%TEST_CLASS%%", currentClass!.name);

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
		} catch (error) {
			console.error(error);
		}
	};

	// Calculate the average of selfMove items together
	const selfMoveAverage = currentTestresult!.results.reduce((acc, result) => {
		return (
			acc +
			selfMoveKeys.reduce((acc, key) => {
				return (
					acc +
					(result[key as keyof typeof result] !== null
						? (result[key as keyof typeof result] as number)
						: 0)
				);
			}, 0)
		);
	}, 0);

	const objectMoveAverage = currentTestresult!.results.reduce((acc, result) => {
		return (
			acc +
			objectMoveKeyd.reduce((acc, key) => {
				return (
					acc +
					(result[key as keyof typeof result] !== null
						? (result[key as keyof typeof result] as number)
						: 0)
				);
			}, 0)
		);
	}, 0);

	const renderTaskGroup = (taskGroup: "SELF_MOVE" | "OBJECT_MOVE") => {
		return TasksOverview[taskGroup].map((task) => (
			<View
				style={styles.cardWrapper}
				key={task.key}
			>
				<Card
					style={styles.card}
					mode="contained"
					onPress={() =>
						router.push(
							`(tabs)/(classes)/${classId}/testresults/${testresultId}/${task.key}` as Href
						)
					}
				>
					<View style={styles.cardContent}>
						<Image
							source={
								taskImages["MOBAK_1_2"][
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

						<View style={styles.textWrapper}>
							<Text style={styles.text}>{t(task.key)}</Text>
							<Text style={styles.subtext}>
								{currentTestresult?.results.reduce(
									(acc, result) =>
										acc +
										(result[
											taskKeyMap[
												task.key as keyof typeof taskKeyMap
											] as keyof typeof result
										] !== null
											? 1
											: 0),
									0
								)}{" "}
								/ {currentTestresult?.results.length}{" "}
								{t("rate_classroom_dashboard_rates_number")}
							</Text>
						</View>
					</View>
				</Card>

				<View style={styles.circleCutout} />

				<TouchableOpacity
					style={{
						...styles.roundButton,
						backgroundColor: `rgba(${task.color}, 1)`,
					}}
					onPress={() =>
						router.push(
							`(tabs)/(classes)/${classId}/testresults/${testresultId}/${task.key}` as Href
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
		));
	};

	const handleTestresultEnd = async () => {
		await updateClass(classId as string, {
			testresults: currentClass!.testresults.map((testresult) => {
				if (testresult.id === testresultId) {
					return {
						...testresult,
						status: "CLOSED",
					};
				}
				return testresult;
			}),
		});
		router.back();
	};

	if (!currentTestresult) {
		return null;
	}

	if (currentTestresult.status === "OPEN") {
		return (
			<SafeScrollView>
				<Title style={styles.title}>{t("rate_classroom_dashboard_title")}</Title>
				{renderTaskGroup("SELF_MOVE")}
				{renderTaskGroup("OBJECT_MOVE")}
				<Button
					style={styles.endButton}
					mode="contained"
					onPress={() => setEndDialogVisible(true)}
				>
					{t("rate_classroom_dashboard_end_session")}
				</Button>
				<Portal>
					<Dialog
						visible={endDialogVisible}
						onDismiss={() => setEndDialogVisible(false)}
					>
						<Dialog.Title>
							{t("rate_classroom_end_session_dialog_title")}
						</Dialog.Title>
						<Dialog.Content>
							<Text variant="bodyMedium">
								{t("rate_classroom_end_session_dialog_description")}
							</Text>
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={() => setEndDialogVisible(false)}>
								{t("general_cancel")}
							</Button>
							<Button onPress={handleTestresultEnd}>{t("general_ok")}</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>
			</SafeScrollView>
		);
	} else {
		return (
			<SafeScrollView>
				<View>
					<Button
						mode="contained"
						style={styles.endButton}
						onPress={() => createPDF()}
					>
						{t("rate_classroom_export")}
					</Button>

					<View style={styles.evaluationWrapper}>
						<Title>{t("rate_classroom_average_self_movement")}</Title>
						<View
							style={{
								...styles.cardAction,
								backgroundColor: "rgba(178, 215, 242,1)",
							}}
						>
							<Text>
								{selfMoveAverage === 0
									? "n/a"
									: selfMoveAverage /
									  currentTestresult!.results.length}
							</Text>
						</View>
					</View>
					<View style={styles.evaluationWrapper}>
						<Title>{t("rate_classroom_average_object_movement")}</Title>
						<View
							style={{
								...styles.cardAction,
								backgroundColor: "rgba(156, 236, 225,1)",
							}}
						>
							<Text>
								{objectMoveAverage === 0
									? "n/a"
									: objectMoveAverage /
									  currentTestresult!.results.length}
							</Text>
						</View>
					</View>
				</View>
				<View style={styles.studentEvaluation}>
					<Title style={styles.studentEvaluationTitle}>
						{t("rate_classroom_result_per_student")}
					</Title>
					{currentTestresult.results.map((result, index) => {
						const student = currentClass?.students.find(
							(student) => student.id === result.studentId
						);

						if (!student) return null;

						return (
							<View
								style={styles.studentCardWrapper}
								key={student.id}
							>
								<Card
									style={styles.studentCard}
									mode="contained"
									onPress={() =>
										router.push(
											`/(tabs)/(classes)/${classId}/testresults/${testresultId}/students/${student.id}` as Href
										)
									}
								>
									<View style={styles.studentCardContent}>
										<Text style={styles.prefix}>
											#{index + 1}
										</Text>
										<MaterialIcons
											name={parseStudentSexIcon(
												student.sex
											)}
											size={24}
											color="black"
										/>
										<Text style={styles.studentText}>
											{student.firstName +
												" " +
												student.lastName}
										</Text>
									</View>
								</Card>

								<View style={styles.circleCutout} />

								<TouchableOpacity
									style={{
										...styles.roundButton,
										backgroundColor: `rgba(255,255,255, 1)`,
									}}
									onPress={() =>
										router.push(
											`/(tabs)/(classes)/${classId}/testresults/${testresultId}/students/${student.id}` as Href
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
						);
					})}
				</View>
			</SafeScrollView>
		);
	}
};

const styles = StyleSheet.create({
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginVertical: 10,
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
        zIndex: 4,
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
	endButton: {
		borderRadius: 7.5,
		marginVertical: 10,
		paddingVertical: 5,
	},
	evaluationWrapper: {
		justifyContent: "space-between",
		flexDirection: "row",
		marginVertical: 10,
	},
	studentEvaluation: {
		marginVertical: 20,
	},
	studentEvaluationTitle: {
		fontWeight: "bold",
		marginBottom: 20,
	},
	cardAction: {
		height: 40,
		width: 40,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "limegreen",
		borderRadius: 7.5,
		borderColor: "black",
	},
	prefix: {
		fontSize: 14,
		fontWeight: "light",
		color: "#cecece",
		zIndex: 3,
	},
	studentCard: {
		backgroundColor: "white",
		height: 70,
		overflow: "hidden",
		position: "relative",
		borderRadius: 7.5,
	},
	studentCardWrapper: {
		position: "relative",
		marginVertical: 5,
	},
	studentCardContent: {
		position: "relative",
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		width: "100%",
		height: "100%",
		zIndex: 0,
		padding: 10,
	},
	studentText: {
		fontSize: 14,
		color: "#000",
		zIndex: 3, // Text über allem
	},
	studentSubtext: {
		fontSize: 14,
		fontWeight: "bold",
		color: "limegreen",
		zIndex: 3, // Text über allem
	},
});

export default ClassStudentTestresults;
