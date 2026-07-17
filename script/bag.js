/*
 * 내 가방 보기
 * 방문자는 목록을 볼 수 있고, 지정된 관리자 계정만 수정할 수 있습니다.
 */

import {
    auth,
    db
} from "../js/firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
    doc,
    onSnapshot,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const BAG_OWNER_EMAIL =
    "cwoo6115@jbnu.ac.kr";

const DEFAULT_BAG = [
    {
        name: "노트북",
        count: 1,
        icon: "💻"
    },
    {
        name: "충전기",
        count: 2,
        icon: "🔌"
    },
    {
        name: "무선 이어폰",
        count: 1,
        icon: "🎧"
    },
    {
        name: "노트",
        count: 1,
        icon: "📓"
    },
    {
        name: "볼펜",
        count: 3,
        icon: "🖊️"
    }
];

var myBag = DEFAULT_BAG.map(
    (item) => ({ ...item })
);

const bagDocument = doc(
    db,
    "portfolioData",
    "myBag"
);

const showMyBagButton =
    document.querySelector("#showMyBagButton");

const bagPreview =
    document.querySelector("#bagPreview");

const bagStatus =
    document.querySelector("#bagStatus");

const bagOwnerControls =
    document.querySelector("#bagOwnerControls");

const bagEditToggleButton =
    document.querySelector("#bagEditToggleButton");

const bagEditor =
    document.querySelector("#bagEditor");

const bagItemIndex =
    document.querySelector("#bagItemIndex");

const bagItemIcon =
    document.querySelector("#bagItemIcon");

const bagItemName =
    document.querySelector("#bagItemName");

const bagItemCount =
    document.querySelector("#bagItemCount");

const bagSaveButton =
    document.querySelector("#bagSaveButton");

const bagDeleteButton =
    document.querySelector("#bagDeleteButton");

const bagCancelButton =
    document.querySelector("#bagCancelButton");

const bagEditorMessage =
    document.querySelector("#bagEditorMessage");

let currentUser = null;
let isBagOwner = false;

function normalizeBag(items) {
    if (!Array.isArray(items)) {
        return null;
    }

    const normalizedItems = [];

    for (var i = 0; i < items.length; i += 1) {
        var item = items[i];
        var name = String(item?.name ?? "").trim();
        var icon = String(item?.icon ?? "🎒").trim();
        var count = Number(item?.count);

        if (
            !name ||
            name.length > 30 ||
            !Number.isInteger(count) ||
            count < 1 ||
            count > 99
        ) {
            continue;
        }

        normalizedItems.push({
            name: name,
            count: count,
            icon: icon.slice(0, 8) || "🎒"
        });

        if (normalizedItems.length >= 30) {
            break;
        }
    }

    return normalizedItems;
}

function setBagStatus(message) {
    if (bagStatus) {
        bagStatus.textContent = message;
    }
}

function showEditorMessage(
    message,
    isError = false
) {
    if (!bagEditorMessage) {
        return;
    }

    bagEditorMessage.textContent = message;
    bagEditorMessage.classList.toggle(
        "is-error",
        isError
    );
}

function renderBagPreview() {
    if (!bagPreview) {
        return;
    }

    bagPreview.textContent = "";

    if (myBag.length === 0) {
        const emptyItem =
            document.createElement("li");

        emptyItem.className = "bag-empty-item";
        emptyItem.textContent =
            "가방이 비어 있습니다.";

        bagPreview.append(emptyItem);
        return;
    }

    for (var i = 0; i < myBag.length; i += 1) {
        var item = myBag[i];

        var listItem = document.createElement("li");
        var itemName = document.createElement("span");
        var itemActions = document.createElement("span");
        var itemCount = document.createElement("strong");

        itemName.className = "bag-item-name";
        itemActions.className = "bag-item-actions";

        itemName.textContent =
            item.icon + " " + item.name;

        itemCount.textContent = "× " + item.count;
        itemActions.append(itemCount);

        if (isBagOwner) {
            const editButton =
                document.createElement("button");

            editButton.type = "button";
            editButton.className =
                "bag-inline-edit";
            editButton.textContent = "수정";
            editButton.dataset.index = String(i);
            editButton.setAttribute(
                "aria-label",
                item.name + " 수정"
            );

            editButton.addEventListener(
                "click",
                () => {
                    startEditingBagItem(
                        Number(editButton.dataset.index)
                    );
                }
            );

            itemActions.append(editButton);
        }

        listItem.append(itemName, itemActions);
        bagPreview.append(listItem);
    }
}

function showMyBag() {
    if (myBag.length === 0) {
        window.alert("🎒 현재 가방이 비어 있습니다.");
        setBagStatus("EMPTY · 0 ITEMS");
        return;
    }

    var message = "🎒 내 가방 속 물건\n\n";
    var totalCount = 0;

    for (var i = 0; i < myBag.length; i += 1) {
        var item = myBag[i];

        message +=
            i + 1 + ". " +
            item.icon + " " +
            item.name + " × " +
            item.count + "개\n";

        totalCount += item.count;
    }

    message +=
        "\n총 " + myBag.length +
        "종류, " + totalCount + "개의 물품이 있습니다.";

    window.alert(message);

    setBagStatus(
        "OPENED · " +
        myBag.length +
        " TYPES · " +
        totalCount +
        " ITEMS"
    );
}

function resetBagEditor(closeEditor = false) {
    if (!bagEditor) {
        return;
    }

    bagEditor.reset();
    bagItemIndex.value = "";
    bagItemCount.value = "1";
    bagSaveButton.textContent = "물품 추가";
    bagDeleteButton.hidden = true;
    showEditorMessage("");

    if (closeEditor) {
        bagEditor.hidden = true;

        if (bagPreview) {
            bagPreview.hidden = true;
        }
    }
}

function startEditingBagItem(index) {
    if (
        !isBagOwner ||
        !myBag[index]
    ) {
        return;
    }

    const item = myBag[index];

    bagEditor.hidden = false;
    bagItemIndex.value = String(index);
    bagItemIcon.value = item.icon;
    bagItemName.value = item.name;
    bagItemCount.value = String(item.count);
    bagSaveButton.textContent = "수정 저장";
    bagDeleteButton.hidden = false;
    showEditorMessage("");
    bagItemName.focus();
}

function setEditorLoading(isLoading) {
    bagSaveButton.disabled = isLoading;
    bagDeleteButton.disabled = isLoading;
    bagCancelButton.disabled = isLoading;
}

async function saveBag(nextBag) {
    if (
        !isBagOwner ||
        !currentUser ||
        currentUser.email?.toLowerCase() !==
            BAG_OWNER_EMAIL
    ) {
        throw new Error("관리자 계정만 수정할 수 있습니다.");
    }

    await setDoc(
        bagDocument,
        {
            items: nextBag,
            updatedAt: serverTimestamp(),
            updatedBy: currentUser.uid,
            updatedByEmail: BAG_OWNER_EMAIL
        }
    );
}

if (bagEditor) {
    bagEditor.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            if (!isBagOwner) {
                showEditorMessage(
                    "관리자 계정만 수정할 수 있습니다.",
                    true
                );
                return;
            }

            const icon =
                bagItemIcon.value.trim() || "🎒";
            const name =
                bagItemName.value.trim();
            const count =
                Number(bagItemCount.value);

            if (!name) {
                showEditorMessage(
                    "물품명을 입력해 주세요.",
                    true
                );
                bagItemName.focus();
                return;
            }

            if (
                !Number.isInteger(count) ||
                count < 1 ||
                count > 99
            ) {
                showEditorMessage(
                    "수량은 1부터 99 사이의 정수로 입력해 주세요.",
                    true
                );
                bagItemCount.focus();
                return;
            }

            const previousBag = myBag.map(
                (item) => ({ ...item })
            );

            const nextBag = previousBag.map(
                (item) => ({ ...item })
            );

            const editingIndex =
                Number(bagItemIndex.value);

            const nextItem = {
                name: name,
                count: count,
                icon: icon.slice(0, 8)
            };

            if (
                bagItemIndex.value !== "" &&
                Number.isInteger(editingIndex) &&
                nextBag[editingIndex]
            ) {
                nextBag[editingIndex] = nextItem;
            } else {
                nextBag.push(nextItem);
            }

            try {
                setEditorLoading(true);
                await saveBag(nextBag);
                myBag = nextBag;
                renderBagPreview();
                resetBagEditor();
                showEditorMessage("저장되었습니다.");
                setBagStatus("UPDATED · OWNER ONLY");
            } catch (error) {
                console.error("가방 저장 오류:", error);
                myBag = previousBag;
                renderBagPreview();
                showEditorMessage(
                    "저장 권한을 확인해 주세요.",
                    true
                );
            } finally {
                setEditorLoading(false);
            }
        }
    );
}

if (bagDeleteButton) {
    bagDeleteButton.addEventListener(
        "click",
        async () => {
            if (!isBagOwner) {
                return;
            }

            const index =
                Number(bagItemIndex.value);

            if (
                !Number.isInteger(index) ||
                !myBag[index]
            ) {
                return;
            }

            const confirmed = window.confirm(
                myBag[index].name +
                "을(를) 가방에서 삭제하시겠습니까?"
            );

            if (!confirmed) {
                return;
            }

            const previousBag = myBag.map(
                (item) => ({ ...item })
            );

            const nextBag = previousBag.filter(
                (item, itemIndex) =>
                    itemIndex !== index
            );

            try {
                setEditorLoading(true);
                await saveBag(nextBag);
                myBag = nextBag;
                renderBagPreview();
                resetBagEditor();
                showEditorMessage("삭제되었습니다.");
                setBagStatus("UPDATED · OWNER ONLY");
            } catch (error) {
                console.error("가방 삭제 오류:", error);
                showEditorMessage(
                    "삭제 권한을 확인해 주세요.",
                    true
                );
            } finally {
                setEditorLoading(false);
            }
        }
    );
}

if (bagEditToggleButton) {
    bagEditToggleButton.addEventListener(
        "click",
        () => {
            if (!isBagOwner) {
                window.alert(
                    "가방 속 물품 변경은 cwoo6115@jbnu.ac.kr 계정으로 로그인한 임창우 님만 사용할 수 있습니다."
                );
                return;
            }

            const shouldOpen = bagEditor.hidden;
            resetBagEditor(!shouldOpen);
            bagEditor.hidden = !shouldOpen;

            if (bagPreview) {
                bagPreview.hidden = !shouldOpen;
            }

            if (shouldOpen) {
                bagItemName.focus();
            }
        }
    );
}

if (bagCancelButton) {
    bagCancelButton.addEventListener(
        "click",
        () => {
            resetBagEditor(true);
        }
    );
}

if (showMyBagButton) {
    showMyBagButton.addEventListener(
        "click",
        showMyBag
    );
}

onAuthStateChanged(
    auth,
    (user) => {
        currentUser = user;
        isBagOwner =
            user?.email?.toLowerCase() ===
            BAG_OWNER_EMAIL;

        if (bagOwnerControls) {
            bagOwnerControls.hidden = false;
        }

        if (!isBagOwner) {
            resetBagEditor(true);
        }

        renderBagPreview();
    }
);

onSnapshot(
    bagDocument,
    (snapshot) => {
        if (snapshot.exists()) {
            const savedBag = normalizeBag(
                snapshot.data().items
            );

            if (savedBag) {
                myBag = savedBag;
            }
        }

        renderBagPreview();
    },
    (error) => {
        console.error(
            "가방 목록을 불러오지 못했습니다:",
            error
        );

        renderBagPreview();
    }
);

window.showMyBag = showMyBag;
renderBagPreview();
