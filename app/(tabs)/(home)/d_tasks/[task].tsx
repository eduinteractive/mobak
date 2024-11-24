import DiagnoseTask from "@/components/features/tasks/DiagnoseTask";
import { useLocalSearchParams } from "expo-router";

const DiagnoseTaskScreen = () => {
	const { task } = useLocalSearchParams();

	return (
        <DiagnoseTask task={task as string} />
	);
};


export default DiagnoseTaskScreen;
