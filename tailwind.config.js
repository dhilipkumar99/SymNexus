import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'crystal-rose':  '#d4a0b0',
				'crystal-blush': '#e8c4cf',
				'prismatic-cyan': '#40e0d0',
				'prismatic-blue': '#7b8fe8',
				'verdant':        '#6caa5c',
				'warm-white':     '#faf8f5',
				'paper':          '#f2f0ec',
				slate: {
					50:  '#f5f3fa',
					100: '#e8e4f0',
					200: '#c8c2d8',
					300: '#a099b4',
					400: '#7b728f',
					500: '#5e5674',
					600: '#3d3652',
					700: '#2a2538',
					800: '#1e1a2a',
					900: '#16131f',
					950: '#0f0d15',
				}
			},
			fontFamily: {
				display: ['DM Serif Display', ...fontFamily.serif],
				heading: ['Space Grotesk', ...fontFamily.sans],
				body:    ['Inter', ...fontFamily.sans],
				mono:    ['JetBrains Mono', ...fontFamily.mono],
			},
			maxWidth: {
				'8xl': '88rem',
				'9xl': '96rem',
			},
			keyframes: {
				aurora: {
					'0%':   { backgroundPosition: '50% 50%, 50% 50%' },
					'100%': { backgroundPosition: '350% 50%, 350% 50%' },
				},
				'fade-up': {
					'0%':   { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in': {
					'0%':   { opacity: '0' },
					'100%': { opacity: '1' },
				},
			},
			animation: {
				aurora:    'aurora 60s linear infinite',
				'fade-up': 'fade-up 0.8s cubic-bezier(0.23,1.01,0.32,1) both',
				'fade-in': 'fade-in 0.6s ease both',
			},
		}
	},
	plugins: []
};
