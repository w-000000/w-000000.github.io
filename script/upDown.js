/*
 * Up-Down 숫자 맞추기 게임
 * 1부터 50 사이의 무작위 숫자를 맞힐 때까지 반복합니다.
 */

const upDownGameButton =
    document.querySelector("#upDownGameButton");

const upDownGameStatus =
    document.querySelector("#upDownGameStatus");

const upDownBestScore =
    document.querySelector("#upDownBestScore");

const upDownLastScore =
    document.querySelector("#upDownLastScore");

const upDownPlayCount =
    document.querySelector("#upDownPlayCount");

const UP_DOWN_STATS_KEY = "upDownGameStats";

function loadUpDownStats() {
    const defaultStats = {
        best: null,
        last: null,
        plays: 0
    };

    try {
        const savedStats = JSON.parse(
            window.localStorage.getItem(
                UP_DOWN_STATS_KEY
            ) || "{}"
        );

        return {
            best:
                Number.isInteger(savedStats.best) &&
                savedStats.best > 0
                    ? savedStats.best
                    : null,

            last:
                Number.isInteger(savedStats.last) &&
                savedStats.last > 0
                    ? savedStats.last
                    : null,

            plays:
                Number.isInteger(savedStats.plays) &&
                savedStats.plays >= 0
                    ? savedStats.plays
                    : 0
        };
    } catch (error) {
        console.warn(
            "Up-Down 기록을 불러오지 못했습니다.",
            error
        );

        return defaultStats;
    }
}

function saveUpDownStats(stats) {
    try {
        window.localStorage.setItem(
            UP_DOWN_STATS_KEY,
            JSON.stringify(stats)
        );
    } catch (error) {
        console.warn(
            "Up-Down 기록을 저장하지 못했습니다.",
            error
        );
    }
}

function renderUpDownStats(stats) {
    if (upDownBestScore) {
        upDownBestScore.textContent =
            stats.best ?? "--";
    }

    if (upDownLastScore) {
        upDownLastScore.textContent =
            stats.last ?? "--";
    }

    if (upDownPlayCount) {
        upDownPlayCount.textContent =
            stats.plays;
    }
}

const upDownStats = loadUpDownStats();

renderUpDownStats(upDownStats);

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

        const isNewBest =
            upDownStats.best === null ||
            attemptCount < upDownStats.best;

        upDownStats.last = attemptCount;
        upDownStats.plays += 1;

        if (isNewBest) {
            upDownStats.best = attemptCount;
        }

        saveUpDownStats(upDownStats);
        renderUpDownStats(upDownStats);

        updateUpDownStatus(
            `CLEAR · ${attemptCount} ATTEMPT${
                attemptCount === 1 ? "" : "S"
            }${isNewBest ? " · NEW BEST" : ""}`
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
