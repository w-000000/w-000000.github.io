import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const commentForm =
    document.querySelector("#commentForm");

const commentContent =
    document.querySelector("#commentContent");

const commentButton =
    document.querySelector("#commentButton");

const commentMessage =
    document.querySelector("#commentMessage");

const commentList =
    document.querySelector("#commentList");

const commentCount =
    document.querySelector("#commentCount");

const characterCount =
    document.querySelector("#characterCount");

const loginGuide =
    document.querySelector("#loginGuide");

let currentUser = null;

function showMessage(message, isError = false) {
    commentMessage.textContent = message;

    commentMessage.style.color = isError
        ? "#c0392b"
        : "#276749";
}

function setLoading(isLoading) {
    commentButton.disabled = isLoading;

    commentButton.textContent = isLoading
        ? "등록 중..."
        : "댓글 등록";
}

function getAuthorName(user) {
    if (!user || !user.email) {
        return "사용자";
    }

    return user.email.split("@")[0];
}

function formatDate(timestamp) {
    if (!timestamp) {
        return "방금 전";
    }

    const date = timestamp.toDate();

    return new Intl.DateTimeFormat(
        "ko-KR",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(date);
}

function createCommentElement(comment) {
    const article =
        document.createElement("article");

    article.className = "comment-card";

    const header =
        document.createElement("div");

    header.className = "comment-card-header";

    const author =
        document.createElement("strong");

    author.textContent =
        `👤 ${comment.authorName ?? "사용자"}`;

    const date =
        document.createElement("time");

    date.textContent =
        formatDate(comment.createdAt);

    const content =
        document.createElement("p");

    content.textContent =
        comment.content ?? "";

    header.append(author, date);
    article.append(header, content);

    return article;
}

/*
로그인 상태 확인
*/
onAuthStateChanged(auth, (user) => {
    currentUser = user;

    if (user) {
        loginGuide.hidden = true;
        commentForm.hidden = false;
        return;
    }

    loginGuide.hidden = false;
    commentForm.hidden = true;
});

/*
글자 수 표시
*/
commentContent.addEventListener("input", () => {
    characterCount.textContent =
        `${commentContent.value.length} / 300`;
});

/*
댓글 등록
*/
commentForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        commentMessage.textContent = "";

        if (!currentUser) {
            showMessage(
                "로그인한 사용자만 댓글을 작성할 수 있습니다.",
                true
            );

            return;
        }

        const content =
            commentContent.value.trim();

        if (!content) {
            showMessage(
                "댓글 내용을 입력해 주세요.",
                true
            );

            commentContent.focus();
            return;
        }

        if (content.length > 300) {
            showMessage(
                "댓글은 300자 이하로 입력해 주세요.",
                true
            );

            return;
        }

        setLoading(true);

        try {
            await addDoc(
                collection(db, "comments"),
                {
                    content: content,

                    authorId:
                        currentUser.uid,

                    authorName:
                        getAuthorName(currentUser),

                    createdAt:
                        serverTimestamp()
                }
            );

            commentForm.reset();

            characterCount.textContent =
                "0 / 300";

            showMessage(
                "댓글이 등록되었습니다."
            );
        } catch (error) {
            console.error(
                "댓글 등록 오류:",
                error
            );

            if (error.code === "permission-denied") {
                showMessage(
                    "로그인한 사용자만 댓글을 작성할 수 있습니다.",
                    true
                );

                return;
            }

            showMessage(
                "댓글 등록 중 오류가 발생했습니다.",
                true
            );
        } finally {
            setLoading(false);
        }
    }
);

/*
댓글 실시간 조회
*/
const commentsQuery = query(
    collection(db, "comments"),
    orderBy("createdAt", "desc")
);

onSnapshot(
    commentsQuery,
    (snapshot) => {
        commentList.innerHTML = "";

        commentCount.textContent =
            `${snapshot.size}개`;

        if (snapshot.empty) {
            const emptyMessage =
                document.createElement("p");

            emptyMessage.className =
                "comment-empty";

            emptyMessage.textContent =
                "아직 등록된 댓글이 없습니다.";

            commentList.appendChild(
                emptyMessage
            );

            return;
        }

        snapshot.forEach((documentSnapshot) => {
            const comment =
                documentSnapshot.data();

            const commentElement =
                createCommentElement(comment);

            commentList.appendChild(
                commentElement
            );
        });
    },
    (error) => {
        console.error(
            "댓글 조회 오류:",
            error
        );

        commentList.innerHTML = "";

        const errorMessage =
            document.createElement("p");

        errorMessage.className =
            "comment-error";

        errorMessage.textContent =
            "댓글을 불러오지 못했습니다.";

        commentList.appendChild(
            errorMessage
        );
    }
);