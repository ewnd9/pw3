import request from 'request-promise';

export let getAccessToken = (pin) => {
	var data = {
		code: pin,
		client_id: '412681ab85026009c32dc6e525ba6226ff063aad0c1a374def0c8ee171cf121f',
  	client_secret: '714f0cb219791a0ecffec788fd7818c601397b95b2b3e8f486691366954902fb',
  	redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
		grant_type: 'authorization_code'
	};

	var params = {
		url:'https://api-v2launch.trakt.tv/oauth/token',
		method: 'POST',
		form: data
	};

	return request(params).then((response) => {
		var body = JSON.parse(response);
		return body.access_token;
	});
};
