const view = {
    yellow: "#EBD730", red: "red", green: "green",

    addPair: (current, top, bottom, parent, type) => {
        let currentText = type == 0 ? current.text : current.value;
        let topText = type == 0 ? top.text : top.value;
        let bottomText = type == 0 ? bottom.text : bottom.value;

        $(parent).append(`<div class="top">${topText}</div>`);
        $(parent).append(`<div class="current">${currentText}</div>`);
        $(parent).append(`<div class="bottom">${bottomText}</div>`);
    },
    updatePair: async (current, top, bottom, dir, parent, type) => {
        let currentText = type == 0 ? current.text : current.value;
        let topText = type == 0 ? top.text : top.value;
        let bottomText = type == 0 ? bottom.text : bottom.value;

        scrolling[type] = true;

        $(parent).find(dir > 0 ? ".bottom" : ".top").addClass(dir > 0 ? "offscreenBottom" : "offscreenTop");

        $(parent).find(".current").addClass(dir > 0 ? "bottom" : "top");
        $(parent).find(".current").removeClass("current");

        $(parent).find(dir > 0 ? ".top" : ".bottom").addClass("current");
        $(parent).find(dir > 0 ? ".top" : ".bottom").removeClass(dir > 0 ? "top" : "bottom");
        $(parent).find(".current").text(currentText);

        if (dir > 0) {
            $(parent).find(".current").before(`<div class="offscreenTop">${topText}</div>`);
        } else {
            $(parent).find(".current").after(`<div class="offscreenBottom">${bottomText}</div>`);
        }

        await timeout(200);
        $(parent).find(dir > 0 ? ".offscreenTop" : ".offscreenBottom").addClass(dir > 0 ? "top" : "bottom");
        $(parent).find(dir > 0 ? ".offscreenTop" : ".offscreenBottom").removeClass(dir > 0 ? "offscreenTop" : "offscreenBottom");

        await timeout (600);
        $(parent).find(dir > 0 ? ".bottom" : ".top").text(dir > 0 ? bottomText : topText);
        $(parent).find(dir > 0 ? ".offscreenBottom" : ".offscreenTop").remove();

        scrolling[type] = false;
    },
    onPlay: async () => {
        $("#status span").last().text(data.length);
        $("#status").addClass("show");
        $(".question").css("opacity", 0);

        $("#play svg").css("opacity", 0);
        $("#play svg").remove();
        await timeout (100);
        $(".icon").load("../graphics/checkmark.svg");
        $(".icon").addClass("checkmark");

        await timeout (1000);
        $(".question").hide("opacity", 0);
        
        await timeout (1000);

        let classes = [".left", ".right", ".leftOverlay", ".rightOverlay"];
        for (let i = 0; i < classes.length; i++) {
            $(classes[i]).removeClass("closed");
        }
    },
    changeColor: (color) => {
        $("path").removeClass("green red");
        $("path").addClass(color);
    }
}