import ClassEditStudent from "@/components/features/classes/ClassEditStudent";
import { useClasses } from "@/hooks/useClasses";
import { useLocalSearchParams } from "expo-router";

const ClassStudentEditScreen = () => {
	const { classId, studentId } = useLocalSearchParams();
	const { getClass } = useClasses();

	const currentClass = getClass(classId as string);

	if (currentClass) {
		const student = currentClass.students.find((student) => student.id === studentId);
		if (student) {
			return (
				<ClassEditStudent
					values={{
						id: student.id,
						firstName: student.firstName,
						lastName: student.lastName,
						sex: student.sex,
					}}
				/>
			);
		}
	}

	return null;
};

export default ClassStudentEditScreen;
