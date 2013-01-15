define(['jquery', 'when', 'papyrus-md', 'foliage', 'phloem'],
       function($, when, papyrus, f, phloem) {
	   var assert = buster.assert;
	   var interpret = function(md, conf) {
	       var defered = when.defer();
	       var fakeRequire = function(resources, callback) {
		   callback(md);
	       }
	      
	       papyrus.load('the-markdown.md',
			    fakeRequire,
			    defered.resolve,
			    conf || {});

	       return defered.promise;
	   }
	   
	   var applyTo = function (context) {
	       return function(leafs) {
		   return leafs(context);
	       }
	   }

	   var AST = function(leafs) {
	       return leafs.AST;
	   }

	   var toFoliage = function(leafs, ast) {
	       return leafs.toFoliage(ast);
	   }

	   var toSplit = function(fn) {
	       return  function(leafs, ast) {
		   return leafs.split(ast, fn);
	       }
	   }
	   
	   var identity = function(value) { return value };

	   var pick = function() {
	       var defered = arguments;
	       return function(val) {
		   return _.map(defered, function(arg){return arg(val);});
	       }
	   }

	   buster.testCase("papyrus", {
	       "parsed AST is accessible" : function() {
		   return when(interpret("hello world")).
		       then(AST).
		       then(function(ast) {
			   assert.equals(ast, ['markdown', ['para', 'hello world']]);
		       });
	       },
	       "possible to explicitly interpret AST": function() {
		   var context = $('<div />');
		   return when(interpret("stuff")).
		       then(pick(identity, AST)).
		       spread(toFoliage).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('p', context).text().trim(), "stuff");
		       });
		    
	       },
	       "possible to split AST on function": function() {
		   var context = $('<div />');
		   return when(interpret("headline\n"+
					 "========\n"+
					 "text1\n"+
					 "\n"+
					 "headline2\n"+
					 "========\n"+
					 "text2\n")).
		       then(pick(identity, AST)).
		       spread(toSplit(function(element) {
			   return _.isArray(element) && element.length > 2 && element[0] === 'header'
		       })).
		       then(function(value) {
			   assert.equals(value.value, ['markdown', ['header', {level: 1}, 'headline'], ['para', 'text1']])
			   return value;
		       }).
		       then(phloem.next).
		       then(function(value) {
			   assert.equals(value.value, ['markdown', ['header', {level: 1}, 'headline2'], ['para', 'text2']])
			   return value;
		       }).
		       then(phloem.next).
		       then(function(value) {
			   assert.equals(value, phloem.EOF);
		       });
	       },
	       "interpret paragraph" : function() {
		   var context = $('<div />');
		   return when(interpret("hello world")).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('p', context).text().trim(), "hello world");
		       });
	       },
       	       "interpret paragraph with strong" : function() {
		   var context = $('<div />');
		   return when(interpret("hello **world**")).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('p strong', context).text().trim(), "world");
		       })
	       },
       	       "interpret paragraph with em" : function() {
		   var context = $('<div />');
		   return when(interpret("*hello* **world**")).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('p em', context).text().trim(), "hello");
		       })
	       },
       	       "interpret headline" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       "Headline\n" +
			"========="
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('h1', context).text().trim(), "Headline");
		       })
	       },
       	       "interpret section" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       "Section\n" +
			"----------"
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('h2', context).text().trim(), "Section");
		       })
	       },
      	       "interpret headline1" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       "# Headline 1 #"
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('h1', context).text().trim(), "Headline 1");
		       })
	       },
      	       "interpret headline2" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       "## Headline 2 ##"
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('h2', context).text().trim(), "Headline 2");
		       })
	       },
      	       "interpret headline6" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       "###### Headline 6 ######"
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('h6', context).text().trim(), "Headline 6");
		       })
	       },
      	       "interpret unordered list" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       " * item1\n"+
		       " * item2\n"
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('ul li', context).text().trim(), "item1\nitem2");
		       })
	       },
      	       "interpret ordered list" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       " 1. item1\n"+
		       " 1. item2\n"
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('ol li', context).text().trim(), "item1\nitem2");
		       })
	       },
	       "interpret codeblock" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       "```javascript\n"+
		       "var a = function(){return '';}```\n"
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('pre', context).text().trim(), "javascript\nvar a = function(){return '';}");
		       })
	       },
	       "interpret block quote" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       "> row 1\n"+
		       "> row 2"
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('blockquote p', context).text().trim(), "row 1\nrow 2");
		       })
	       },
	       "interpret block quote" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       "> row 1\n"+
		       "> row 2"
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('blockquote p', context).text().trim(), "row 1\nrow 2");
		       })
	       },
	       "interpret codeblock" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       "    row 1\n"+
		       "    row 2"
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('code', context).text().trim(), "row 1\nrow 2");
		       })
	       },
	       "interpret image" : function() {
		   var context = $('<div />');
		   return when(interpret('![alt text](images/image.png)')).
		       then(applyTo(context)).
		       then(function(value) {
			   var link = $('img', context);
			   assert.equals(link.attr('alt'), 'alt text');
			   assert.equals(link.attr('src'), 'images/image.png');
		       });
	       },
	       "uses handler from conf if available" : function () {
		   var context = $('<div />');
		   return when(interpret('[link text](linkUrl)', 
					{link: function(element) {
					    return f.p({id: "subst"}, element.href);
					}})).
		       then(applyTo(context)).
		       then(function(value) {
			   var link = $('p#subst', context);
			   assert.equals(link.text().trim(), 'linkUrl');
		       })
	       }
	   })
       })
