const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let data;
let currentWord = [];
let scrolling = [false, false];
let shuffledWords = [];
let done = false;
let originalData = [];

jQuery.event.special.wheel = {
    setup: function( _, ns, handle ) {
        this.addEventListener("wheel", handle, { passive: !ns.includes("noPreventDefault") });
    }
};

const onPageLoad = async () => {
    data = await parser.dataFetch();
    data = data.objects;
    originalData = JSON.parse(JSON.stringify(data));

    for (let i = 0; i < data.length; i++) shuffledWords.push(i);
    shuffledWords = shuffle(shuffledWords);

    currentWord[0] = shuffledWords[0];
    currentWord[1] = shuffledWords[1];
    addWords(".left", currentWord[0], 0);
    addWords(".right", currentWord[1], 1);
    $(".left" ).on('wheel', async function (e) { wheel(e, this, 0) });
    $(".right").on('wheel', async function (e) { wheel(e, this, 1) });
}

const wheel = (e, obj, i) => {
    if (!scrolling[i] && !done) {
        let dir = -Math.sign(e.originalEvent.wheelDelta);
        currentWord[i] += dir;

        let two = data.length < 3;
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
    view.updatePair(getWord(index), getWord(index - 1), getWord(index + 1), dir, parent, type, reset, generate);
}

const addWords = async (parent, index, type) => {
    view.addPair(getWord(index), getWord(index - 1), getWord(index + 1), parent, type);
}

const shuffle = (array) => {
    let i = array.length, j = 0, temp;

    while (i--) {
        j = Math.floor(Math.random() * (i + 1));

        temp = array[i];
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
    scrolling = [true, true];

    if (getWord(currentWord[0]).value == getWord(currentWord[1]).value) {
        view.toggleFlash("green");
        view.updateStatus();

        data.splice(data.indexOf(getWord(currentWord[0])), 1);
        view.deletePair();
        await timeout(1000);

        for (let i = 0; i < currentWord.length; i++) {
            currentWord[i]++;
            
            let obj = i == 0 ? ".left" : ".right";

            if (data.length == 2) {
                view.secondLastScroll();
            }
            else if (data.length >= 3) {
                scrollTo(currentWord[i], 1, obj, i, true, true);
            }
            else if (data.length == 1) {
                view.lastScroll();
            } else {
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
    await timeout (800);
    $("#play").attr("onclick", "check()");
}

const getWord = (newIndex) => {
    newIndex %= data.length;
    
    if (newIndex < 0) {
        newIndex = data.length + newIndex;
    }
    else if (newIndex > data.length) {
        newIndex = 0;
    }

    return data[newIndex];
}

$(onPageLoad);