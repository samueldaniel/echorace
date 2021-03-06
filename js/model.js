// Derka

var Artist = (function () {

	var previousColor = null;

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

		console.log("Got childen = " + children);
		console.log("center: " + center)

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

	// Given the initial center, returns a graph
	var getInitial = function (to, options) {
		console.log(to);
		EchoNest.addTerms(getNext(to)).then(function () {
			console.log("Got next");
			console.log(this);
			options.success(this);
		}, options.error);
	}

	// Options has success/failure continuations
	var getNext = function (center) 
	{
		var def = new $.Deferred();
		EchoNest.getSimilar(center)
			.done(function () {
				related = this;
				g = makeGraph(assignGroups(center), assignGroups(related));
				def.resolveWith(g, g);
			})
			.fail(function () {
				console.log("Error in getting similar artists!");
				def.rejectWith(this);
			})
		return def.promise();
	}

	var assignGroups = function (nodes) {
		if (_.isArray(nodes)) {
			_.each(nodes, function(n, i) {
				r = _.random(0, 19);
				if (r === previousColor) {
					n.group = _.random(0, 19);
				} else {
					n.group = r;
				}
			});
		} else {
			nodes.group = nodes.group || 0;
			previousColor = nodes.group;
		}
		return nodes;
	}

	// Export the functions we want public
	return {
		getRace: getRace,
		getInitial: getInitial,
		getNext: getNext
	}

})(this)


			