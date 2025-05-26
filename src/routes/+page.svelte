<script>
	import SwayWindow from "$lib/SwayWindow.svelte";
	import Grade from "$lib/Grade.svelte";
	import { _ } from "svelte-i18n";
	import rtkIndex from "./rtk1_index.json";
	import joyoIndex from "./joyo_list_extended_V2.json";

	const HEISIG_LEN = 2200;
	
	let qtyLearnt = $state(0);
	let perDay = $state(1);
	let active = $state(new Array(HEISIG_LEN));

	const updateIndex = () => {
		active[qtyLearnt] = true;
		for (let i = 0; i < qtyLearnt; i++)
			active[i] = true;
		for (let i = qtyLearnt; i < HEISIG_LEN; i++)
			active[i] = false;
	}
</script>

<SwayWindow title={$_("general.options")} mainStyle="max-width: 300px; min-width: 300px">
	<h5 style="margin: 0;">{$_("general.rtkQty")}:</h5>
	<p style="margin: 0; font-size: 10pt;"><i>({$_("general.ieLearnt")})</i></p> <!-- todo: make this hoverable -->
	<form style="">
		<input type="number" bind:value={qtyLearnt} min="0" max={HEISIG_LEN} oninput={updateIndex}/>
		<input type="range" bind:value={qtyLearnt} min="0" max={HEISIG_LEN} oninput={updateIndex}/>
	</form>
	<div style="height: 1px; background-color: var(--unfocused_border);	margin: 8px 0 8px 0;"></div>
	<h5>{$_("general.kanji/day")}:</h5>
	<form>
		<input type="number" bind:value={perDay} min="1" max={HEISIG_LEN}/>
		<input type="range" bind:value={perDay} min="1" max="50"/>
	</form>
	<h5>{$_("general.daysDone")}: {Math.round((HEISIG_LEN - qtyLearnt) / perDay)}</h5>
</SwayWindow>

<SwayWindow title={$_("general.grades")}>
	{#each joyoIndex.grades as grade, i}
		<Grade title="{$_("general.grade")} {i == 6 ? "7-12" : i + 1}">
			{#each grade as kanji}
				<a class={active[kanji.heisigIndex - 1] == true ? "kanji active" : "kanji"} href="https://{kanji.jishoHref}">{kanji.kanji}</a>
			{/each}
		</Grade>
		{#if i != 6}
			<div style="height: 1px; background-color: var(--unfocused_border);	margin: 8px 0 8px 0;"></div>
		{/if}
	{/each}
</SwayWindow>

<style>
	.active {
		background-color: var(--accent) !important; /* 必要がある？ */
	}
	.kanji {
		text-align: center;
		align-content: center;
		font-size: 1.3em;
		padding: 2px 4px;
		font-weight: normal;
		color: var(--text_color);
		background-color: var(--unfocused_background);
		margin: 1px;
	}
	form {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	input[type="range"] { 
	accent-color: var(--accent);
	}
	input[type="number"] {
		-moz-appearance: textfield;
		box-sizing: border-box;
		outline: none;
		padding: 4px 6px;
		font-size: 12pt;
		border-radius: 0 !important;
		background-color: var(--bg);
		border: 2px solid var(--border_H);
		caret-color: var(--text);
		color: var(--text);
	}
	input[type="number"]:focus {
		border: 2px solid var(--accent);
	}
	
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
	  -webkit-appearance: none;
	  margin: 0;
	}
</style>
