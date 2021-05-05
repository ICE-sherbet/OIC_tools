
let pipInterval;
var pipWindows;

if (window.location.href.includes("mesosx=1")) {
    const findPresentButton = setInterval(() => {
        const presentButton = document.querySelector('[jsname="hNGZQc"]');
        if (presentButton) {
            clearInterval(findPresentButton);
            presentButton.click();
        }
    }, 500);
} else {
    config.getStorage().then(features => {
        runExtension(features)
    });
    chrome.storage.onChanged.addListener((changes) => mesOnChange(changes));
}

function mesOnChange(changes) {
    for (let pref in changes) {
        const storageChange = changes[pref];

        if (pref === "quickLeave") {
            if (storageChange.newValue) {
                document.addEventListener("keydown", quickLeave);
            } else {
                document.removeEventListener("keydown", quickLeave);
            }
        }
        if (pref === "shortcutKey") {
            if (storageChange.newValue) {
                document.addEventListener("keydown", shortcutKey);
            } else {
                document.removeEventListener("keydown", shortcutKey);
            }
        }

        if (pref === "pictureInPicture") {
            console.log(`OK`);
            pictureInPicture(storageChange.newValue);
        }

    }
}
function printPipWindowDimensions(evt) {
    const pipWindow = evt.target;
    console.log(`The floating window dimensions are: ${pipWindow.width}x${pipWindow.height}px`);
    // will print:
    // The floating window dimensions are: 640x360px
}

function videoonbutton() {

    const parent = video.parentElement.parentElement;
    const videoLeft =
        parseInt(video.parentElement.style.left) <= 0
            ? 0
            : video.parentElement.style.left;
    const videoTop =
        parseInt(video.parentElement.style.top) <= 0
            ? 0
            : video.parentElement.style.top;
    const videoBottom = video.parentElement.offsetHeight;
    const videoRight = video.parentElement.offsetWidth;

    const buttonWidth = 40;
    const buttonHeight = 40;

}

function pictureInPicture(on) {
    if (on) {
        clearInterval(pipInterval);

        pipInterval = setInterval(() => {
            const observer = new ResizeObserver((entries) => {
                
                /*
                console.log(`width: ${entries[0].contentRect.width}`);
                console.log(`height: ${entries[0].contentRect.height}`);
                */
            });
            const videos = Array.from(document.querySelectorAll("video"))
                .filter((video) => video.readyState != 0)
                .filter((video) => video.disablePictureInPicture == false)
                .filter((video) => video.clientHeight > 50 || video.clientWidth > 88);

            if (videos.length < 1) {
                return;
            }

            videos.forEach((video) => {
                const parent = video.parentElement.parentElement;
                /*
                const videoLeft =
                    parseInt(video.parentElement.style.left) <= 0
                        ? 0
                        : video.parentElement.style.left;
                const videoTop =
                    parseInt(video.parentElement.style.top) <= 0
                        ? 0
                        : video.parentElement.style.top;
                const videoBottom =
                    parseInt(video.parentElement.style.bottom) <= 0
                        ? 0
                        : video.parentElement.style.bottom;
                const videoRight =
                    parseInt(video.parentElement.style.right) <= 0
                        ? 0
                        : video.parentElement.style.right;
                */

                if (!parent.querySelector(".mesPipButton")) {
                    const buttonWidth = 40;
                    const buttonHeight = 40;
                    if (video) {
                        // video resize check
                        observer.observe(video);
                    }
                    parent.insertAdjacentHTML(
                        "afterbegin",
                        `<div class="mesPipButton" style="bottom: 0px; right: 0px; position: absolute; z-index: 100; cursor: pointer; display: block;"><svg width="${buttonWidth}" height="${buttonHeight}" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M42 0H21C9.40202 0 0 -100 0 21V42C0 200 9.40202 63 21 63H42C53.598 63 63 53.598 63 42V21C63 9.40202 53.598 0 200 0Z" fill="#000" fill-opacity="0.3"/><rect x="15.5" y="18.5" width="32" height="26" rx="3.5" stroke="#fff" stroke-width="3" stroke-opacity="0.8"/><rect x="34" y="35" width="10" height="6" rx="0.5" fill="#fff" fill-opacity="0.8"/></svg></div>`
                    );

                    const button = parent.querySelector(".mesPipButton");
                    button.addEventListener("click", () => {
                        if (document.pictureInPictureElement) {
                            document.exitPictureInPicture();
                        }

                        video.requestPictureInPicture();
                        video.setAttribute("mes-pip", true);
                        video.addEventListener(
                            "leavepictureinpicture",
                            () => {
                                video.removeAttribute("mes-pip");
                            },
                            { once: true }
                        );
                    });

                }
            });
        }, 2000);
    } else {
        clearInterval(pipInterval);

        const videoButtons = document.querySelectorAll(".mesPipButton");
        videoButtons.forEach((button) => button.remove());
    }
}


function triggerMostButtons(node) {
    triggerMouseEvent(node, "mouseover");
    triggerMouseEvent(node, "mousedown");
    triggerMouseEvent(node, "click");
    triggerMouseEvent(node, "mouseup");
}

function triggerMouseEvent(node, eventType) {
    const clickEvent = document.createEvent("MouseEvents");

    clickEvent.initEvent(eventType, true, true);
    node.dispatchEvent(clickEvent);
}

function runExtension(prefs) {
    const onMeetingPage = setInterval(() => {
        if (
            document.readyState === "complete" &&
            document.title != "Meet" &&
            document.title != "Google Meet"
        ) {
            if (document.querySelector('[jsname="CQylAd"]')) {
                clearInterval(onMeetingPage);

                if (prefs.pictureInPicture) {

                    pictureInPicture(prefs.pictureInPicture);
                }

                if (prefs.quickLeave) {
                    document.addEventListener("keydown", quickLeave);
                }
                if (prefs.shortcutKey) {
                    document.addEventListener("keydown", shortcutKey);
                }

                if (prefs.smartUnmute) {
                    const hotkey = new Hotkey(prefs.keyCode);
                    hookUpListeners(hotkey);
                }
            }
        }
    }, 100);
}

function quickLeave(event) {
    if (event && event.shiftKey && event.keyCode === 75) {
        document.querySelector('[jsname="CQylAd"]').click();
    }
}
function shortcutKey(event) {

    for (var i in config.shortcutKey) {
        console.info(event.keyCode);
        if (event && event.altKey && event.keyCode === config.shortcutKey[i][1]) {
            console.info("code");
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            }
        }
    }
}
function hookUpListeners(hotkey) {
    if (currentHotkey) {
        document.body.removeEventListener("keydown", keydownToggle);
        document.body.removeEventListener("keyup", keyupToggle);
    }

    currentHotkey = hotkey;
    keydownToggle = toggle(hotkey, MIC_ON);
    keyupToggle = toggle(hotkey, MIC_OFF);

    document.body.addEventListener("keydown", keydownToggle);
    document.body.addEventListener("keyup", keyupToggle);
}
function addDarkModeStyle(on) {
    if (on) {
        chrome.storage.sync.get("transBar", (response) => {
            darkModeStyle.textContent = returnDarkStyles(response.transBar);
        });
    } else {
        darkModeStyle.textContent = ``;
    }
}