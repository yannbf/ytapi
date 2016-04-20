/*=====================================================
*
*	yt_api : JavaScript framework for youtube API.
*	(c) Yann Braga 2016
*
======================================================*/

/*	_ Object Constructor
========================*/

function yt_api(apiKey, clientId) {

	var tag = document.createElement('script'); 
	tag.src = "https://apis.google.com/js/client.js";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	// About object is returned if there is no 'id' parameter
	var about = {
		Version: 0.1,
		Author: "Yann Braga",
		Created: "April 2016",
		Updated: "18 April 2016"
	};

	if (apiKey) { 	 
		if (window === this) {
			return new yt_api(apiKey);
		} 

		this.apiKey = apiKey;
		this.clientId = clientId;   

		this.channelId = ""; 
		this.uploadsPlaylistId = ""; 
		
		this.scopes = [
		    'https://www.googleapis.com/auth/youtube',
		    'https://www.googleapis.com/auth/youtubepartner',
		    'https://www.googleapis.com/auth/youtube.force-ssl'
		]

		this.favoritesPlaylistId = "";
		this.nextPageToken = ""; 

		return this;
	} else {
		// if no paramater was given, return the 'about' object
		return about;
	}
}

/*	_ Prototype Functions
============================*/

// SET
yt_api.prototype = {

	setApiKey: function(apiKey){
		this.apiKey = apiKey;
	},

	setClientId: function(clientId){
		this.clientId = clientId;
	},

	setChannelId: function(channelId){
		this.channelId = channelId;
	}
}

// GET
yt_api.prototype = { 

	getLikes: function (videoId) {
		return gapi.client.request({
	        path: '/youtube/v3/videos/getRating',
	        params: {
	            'id': videoId
	        }
	    }); 
	},

	retrieveVideos: function (playlistId, maxNumberOfVideos, nextPageToken){   
	    return gapi.client.request({
            path: '/youtube/v3/playlistItems',
            params: {
                'part': 'contentDetails, snippet',
                'playlistId': playlistId,
                'maxResults': maxNumberOfVideos,
                'nextPageToken' : nextPageToken
            }
        });
	}
};