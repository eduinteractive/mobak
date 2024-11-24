import SafeScrollView from "@/components/common/SafeScrollView";
import { getTaskObjectByTaskGroup } from "@/constants/TasksOverview";
import { useClasses } from "@/hooks/useClasses";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";
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

const ClassSingleStudentLongitudinal = () => {
	const { classId, studentId } = useLocalSearchParams();
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
            const studentResult = result.results.find(
                (studentResult) => studentResult.studentId === studentId
            );
            if (!studentResult) return;
			if (key !== "selfMove" && key !== "objectMove") {
				const value = studentResult
					? (studentResult[key as keyof typeof studentResult] as number) || 0
					: 0;
				longitudinalMap[key].push({
					value: value,
					label: result.createdAt,
					topLabelComponent: () => <Text>{value.toFixed(2)}</Text>,
				});
			} else if (key === "selfMove") {
				const value =
					selfMoveKeys.reduce((acc, moveKey) => {
						return (
							acc +
							(studentResult[moveKey as keyof typeof studentResult] as number || 0)
						);
					}, 0);
				longitudinalMap.selfMove.push({
					value: value,
					label: result.createdAt,
					topLabelComponent: () => <Text>{value.toFixed(2)}</Text>,
				});
			} else if (key === "objectMove") {
				const value =
					objectMoveKeyd.reduce((acc, moveKey) => {
						return (
							acc +
							(studentResult[moveKey as keyof typeof studentResult] as number || 0)
						);
					}, 0);
				longitudinalMap.objectMove.push({
					value: value,
					label: result.createdAt,
					topLabelComponent: () => <Text>{value.toFixed(2)}</Text>,
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
		</SafeScrollView>
	);
};

const styles = StyleSheet.create({
	title: {
		padding: 5,
		marginTop: 20,
		marginBottom: 10,
	},
});

export default ClassSingleStudentLongitudinal;
