/*
 * Showcase interactions
 * 브라우저 기본 API만 사용하며 외부 라이브러리에 의존하지 않습니다.
 */

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const revealElements = [
    ...document.querySelectorAll("[data-reveal]")
];

const isShowcaseContentPage =
    document.body.classList.contains(
        "showcase-portfolio"
    ) ||
    document.body.classList.contains(
        "showcase-inner"
    );

if (isShowcaseContentPage) {
    document
        .querySelectorAll(
            "main > section, " +
            "main > .container > section"
        )
        .forEach((section) => {
            section.dataset.reveal = "";
            revealElements.push(section);
        });
}

document.documentElement.classList.add(
    "showcase-ready"
);

if (reducedMotion) {
    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add(
                    "is-visible"
                );

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}

/* 카드 위에서 마우스를 따라오는 은은한 조명 */
const spotlightElements = document.querySelectorAll(
    "[data-spotlight], .showcase-portfolio .project-card"
);

spotlightElements.forEach((element) => {
    element.addEventListener(
        "pointermove",
        (event) => {
            const bounds =
                element.getBoundingClientRect();

            element.style.setProperty(
                "--spot-x",
                `${event.clientX - bounds.left}px`
            );

            element.style.setProperty(
                "--spot-y",
                `${event.clientY - bounds.top}px`
            );
        }
    );
});

/* Cloudflare 표준시를 기준으로 표시하는 한국 표준시 */
const missionClock =
    document.querySelector("#missionClock");

const missionDate =
    document.querySelector("#missionDate");

const missionTimeEndpoint =
    "https://cw-ai-guide.changwoo-ai.workers.dev";

let missionTimeOffset = 0;

async function syncMissionKoreaTime() {
    if (!missionClock || !missionDate) {
        return;
    }

    const requestStartedAt = Date.now();

    try {
        const response = await fetch(
            missionTimeEndpoint,
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error("표준시 응답 오류");
        }

        const data = await response.json();
        const requestFinishedAt = Date.now();
        const estimatedLocalTime =
            (requestStartedAt + requestFinishedAt) / 2;

        missionTimeOffset =
            Date.parse(data.now) - estimatedLocalTime;

        updateMissionClock();
    } catch (error) {
        missionTimeOffset = 0;
    }
}

function updateMissionClock() {
    if (!missionClock || !missionDate) {
        return;
    }

    const now = new Date(
        Date.now() + missionTimeOffset
    );

    missionClock.textContent =
        new Intl.DateTimeFormat(
            "ko-KR",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                timeZone: "Asia/Seoul"
            }
        ).format(now);

    missionClock.dateTime =
        now.toISOString();

    missionDate.textContent =
        new Intl.DateTimeFormat(
            "ko-KR",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "short",
                timeZone: "Asia/Seoul"
            }
        ).format(now);
}

updateMissionClock();
syncMissionKoreaTime();

if (missionClock) {
    window.setInterval(
        updateMissionClock,
        1000
    );

    window.setInterval(
        syncMissionKoreaTime,
        60 * 60 * 1000
    );
}

/* 페이지 상단 진행 표시 */
const scrollProgress =
    document.querySelector("#scrollProgress");

let scrollFrameRequested = false;

function updateScrollProgress() {
    if (!scrollProgress) {
        return;
    }

    const scrollableHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress = scrollableHeight > 0
        ? Math.min(
            window.scrollY / scrollableHeight,
            1
        )
        : 0;

    scrollProgress.style.width =
        `${progress * 100}%`;

    scrollFrameRequested = false;
}

window.addEventListener(
    "scroll",
    () => {
        if (scrollFrameRequested) {
            return;
        }

        scrollFrameRequested = true;

        window.requestAnimationFrame(
            updateScrollProgress
        );
    },
    { passive: true }
);

updateScrollProgress();
