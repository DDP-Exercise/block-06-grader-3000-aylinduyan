export class GradeModel {
    constructor() {
        this.exercises = [0, 0, 0, 0, 0, 0, 0, 0];
        this.exam = 0;
        this.attendance = 100;
    }
    setExercisePoints(index, points) {
        this.exercises[index] = points;
        this.updateGrades();
    }
    setExamPoints(points) {
        this.exam = points;
        this.updateGrades();
    }
    setAttendance(percent) {
        this.attendance = percent;
        this.updateGrades();
    }
    isPositive(points) {
        return points > 50;
    }
    getDroppedExerciseIndex() {
        let lowestIndex = 0;
        for (let i = 1; i < this.exercises.length; i++) {
            if (this.exercises[i] < this.exercises[lowestIndex]) {
                lowestIndex = i;
            }
        }
        return lowestIndex;
    }
    calculateExerciseGrade() {
        let droppedIndex = this.getDroppedExerciseIndex();
        let sum = 0;
        for (let i = 0; i < this.exercises.length; i++) {
            if (i !== droppedIndex) {
                sum = sum + this.exercises[i];
            }
        }
        return sum / 700 * 100;
    }
    countPositiveExercises() {
        let counter = 0;
        for (let points of this.exercises) {
            if (this.isPositive(points)) {
                counter++;
            }
        }
        return counter;
    }
    calculateFinalGrade() {
        let exerciseGrade = this.calculateExerciseGrade();
        let finalPercent = exerciseGrade * 0.6 + this.exam * 0.4;
        let exercisePositive = exerciseGrade > 50;
        let examPositive = this.exam > 50;
        let enoughPositiveExercises = this.countPositiveExercises() >= 6;
        let enoughAttendance = this.attendance >= 80;
        let isPositive = exercisePositive &&
            examPositive &&
            enoughPositiveExercises &&
            enoughAttendance;
        let gradeText = this.getGradeText(finalPercent, isPositive);
        let reasons = this.getReasons(
            exercisePositive,
            examPositive,
            enoughPositiveExercises,
            enoughAttendance
        );
        return {
            exerciseGrade: exerciseGrade,
            examGrade: this.exam,
            finalPercent: finalPercent,
            gradeText: gradeText,
            isPositive: isPositive,
            droppedIndex: this.getDroppedExerciseIndex(),
            reasons: reasons
        };
    }
    getGradeText(percent, isPositive) {
        if (!isPositive) {
            return "Nicht Genügend";
        }
        if (percent <= 61) {
            return "Genügend";
        }
        if (percent <= 74) {
            return "Befriedigend";
        }
        if (percent <= 86) {
            return "Gut";
        }
        return "Sehr gut";
    }
    getReasons(exercisePositive, examPositive, enoughPositiveExercises, enoughAttendance) {
        let reasons = [];
        if (!exercisePositive) {
            reasons.push("Die Übungsnote ist negativ.");
        }
        if (!examPositive) {
            reasons.push("Die Klausur ist negativ.");
        }
        if (!enoughPositiveExercises) {
            reasons.push("Weniger als 75% der Übungen sind positiv.");
        }
        if (!enoughAttendance) {
            reasons.push("Die Anwesenheit ist unter 80%.");
        }
        if (reasons.length === 0) {
            reasons.push("Alles positiv.");
        }
        return reasons;
    }
    updateGrades() {
        let result = this.calculateFinalGrade();
        const gradeChangedEvent = new CustomEvent("grade:changed", {
            detail: result
        });
        document.dispatchEvent(gradeChangedEvent);
    }
}