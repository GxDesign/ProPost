var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'app');

var config = {
    entry: APP_DIR + '/index.jsx',
    output: {
      path: BUILD_DIR,
      filename: 'main.js'
    },
    module: {
	  loaders: [
    	{ 
    		test: /\.jsx?/, 
	    	include : APP_DIR,
	    	loaders: ["babel-loader"]
    	},
    	{ 
    		test: /\.json?/, 
	    	loaders: ["json"]
    	},
    	{
            test: /\.scss$/,
            loaders: ['style', 'css', 'sass']
        }
	  ]
	}
};

module.exports = config;