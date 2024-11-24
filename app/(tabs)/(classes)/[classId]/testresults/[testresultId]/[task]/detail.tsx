import DiagnoseTask from "@/components/features/tasks/DiagnoseTask";
import { getTaskObjectByTaskGroup } from "@/constants/TasksOverview";
import { useClasses } from "@/hooks/useClasses";
import { useLocalSearchParams } from "expo-router";

const ClassTestresultsTasksDetail = () => {
	const { getClass } = useClasses();
	const { task, classId } = useLocalSearchParams();

	const currentClass = getClass(classId as string);

	const taskObject = getTaskObjectByTaskGroup(task as string);

	let taskKey = taskObject.d_key;

	if (currentClass?.grade === "first" || currentClass?.grade === "second") {
		taskKey = taskKey + "_1_2";
	} else {
		taskKey = taskKey + "_3_4";
	}

    return <DiagnoseTask task={taskKey as string} />
}

export default ClassTestresultsTasksDetail;