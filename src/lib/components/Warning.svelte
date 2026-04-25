<script>
	let { children } = $props();
</script>

<div class="border-l-6 border-yellow-600 bg-amber-950 p-2 rounded-md rounded-l-none m-2">
	<div class="text-lg font-bold text-yellow-600 select-none">Warning!</div>
	<div class="">
		{@render children?.()}
	</div>
</div>