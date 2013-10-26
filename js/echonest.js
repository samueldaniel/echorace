var EchoNest = (function() {

	var delay = 50,
		limit = 5;

	var batchPreFetch = function(artists) {
		console.log("Performing batch prefetch");
		_.each(artists, function(a, i) { 
			_.delay(function () {
				preFetch(a);
			}, delay*i);
		})
	}

	var preFetch = function(artist) {
		console.log("Indiv prefetch on artist = " + artist.name);
		getSimilar(artist, false);
	}

	var _getSimilar = function(artist, prefetch) {
		// console.log("CACHE MISS!!");

		console.log("retrieving artist with id = " + artist.id);

		url = "http://developer.echonest.com/api/v4/artist/similar"
		data = {
			api_key: "MHSE3YIQAWLBHWFSO",
			id: artist.id,
			format: 'json'
		}

		var deferred = new $.Deferred();

		$.get(url, data).done(function (resp) {
			// console.log("Ajax done!");
			var artists = _.first(resp.response.artists, limit);
			deferred.resolveWith(artists);

			// prefetch the next round if desired
			if (prefetch === true) {
				batchPreFetch(artists);
			}
		});

		return deferred.promise();
	}

	var hashFunction = function(artist) {
		return artist.id;
	}

	var getSimilar = _.memoize(_getSimilar, hashFunction);

	return {
		getSimilar: function(artist) {
			return getSimilar(artist, true);
		}
	}

})(this);