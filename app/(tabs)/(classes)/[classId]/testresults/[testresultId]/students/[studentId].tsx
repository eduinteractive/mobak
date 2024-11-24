import SafeScrollView from "@/components/common/SafeScrollView";
import TasksOverview from "@/constants/TasksOverview";
import { useClasses } from "@/hooks/useClasses";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";

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

const ClassTestresultsStudent = () => {
	const { classId, testresultId, studentId } = useLocalSearchParams();
	const { getClass } = useClasses();
	const { t } = useTranslation();

	const currentClass = getClass(classId as string);

	const currentTestresult = getClass(classId as string)
		?.testresults.find((testresult) => testresult.id === testresultId)
		?.results.find((result) => result.studentId === studentId);

	const renderTaskGroup = (taskGroup: "SELF_MOVE" | "OBJECT_MOVE") => {
		return TasksOverview[taskGroup].map((task) => (
			<View
				style={styles.cardWrapper}
				key={task.key}
			>
				<Card
					style={{
						...styles.card,
						backgroundColor: `rgba(${task.color}, 1)`,
					}}
					mode="contained"
				>
					<View style={styles.cardContent}>
						<View style={styles.textWrapper}>
							<Text style={styles.text}>{t(task.key)}</Text>
						</View>
                        <View style={styles.cardAction}>
                            <Text>{currentTestresult![taskKeyMap[task.key as keyof typeof taskKeyMap] as keyof typeof currentTestresult] !== null ? 
                                currentTestresult![taskKeyMap[task.key as keyof typeof taskKeyMap] as keyof typeof currentTestresult] : "n/a"}
                            </Text>
                        </View>
					</View>
				</Card>
			</View>
		));
	};

    if (!currentTestresult) {
        return null
    }

	return (
		<SafeScrollView>
			{renderTaskGroup("SELF_MOVE")}
			{renderTaskGroup("OBJECT_MOVE")}
		</SafeScrollView>
	);
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
        padding: 10,
        flexDirection: "row",
		position: "relative",
		width: "100%",
		height: "100%",
		justifyContent: "space-between",
        alignItems: "center",
		zIndex: 0,
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
	},
	cardAction: {
        marginRight: 10,
		height: 40,
		width: 40,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 7.5,
		borderColor: "black",
	},
});

export default ClassTestresultsStudent;
