define(['jquery', 'when', 'papyrus-md'],
       function($, when, papyrus) {
	   var assert = buster.assert;
	   var interpret = function(md) {
	       var defered = when.defer();
	       var fakeRequire = function(resources, callback) {
		   callback(md);
	       }
	      
	       papyrus.load('the-markdown.md',
			    fakeRequire,
			    defered.resolve);

	       return defered.promise;
	   }
	   
	   var applyTo = function (context) {
	       return function(leafs) {
		   return leafs(context);
	       }
	   }

	   buster.testCase("papyrus", {
	       "interpret paragraph" : function() {
		   var context = $('<div />');
		   return when(interpret("hello world")).
		       then(applyTo(context)).
		       then(function(value) {
			   assert.equals($('p', context).text().trim(), "hello world");
		       })
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
       	       "interpret paragraph with headline" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       "Headline\n" +
			"========="
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   console.log(context);
			   assert.equals($('h1', context).text().trim(), "Headline");
		       })
	       }
	   })
       })
