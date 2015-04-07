module.exports = {
	entry: {
		app: ['webpack/hot/dev-server', './src/js/app.ts']
	},
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: 'style!css!autoprefixer-loader' },
			{ test: /\.ts$/, loader: 'ts-loader?additionalFiles[]=../../lib/webpack/require.d.ts&additionalFiles[]=../../lib/es6-promise/es6-promise.d.ts' },
			{ test: /\.hbs$/, loader: 'handlebars-loader' },
			{ test: /\.less$/, loader: 'style!css!autoprefixer-loader!less'}
		]
	},
	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
	},
	devtool: 'source-map'
};
