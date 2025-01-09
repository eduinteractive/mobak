import TasksOverview from "@/constants/TasksOverview";
import { useFavorites } from "@/hooks/useFavorites";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

const HomeLayout = () => {
	const { t } = useTranslation();
	const { favorites, addFavorite, removeFavorite } = useFavorites();

	return (
		<Stack
            initialRouteName="index"
			screenOptions={{
				headerStyle: {
					backgroundColor: "#fff",
				},
				headerTintColor: "#fff",
				headerTitleStyle: {
					fontWeight: "bold",
				},
				header: (props) => {
					return (
						<View
							style={{
								...styles.headerContainer,
								backgroundColor: props.route.name.includes(
									"[taskGroup]"
								)
									? `rgba(${
											TasksOverview.OBJECT_MOVE.find(
												(item) =>
													item.key ===
													(
														props
															.route
															.params as {
															taskGroup: string;
														}
													).taskGroup
											)?.color ||
											TasksOverview.SELF_MOVE.find(
												(item) =>
													item.key ===
													(
														props
															.route
															.params as {
															taskGroup: string;
														}
													).taskGroup
											)?.color ||
											"255,255,255"
									  },1)`
									: "white",
							}}
						>
							{props.navigation.canGoBack() && props.route.name !== "index" && (
								<MaterialIcons
									name="keyboard-double-arrow-left"
									size={32}
									color="black"
									onPress={() => props.navigation.goBack()}
								/>
							)}
							{!props.route.name.includes("[taskGroup]") &&
								!props.route.name.includes("d_tasks") && (
									<>
										<Image
											resizeMethod="resize"
											resizeMode="contain"
											style={{
												height: 100,
												width: 100,
												marginRight: 20,
												marginLeft: 20,
											}}
											source={require("@/assets/images/MOBAK_LOGO.jpg")}
										/>
										<Image
											resizeMethod="resize"
											resizeMode="contain"
											style={{
												height: 100,
												width: 100,
											}}
											source={require("@/assets/images/BMCEU_LOGO.png")}
										/>
									</>
								)}
							{props.route.name.includes("[taskGroup]") &&
								(props.route.name.includes("[task]") ? (
									<View style={styles.headerFull}>
										<Text style={styles.headerTitle}>
											{t(
												(
													props.route
														.params as {
														task: string;
													}
												).task + ".TITLE"
											)}
										</Text>
										<TouchableOpacity
											style={styles.headerIconWrapper}
											onPress={() =>
												favorites.find(
													(fav) =>
														fav ===
														(
															props
																.route
																.params as {
																task: string;
															}
														).task
												)
													? removeFavorite(
															(
																props
																	.route
																	.params as {
																	task: string;
																}
															)
																.task
													  )
													: addFavorite(
															(
																props
																	.route
																	.params as {
																	task: string;
																}
															)
																.task
													  )
											}
										>
											<MaterialIcons
												name={
													favorites.find(
														(fav) =>
															fav ===
															(
																props
																	.route
																	.params as {
																	task: string;
																}
															)
																.task
													)
														? "favorite"
														: "favorite-outline"
												}
												size={28}
												color="black"
												style={
													styles.headerIcon
												}
											/>
										</TouchableOpacity>
									</View>
								) : (
									<Text style={styles.headerTitle}>
										{t(
											(
												props.route.params as {
													taskGroup: string;
												}
											).taskGroup
										)}
									</Text>
								))}
							{props.route.name === "d_tasks" && (
								<Text style={styles.headerTitle}>
									{t("dashboard_test_title")}
								</Text>
							)}
							{props.route.name.includes("d_tasks/[task]") && (
								<Text style={styles.headerTitle}>
									{t(
										TasksOverview.OBJECT_MOVE.find((t) =>
											(
												props.route.params as {
													task: string;
												}
											).task.includes(t.d_key)
										)?.key ||
											TasksOverview.SELF_MOVE.find(
												(t) =>
													(
														props
															.route
															.params as {
															task: string;
														}
													).task.includes(
														t.d_key
													)
											)?.key ||
                                            ""
									)}
								</Text>
							)}
						</View>
					);
				},
			}}
		>
			<Stack.Screen name="d_tasks" />
		</Stack>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		backgroundColor: "white",
		paddingTop: Platform.OS === "ios" ? 20 : 0,
		paddingLeft: 20,
		height: Platform.OS === "ios" ? 90 : 60,
		flexDirection: "row",
		alignItems: "center",
	},
	headerFull: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerIcon: {},
	headerIconWrapper: {
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 20,
		backgroundColor: "white",
		width: 40,
		height: 40,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 2.5,
		marginLeft: 20,
	},
});

export default HomeLayout;
