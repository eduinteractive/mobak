import i18next from "i18next";

export const parseClassGrade = (grade: string) => {

    switch (grade) {
        case "first":
            return i18next.t("classroom_grade_first");
        case "second":
            return i18next.t("classroom_grade_second");
        case "third":
            return i18next.t("classroom_grade_third");
        case "fourth":
            return i18next.t("classroom_grade_fourth");
        default:
            return "";
    }
}

export const parseStudentSex = (sex: number) => {
    switch (sex) {
        case 0:
            return i18next.t("student_gender_male");
        case 1:
            return i18next.t("student_gender_female");
        case 2:
            return i18next.t("student_gender_other");
        default:
            return "";
    }
}

export const parseStudentSexIcon = (sex: number) => {
    switch (sex) {
        case 0:
            return "male"
        case 1:
            return "female"
        case 2:
            return "transgender"
        default:
            return "star"
    }
}