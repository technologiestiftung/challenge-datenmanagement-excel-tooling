import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import officeAddin from 'vite-plugin-office-addin';
import eslint from 'vite-plugin-eslint';
import path from 'path';
const devCerts = require('office-addin-dev-certs');

async function getHttpsOptions() {
	const httpsOptions = await devCerts.getHttpsServerOptions();
	return {
		ca: httpsOptions.ca,
		key: httpsOptions.key,
		cert: httpsOptions.cert,
	};
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
	plugins: [
		react(),
		eslint(),
		officeAddin({
			devUrl: 'https://localhost:8080',
			prodUrl: 'https://www.citylab-berlin.org', // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	root: 'src',
	build: {
		rollupOptions: {
			input: {
				taskpane: '/taskpane/taskpane.html',
				commands: '/commands/commands.html',
			},
		},
		outDir: '../dist',
		emptyOutDir: true,
	},
	server:
		mode !== 'production' ? { https: await getHttpsOptions(), port: 8080 } : {},
}));
