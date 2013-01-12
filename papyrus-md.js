define(['foliage', 'lodash', 'when', 'phloem',  'js!markdown'], function(f, _, when, phloem) {
    var interpret;
    var elemHandlers = {
	markdown: f.all,
	para: f.p,
	strong: f.strong,
	em: f.em,
	header: function(arg) {
	    return f['h'+arg.level].apply(this,_.rest(_.toArray(arguments)));
	},
	bulletlist: f.ul,
	numberlist: f.ol,
	listitem: f.li,
	inlinecode: f.pre,
	link: f.a,
	img: function(elem) {
	    var attr = {alt: elem.alt, src: elem.href};
	    return f.img(attr)},
	blockquote:f.blockquote
    }

    interpret = function(next) {
	if(_.isArray(next)) {
	    var name = _.first(next);
	    var handler = elemHandlers[name];
	    if(!handler) {
		console.log(next);
		throw Error("No handler for: "+name);
	    }
	    var rest = _.rest(next);
	    var result = handler.apply(this, _.map(rest, interpret));
	    return result;
	}
	return next
    };

    var splitAST = function(ast, fn) {
	function find(ast, fn) {
	    var foundAt;
	    var found = _.find(ast, function(element, index)  {
		foundAt = fn(element) && index;
		return foundAt;
	    });
	    return foundAt;
	}

	var foundAt = find(ast, fn);
	if(foundAt) {
	    var rest = _.drop(ast, foundAt +1 )
	    var stop = find(rest, fn);
	    var res = stop ? [ast[foundAt]].concat(_.take(rest, stop)) : _.drop(ast, foundAt);
	    var next = stop ? _.drop(rest, stop) : rest;
	    return {value: ['markdown'].concat(res), 
		    next: stop ? when(splitAST(['markdown'].concat(next), fn)) : phloem.EOF
		   };
	}

	return {value: ast};
    };

    return {
	load: function(resourceName, 
		       req, 
		       callback) {

	    req(['text!'+resourceName], function(md) {
		var tree = markdown.parse(md);
		var res = interpret(tree);
		res.AST = tree;
		res.toFoliage = interpret;
		res.split = splitAST;
		callback(res);
	    })
	}
    }
})
