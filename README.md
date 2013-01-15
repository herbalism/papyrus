Papyrys
=========
Papyrys turns written text such as articles into foliage code. Currently markdown is used and a few methods to transform and query the AST is available.

Usage
----------
You use papyrus as a curl plugin. If you have named papyrys *md* this is how you use it:

``` javascript
define(
	['md!hello-world.md', 'foliage'],
	function(hello, f) {
	// hello is a foliage function at this point
		return f.div(hello);
	});
	
``` 

You can also get the AST to do some initial processing before you render it:

``` javascript
define(
	['md!hello-world.md', 'foliage'],
	function(hello, f) {
	// you can get the AST first
		var ast = hello.AST;
		return f.div(hello.toFoliage(ast));
	});
	
``` 

The above is equivalent to the previous example.		
