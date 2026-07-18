import {
    auth
} from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const loginForm =
    document.querySelector("#loginForm");

const loginButton =
    document.querySelector("#loginButton");

const loginMessage =
    document.querySelector("#loginMessage");

function showMessage(message, isError = false) {
    loginMessage.textContent = message;

    loginMessage.style.color = isError
        ? "#c0392b"
        : "#276749";
}

function setLoading(isLoading) {
    loginButton.disabled = isLoading;

    loginButton.textContent = isLoading
        ? "로그인 중..."
        : "로그인";
}

/*
현재 탭에서 정상적으로 로그인한 사용자만
메인 페이지로 이동합니다.
*/
onAuthStateChanged(auth, (user) => {
    const sessionLogin =
        sessionStorage.getItem("sessionLogin");

    if (user && sessionLogin === "true") {
        window.location.replace("index.html");
    }
});

loginForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        loginMessage.textContent = "";

        const email =
            document
                .querySelector("#loginEmail")
                .value
                .trim();

        const password =
            document.querySelector(
                "#loginPassword"
            ).value;

        if (!email) {
            showMessage(
                "아이디를 입력해 주세요.",
                true
            );

            document
                .querySelector("#loginEmail")
                .focus();

            return;
        }

        if (!password) {
            showMessage(
                "비밀번호를 입력해 주세요.",
                true
            );

            document
                .querySelector("#loginPassword")
                .focus();

            return;
        }

        setLoading(true);

        try {
            /*
            Firebase 로그인 상태를
            현재 브라우저 세션에서만 유지합니다.
            */
            await setPersistence(
                auth,
                browserSessionPersistence
            );

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            /*
            현재 탭에서 로그인했다는 표시입니다.

            같은 탭 이동 및 새로고침에서는 유지되고,
            탭이나 창을 닫으면 삭제됩니다.
            */
            sessionStorage.setItem(
                "sessionLogin",
                "true"
            );

            console.log(
                "로그인한 사용자:",
                userCredential.user
            );

            showMessage(
                "로그인에 성공했습니다."
            );

            setTimeout(() => {
                window.location.replace(
                    "index.html"
                );
            }, 700);
        } catch (error) {
            console.error(
                "로그인 오류:",
                error
            );

            sessionStorage.removeItem(
                "sessionLogin"
            );

            switch (error.code) {
                case "auth/invalid-email":
                    showMessage(
                        "아이디를 이메일 형식으로 입력해 주세요.",
                        true
                    );
                    break;

                case "auth/invalid-credential":
                    showMessage(
                        "아이디 또는 비밀번호가 올바르지 않습니다.",
                        true
                    );
                    break;

                case "auth/user-disabled":
                    showMessage(
                        "사용이 중지된 계정입니다.",
                        true
                    );
                    break;

                case "auth/too-many-requests":
                    showMessage(
                        "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.",
                        true
                    );
                    break;

                case "auth/network-request-failed":
                    showMessage(
                        "네트워크 연결을 확인해 주세요.",
                        true
                    );
                    break;

                default:
                    showMessage(
                        `로그인 중 오류가 발생했습니다: ${
                            error.message
                        }`,
                        true
                    );
            }
        } finally {
            setLoading(false);
        }
    }
);
