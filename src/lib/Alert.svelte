<script>
	import SwayWindow from "$lib/SwayWindow.svelte";
	import { _ } from "svelte-i18n";

	let { severity = null, code = null } = $props();
</script>

<SwayWindow
	title={code}
	altTitle={code}
	mainStyle="border-color: var(--{severity}); margin: auto; margin-top: 1rem; max-width: 30rem;"
	titleStyle="background-color: var(--{severity}); color: var(--text)"
	contentStyle="text-align: center">
	<p>{$_(code)}</p>
</SwayWindow>
