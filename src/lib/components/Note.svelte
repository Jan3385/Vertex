<script>
	let { children } = $props();
</script>

<div class="border-l-4 border-blue-500 bg-gray-900 p-2 rounded-md m-2">
	<div class="text-lg font-bold text-blue-400 select-none">Note</div>
	<div class="">
		{@render children?.()}
	</div>
</div>