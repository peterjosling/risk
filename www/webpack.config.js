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
			{ test: /\.css$/, loader: 'style!css' },
			{ test: /\.ts$/, loader: 'ts-loader?additionalFiles[]=../../lib/webpack/require.d.ts' },
			{ test: /\.hbs$/, loader: 'handlebars-loader' }
		]
	},
	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
	},
	devtool: 'source-map'
};
