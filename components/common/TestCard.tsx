import { parseStudentSexIcon } from "@/constants/ClassParser";
import { ClassStudent } from "@/hooks/useClasses";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";

interface TestCardProps {
	value: number | null;
	student: ClassStudent & { index: number };
	onChange: (value: number | null) => void;
}

const TestCard = (props: TestCardProps) => {
	return (
		<Card
			mode="contained"
			style={styles.card}
		>
			<View style={styles.cardHeader}>
				<Text style={styles.headerText}>
					<Text style={styles.headerSubtext}>
						#{props.student.index}
						{"   "}
					</Text>{" "}
					{props.student.firstName + " " + props.student.lastName}
				</Text>
				<MaterialIcons
					name={parseStudentSexIcon(props.student.sex)}
					size={24}
					color="black"
				/>
			</View>
			<View style={styles.cardContent}>
				<TouchableOpacity
					style={{
						...styles.cardAction,
						backgroundColor: "rgba(178, 215, 242, 1)",
						borderWidth: props.value === null ? 2 : 0,
					}}
					onPress={() => props.onChange(null)}
				>
					<Text>n/a</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						...styles.cardAction,
						backgroundColor: "rgba(255, 199, 176, 1)",
						borderWidth: props.value === 0 ? 2 : 0,
					}}
					onPress={() => props.onChange(0)}
				>
					<Text>0</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						...styles.cardAction,
						backgroundColor: "rgba(156, 236, 225, 1)",
						borderWidth: props.value === 1 ? 2 : 0,
					}}
					onPress={() => props.onChange(1)}
				>
					<Text>1</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						...styles.cardAction,
						backgroundColor: "limegreen",
						borderWidth: props.value === 2 ? 2 : 0,
					}}
					onPress={() => props.onChange(2)}
				>
					<Text>2</Text>
				</TouchableOpacity>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	headerText: {
		fontSize: 14,
		color: "black",
	},
	headerSubtext: {
		color: "#cecece",
	},
	card: {
		padding: 10,
		backgroundColor: "white",
		borderRadius: 7.5,
		marginVertical: 10,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	cardContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingBottom: 15,
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
});

export default TestCard;
