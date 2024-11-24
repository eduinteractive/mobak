import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { Card, Text } from "react-native-paper";

interface AccordionProps {
	buttonColor?: string;
	title: string;
	children: React.ReactNode;
}

const Accordion = (props: AccordionProps) => {
	const [expanded, setExpanded] = useState(false);

	return (
		<View style={styles.cardWrapper}>
			<TouchableNativeFeedback onPress={() => setExpanded(!expanded)}>
				<Card
					style={styles.card}
					mode="contained"
				>
					<View style={styles.cardHeader}>
						<Text style={styles.cardTitle}>{props.title}</Text>
						<View
							style={{
								...styles.roundButton,
								backgroundColor: props.buttonColor
									? `rgba(${props.buttonColor},1)`
									: `rgba(244, 244, 244, 1)`,
							}}
						>
							<MaterialIcons
								name={
									!expanded
										? "keyboard-double-arrow-down"
										: "keyboard-double-arrow-up"
								}
								size={24}
								color="black"
							/>
						</View>
					</View>
					{expanded && props.children && (
						<View style={styles.cardContent}>{props.children}</View>
					)}
				</Card>
			</TouchableNativeFeedback>
		</View>
	);
};

const styles = StyleSheet.create({
	cardWrapper: {
		borderRadius: 7.5,
		overflow: "hidden",
	},
	card: {
		position: "relative",
		backgroundColor: "rgb(255, 255, 255)",
		padding: 10,
	},
	cardTitle: {
		fontSize: 16,
	},
	cardHeader: {
		height: 50,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	cardContent: {
		marginTop: 6,
        paddingBottom: 10,
	},
	roundButton: {
		borderRadius: 10, // Kreisförmiger Button
		justifyContent: "center",
		alignItems: "center",
		zIndex: 4,
		width: 37.5,
		height: 37.5,
	},
});

export default Accordion;
