<script>
	let { title = "", children } = $props();
</script>

<section style="padding: 0 10px 10px 10px; width: 100%; box-sizing: border-box;">
	<h1>{title}</h1>
	<div style="font-weight: normal; margin-top: 16px; display: flex; flex-direction: row; flex-wrap: wrap;">
		{@render children?.()}
	</div>
</section>

<style>
	a {
		margin-left: 4px;
	}
</style>
