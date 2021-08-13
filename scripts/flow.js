const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let data;
let dupValues = [];
let keepValue = false;
let currentWord = [];
let scrolling = [false, false];
let shuffledIndexes = [];
let done = false;
let originalData = [];
let href = window.location.href;

jQuery.event.special.wheel = {
    setup: function( _, ns, handle ) {
        this.addEventListener("wheel", handle, { passive: !ns.includes("noPreventDefault") });
    }
};

const onPageLoad = async () => {
    data        = await parser.dataFetch();
    if (data.data.data.keepValue === undefined) keepValue = false;
    else keepValue   = data.data.data.keepValue;
    data        = data.data.data.elements;
    href        = href.substring(0, href.indexOf("?"));

    // data = [{text: "test", value: "testing"}, {text: "d", value: "testing"}, {text: "a", value: "testable"}, {text: "bla", value: "testable"}, {text: "cmon", value: "testing"}, {text: "bro", value: "testing"}]

    if (keepValue) {
        for(let i = 0; i < data.length - 1; i++) {
            if (data[i + 1].value == data[i].value && !dupValues.includes(data[i].value)) {
                dupValues.push(data[i].value);
            }
        }
    }

    for (let i = 0; i < dupValues.length; i++) dupValues[i] = {value: dupValues[i]};

    originalData = JSON.parse(JSON.stringify(data));

    for (let i = 0; i < data.length; i++) shuffledIndexes.push(i);
    shuffledIndexes = shuffle(shuffledIndexes);

    currentWord[0] = shuffledIndexes[0];
    currentWord[1] = shuffledIndexes[1];

    addWords(".left", currentWord[0], 0);
    addWords(".right", currentWord[1], 1);

    $(".left" ).on('wheel', async function (e) { wheel(e, this, 0) });
    $(".right").on('wheel', async function (e) { wheel(e, this, 1) });

    loader.toggle();
}

const wheel = (e, obj, i) => {
    if (!scrolling[i] && !done) {
        let dir = -Math.sign(e.originalEvent.wheelDelta);
        currentWord[i] += dir;

        let two = keepValue && i == 1 ? dupValues.length < 3 : data.length < 3;
        if (two) {
            if($(obj).find(".top").length == 0 && dir == 1) {
                return;
            } else if ($(obj).find(".bottom").length == 0 && dir == -1) {
                return;
            }
        }
        
        scrollTo(currentWord[i], dir, obj, i, false, data.length >= 3);
    }
}

const scrollTo = async (index, dir, parent, type, reset, generate) => {
    if (keepValue && type == 1) {
        if (dupValues.length < 3) {
            view.updatePair(getWord(index, type), getWord(index - 1, type), getWord(index + 1, type), dir, parent, type, reset, false);
        } else {
            view.updatePair(getWord(index, type), getWord(index - 1, type), getWord(index + 1, type), dir, parent, type, reset, false);
        }
    } else {
        view.updatePair(getWord(index, type), getWord(index - 1, type), getWord(index + 1, type), dir, parent, type, reset, generate);
    }
}

const addWords = async (parent, index, type) => {
    if (keepValue && type == 1) {
        if (dupValues.length < 3) {
            view.addPair(getWord(index, type), getWord(index - 1, type), getWord(index + 1, type), parent, type);
        } else {
            view.addPair(getWord(index, type), getWord(index - 1, type), getWord(index + 1, type), parent, type);
        }
    } else {
        view.addPair(getWord(index, type), getWord(index - 1, type), getWord(index + 1, type), parent, type);
    }
}

const shuffle = (array) => {
    let i = array.length, j = 0, temp;

    while (i--) {
        j = Math.floor(Math.random() * (i + 1));

        temp     = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

const onPlay = async () => {
    await view.onPlay();
    $("#play").attr("onclick", "check()");
}

const check = async () => {
    view.flashCircle();
    
    scrolling = [true, true];

    let condition;
    if (keepValue)  condition = getWord(currentWord[0], 0).value == getWord(currentWord[1], 1).value;
    else            condition = getWord(currentWord[0], 0).value == getWord(currentWord[1], 0).value;

    if (condition) {
        view.toggleFlash("green");
        view.updateStatus();

        data.splice(data.indexOf(getWord(currentWord[0])), 1);
        view.deletePair();
        await timeout(1000);

        for (let i = 0; i < currentWord.length; i++) {
            if (!keepValue || (keepValue && i == 0 && dupValues.length < 3)) {
                currentWord[i]++;
            }
            
            let obj = i == 0 ? ".left" : ".right";

            let length = keepValue && i == 1 ? dupValues.length : data.length;

            if (data.length == 2) {
                view.secondLastScroll(obj);
            }
            else if (length >= 3) {
                scrollTo(currentWord[i], 1, obj, i, true, true);
            }
            else if (length == 1) {
                view.lastScroll();
            } else if (data.length < 1) {
                done = true;
                view.end();
                break;
            }
        }
    } 
    else {
        view.toggleFlash("red");
        await view.shake();
    }
    
    await timeout(800);
    scrolling = [false, false];

    // Cooldown
    $("#play").attr("onclick", "");
    await timeout (200);
    $("#play").attr("onclick", "check()");
}

const getWord = (newIndex, type) => {
    let length  = (type == 1 && keepValue) ? dupValues.length : data.length;
    newIndex    %= length;
    
    if (newIndex < 0) {
        newIndex = length + newIndex;
    }
    else if (newIndex > length) {
        newIndex = 0;
    }

    return (type == 1 && keepValue) ? dupValues[newIndex] : data[newIndex];
}

$(onPageLoad);