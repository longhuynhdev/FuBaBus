import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
// https://vite.dev/config/
export default defineConfig({
	plugins: [
		// Doc: https://tanstack.com/router/latest/docs/framework/react/quick-start
		TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
		react(),
		//Doc: https://tailwindcss.com/docs/installation/using-vite
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
