import SafeScrollView from "@/components/common/SafeScrollView";
import { parseClassGrade } from "@/constants/ClassParser";
import { useClasses } from "@/hooks/useClasses";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
	Button,
	Dialog,
	MD3DarkTheme,
	MD3LightTheme,
	Modal,
	Portal,
	RadioButton,
	Text,
	TextInput,
	Title,
} from "react-native-paper";
import { Modal as RNModal } from "react-native";
import * as Device from "expo-device";

interface ClassEditProps {
	values?: {
		id: string;
		className: string;
		classGrade: string;
	};
}

const ClassEdit = (props: ClassEditProps) => {
	const { addClass, updateClass, removeClass } = useClasses();
	const { t } = useTranslation();
	const [className, setClassName] = useState<string>("");
	const [dialogVisible, setDialogVisible] = useState<boolean>(false);
	const [classGrade, setClassGrade] = useState<string>("");
	const [dialogClassGrade, setDialogClassGrade] = useState<string>("");
	const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);

	const handleSubmit = async () => {
		if (props.values) {
			await updateClass(props.values.id, {
				name: className,
				grade: classGrade,
			});
		} else {
			await addClass(className, classGrade);
		}
		router.back();
	};

	const handleClassDelete = async () => {
		if (props.values) {
			await removeClass(props.values.id);
		}
		router.replace("/(tabs)/(classes)");
	};

	useEffect(() => {
		if (props.values) {
			setClassName(props.values.className);
			setClassGrade(props.values.classGrade);
		} else {
			setClassName("");
			setClassGrade("");
		}
	}, [props.values]);

	return (
		<SafeScrollView
			header={
				<View style={styles.headerWrapper}>
					<Title style={styles.headerTitle}>
						{props.values ? props.values.className : t("classroom_new_class")}
					</Title>
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
				<Modal visible={dialogVisible}>
					<RNModal
						visible={dialogVisible}
						transparent={true}
					>
						<Dialog
							visible={dialogVisible}
							onDismiss={() => setDialogVisible(false)}
						>
							<Dialog.Title>{t("classroom_grade")}</Dialog.Title>
							<Dialog.Content>
								<RadioButton.Group
									onValueChange={(newValue) =>
										setDialogClassGrade(newValue)
									}
									value={dialogClassGrade}
								>
									<View style={styles.radioContainer}>
										<RadioButton.Android value="first" />
										<Text>
											{t("classroom_grade_first")}
										</Text>
									</View>
									<View style={styles.radioContainer}>
										<RadioButton.Android value="second" />
										<Text>
											{t("classroom_grade_second")}
										</Text>
									</View>
									<View style={styles.radioContainer}>
										<RadioButton.Android value="third" />
										<Text>
											{t("classroom_grade_third")}
										</Text>
									</View>
									<View style={styles.radioContainer}>
										<RadioButton.Android value="fourth" />
										<Text>
											{t("classroom_grade_fourth")}
										</Text>
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
										setClassGrade(dialogClassGrade);
										setDialogClassGrade("");
									}}
								>
									{t("general_ok")}
								</Button>
							</Dialog.Actions>
						</Dialog>
					</RNModal>
				</Modal>
			</Portal>

			<TextInput
				style={styles.textInput}
				left={
					<TextInput.Icon
						icon="text-account"
						style={styles.textInputIcon}
					/>
				}
				label={"* " + t("classroom_textfield_class_name")}
				theme={{ colors: { onSurfaceVariant: "rgba(181,181,181,1)" } }}
				value={className}
				onChangeText={setClassName}
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
				label={"* " + t("classroom_textfield_grade")}
				theme={{ colors: { onSurfaceVariant: "rgba(181,181,181,1)" } }}
				value={parseClassGrade(classGrade)}
				onPress={() => setDialogVisible(true)}
			/>
			<Button
				buttonColor="rgba(150,156,180,1)"
				mode="contained"
				style={styles.submitButton}
				onPress={handleSubmit}
			>
				{props.values ? t("generic_save_changes") : t("classroom_add_class")}
			</Button>
			{props.values && (
				<>
					<Portal>
						<Modal visible={deleteDialogVisible}>
							<RNModal
								visible={deleteDialogVisible}
								transparent={true}
							>
								<Dialog
									visible={deleteDialogVisible}
									onDismiss={() => setDeleteDialogVisible(false)}
								>
									<Dialog.Title>
										{t("classroom_dialog_delete_title")}
									</Dialog.Title>
									<Dialog.Content>
										<Text variant="bodyMedium">
											{t(
												"classroom_dialog_delete_description"
											)}
										</Text>
									</Dialog.Content>
									<Dialog.Actions>
										<Button
											onPress={() =>
												setDeleteDialogVisible(
													false
												)
											}
										>
											{t("general_cancel")}
										</Button>
										<Button onPress={handleClassDelete}>
											{t("general_delete")}
										</Button>
									</Dialog.Actions>
								</Dialog>
							</RNModal>
						</Modal>
					</Portal>
					<TouchableOpacity
						style={styles.studentDeleteWrapper}
						onPress={() => setDeleteDialogVisible(true)}
					>
						<Text style={styles.studentDeleteText}>
							{t("classroom_delete_class")}
						</Text>
					</TouchableOpacity>
				</>
			)}
		</SafeScrollView>
	);
};

const styles = StyleSheet.create({
	headerWrapper: {
		backgroundColor: "rgb(255, 255, 255)",
		height: Device.deviceType === Device.DeviceType.PHONE ? 110 : 100,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		paddingTop: Device.deviceType === Device.DeviceType.PHONE ? 60 : 40,
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

export default ClassEdit;
