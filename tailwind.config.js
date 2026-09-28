/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.php', './public/assets/js/**/*.js'],
	theme: {
		extend: {
			colors: {
				// Theme-aware teal (see --brand-primary in src/css/app.css): the reference #009688, adjusted per theme for WCAG AA text contrast
				brandPrimary: 'rgb(var(--brand-primary) / <alpha-value>)',
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
