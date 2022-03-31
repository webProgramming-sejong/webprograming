const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const htmlConfig = {
	// title: 'Just a Demo',
	// filename: './index.html',
	template: path.resolve(__dirname, '../src/index.html'),
	minify: true
};

module.exports = {
	entry: {
		main: path.resolve(__dirname, '../src/index.js')
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].[contenthash].js',
		clean: true,
		assetModuleFilename: '[name][ext]',
		publicPath: '/'
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, '../assets')
				}
			]
		}),
		new HtmlWebpackPlugin(htmlConfig),
		new MiniCSSExtractPlugin()
	],
	module: {
		rules: [
			//html
			{
				test: /\.html$/,
				use: ['html-loader'] // 흑흑 시발 ...
			},
			//css
			{ test: /\.css$/, use: [MiniCSSExtractPlugin.loader, 'css-loader'] },
			{
				test: /\.s[ac]ss$/,
				exclude: /node_modules/,
				use: [MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader']
			},

			//image
			{
				test: /\.(svg|ic|png|webp|jpg|gif|jpeg)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/image/[name][ext]'
				}
			},

			// es5
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			//font
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name][ext]'
				}
			}
		]
	}
};
