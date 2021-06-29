const view = {
    addPair: (current, top, bottom) => {
        $(".left").append(`<div class="top">${top.text}</div>`);
        $(".left").append(`<div class="current">${current.text}</div>`);
        $(".left").append(`<div class="bottom">${bottom.text}</div>`);
    },
    updatePair: async (current, top, bottom, dir) => {
        if (dir > 0) {
            $(".bottom").remove();

            $(".current").addClass("bottom");
            $(".current").removeClass("current");
            $(".bottom").text(bottom.text);

            $(".top").addClass("current");
            $(".top").removeClass("top");
            $(".current").text(current.text);
            
            $(".current").before(`<div class="top">${top.text}</div>`);
        } else {
            $(".top").remove();

            $(".current").addClass("top");
            $(".current").removeClass("current");
            $(".top").text(top.text);

            $(".bottom").addClass("current");
            $(".bottom").removeClass("bottom");
            $(".current").text(current.text);

            $(".current").after(`<div class="bottom">${bottom.text}</div>`);
        }
    }
}