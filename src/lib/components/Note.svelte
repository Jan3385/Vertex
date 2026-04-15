<script>
	let { children } = $props();
</script>

<div class="border-l-4 border-blue-800 bg-gray-900 p-2 rounded-md m-2">
	<div class="text-lg font-bold text-blue-400 select-none">Note</div>
	<div class="">
		{@render children?.()}
	</div>
</div>

<!--
<fieldset class="border-2 p-2 border-blue-900 bg-gray-900 rounded-md m-1">
	<legend class="font-bold text-blue-400 text-lg select-none">Note</legend>
	<div class="p-0 text-gray-300">
		{@render children?.()}
	</div>
</fieldset>
-->