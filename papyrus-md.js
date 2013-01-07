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
	listitem: f.li,
	inlinecode: f.pre,
	link: f.a,
	img: function(elem) {
	    var attr = {alt: elem.alt, src: elem.href};
	    return f.img(attr)}
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


    return {
	load: function(resourceName, 
		       req, 
		       callback) {

	    req(['text!'+resourceName], function(md) {
		var tree = markdown.parse(md);
		var res = interpret(tree);
		res.AST = tree;
		res.toFoliage = interpret;
		callback(res);
	    })
	}
    }
})
