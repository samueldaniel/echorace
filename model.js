// Derka

var Artist = (function () {

	var randomElement = function (list)
	{
		return list[_.random(list.length)];
	}

	var randomElementNotPresentIn = function (list, blackobj) 
	{
		while (1) {
			var e = randomElement(list);
			if (e !== blackobj) {
				return e;
			}
		}
	}

	var cons = function (x, xs) {
		var all = [x];
		Array.prototype.push.apply(all, xs);
		return all;
	}

	// Adds the links to the center/child graph
	var makeGraph = function(center, children) {
		var links = _.map(children, function(i, child) {
			return {
				source: 0,
				target: i,
				value: i
			}
		});

		return {
			center: center,
			links: links,
			all: cons(center, children)
		}
	}

	// Randomly generates to/from artists
	var getRace = function () {
		var from = randomElement(artists);
		var to = randomElementNotPresentIn(artists, from);
		
		return {
			from: from,
			to: to
		};
	}

	// Options has a success continuation
	var getSimilar = function (artist, options) {
		url = "http://developer.echonest.com/api/v4/artist/similar"
		data = {
			api_key: "MHSE3YIQAWLBHWFSO",
			id: artist.id,
			format: 'json'
		}
		$.get(url, data).done(function (resp) {
			options.success(resp.response.artists);
		});
	}

	// Given the initial center, returns a graph
	var getInitial = function (to, options) {
		console.log(to);
		getNext(to, options);
	}

	// Options has success/failure continuations
	var getNext = function (center, options) 
	{
		getSimilar(center, {
			success: function (related) {
				console.log("aslkfjldksajfdsafklj");
				console.log(related);
				options.success(makeGraph(assignGroups(center), assignGroups(related)));
			},
			error : function (err) {
				console.log("Error in getting similar artists!");
				throw new Error("HOLY SHIT NUTS FUCK SHIT FUCK DICK");
			}
		})
	}

	var assignGroups = function (nodes) {
		if (_.isArray(nodes)) {
			_.each(nodes, function(n, i) {
				n.group = i+1;
			});
		} else {
			nodes.group = 0;
		}
		return nodes;

	}

	var parseEchoResults = function(center, children) {

	}

	// Export the functions we want public
	return {
		getRace: getRace,
		getInitial: getInitial,
		getNext: getNext
	}

})(this)


			