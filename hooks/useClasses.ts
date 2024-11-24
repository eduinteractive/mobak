import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import uuid from "react-native-uuid";

const APP_CLASSES_KEY = "app_classes";

export interface ClassStudent {
    id: string;
    lastName: string;
    firstName: string
    sex: number;
}

export interface ClassResults {
    id: string;
    createdAt: string;
    status: "OPEN" | "CLOSED";
    results: {
        studentId: string;
        balance: number | null;
        roll: number | null;
        jump: number | null;
        walk: number | null;
        bouncing: number | null;
        catch: number | null
        throw: number | null;
        dribble: number | null;
    }[]
}

const classesState = atom({
    key: "classes",
    default: [] as {
        id: string;
        name: string;
        grade: string;
        students: ClassStudent[];
        testresults: ClassResults[];
    }[]
})

export const useClasses = () => {
    const [classes, setClasses] = useRecoilState(classesState);

    useEffect(() => {
        const loadClasses = async () => {
            const result = await AsyncStorage.getItem(APP_CLASSES_KEY);
            if (result) {
                setClasses(JSON.parse(result));
            } else {
                await AsyncStorage.setItem(APP_CLASSES_KEY, JSON.stringify([]));
                setClasses([]);
            }
        }

        loadClasses();

    }, [])

    const addClass = async (name: string, grade: string) => {
        const id = uuid.v4().toString();
        setClasses([...classes, {
            id,
            name,
            grade,
            students: [],
            testresults: []
        }]);
        await AsyncStorage.setItem(APP_CLASSES_KEY, JSON.stringify([...classes, {
            id,
            name,
            grade,
            students: [],
            testresults: []
        }]));
    }

    const removeClass = async (id: string) => {
        const newClasses = classes.filter(c => c.id !== id);
        setClasses(newClasses);
        await AsyncStorage.setItem(APP_CLASSES_KEY, JSON.stringify(newClasses));
    }

    const updateClass = async (id: string, payload: {
        name?: string;
        grade?: string;
        students?: ClassStudent[];
        testresults?: ClassResults[];
    }) => {
        const newClasses = classes.map(c => {
            if (c.id === id) {
                return {
                    ...c,
                    ...payload
                }
            }
            return c;
        });
        setClasses(newClasses);
        await AsyncStorage.setItem(APP_CLASSES_KEY, JSON.stringify(newClasses));
    }

    const getClass = (id: string) => {
        return classes.find(c => c.id === id);
    }

    return {
        classes,
        addClass,
        getClass,
        removeClass,
        updateClass
    }
}