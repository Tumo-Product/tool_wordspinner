const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let data;
let currentWord = 0;

const onPageLoad = async () => {
    data = await parser.dataFetch();
    data = data.objects;

    addWords();

    $(".left").on('wheel', async function (e) {
        e.preventDefault();

        let dir = Math.sign(e.originalEvent.wheelDelta);
        currentWord += dir;
        scrollTo(currentWord, dir);
    });
}

const scrollTo = async (index, dir) => {
    view.updatePair(getWord(index), getWord(index - 1), getWord(index + 1), dir);
    console.log(getWord(currentWord), getWord(currentWord - 1), getWord(currentWord + 1));
}

const addWords = async () => {
    view.addPair(getWord(currentWord), getWord(currentWord - 1), getWord(currentWord + 1));
    console.log(getWord(currentWord), getWord(currentWord - 1), getWord(currentWord + 1));
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