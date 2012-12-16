define(['foliage', 'lodash', 'js!markdown'], function(f, _) {
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
	listitem: f.li
    }

    interpret = function(next) {
	console.log("interpret: ", next);
	if(_.isArray(next)) {
	    var name = _.first(next);
	    var rest = _.rest(next);
	    console.log("name: ", name, "rest: ", rest);
	    var result = elemHandlers[name].apply(this, _.map(rest, interpret));
	    console.log("result: ", result);
	    return result;
	}
	return next
    };


    return {
	load: function(resourceName, 
		       req, 
		       callback) {

	    req(resourceName, function(md) {
		var tree = markdown.parse(md);
		var res = interpret(tree);
		console.log(res);
		callback(res);
	    })
	}
    }
})
