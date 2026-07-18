const themeToggleButton =
    document.querySelector(
        "#themeToggleButton"
    );

const savedTheme =
    localStorage.getItem(
        "portalTheme"
    );

function applyTheme(theme) {
    const isDark =
        theme === "dark";

    document.documentElement.classList.toggle(
        "dark-mode",
        isDark
    );

    if (themeToggleButton) {
        themeToggleButton.textContent =
            isDark
                ? "☀️ 라이트 모드"
                : "🌙 다크 모드";

        themeToggleButton.setAttribute(
            "aria-label",
            isDark
                ? "라이트 모드로 전환"
                : "다크 모드로 전환"
        );
    }
}

/*
저장된 테마를 모든 페이지에 적용
*/
applyTheme(
    savedTheme === "dark"
        ? "dark"
        : "light"
);

/*
버튼은 index.html에만 존재하므로
버튼이 있을 때만 클릭 이벤트 등록
*/
if (themeToggleButton) {
    themeToggleButton.addEventListener(
        "click",
        () => {
            const isDark =
                document.documentElement
                    .classList
                    .contains("dark-mode");

            const nextTheme =
                isDark
                    ? "light"
                    : "dark";

            localStorage.setItem(
                "portalTheme",
                nextTheme
            );

            applyTheme(nextTheme);
        }
    );
}
