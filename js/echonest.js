var EchoNest = (function() {

	var delay = 50,
		limit = 7,
		api_key = "MHSE3YIQAWLBHWFSO";

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
			api_key: api_key,
			id: artist.id,
			format: 'json'
		}

		return $.get(url, data).then(function (resp) {
			// format the returned data appropriately
			var artists = generateCID(randomSubset(resp.response.artists, limit));
			
			// prefetch the next round if requested
			if (prefetch === true) {
				batchPreFetch(artists);
			}

			// return a promise
			var def = new $.Deferred();
			def.resolveWith(artists);
			return def;
		});	
	}

	var _addTerms = function (artist) {
		url = "http://developer.echonest.com/api/v4/artist/terms"
		data = {
			api_key: api_key,
			id: artist.id,
			format: 'json',
			sort: 'weight'
		}

		console.log("Making http req for terms");

		return $.get(url, data).then(function (resp) {
			artist.terms = _.pluck(_.first(resp.response.terms, 3), 'name');
			console.log("Resolved terms with:");
			console.log(artist.terms);

			return new $.Deferred().resolveWith(artist, artist);
		});
	}

	var addTerms = function(def) {
		return def;
		console.log("Add terms got:")
		console.log(def.state());
		var master = def.then(function () {
			console.log("artists given =");
			console.log(this);
			var defs  = _.map(this, function(a) {
				return _addTerms(a);
			});

			return $.when.apply(null, defs);
		});

		console.log("Master deferred");
		console.log(master);

		return master.done(function (arg) {
			console.log("addTerms master deferred has resolved with");
			console.log(this);
			console.log(arg);
		});
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
			console.log("Call to get similar on ");
			console.log(artist);
			return addTerms(getSimilar(artist, true));
		},

		addTerms: function (deferred) {
			return addTerms(deferred);
			// return addTerms(new $.Deferred.promise(artist));
		}
	}

})(this);