class CommonUI {
    constructor() {

        this.initListeners();
    }

    initListeners() {

    }

    save_options() {
        config.getStorage().then(featureState => {
            if (feature == "keyCode") {
                delete featureState.keyCode;
            } else {
                featureState[feature] = document.getElementById(feature).checked;
            }
        });
        chrome.storage.sync.set(featureState);
    };

    restore_options() {
        //Either...
        config.getStorage().then(items => {
            features.forEach((feature) => {
                if (feature === "keyCode") {
                    this.currentHotkey = new Hotkey(Hotkey.keysFromEvent(items[feature]));
                    this.hotkeyContainer.innerText = this.currentHotkey.display();
                } else if (feature === "backgroundColor") {

                } else {
                    document.getElementById(feature).checked = items[feature];
                }
            });
        });
    }

    attachCheckboxHandlers() {
        const featureList = document.getElementById("featureList");

        Object.values(featureList.getElementsByTagName("input")).forEach((element) => {
            if (element.type === "checkbox") {
                if(features.includes(element.id)){
                    element.onchange = this.save_options;
                }
                else{
                    element.closest(".container").style.display = "none";
                }
            }
            }
        );
    }
    


}
