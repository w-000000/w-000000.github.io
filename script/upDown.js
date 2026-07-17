/*
 * Up-Down 숫자 맞추기 게임
 * 1부터 50 사이의 무작위 숫자를 맞힐 때까지 반복합니다.
 */

const upDownGameButton =
    document.querySelector("#upDownGameButton");

const upDownGameStatus =
    document.querySelector("#upDownGameStatus");

function updateUpDownStatus(message) {
    if (upDownGameStatus) {
        upDownGameStatus.textContent = message;
    }
}

function startUpDownGame() {
    const computerNum =
        Math.floor(Math.random() * 50) + 1;

    let attemptCount = 0;

    updateUpDownStatus("PLAYING · FIND THE HIDDEN NUMBER");

    while (true) {
        const answer = window.prompt(
            "1부터 50 사이의 숫자를 입력하세요."
        );

        if (answer === null) {
            updateUpDownStatus("STOPPED · READY TO RETRY");
            window.alert("게임을 종료합니다.");
            return;
        }

        const userNum = Number(answer.trim());

        if (
            !Number.isInteger(userNum) ||
            userNum < 1 ||
            userNum > 50
        ) {
            window.alert(
                "1부터 50 사이의 정수를 입력해 주세요."
            );
            continue;
        }

        attemptCount += 1;

        if (userNum > computerNum) {
            window.alert("Down!");
            continue;
        }

        if (userNum < computerNum) {
            window.alert("Up!");
            continue;
        }

        window.alert(
            `축하합니다! ${attemptCount}번 만에 맞추셨습니다.`
        );

        updateUpDownStatus(
            `CLEAR · ${attemptCount} ATTEMPT${
                attemptCount === 1 ? "" : "S"
            }`
        );

        return;
    }
}

if (upDownGameButton) {
    upDownGameButton.addEventListener(
        "click",
        startUpDownGame
    );
}
