const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let data;
let currentWord = [];
let scrolling = [false, false];
let shuffledWords = [];
let len;

jQuery.event.special.wheel = {
    setup: function( _, ns, handle ) {
        this.addEventListener("wheel", handle, { passive: !ns.includes("noPreventDefault") });
    }
};

const onPageLoad = async () => {
    data = await parser.dataFetch();
    data = data.objects;
    len = data.length;

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
    if (!scrolling[i]) {
        let dir = -Math.sign(e.originalEvent.wheelDelta);
        currentWord[i] += dir;
        scrollTo(currentWord[i], dir, obj, i);
    }
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
    if (getWord(currentWord[0]).value == getWord(currentWord[1]).value) {
        view.changeColor("green");
        view.changeAnswersBlock();
        for(let i = 0; i < data.length; i++){
            if (i == currentWord[0])
                data.splice(i, 1);
        }
        view.deletePair();
    } 
    else {
        view.changeColor("red");
    }
}

const scrollTo = async (index, dir, parent, type) => {
    view.updatePair(getWord(index), getWord(index - 1), getWord(index + 1), dir, parent, type);
}

const addWords = async (parent, index, type) => {
    view.addPair(getWord(index), getWord(index - 1), getWord(index + 1), parent, type);
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