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
	},

	setFavoritesPlaylistId: function(favoritesPlaylistId){ 
		this.favoritesPlaylistId = favoritesPlaylistId;
	},

	getLikes: function (videoId) {
		return gapi.client.request({
	        path: '/youtube/v3/videos/getRating',
	        params: {
	            'id': videoId
	        }
	    }); 
	},

	handleClientLoad: function (callbackFunction){
	    gapi.client.setApiKey(this.apiKey);
	    window.setTimeout(callbackFunction, 1);	
	},

	authenticate: function (immediate, clientId, scope, callbackFunction){
		console.log(immediate);
		console.log(clientId);
		console.log(scope);
	    return gapi.auth.authorize({
	        client_id: clientId,
	        scope: scope,
	        immediate: immediate
	    }, callbackFunction);
	},

	//Rates a video. Rating type -> like, dislike, none
	rateVideo: function(videoId, ratingType){
		return gapi.client.request({
            path: '/youtube/v3/videos/rate',
            method: 'POST',
            params: {
                'id': videoId,
                'rating': ratingType
            }
        });
	},

	// Retrieve videos from a given playlistId
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
	},

	// Creates a playlist for the user's account.
	createPlaylist: function(title){
		return gapi.client.request({
            path: '/youtube/v3/playlists',
            method: 'POST',
            params: {
                'part': 'snippet'
            },
            body:{
                'snippet': {
                    'title': title
                }
            }
        });
	},

	// Lists all videos from favorites playlist
	getFavoriteVideos: function () {  
	    return gapi.client.request({
	        path: '/youtube/v3/playlistItems',
	        params: {
	            'part': 'id, snippet', 
	            'playlistId': this.favoritePlaylistId
	        }
	    });
	},

	// Adds a given video to favorites playlist
	addVideoToFavorites: function(videoId) {
		return gapi.client.request({
            path: '/youtube/v3/playlistItems',
            method: 'POST',
            params: {
                "part": "id, snippet",
            },
            body: {
                "snippet": {
                    "playlistId": this.favoritesPlaylistId,
                    "resourceId": {
                      "kind": "youtube#video",
                      "videoId": videoId,
                    }
                }
            }
        });
	},

	// Note that whenever a video is in a playlist, it has its own playlistItemId. This method DOES NOT use videoId.
	removeVideoFromFavorites: function(playlistItemId) {
		return gapi.client.request({
            path: '/youtube/v3/playlistItems',
            method: 'DELETE', 
            params: {
                "part": "id, snippet",  
                "id": playlistItemId 
            } 
        });
	},

	loadFavoritesPlaylistId: function () {    
        gapi.client.request({
            path: '/youtube/v3/channels', 
            params: {
                'part': 'id, snippet, contentDetails',
                'mine': true
            }
        }).then(function(resp) {  
            favoritePlaylistId = resp.result.items[0].contentDetails.relatedPlaylists.favorites;
            this.favoritesPlaylistId = favoritePlaylistId;
        },function(err) {
            console.log("YTAPI: There was an unexpected error: " + err);
        }); 
    },

    listComments: function(videoId) {
    	return gapi.client.request({
	        path: '/youtube/v3/commentThreads',
	        params: {
	            'part': 'id, replies, snippet',
	            'videoId': videoId,
	            'order': 'time'
	        }
	    });
    },

    postComment: function(videoId, commentText) {
    	return gapi.client.request({
	        path: '/youtube/v3/commentThreads',
	        method: 'POST',
	        params: {
	            "part": "id, snippet",
	        },
	        body: {
	            "snippet": {
	                "channelId": this.channelId,
	                "videoId": videoId,
	                "topLevelComment": {
	                    "snippet": {
	                        "textOriginal": commentText,
	                    }
	                }
	            }
	        }
	    });
    }
};