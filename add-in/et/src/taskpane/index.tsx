import React from 'react';
import App from './components/App';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { ThemeProvider } from '@fluentui/react/lib/Theme';
import { createRoot } from 'react-dom/client';

/* global , Office */

initializeIcons();

let isOfficeInitialized = false;

const title = 'ET Add-in';

const render = (Component: typeof App) => {
	createRoot(document.getElementById('app') as HTMLElement).render(
		<React.StrictMode>
			<ThemeProvider>
				<Component title={title} isOfficeInitialized={isOfficeInitialized} />
			</ThemeProvider>
		</React.StrictMode>,
	);
};

/* Render application after Office initializes */
Office.onReady(() => {
	isOfficeInitialized = true;
	render(App);
});
