exports.loadCss = ({ include, exclude } = {}) => ({
	module: {
		rules: [
			{
				test: /\.css$/,
				include,
				exclude,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
});

exports.loadSass = ({ include, exclude } = {}) => ({
	module: {
		rules: [
			{
				test: /\.(scss|sass)$/,
				include,
				exclude,
				use: ['style-loader', 'css-loader', 'fast-sass-loader'],
				// use: ['style-loader, css-loader', 'style-loader'],
			},
		],
	},
});
