const view = {
    correct: 0,
    row: `<div class="row"></div>`,

    addPair: (current, top, bottom, parent, type) => {
        let currentText = type == 0 ? current.text : current.value;
        let topText = type == 0 ? top.text : top.value;
        let bottomText = type == 0 ? bottom.text : bottom.value;

        $(parent).append(`<div class="top"><p>${topText}</p></div>`);
        $(parent).append(`<div class="current"><p>${currentText}</p></div>`);
        $(parent).append(`<div class="bottom"><p>${bottomText}</p></div>`);
    },
    updatePair: async (current, top, bottom, dir, parent, type, reset, generate) => {
        let currentText = type == 0 ? current.text : current.value;
        let topText = type == 0 ? top.text : top.value;
        let bottomText = type == 0 ? bottom.text : bottom.value;

        scrolling[type] = true;

        if (reset === undefined || reset === false) {
            $(parent).find(dir > 0 ? ".bottom" : ".top").addClass(dir > 0 ? "offscreenBottom" : "offscreenTop");
        }

        $(parent).find(".current").addClass(dir > 0 ? "bottom" : "top");
        $(parent).find(".current").removeClass("current");

        $(parent).find(dir > 0 ? ".top" : ".bottom").addClass("current");
        $(parent).find(dir > 0 ? ".top" : ".bottom").removeClass(dir > 0 ? "top" : "bottom");
        if (data.length >= 3) {
            $(parent).find(".current p").text(currentText);
        }

        if (generate) {
            if (dir > 0) {
                $(parent).find(".current").before(`<div class="offscreenTop"><p>${topText}</p></div>`);
            } else {
                $(parent).find(".current").after(`<div class="offscreenBottom"><p>${bottomText}</p></div>`);
            }
        }

        view.fitText();
        await timeout(200);
        $(parent).find(dir > 0 ? ".offscreenTop" : ".offscreenBottom").addClass(dir > 0 ? "top" : "bottom");
        $(parent).find(dir > 0 ? ".offscreenTop" : ".offscreenBottom").removeClass(dir > 0 ? "offscreenTop" : "offscreenBottom");

        await timeout (600);
        $(parent).find(dir > 0 ? ".bottom p" : ".top p").text(dir > 0 ? bottomText : topText);
        $(parent).find(dir > 0 ? ".offscreenBottom" : ".offscreenTop").remove();
        if (reset == true) $(".goLeft").remove();

        scrolling[type] = false;
    },
    secondLastScroll: async () => {
        $(".top").addClass   ("current");
        $(".top").removeClass("top");
        $(".goLeft" ).remove ();
        $(".goRight").remove ();

        $(".left").find (".current p").text(getWord(currentWord[0].text));
        $(".right").find(".current p").text(getWord(currentWord[1].value));
        view.fitText();
    },
    lastScroll: async () => {
        $(".left div").addClass("current");
        $(".left div").removeClass("top bottom")

        $(".right div").addClass("current");
        $(".right div").removeClass("top bottom");
        view.fitText();
    },
    onPlay: async () => {
        $("#status span").last().text(data.length);
        $("#status").addClass("show");
        $(".question").css("opacity", 0);

        $("#play svg").css("opacity", 0);
        await timeout (500);
        $("#play svg").remove();
        $(".icon").load(href + "graphics/checkmark.svg");
        $(".icon").addClass("checkmark");

        await timeout (1000);
        $(".question").hide("opacity", 0);

        let classes = [".left", ".right", ".leftOverlay", ".rightOverlay"];
        for (let i = 0; i < classes.length; i++) {
            $(classes[i]).removeClass("closed");
        }
    },
    toggleFlash: async(color) => {
		$(`#${color}`).css("opacity", 1);
		await timeout(500);
		$(`#${color}`).css("opacity", 0);
	},
    flashCircle: async() => {
        $(".circle").css("opacity", 0);
        await timeout(300);
        $(".circle").css("opacity", 1);
    },
    updateStatus: () =>{
        $("#status span").first().text(++view.correct);
    },
    deletePair: () =>{
        $(".left .current").addClass("goLeft");
        $(".right .current").addClass("goRight");
    },
    shake: async () => {
        $(".current").addClass("shake");
        await timeout(820);
        $(".current").removeClass("shake");
    },
    end: async () => {
        await timeout(200);
        let classes = [".left", ".right", ".leftOverlay", ".rightOverlay"];

        for (let i = 0; i < classes.length; i++) {
            $(classes[i]).addClass("closed");
        }

        $("#play").addClass("goUnder");
        $("#status").removeClass("show");

        await timeout(1000);
        $(".outcome").show();
        $(".outcome").addClass("showOutcome");

        let rowCount = Math.ceil(originalData.length / 3);
        let itemCount = 0;

        for (let i = 0; i < rowCount; i++) {
            $(".outcome").append(view.row);
            
            for (let j = 0; j < 3; j++) {
                view.createItem($(".row").eq(i), originalData[itemCount].text, originalData[itemCount].value);
                itemCount++;

                if (itemCount == originalData.length) {
                    return;
                }
            }

            await timeout(200);
        }
    },
    createItem: async (parent, text, value) => {
        let item = `<div class="item">
                        <p>${text}</p>
                        <div class="bar"></div>
                        <p>${value}</p>
                    </div>`;

        $(parent).append(item);
    },
    fitText: () => {
		$(`.current`).each(function () {
			let size;

			while ($(this).find("p").width() > $(this).width() - 10) {
				size = parseInt($(this).find("p").css("font-size"), 10);
				$(this).find("p").css("font-size", size - 1);
			}
		});
	},
}