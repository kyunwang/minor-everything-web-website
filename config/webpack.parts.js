const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';

exports.loadCss = ({ include, exclude } = {}) => ({
	module: {
		rules: [
			{
				test: /\.css$/,
				include,
				exclude,
				use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
});

exports.loadSass = ({ include, exclude, devMode } = {}) => ({
	module: {
		rules: [
			{
				test: /\.(scss|sass)$/,
				include,
				exclude,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					'fast-sass-loader',
				],
			},
		],
	},
});

exports.loadCssSVG = ({ include, exclude } = {}) => ({
	module: {
		rules: [
			{
				test: /\.svg/,
				use: {
					loader: 'svg-url-loader',
				},
			},
		],
	},
});
