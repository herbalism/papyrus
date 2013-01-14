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
	    return f.img(attr)},
	blockquote:f.blockquote
    }

    interpret = function(next, handlers) {
	if(_.isArray(next)) {
	    var name = _.first(next);
	    var handlers = handlers;
	    var handler = handlers[name];
	    if(!handler) {
		console.log(next);
		throw Error("No handler for: "+name);
	    }
	    var rest = _.rest(next);
	    var result = handler.apply(this, _.map(rest, 
						   function(elem) {return interpret(elem, handlers)}));
	    return result;
	}
	return next
    };


    return {
	load: function(resourceName, 
		       req, 
		       callback,
		       config) {

	    req(['text!'+resourceName], function(md) {
		var tree = markdown.parse(md);
		var configuredHandlers = _.extend({}, elemHandlers, config); 
		var res = interpret(tree, configuredHandlers);
		res.AST = tree;
		res.toFoliage = function(elem) {return interpret(elem, configuredHandlers)};
		callback(res);
	    })
	}
    }
})
