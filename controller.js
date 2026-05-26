import { GradeModel } from "./model.js";
import { GradeView } from "./view.js";
const model = new GradeModel();
const view = new GradeView();
view.renderInputs();
document.getElementById("app").addEventListener("input", function(event) {
    let input = event.target;
    if (input.tagName !== "INPUT") {
        return;
    }
    let value = Number(input.value);
    if (value < 0) {
        value = 0;
        input.value = 0;
    }
    if (value > 100) {
        value = 100;
        input.value = 100;
    }
    if (input.dataset.type === "exercise") {
        let index = Number(input.dataset.index);
        model.setExercisePoints(index, value);
    }
    if (input.dataset.type === "exam") {
        model.setExamPoints(value);
    }
    if (input.dataset.type === "attendance") {
        model.setAttendance(value);
    }
});
document.addEventListener("grade:changed", function(event) {
    view.renderResult(event.detail);
});
model.updateGrades();