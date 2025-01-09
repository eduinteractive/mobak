import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Image, Platform, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

const TabLayout = () => {
	const { t } = useTranslation();
	const config = {
		duration: 500,
		easing: Easing.bezier(0.5, 0.01, 0, 1),
	};
	const colorScheme = useColorScheme();

	const renderLabel = (focused: boolean, color: string, text: string) => {
		const y = useSharedValue(0);
		const height = useSharedValue(20);

		const style = useAnimatedStyle(() => {
			return {
				transform: [{ translateY: withTiming(y.value, config) }],
				height: withTiming(height.value, config),
			};
		});

		useEffect(() => {
			// Wenn der Tab fokussiert wird, animiere die Höhe auf 0 (Text kommt von unten)
			if (focused) {
				y.value = 0;
				height.value = 22.5;
			} else {
				// Wenn der Tab nicht fokussiert ist, animiere die Höhe auf 20 (Text geht nach unten)
				y.value = 30;
				height.value = 0;
			}
		}, [focused]);

		return <Animated.Text style={[{ color }, style]}>{text}</Animated.Text>;
	};

	return (
		<Tabs
			screenOptions={{
				tabBarLabelPosition: "below-icon",
				tabBarStyle: {
					height: Platform.OS === "ios" ? 80 : 70,
					paddingTop: 10,
					paddingBottom: 10,
				},
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: false,
				header: () => {
					return (
						<View style={styles.headerContainer}>
							<Image
								resizeMethod="resize"
								resizeMode="contain"
								style={{ height: 100, width: 100, marginRight: 20 }}
								source={require("@/assets/images/MOBAK_LOGO.jpg")}
							/>
							<Image
								resizeMethod="resize"
								resizeMode="contain"
								style={{ height: 100, width: 100 }}
								source={require("@/assets/images/BMCEU_LOGO.png")}
							/>
						</View>
					);
				},
			}}
		>
            <Tabs.Screen
                name="index"
                options={{ href: null }}
            />
			<Tabs.Screen
				name="(home)"
				options={{
					title: "Aufgaben",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "list-outline" : "list-sharp"}
							color={color}
						/>
					),
					tabBarLabel: ({ color, focused }) =>
						renderLabel(focused, color, t("navigation_dashboard")),
				}}
			/>
			<Tabs.Screen
				name="favorites"
				options={{
					title: "Favoriten",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "heart" : "heart-outline"}
							color={color}
						/>
					),
					tabBarLabel: ({ color, focused }) =>
						renderLabel(focused, color, t("navigation_favorite")),
				}}
			/>
			<Tabs.Screen
				name="(classes)"
				options={{
					title: "Klasse",
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? "school" : "school"}
							color={color}
						/>
					),
					tabBarLabel: ({ color, focused }) =>
						renderLabel(focused, color, t("navigation_classroom")),
				}}
			/>
		</Tabs>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		backgroundColor: "white",
		paddingTop: 20,
		paddingLeft: 20,
		height: Platform.OS === "ios" ? 140 : 100,
		flexDirection: "row",
	},
});

export default TabLayout;
