const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let data;
let currentWord = 0;
let scrolling = [false, false];

jQuery.event.special.wheel = {
    setup: function( _, ns, handle ) {
        this.addEventListener("wheel", handle, { passive: !ns.includes("noPreventDefault") });
    }
};

const onPageLoad = async () => {
    data = await parser.dataFetch();
    data = data.objects;

    addWords(".left", 0);
    addWords(".right", 1);

    $(".left").on('wheel', async function (e) {
        if (!scrolling[0]) {
            // e.preventDefault();

            let dir = -Math.sign(e.originalEvent.wheelDelta);
            currentWord += dir;
            scrollTo(currentWord, dir, this, 0);
        }
    });

    $(".right").on('wheel', async function (e) {
        if (!scrolling[1]) {
            // e.preventDefault();

            let dir = -Math.sign(e.originalEvent.wheelDelta);
            currentWord += dir;
            scrollTo(currentWord, dir, this, 1);
        }
    });
}

const onPlay = () => {
    view.onPlay();
}

const scrollTo = async (index, dir, parent, type) => {
    view.updatePair(getWord(index), getWord(index - 1), getWord(index + 1), dir, parent, type);
}

const addWords = async (parent, type) => {
    view.addPair(getWord(currentWord), getWord(currentWord - 1), getWord(currentWord + 1), parent, type);
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