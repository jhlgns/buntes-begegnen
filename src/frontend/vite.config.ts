import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	build: {
		//minify: false,
		sourcemap: true,  // TODO: Disable in production
	},
	envPrefix: ["VITE_", "BUNTES_BEGEGNEN_"],
	resolve: {
		alias: {
			"@bb": path.resolve(__dirname, "src"),

		}
	}
});
