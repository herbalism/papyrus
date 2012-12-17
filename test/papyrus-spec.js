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
       	       "interpret headline" : function() {
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
	       },
       	       "interpret section" : function() {
		   var context = $('<div />');
		   return when(interpret(
		       "Section\n" +
			"----------"
		   )).
		       then(applyTo(context)).
		       then(function(value) {
			   console.log(context);
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
			   console.log(context);
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
			   console.log(context);
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
			   console.log(context);
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
			   console.log(context);
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
			   console.log(context);
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
			   console.log(context);
			   assert.equals($('pre', context).text().trim(), "javascript\nvar a = function(){return '';}");
		       })
	       }
	   })
       })
