import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import fs from "fs";

export default defineConfig(() => {
	const PORT = process.env.APP_ENV == "dev" ? 5921 : 8821;

	if (process.env.APP_ENV == "dev") {
		return {
			plugins: [sveltekit()],
			server: {
				port: PORT
			},
			preview: { port: PORT }
		}
	} else {
		return {
			plugins: [sveltekit()],
			server: {
				port: PORT,
				https: {
					key:  fs.readFileSync("/etc/letsencrypt/live/rtk-joyo-comparer.toralv.dev/privkey.pem"),
					cert: fs.readFileSync("/etc/letsencrypt/live/rtk-joyo-comparer.toralv.dev/cert.pem")
				},

			},
			preview: { port: PORT }
		}
	}
});
