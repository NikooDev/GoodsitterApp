/** @type {import('tailwindcss').Config} */

const { colors, fonts } = require('./src/assets/theme/goodsitter');

module.exports = {
	content: ['./App.{ts,tsx}', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: colors,
			fontFamily: fonts
		},
	},
	plugins: [],
};
