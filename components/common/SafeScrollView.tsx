import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

interface SafeScrollViewProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    style?: Record<string, unknown>;
}

const SafeScrollView = (props: SafeScrollViewProps) => {
    return (
        <ScrollView style={props.style}>
            {props.header}
            <SafeAreaView style={styles.container}>
                {props.children}
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    }
})

export default SafeScrollView;