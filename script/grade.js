/*
 * 성적 계산기
 * HTML, CSS, JavaScript 점수를 입력받아 총점, 평균,
 * 합격 여부와 등급을 계산합니다.
 */

const gradeCalculatorButton =
    document.querySelector("#gradeCalculatorButton");

const gradeCalculatorStatus =
    document.querySelector("#gradeCalculatorStatus");

const gradeAverage =
    document.querySelector("#gradeAverage");

const gradeLetter =
    document.querySelector("#gradeLetter");

function getLetterGrade(average) {
    if (average >= 90) {
        return "A";
    }

    if (average >= 80) {
        return "B";
    }

    if (average >= 70) {
        return "C";
    }

    if (average >= 60) {
        return "D";
    }

    return "F";
}

function startGradeCalculator() {
    var subjects = ["HTML", "CSS", "JavaScript"];
    var total = 0;

    for (var i = 0; i < subjects.length; i += 1) {
        var score;

        while (true) {
            var input = window.prompt(
                subjects[i] + " 점수를 입력하세요. (0~100)"
            );

            if (input === null) {
                gradeCalculatorStatus.textContent =
                    "CANCELED · READY TO RETRY";

                window.alert("성적 계산을 취소했습니다.");
                return;
            }

            score = Number(input.trim());

            if (
                input.trim() !== "" &&
                Number.isFinite(score) &&
                score >= 0 &&
                score <= 100
            ) {
                break;
            }

            window.alert(
                "0부터 100 사이의 숫자를 입력해 주세요."
            );
        }

        total += score;
    }

    var average = total / subjects.length;
    var roundedAverage =
        Math.round(average * 10) / 10;

    var result =
        average >= 60 ? "합격" : "불합격";

    var letterGrade = getLetterGrade(average);

    gradeAverage.textContent = roundedAverage;
    gradeLetter.textContent = letterGrade;

    gradeCalculatorStatus.textContent =
        result.toUpperCase() +
        " · TOTAL " +
        total +
        " / 300";

    window.alert(
        "총점: " + total + "점\n" +
        "평균: " + roundedAverage + "점\n" +
        "등급: " + letterGrade + "\n" +
        "결과: " + result + "입니다!"
    );
}

if (gradeCalculatorButton) {
    gradeCalculatorButton.addEventListener(
        "click",
        startGradeCalculator
    );
}
