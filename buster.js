var config = module.exports;

config["browser tests"] = {
    environment: "browser",
    sources: ["papyrus*.js",
	      "modules/foliage/foliage.js",
	      "modules/markdown-js/lib/markdown.js",
	      "modules/lodash/lodash.js",
	      "modules/when/**/*.js",
	      "modules/curl/src/curl/plugin/js.js"
	     ],
    tests: ["test/*.js"],
    libs: ["modules/curl/src/curl.js", 
	   "loaderconf.js", 
	   "ext/*.js"],
    extensions: [require("buster-amd")]
};


