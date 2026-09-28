/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.php', './public/assets/js/**/*.js'],
	theme: {
		extend: {
			colors: {
				brandPrimary: '#009688',
				brandNeutral: '#0F172A',
			},
			fontFamily: {
				sans: ['"Montserrat"', 'sans-serif'],
				headline: ['"Karla"', 'sans-serif'],
				body: ['"Open Sans"', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
