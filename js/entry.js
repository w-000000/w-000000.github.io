/*
 * home.html에서 실행되는 로켓 입장 전환
 * 브라우저 기본 API만 사용합니다.
 */

const enterButton =
    document.querySelector("#enterButton");

const buttonLabel =
    document.querySelector(".entry-button-label");

const entrySequence =
    document.querySelector("#entrySequence");

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

let isLaunching = false;

function resetEntryScreen() {
    isLaunching = false;
    document.body.classList.remove("is-launching");
    enterButton.disabled = false;
    buttonLabel.textContent =
        "임창우님의 공간으로 입장";
    entrySequence.textContent =
        "버튼 클릭 또는 키보드의 아무 키나 눌러 입장하세요.";
}

function launchPortfolio() {
    if (isLaunching) {
        return;
    }

    isLaunching = true;
    enterButton.disabled = true;
    buttonLabel.textContent = "로켓 발사 중";
    entrySequence.textContent =
        "IGNITION · LIFTOFF · ENTERING CW/26";
    document.body.classList.add("is-launching");

    window.setTimeout(
        () => {
            window.location.replace("index.html");
        },
        reducedMotion ? 120 : 1580
    );
}

enterButton.addEventListener(
    "click",
    launchPortfolio
);

window.addEventListener(
    "keydown",
    (event) => {
        if (event.repeat) {
            return;
        }

        launchPortfolio();
    }
);

window.addEventListener(
    "pageshow",
    resetEntryScreen
);
