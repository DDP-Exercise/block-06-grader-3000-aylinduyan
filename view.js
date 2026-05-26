export class GradeView {
    constructor() {
        this.exerciseContainer = document.getElementById("exercise-container");
        this.examContainer = document.getElementById("exam-container");
        this.attendanceContainer = document.getElementById("attendance-container");
        this.exerciseResult = document.getElementById("exercise-result");
        this.examResult = document.getElementById("exam-result");
        this.finalResult = document.getElementById("final-result");
        this.gradeResult = document.getElementById("grade-result");
        this.reasonResult = document.getElementById("reason-result");
    }
    createPointsInput(labelText, type, index) {
        let wrapper = document.createElement("div");
        wrapper.classList.add("input-row");
        let label = document.createElement("label");
        label.textContent = labelText;
        let input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = 100;
        input.value = 0;
        input.dataset.type = type;
        if (index !== undefined) {
            input.dataset.index = index;
            wrapper.id = "exercise-" + index;
        }
        wrapper.append(label, input);
        return wrapper;
    }
    createAttendanceInput() {
        let wrapper = document.createElement("div");
        wrapper.classList.add("input-row");
        let label = document.createElement("label");
        label.textContent = "Anwesenheit in %";
        let input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = 100;
        input.value = 100;
        input.dataset.type = "attendance";
        wrapper.append(label, input);
        return wrapper;
    }
    renderInputs() {
        for (let i = 0; i < 8; i++) {
            let input = this.createPointsInput("Übung " + (i + 1), "exercise", i);
            this.exerciseContainer.append(input);
        }
        let examInput = this.createPointsInput("Klausur", "exam");
        this.examContainer.append(examInput);
        let attendanceInput = this.createAttendanceInput();
        this.attendanceContainer.append(attendanceInput);
    }
    highlightDroppedExercise(index) {
        let allExercises = document.querySelectorAll("#exercise-container .input-row");
        for (let exercise of allExercises) {
            exercise.classList.remove("dropped");
        }
        let droppedExercise = document.getElementById("exercise-" + index);
        if (droppedExercise) {
            droppedExercise.classList.add("dropped");
        }
    }
    highlightNegative(element, isNegative) {
        if (isNegative) {
            element.classList.add("negative");
            element.classList.remove("positive");
        } else {
            element.classList.remove("negative");
            element.classList.add("positive");
        }
    }
    renderResult(result) {
        this.exerciseResult.textContent = "Übungsnote: " + result.exerciseGrade.toFixed(2) + "%";
        this.examResult.textContent = "Klausurnote: " + result.examGrade.toFixed(2) + "%";
        this.finalResult.textContent = "Gesamtnote: " + result.finalPercent.toFixed(2) + "%";
        this.gradeResult.textContent = "Note: " + result.gradeText;
        this.reasonResult.textContent = result.reasons.join(" ");
        this.highlightDroppedExercise(result.droppedIndex);
        this.highlightNegative(this.exerciseResult, result.exerciseGrade <= 50);
        this.highlightNegative(this.examResult, result.examGrade <= 50);
        this.highlightNegative(this.gradeResult, !result.isPositive);
    }
}