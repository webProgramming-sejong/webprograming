const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const ip = require('ip');
const portFinderSync = require('portfinder-sync');

const infoColor = (_message) => {
	return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`;
};

module.exports = merge(commonConfig, {
	stats: 'errors-only',
	mode: 'development',
	infrastructureLogging: {
		level: 'warn'
	},
	devServer: {
		static: [
			{
				directory: path.join(__dirname, '../assets'),
				// staticOptions: {
				// 	watchContentBase: true,
				// 	watchFiles: ['src/*', 'static/*']
				// },
				publicPath: '/assets',
				watch: true
			}
		],
		client: {
			progress: true,
			logging: 'info',
			overlay: true,
			reconnect: 5
		},
		compress: true,
		port: portFinderSync.getPort(8080),
		open: true,
		hot: false,
		watchFiles: ['src/**', 'assets/**'],
		allowedHosts: ['.'],
		server: 'http',
		host: 'local-ip',

		setupMiddlewares: (middleWares, devServer) => {
			if (!devServer) {
				throw new Error('webpack-dev-server is not defined');
			}

			const port = devServer.options.port;
			const https = devServer.options.server.type === 'https' ? 's' : '';
			const localIP = ip.address();
			const httpDomain = 'http' + https + '://' + localIP + ':' + port;
			const localHostDomain = 'http' + https + '://localhost:' + port;

			console.log(`Server running at : \n${infoColor(httpDomain)}\n${infoColor(localHostDomain)}`);

			return middleWares;
		}
	},
	devtool: 'source-map'
});
