'use strict';

var config = {
    "keyCode":{
        keyCode: 32,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
    },
    "pictureInPicture": true,
    "quickLeave": true,
    "shortcutKey": {
        "scaleUp": [18,187],
        "scaleDown": [18,189],
        "popUp": [18,80],
        "Close": [18,68],
    }
};

const features = [
    "pictureInPicture",
    "quickLeave",
    "shortcutKey"
];

config.get = arr => new Promise(resolve => {
  const ps = arr.reduce((p, c) => {
    p[c] = config[c];
    return p;
  }, {});
  chrome.storage.sync.get(ps, resolve);
});

config.getStorage = () => new Promise(resolve =>{
    config.get(features).then(resolve);
})
