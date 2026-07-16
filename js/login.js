import {
    auth
} from "./firebase-config.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const loginForm = document.querySelector("#loginForm");
const loginButton = document.querySelector("#loginButton");
const loginMessage = document.querySelector("#loginMessage");

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

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginMessage.textContent = "";

    const email =
        document.querySelector("#loginEmail").value.trim();

    const password =
        document.querySelector("#loginPassword").value;

    setLoading(true);

    try {
        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        console.log(
            "로그인한 사용자:",
            userCredential.user
        );

        showMessage("로그인에 성공했습니다.");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } catch (error) {
        console.error("로그인 오류:", error);

        switch (error.code) {
            case "auth/invalid-email":
                showMessage(
                    "이메일 형식이 올바르지 않습니다.",
                    true
                );
                break;

            case "auth/invalid-credential":
                showMessage(
                    "이메일 또는 비밀번호가 올바르지 않습니다.",
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
                    `로그인 중 오류가 발생했습니다: ${error.message}`,
                    true
                );
        }
    } finally {
        setLoading(false);
    }
});