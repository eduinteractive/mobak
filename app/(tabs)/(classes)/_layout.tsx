import { getTaskObjectByTaskGroup } from "@/constants/TasksOverview";
import { useClasses } from "@/hooks/useClasses";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text, Title } from "react-native-paper";

const ClassesLayout = () => {
	const { t } = useTranslation();
	const { getClass } = useClasses();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen
				name="new"
				options={{
					presentation: "modal",
					animation: "slide_from_bottom",
				}}
			/>
			<Stack.Screen
				name="[classId]/index"
				options={({ route, navigation }) => {
					const params = route.params as { classId: string };
					return {
						headerShown: true,
						headerTitle: getClass(params.classId)?.name,
						headerRight: () => (
							<TouchableOpacity
								onPressIn={() =>
									router.push(
										`/(tabs)/(classes)/${params.classId}/edit`
									)
								}
							>
								<MaterialIcons
									name="edit"
									size={24}
									color="black"
								/>
							</TouchableOpacity>
						),
					};
				}}
			/>
			<Stack.Screen
				name="[classId]/new-student"
				options={{
					presentation: "modal",
					animation: "slide_from_bottom",
				}}
			/>
			<Stack.Screen
				name="[classId]/edit"
				options={{
					presentation: "modal",
					animation: "slide_from_bottom",
				}}
			/>
			<Stack.Screen
				name="[classId]/testresults/[testresultId]/index"
				options={({ route, navigation }) => {
					const params = route.params as { classId: string; testresultId: string };
					return {
						headerShown: true,
						headerTitle: getClass(params.classId)?.testresults.find(
							(testresult) => testresult.id === params.testresultId
						)?.createdAt,
					};
				}}
			/>
			<Stack.Screen
				name="[classId]/testresults/[testresultId]/[task]/detail"
				options={({ route, navigation }) => {
					const params = route.params as {
						classId: string;
						testresultId: string;
						task: string;
					};
					const taskObject = getTaskObjectByTaskGroup(params.task);
					return {
						presentation: "modal",
						animation: "slide_from_bottom",
						header: () => (
							<View
								style={{
									backgroundColor: `rgba(${taskObject.color},1)`,
									flexDirection: "row",
									justifyContent: "space-between",
									alignContent: "center",
									paddingVertical: 20,
									paddingHorizontal: 20,
									paddingTop: 40,
								}}
							>
								<Title style={{ fontWeight: "bold" }}>
									{t(params.task)}
								</Title>
								<TouchableOpacity
									onPress={() => router.back()}
									style={{
										backgroundColor: "white",
										padding: 7.5,
										borderRadius: 7.5,
									}}
								>
									<MaterialIcons
										name="close"
										size={24}
										color="black"
									/>
								</TouchableOpacity>
							</View>
						),
						headerShown: true,
					};
				}}
			/>
			<Stack.Screen
				name="[classId]/longitudinal/index"
				options={({ route, navigation }) => {
					const params = route.params as { classId: string };
					return {
						headerShown: true,
						headerTitle: getClass(params.classId)?.name,
					};
				}}
			/>
			<Stack.Screen
				name="[classId]/longitudinal/[studentId]"
				options={({ route, navigation }) => {
					const params = route.params as { classId: string; studentId: string };
					const student = getClass(params.classId)?.students.find(
						(student) => student.id === params.studentId
					);
					return {
						headerShown: true,
						headerTitle: student?.firstName + " " + student?.lastName,
					};
				}}
			/>
			<Stack.Screen
				name="[classId]/testresults/[testresultId]/students/[studentId]"
				options={({ route, navigation }) => {
					const params = route.params as {
						classId: string;
						testresultId: string;
						studentId: string;
					};
					return {
						headerShown: true,
						headerTitle:
							getClass(params.classId)?.students.find(
								(student) => student.id === params.studentId
							)?.firstName +
							" " +
							getClass(params.classId)?.students.find(
								(student) => student.id === params.studentId
							)?.lastName,
					};
				}}
			/>
		</Stack>
	);
};

const styles = StyleSheet.create({});

export default ClassesLayout;
