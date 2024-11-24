import SafeScrollView from "@/components/common/SafeScrollView";
import { parseClassGrade } from "@/constants/ClassParser";
import { useClasses } from "@/hooks/useClasses";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Card } from "react-native-paper";

const ClassesScreen = () => {
	const { classes } = useClasses();
	const { t } = useTranslation();

	return (
		<SafeScrollView
			header={
				<View style={styles.header}>
					<ImageBackground
						source={require("@/assets/images/l_tasks/DRIBBLING.WITHIN_SHARK_TERRITORY.FOTO.jpg")}
						style={{ width: "100%", height: "100%" }}
					>
						<LinearGradient
							colors={[
								`rgba(255, 255, 255, 1)`,
								`rgba(255, 255, 255, 0.9)`,
								"transparent",
							]}
							style={styles.gradient}
							start={{ x: 0, y: 1 }}
							end={{ x: 0, y: 0.1 }}
						/>
						<View style={styles.headerContent}>
							<Text style={styles.headerText}>
								{t("navigation_classroom")}
							</Text>
							<Button
								style={styles.headerButton}
								mode="contained"
								buttonColor="rgba(123,210,53,1)"
								icon={"plus"}
								onPress={() =>
									router.push(`/(tabs)/(classes)/new`)
								}
							>
								{t("classroom_new_class")}
							</Button>
						</View>
					</ImageBackground>
				</View>
			}
		>
			{classes.map((classItem) => (
				<View
					style={styles.cardWrapper}
					key={classItem.id}
				>
					<Card
						style={styles.card}
						mode="contained"
                        onPress={() => router.push(`/(tabs)/(classes)/${classItem.id}`)}
					>
						<View style={styles.cardContent}>
							<Text style={styles.classTitle}>{classItem.name}</Text>
							<Text style={styles.classGrade}>{parseClassGrade(classItem.grade)}</Text>
							<Text style={styles.classGrade}>
								<Text style={styles.classStudents}>
									{classItem.students.length + " "}
								</Text>
								{t("student_general")}
							</Text>
						</View>
					</Card>
					<View style={styles.circleCutout} />
					<TouchableOpacity
						style={{
							...styles.roundButton,
							backgroundColor: `rgba(255,255,255, 1)`,
						}}
                        onPress={() => router.push(`/(tabs)/(classes)/${classItem.id}`)}
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

export default ClassesScreen;

const styles = StyleSheet.create({
	header: {
		backgroundColor: "rgb(255, 255, 255)",
		height: 250,
		width: "100%",
		position: "relative",
	},
	headerContent: {
		position: "absolute",
		flexDirection: "row",
		bottom: 20,
		width: "100%",
		justifyContent: "space-between",
		alignItems: "flex-end",
	},
	headerButton: {
		zIndex: 3,
		marginRight: 20,
		borderRadius: 7.5,
	},
	headerText: {
		fontSize: 24,
		fontWeight: "bold",
		zIndex: 3,
		marginLeft: 20,
	},
	gradient: {
		position: "absolute",
		width: "100%", // Gradient über der linken Hälfte des Bildes
		height: "100%",
		right: 0,
		top: 0,
		zIndex: 2, // Gradient über dem BlurView
	},
	card: {
		overflow: "hidden",
		position: "relative",
		backgroundColor: "rgb(255, 255, 255)",
		borderRadius: 7.5,
	},
	cardWrapper: {
		overflow: "hidden",
		position: "relative",
		marginVertical: 5,
	},
	cardContent: {
		paddingVertical: 20,
		position: "relative",
		width: "100%",
		justifyContent: "center",
		zIndex: 0,
		padding: 10,
	},
	circleCutout: {
		overflow: "hidden",
		position: "absolute",
		transform: [{ translateY: -15 }],
		right: -20,
		top: 0,
		width: 70,
		height: 60,
		backgroundColor: "rgb(242, 242, 242)",
		borderRadius: 15,
		zIndex: 1,
	},
	roundButton: {
		position: "absolute",
		right: 5, // Um den Button in die Einbuchtung zu schieben
		top: 20,
		transform: [{ translateY: -17.5 }], // Button zentrieren
		width: 37.5,
		height: 35,
		borderRadius: 10, // Kreisförmiger Button
		justifyContent: "center",
		alignItems: "center",
		zIndex: 4,
	},
	classTitle: {
		fontSize: 14,
		fontWeight: "bold",
	},
	classGrade: {
		fontSize: 12,
		marginVertical: 2.5,
	},
	classStudents: {
		fontSize: 12,
		color: "green",
	},
});
