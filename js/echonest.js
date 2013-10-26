var EchoNest = (function() {

	var delay = 50,
		limit = 7;

	var randomElementNotPresentIn = function (list, blacklist) 
	{
		var randomElement = function (list){ 
			return list[_.random(list.length - 1)];
		}
		while (1) {
			var e = randomElement(list);
			if (!_.contains(blacklist, e)) {
				return e;
			}
		}
	}

	var randomSubset = function (list, n) 
	{
		var output = [];
		_.times(n, function(i) {
			output.push(randomElementNotPresentIn(list, output));
		});

		console.log("Random subset generated:");
		console.log(output);
		return output;
	}

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
		url = "http://developer.echonest.com/api/v4/artist/similar"
		data = {
			api_key: "MHSE3YIQAWLBHWFSO",
			id: artist.id,
			format: 'json'
		}

		var deferred = $.get(url, data).then(function (resp) {
			var def = new $.Deferred();

			var artists = randomSubset(resp.response.artists, limit);
			def.resolveWith(generateCID(artists));

			// prefetch the next round if desired
			if (prefetch === true) {
				batchPreFetch(artists);
			}

			return def.promise();
		});	

		return deferred;
	}

	var hashFunction = function(artist) {
		return artist.id;
	}

	var generateCID = function (arg) {
		if (_.isArray(arg)) {
			_.each(arg, function(artist) {
				artist.cid = _.uniqueId();
			})
		} else {
			arg.cid = _.uniqueId();
		}
		return arg;
	}

	var getSimilar = _.memoize(_getSimilar, hashFunction);

	return {
		getSimilar: function(artist) {
			return getSimilar(artist, true);
		}
	}

})(this);