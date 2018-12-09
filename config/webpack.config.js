const path = require('path');
const webpackMerge = require('webpack-merge');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devConfig = require('./webpack.dev');
const parts = require('./webpack.parts');

require('dotenv').config({ path: path.resolve(__dirname, '../vars.env') });

const devMode = process.env.NODE_ENV !== 'production';
/*==========================
=== Base config
===========================*/
const baseConfig = webpackMerge([
	{
		// mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
		mode: process.env.NODE_ENV || 'development',
		entry: path.resolve(__dirname, '../src/scripts'),
		/*==========================
	=== Plugins
	===========================*/
		plugins: [
			new HTMLWebpackPlugin({
				title: 'Webpack demo',
				template: path.resolve(__dirname, '../index.html'),
			}),
			new MiniCssExtractPlugin({
				filename: devMode ? '[name].css' : '[name].[hash].css',
				chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
			}),
			// new PreloadWebpackPlugin({
			// rel: 'preload',
			// 	as: 'script',
			// }),
		],
	},
	// parts.loadCss(),
	parts.loadSass({
		devmode: devMode,
	}),
	parts.loadCssSVG(),
]);

/*==========================
=== Production config
===========================*/
const productionConfig = webpackMerge([]);

/*==========================
=== Development config
===========================*/
const developmentConfig = webpackMerge([
	devConfig.devServer({
		// Customise host/port here
		host: process.env.HOST,
		port: process.env.PORT,
	}),
]);

module.exports = mode => {
	console.log(mode);

	if (mode === 'production') {
		return webpackMerge(baseConfig, productionConfig, { mode });
	}

	return webpackMerge(baseConfig, developmentConfig, { mode });
};
