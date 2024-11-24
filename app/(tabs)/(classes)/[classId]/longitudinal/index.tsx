import SafeScrollView from "@/components/common/SafeScrollView";
import { parseStudentSexIcon } from "@/constants/ClassParser";
import { getTaskObjectByTaskGroup } from "@/constants/TasksOverview";
import { useClasses } from "@/hooks/useClasses";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Card, Text, Title } from "react-native-paper";

const selfMoveKeys = ["balance", "roll", "jump", "walk"];
const objectMoveKeyd = ["bouncing", "catch", "throw", "dribble"];

const taskKeyMap = {
	task_balancing: "balance",
	task_rolling: "roll",
	task_jumping: "jump",
	task_running: "walk",
	task_bouncing: "bouncing",
	task_catching: "catch",
	task_throwing: "throw",
	task_dribbling: "dribble",
	task_self_movement: "selfMove",
	task_object_movement: "objectMove",
};

const ClassStudentLongitudinal = () => {
	const { classId } = useLocalSearchParams();
	const { getClass } = useClasses();
	const { t } = useTranslation();
	const currentClass = getClass(classId as string);

	const results = currentClass?.testresults.map((test) => {
		return {
			results: test.results,
			createdAt: test.createdAt,
			status: test.status,
		};
	});

	const longitudinalMap: Record<
		string,
		{ value: number; label: string; topLabelComponent: () => React.ReactNode }[]
	> = {
		selfMove: [],
		objectMove: [],
		balance: [],
		roll: [],
		jump: [],
		walk: [],
		bouncing: [],
		catch: [],
		throw: [],
		dribble: [],
	};

	results?.forEach((result) => {
		Object.keys(longitudinalMap).forEach((key) => {
			if (key !== "selfMove" && key !== "objectMove") {
				const average =
					result.results.reduce((acc, studentResult) => {
						return (
							acc +
							((studentResult[key as keyof typeof studentResult] as number) ||
								0)
						);
					}, 0) / result.results.length;
				longitudinalMap[key].push({
					value: average,
					label: result.createdAt,
					topLabelComponent: () => <Text>{average.toFixed(2)}</Text>,
				});
			} else if (key === "selfMove") {
				const average =
					selfMoveKeys.reduce((acc, moveKey) => {
						return (
							acc +
							result.results.reduce((acc, studentResult) => {
								return (
									acc +
									((studentResult[
										moveKey as keyof typeof studentResult
									] as number) || 0)
								);
							}, 0)
						);
					}, 0) / result.results.length;
				longitudinalMap.selfMove.push({
					value: average,
					label: result.createdAt,
					topLabelComponent: () => <Text>{average.toFixed(2)}</Text>,
				});
			} else if (key === "objectMove") {
				const average =
					objectMoveKeyd.reduce((acc, moveKey) => {
						return (
							acc +
							result.results.reduce((acc, studentResult) => {
								return (
									acc +
									((studentResult[
										moveKey as keyof typeof studentResult
									] as number) || 0)
								);
							}, 0)
						);
					}, 0) / result.results.length;
				longitudinalMap.objectMove.push({
					value: average,
					label: result.createdAt,
					topLabelComponent: () => <Text>{average.toFixed(2)}</Text>,
				});
			}
		});
	});

	return (
		<SafeScrollView>
			{Object.keys(longitudinalMap).map((key) => (
				<View key={key}>
					<Title
						style={{
							...styles.title,
							backgroundColor: `rgba(${
								getTaskObjectByTaskGroup(
									Object.keys(taskKeyMap).find(
										(taskKey) =>
											taskKeyMap[
												taskKey as keyof typeof taskKeyMap
											] === key
									) || key
								).color || "123,210,53"
							},1)`,
						}}
					>
						{t(
							Object.keys(taskKeyMap).find(
								(taskKey) =>
									taskKeyMap[
										taskKey as keyof typeof taskKeyMap
									] === key
							) || key
						)}
					</Title>
					<BarChart
						width={Dimensions.get("window").width - 40}
						data={longitudinalMap[key]}
						frontColor={`rgba(${
							getTaskObjectByTaskGroup(
								Object.keys(taskKeyMap).find(
									(taskKey) =>
										taskKeyMap[
											taskKey as keyof typeof taskKeyMap
										] === key
								) || key
							).color || "123,210,53"
						},1)`}
						height={240}
						barWidth={140}
						maxValue={key === "selfMove" || key === "objectMove" ? 8 : 2}
						noOfSections={key === "selfMove" || key === "objectMove" ? 8 : 1}
						stepValue={key === "selfMove" || key === "objectMove" ? 2 : 1}
						isAnimated
						yAxisExtraHeight={30}
						topLabelContainerStyle={{ paddingBottom: 10 }}
					/>
				</View>
			))}
			<View style={styles.studentEvaluation}>
				<Title style={styles.studentEvaluationTitle}>
					{t("rate_classroom_result_per_student")}
				</Title>
				{currentClass?.students.map((student, index) => {
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
										`/(tabs)/(classes)/${classId}/longitudinal/${student.id}`
									)
								}
							>
								<View style={styles.studentCardContent}>
									<Text style={styles.prefix}>#{index + 1}</Text>
									<MaterialIcons
										name={parseStudentSexIcon(student.sex)}
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
										`/(tabs)/(classes)/${classId}/longitudinal/${student.id}`
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
};

const styles = StyleSheet.create({
	title: {
		padding: 5,
		marginTop: 20,
		marginBottom: 10,
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
	studentEvaluation: {
        marginTop: 40,
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

export default ClassStudentLongitudinal;
