// axios.defaults.baseURL = "https://blackboxbasic.herokuapp.com/";

const parser = {
    dataFetch: async () => {
        return words;
        // return axios.get(config.query_url + _uid);
    }
}

const words = {
    objects: [
        {
            text: "Plastic",
            value: "Once or twice"
        },
        {
            text: "Test",
            value: "Twice"
        },
        {
            text: "Water",
            value: "Three times"
        },
        {
            text: "ab",
            value: "Once"
        },
        {
            text: "ca",
            value: "Infinite"
        },
        {
            text: "ds",
            value: "Three times"
        }
    ]
}