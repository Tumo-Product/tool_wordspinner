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
            value: "Once"
        },
        {
            text: "Food",
            value: "Twice"
        },
        {
            text: "Water",
            value: "Three times"
        }
    ]
}