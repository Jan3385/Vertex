<script>
	let { children } = $props();
</script>

<div class="border-l-4 border-yellow-600 bg-amber-950 p-2 rounded-md m-2">
	<div class="text-lg font-bold text-yellow-600 select-none">Warning!</div>
	<div class="">
		{@render children?.()}
	</div>
</div>