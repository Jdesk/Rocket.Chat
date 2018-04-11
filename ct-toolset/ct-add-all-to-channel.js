/* exported Script */
/* globals console, _, s, HTTP */

/** Global Helpers
 *
 * console - A normal console instance
 * _       - An underscore instance
 * s       - An underscore string instance
 * HTTP    - The Meteor HTTP object to do sync http calls
 */

var axios = require("axios");

let rcRestEndPoint = "https://chat.convergenttrading.com/api/v1";

let rcUser = "notices@convergenttrading.com";
let rcPass = "{SZU>^wEq}7Gzc~`";
var message = "";

async function addAllUsersToChannels(channels) {
	var url = rcRestEndPoint + "/login";

	var authResponse = await axios.post(
		url,
		{ user: rcUser, password: rcPass },
		{ headers: { "Content-type": "application/json" } }
	);

	authResponse = authResponse.data;

	var headers = {
		"X-Auth-Token": authResponse.data.authToken,
		"X-User-Id": authResponse.data.userId
	};
	headers["Content-type"] = "application/json";

	url = rcRestEndPoint + '/channels.list?count=1000&fields={"_id":1,"name":1}';
	let channelListResponse = await axios.get(url, { headers: headers });

	var channelsByNameLower = [];

	channelListResponse.data.channels.forEach(function(channelObj) {
		channelsByNameLower[channelObj.name.toLowerCase()] = channelObj._id;
	});

    try{

    
	for (var channel of channels) {
        if(channelsByNameLower[channel.toLowerCase()])
        {
            var resp = await axios.post(
                rcRestEndPoint + "/channels.addAll",
                { roomId: channelsByNameLower[channel.toLowerCase()] },
                { headers: headers }
            );
    
            console.log(
                "Added all users to channel: " +
                    channel +
                    " " +
                    JSON.stringify(resp.data, null, 2)
            );
        }
        else
        {
            console.error("invalid channel",channel)
        }
		
    }
    
    }
    catch (e)
    {
        console.error("err",e)
    }
}

addAllUsersToChannels(["european_markets","_head_traders","mental_edge"]);

class Script {
	/**
	 * @params {object} request
	 */
	prepare_outgoing_request({ request }) {
		return prepareOutgoingRequest({ request: request });
	}

	/**
	 * @params {object} request, response
	 */
	process_outgoing_response({ request, response }) {
		return processOutgoingResponse({ request: request, response: response });
	}
}

function prepareOutgoingRequest({ request }) {
	// request.params            {object}
	// request.method            {string}
	// request.url               {string}
	// request.auth              {string}
	// request.headers           {object}
	// request.data.token        {string}
	// request.data.channel_id   {string}
	// request.data.channel_name {string}
	// request.data.timestamp    {date}
	// request.data.user_id      {string}
	// request.data.user_name    {string}
	// request.data.text         {string}
	// request.data.trigger_word {string}

	let match;

	if (
		request.data.text &&
		request.data.text.indexOf("add_all_users_to_channel") == 0
	) {
		try {
			message = request.data.text.trim();
			if (true) {
				var url = rcRestEndPoint + "/login";
				return {
					url: url,
					data: { user: rcUser, password: rcPass },
					headers: { "Content-type": "application/json" },
					method: "POST"
				};
			}
		} catch (e) {
			console.log(JSON.stringify(e, null, 2));
		}
	}
}

function processOutgoingResponse({ request, response }) {
	// Get Auth Token

	var headers = {
		"X-Auth-Token": response.content.data.authToken,
		"X-User-Id": response.content.data.userId
	};

	var url =
		rcRestEndPoint + '/channels.list?count=1000&fields={"_id":1,"name":1}';

	var numberOfRoomsPosted = 0;

	var whiteListedChannels = [];

	if (message.indexOf("add_all_users_to_channel (") == 0) {
		var channels = message.substring(
			message.indexOf("(") + 1,
			message.indexOf(")")
		);
		channels = channels.toLowerCase();
		console.log(channels);
		whiteListedChannels = channels.split(" ");

		console.log(JSON.stringify(whiteListedChannels, null, 2));
		//message = message.substring(message.indexOf(")")+1).trim();
	} else {
		whiteListedChannels = null;
		// message = message.substring(9).trim();
	}

	headers["Content-type"] = "application/json";
	try {
		let channelListResponse = HTTP("get", url, { headers: headers });

		console.log(
			JSON.stringify(channelListResponse.result.data.channels, null, 2)
		);

		channelListResponse.result.data.channels.forEach(function(channelObj) {
			console.log(
				"checking " + channelObj.name + " against " + whiteListedChannels
			);

			if (
				whiteListedChannels.length > 0 &&
				whiteListedChannels.includes(channelObj.name.toLowerCase())
			) {
				++numberOfRoomsPosted;
				try {
					var resp = HTTP("post", rcRestEndPoint + "/channels.addAll", {
						data: { roomId: channelObj._id, roomid: channelObj._id },
						headers: headers
					});
					console.log(
						"Added all users to channel: " +
							channelObj.name +
							" " +
							JSON.stringify(resp, null, 2)
					);
				} catch (e) {
					console.log(
						"Error adding all users to channel " +
							JSON.stringify(channelObj, null, 2) +
							" " +
							JSON.stringify(err, null, 2)
					);
				}
			} else {
				console.log(
					"Skipped channel in all add wasn't white listed: " + channelObj.name
				);
			}
		});
	} catch (e) {
		console.log(JSON.stringify(e, null, 2));
	}

	// Get List of Rooms

	// Post Message to Each Room

	return {
		content: {
			text: "Added all users to " + numberOfRoomsPosted + " channels.",
			parseUrls: false
			// "attachments": [{
			//   "color": "#FF0000",
			//   "author_name": "Rocket.Cat",
			//   "author_link": "https://open.rocket.chat/direct/rocket.cat",
			//   "author_icon": "https://open.rocket.chat/avatar/rocket.cat.jpg",
			//   "title": "Rocket.Chat",
			//   "title_link": "https://rocket.chat",
			//   "text": "Rocket.Chat, the best open source chat",
			//   "fields": [{
			//     "title": "Priority",
			//     "value": "High",
			//     "short": false
			//   }],
			//   "image_url": "https://rocket.chat/images/mockup.png",
			//   "thumb_url": "https://rocket.chat/images/mockup.png"
			// }]
		}
	};
}
