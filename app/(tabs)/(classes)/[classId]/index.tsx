import SafeScrollView from "@/components/common/SafeScrollView";
import { parseStudentSexIcon } from "@/constants/ClassParser";
import { useClasses } from "@/hooks/useClasses";
import { MaterialIcons } from "@expo/vector-icons";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, Text, Title } from "react-native-paper";
import uuid from "react-native-uuid";

const ClassScreen = () => {
	const { getClass, updateClass } = useClasses();
	const { t } = useTranslation();
	const { classId } = useLocalSearchParams();

	const currentClass = getClass(classId as string);

	const handleNewTest = async () => {
		const id = uuid.v4().toString();
		await updateClass(classId as string, {
			testresults: [
				...currentClass!.testresults,
				{
					id,
					createdAt: new Date().toLocaleDateString("de-DE", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					}),
					status: "OPEN",
					results: currentClass!.students.map((student) => ({
						studentId: student.id,
						balance: null,
						roll: null,
						jump: null,
						walk: null,
						bouncing: null,
						catch: null,
						throw: null,
						dribble: null,
					})),
				},
			],
		});
		router.push(`/(tabs)/(classes)/${classId}/testresults/${id}`);
	};

	return (
		<SafeScrollView>
			<Title style={styles.title}>{t("test_task_list_title")}</Title>
			{!currentClass?.testresults.find((test) => test.status === "OPEN") && (
				<View style={styles.testContainer}>
					<Text style={styles.testTitle}>{t("classroom_new_test")}</Text>
					<Button
						mode="contained"
						buttonColor="rgba(123,210,53,1)"
						rippleColor={"rgba(0,0,0,0.1)"}
						style={styles.testButton}
						contentStyle={styles.testButtonInner}
						onPress={() => handleNewTest()}
					>
						<Text>{t("classroom_test_class")}</Text>
					</Button>
				</View>
			)}
			<View style={styles.testDivider} />
			{currentClass?.testresults.map((test, index) => (
				<View
					style={styles.testCardWrapper}
					key={test.id}
				>
					<Card
						style={styles.testCard}
						mode="contained"
						onPress={() =>
							router.push(
								`/(tabs)/(classes)/${classId}/testresults/${test.id}`
							)
						}
					>
						<View style={styles.testCardContent}>
							<Text style={styles.testCardTitle}>{test.createdAt}</Text>
							<Text
								style={{
									...styles.subtext,
									color:
										test.status === "OPEN"
											? "limegreen"
											: "grey",
								}}
							>
								{test.status === "OPEN"
									? t("general_open")
									: t("general_closed")}
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
								`/(tabs)/(classes)/${classId}/testresults/${test.id}`
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
			{currentClass?.testresults && currentClass?.testresults.length >= 2 && (
				<Button
					mode="contained"
					buttonColor="rgba(123,210,53,1)"
					rippleColor={"rgba(0,0,0,0.1)"}
					style={styles.testButton}
					contentStyle={styles.testButtonInner}
					onPress={() => router.push(`/(tabs)/(classes)/${classId}/longitudinal`)}
				>
					<Text>{t("rate_classroom_longitudinal_analysis")}</Text>
				</Button>
			)}
			<View style={styles.studentContent}>
				<Title style={styles.title}>{t("student_general_plural")}</Title>
				<Button
					style={styles.studentButton}
					mode="contained"
					buttonColor="rgba(123,210,53,1)"
					icon={"plus"}
					onPress={() => router.push(`/(tabs)/(classes)/${classId}/new-student`)}
				>
					{t("student_add")}
				</Button>
			</View>
			{currentClass?.students.map((student, index) => (
				<View
					style={styles.cardWrapper}
					key={student.id}
				>
					<Card
						style={styles.card}
						mode="contained"
						onPress={() =>
							router.push(
								`/(tabs)/(classes)/${classId}/students/${student.id}`
							)
						}
					>
						<View style={styles.cardContent}>
							<Text style={styles.prefix}>#{index + 1}</Text>
							<MaterialIcons
								name={parseStudentSexIcon(student.sex)}
								size={24}
								color="black"
							/>
							<Text style={styles.text}>
								{student.firstName + " " + student.lastName}
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
								`/(tabs)/(classes)/${classId}/students/${student.id}`
							)
						}
					>
						<MaterialIcons
							name="edit"
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
	title: {
		fontSize: 22,
		fontWeight: "bold",
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
	studentContent: {
		marginTop: 40,
		marginVertical: 20,
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
	},
	studentButton: {
		zIndex: 3,
		borderRadius: 7.5,
	},
	card: {
		height: 70,
		overflow: "hidden",
		position: "relative",
		backgroundColor: "rgb(255, 255, 255)",
		borderRadius: 7.5,
	},
	testCard: {
		height: 80,
		overflow: "hidden",
		position: "relative",
		backgroundColor: "rgb(255, 255, 255)",
		borderRadius: 7.5,
	},
	testDivider: {
		marginTop: 10,
	},
	cardWrapper: {
		position: "relative",
		marginVertical: 5,
	},
	testCardWrapper: {
		position: "relative",
		marginVertical: 5,
	},
	cardContent: {
		position: "relative",
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		width: "100%",
		height: "100%",
		zIndex: 0,
		padding: 10,
	},
	testCardContent: {
		position: "relative",
		justifyContent: "center",
		width: "100%",
		height: "100%",
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
		color: "#000",
		zIndex: 3, // Text über allem
	},
	testCardTitle: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#000",
		zIndex: 3,
	},
	subtext: {
		fontSize: 14,
		fontWeight: "bold",
		color: "limegreen",
		zIndex: 3, // Text über allem
	},
	prefix: {
		fontSize: 14,
		fontWeight: "light",
		color: "#cecece",
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
});

export default ClassScreen;
