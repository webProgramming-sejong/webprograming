const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

const htmlConfig = {
	// title: 'Just a Demo',
	// filename: './index.html',
	template: path.resolve(__dirname, '../src/index.html'),
	minify: true
};

const mainSectionConfig = {
	filename: 'mainSection.html',
	chunks: ['subpage'],
	template: path.resolve(__dirname, '../src/mainSection.html'),
	minify: true
};

const loginConfig = {
	filename: 'login.html',
	chunks: ['subpage'],
	template: path.resolve(__dirname, '../src/login.html'),
	minify: true
};
const signUpConfig = {
	filename: 'signUp.html',
	chunks: ['subpage'],
	template: path.resolve(__dirname, '../src/signUp.html'),
	minify: true
};
const hotelConfig = {
	filename: 'hotel.html',
	chunks: ['subpage'],
	template: path.resolve(__dirname, '../src/hotel.html'),
	minify: true
};

const restaurantConfig = {
	filename: 'restaurant.html',
	chunks: ['subpage'],
	template: path.resolve(__dirname, '../src/restaurant.html'),
	minify: true
};
const detailConfig = {
	filename: 'detail.html',
	chunks: ['subpage'],
	template: path.resolve(__dirname, '../src/detail.html'),
	minify: true
};
const museumConfig = {
	filename: 'museum.html',
	chunks: ['subpage'],
	template: path.resolve(__dirname, '../src/museum.html'),
	minify: true
};
module.exports = {
	entry: {
		main: path.resolve(__dirname, '../src/index.js'),
		section: path.resolve(__dirname, '../src/scripts/mainSection.js'),
		login: path.resolve(__dirname, '../src/style/login.css'),
		signup: path.resolve(__dirname, '../src/style/SignUpStyle.css'),
		hotel: path.resolve(__dirname, '../src/style/hotel.css'),
		restaurant: path.resolve(__dirname, '../src/style/restaurant.css'),
		detail: path.resolve(__dirname, '../src/style/detail.css'),
		museum: path.resolve(__dirname, '../src/style/museum.css')
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].bundle.js',
		clean: true,
		assetModuleFilename: '[name][ext]',
		publicPath: '/'
	},
	optimization: {
		runtimeChunk: 'single'
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
		new HtmlWebpackPlugin(mainSectionConfig),
		new HtmlWebpackPlugin(loginConfig),
		new HtmlWebpackPlugin(signUpConfig),
		new HtmlWebpackPlugin(hotelConfig),
		new HtmlWebpackPlugin(restaurantConfig),
		new HtmlWebpackPlugin(detailConfig),
		new HtmlWebpackPlugin(museumConfig),
		new MiniCSSExtractPlugin({
			filename: '[name].css'
		})
	],
	module: {
		rules: [
			//html
			{
				test: /\.html$/,
				use: ['html-loader']
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
				test: /\.(svg|ic|png|webp|jpg|gif|jpeg|cur)$/,
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
