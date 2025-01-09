import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

interface SafeScrollViewProps {
	children: React.ReactNode;
	header?: React.ReactNode;
	style?: Record<string, unknown>;
}

const SafeScrollView = (props: SafeScrollViewProps) => {
	return (
		<ScrollView style={props.style}>
			{props.header}
			<SafeAreaView>
				<View style={styles.container}>{props.children}</View>
			</SafeAreaView>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
});

export default SafeScrollView;
