exports.devServer = ({ host, port } = {}) => ({
	/*==========================
	=== Config for webpack-serve - Choose either this or dev server
	===========================*/
	serve: {
		host,
		port,
		open: false,
	},
	/*==========================
	=== Config for webpack dev server - Choose either this or serve
	===========================*/
	devServer: {
		stats: 'errors-only',
		host,
		port,
		open: false,
		overlay: true,
	},
});
