curl({
    paths: {
	jquery: 'ext/jquery-1.8.2',
	'curl/plugin': 'modules/curl/src/curl/plugin'
    },
    packages : {
	when: {
	    path: 'modules/when',
	    main: 'when'
	},
	markdown: {
	    path: 'modules/markdown-js/lib',
	    main: 'markdown.js'
	},
	lodash: {
	    path: 'modules/lodash',
	    main: 'lodash'
	},
	foliage: {
	    path: 'modules/foliage',
	    main: 'foliage'
	}
    }
    
});

define('buster', function() {
    return buster;
})

window.require = curl;


