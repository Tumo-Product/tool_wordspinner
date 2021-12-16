axios.defaults.baseURL = "https://content-tools.tumo.world:4000/";

const parser = {
    dataFetch: async () =>
	{
        let get_url = document.location.href;
		let url     = new URL(get_url);
		let _uid    = url.searchParams.get("_uid");

        return      axios.get(config.query_url + _uid);
	}
}