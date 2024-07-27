import { browser } from "$app/environment";
import { locale, waitLocale } from "svelte-i18n";

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, params }) {
	if (browser) {
		locale.set(window.navigator.language);
	}
	await waitLocale();

	return;
}
