import SafeScrollView from "@/components/common/SafeScrollView";
import { parseStudentSex } from "@/constants/ClassParser";
import { useClasses } from "@/hooks/useClasses";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Portal, RadioButton, Text, TextInput, Title } from "react-native-paper";
import uuid from "react-native-uuid";

interface ClassEditStudentProps {
	values?: {
		id: string;
		firstName: string;
		lastName: string;
		sex: number;
	};
}

const ClassEditStudent = (props: ClassEditStudentProps) => {
	const { classId } = useLocalSearchParams();
	const { updateClass, getClass } = useClasses();
	const { t } = useTranslation();
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [sex, setSex] = useState<number>();

	const [dialogSex, setDialogSex] = useState<string>("");
	const [dialogVisible, setDialogVisible] = useState<boolean>(false);
	const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);

	const handleSubmit = async () => {
		const currentClass = getClass(classId as string);
		if (!firstName || !lastName || sex === undefined) {
			return;
		}
		if (props.values) {
			await updateClass(currentClass!.id, {
				students: currentClass!.students.map((student) => {
					if (props.values && student.id === props.values.id) {
						return {
							id: props.values!.id,
							firstName,
							lastName,
							sex,
						};
					}
					return student;
				}),
			});
		} else {
			const id = uuid.v4().toString();
			await updateClass(currentClass!.id, {
				students: [
					...currentClass!.students,
					{
						id,
						firstName,
						lastName,
						sex,
					},
				],
			});
		}
		router.back();
	};

    const handleStudentDelete = async () => {
        if (props.values) {
            const currentClass = getClass(classId as string);
            await updateClass(currentClass!.id, {
                students: currentClass!.students.filter((student) => student.id !== props.values!.id),
                testresults: currentClass!.testresults.map((testresult) => {
                    return {
                        ...testresult,
                        results: testresult.results.filter((result) => result.studentId !== props.values!.id),
                    };
                }),
            });
            router.back();
        }
    }

	useEffect(() => {
		if (props.values) {
			setFirstName(props.values.firstName);
			setLastName(props.values.lastName);
			setSex(props.values.sex);
		} else {
			setFirstName("");
			setLastName("");
			setSex(undefined);
		}
	}, [props.values]);

	return (
		<SafeScrollView
			header={
				<View style={styles.headerWrapper}>
					<Title style={styles.headerTitle}>{t("student_add")}</Title>
					<TouchableOpacity
						style={styles.headerIcon}
						onPress={() => router.back()}
					>
						<MaterialIcons
							name="close"
							size={18}
							color="black"
						/>
					</TouchableOpacity>
				</View>
			}
		>
			<Portal>
				<Dialog
					visible={dialogVisible}
					onDismiss={() => setDialogVisible(false)}
				>
					<Dialog.Title>{t("classroom_grade")}</Dialog.Title>
					<Dialog.Content>
						<RadioButton.Group
							onValueChange={(newValue) => setDialogSex(newValue)}
							value={dialogSex}
						>
							<View style={styles.radioContainer}>
								<RadioButton value="0" />
								<Text>{t("student_gender_male")}</Text>
							</View>
							<View style={styles.radioContainer}>
								<RadioButton value="1" />
								<Text>{t("student_gender_female")}</Text>
							</View>
							<View style={styles.radioContainer}>
								<RadioButton value="2" />
								<Text>{t("student_gender_other")}</Text>
							</View>
						</RadioButton.Group>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setDialogVisible(false)}>
							{t("general_cancel")}
						</Button>
						<Button
							onPress={() => {
								setDialogVisible(false);
								setSex(
									Number.parseInt(dialogSex) as number | undefined
								);
								setDialogSex("");
							}}
						>
							{t("general_ok")}
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
			<TextInput
				style={styles.textInput}
				left={
					<TextInput.Icon
						icon="text-account"
						style={styles.textInputIcon}
					/>
				}
				label={"* " + t("student_textfield_name")}
				theme={{ colors: { onSurfaceVariant: "rgba(181,181,181,1)" } }}
				value={firstName}
				onChangeText={setFirstName}
			/>
			<TextInput
				style={styles.textInput}
				left={
					<TextInput.Icon
						icon="text-account"
						style={styles.textInputIcon}
					/>
				}
				label={"* " + t("student_textfield_surname")}
				theme={{ colors: { onSurfaceVariant: "rgba(181,181,181,1)" } }}
				value={lastName}
				onChangeText={setLastName}
			/>
			<TextInput
				style={styles.textInput}
				left={
					<TextInput.Icon
						icon="text-account"
						style={styles.textInputIcon}
					/>
				}
				right={<TextInput.Icon icon="chevron-double-right" />}
				label={"* " + t("student_textfield_gender")}
				theme={{ colors: { onSurfaceVariant: "rgba(181,181,181,1)" } }}
				value={parseStudentSex(sex as number)}
				onPress={() => setDialogVisible(true)}
			/>
			<Button
				buttonColor="rgba(150,156,180,1)"
				mode="contained"
				style={styles.submitButton}
				onPress={handleSubmit}
			>
				{props.values ? t("generic_save_changes") : t("student_add")}
			</Button>
			{props.values && (
				<>
					<Portal>
						<Dialog
							visible={deleteDialogVisible}
							onDismiss={() => setDeleteDialogVisible(false)}
						>
							<Dialog.Title>
								{t("student_dialog_delete_title")}
							</Dialog.Title>
							<Dialog.Content>
								<Text variant="bodyMedium">
									{t(
										"student_dialog_delete_description"
									)}
								</Text>
							</Dialog.Content>
							<Dialog.Actions>
								<Button onPress={() => setDeleteDialogVisible(false)}>
									{t("general_cancel")}
								</Button>
								<Button onPress={handleStudentDelete}>
									{t("general_delete")}
								</Button>
							</Dialog.Actions>
						</Dialog>
					</Portal>
					<TouchableOpacity style={styles.studentDeleteWrapper} onPress={() => setDeleteDialogVisible(true)}>
						<Text style={styles.studentDeleteText}>{t("student_delete")}</Text>
					</TouchableOpacity>
				</>
			)}
		</SafeScrollView>
	);
};

const styles = StyleSheet.create({
	headerWrapper: {
		backgroundColor: "rgb(255, 255, 255)",
		height: 100,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		paddingTop: 40,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
	headerIcon: {
		backgroundColor: "rgba(221,242,177,1)",
		width: 35,
		height: 35,
		borderRadius: 10, // Kreisförmiger Button
		justifyContent: "center",
		alignItems: "center",
		zIndex: 4,
	},
	radioContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
		gap: 10,
	},
	textInput: {
		fontSize: 14,
		backgroundColor: "rgba(255,255,255,1)",
		marginBottom: 20,
	},
	textInputIcon: {
		backgroundColor: "rgba(235,237,241,1)",
		width: 35,
		height: 35,
		borderRadius: 7.5, // Kreisförmiger Button
		justifyContent: "center",
		alignItems: "center",
		zIndex: 4,
	},
	submitButton: {
		borderRadius: 7.5,
	},
	studentDeleteWrapper: {
		marginTop: 40,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	studentDeleteText: {
		fontSize: 16,
		color: "grey",
		textDecorationLine: "underline",
	},
});

export default ClassEditStudent;
