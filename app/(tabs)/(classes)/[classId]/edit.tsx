import ClassEdit from "@/components/features/classes/ClassEdit";
import { useClasses } from "@/hooks/useClasses";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const ClassEditScreen = () => {
    const { classId } = useLocalSearchParams();
    const { getClass } = useClasses();

    const currentClass = getClass(classId as string);

    if (currentClass) {
        return (
            <ClassEdit values={{
                id: currentClass.id,
                className: currentClass.name,
                classGrade: currentClass.grade,
            }} />
        )
    } else {
        return <View></View>;
    }
}

export default ClassEditScreen;