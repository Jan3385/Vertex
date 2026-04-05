<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state';

  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();

  const docLinks = [
    { href: resolve('/'), label: 'Getting Started', level: 0 },
    { href: resolve('/setup'), label: 'Setup', level: 1 },
  ] as const;

  function GetClassFromLevel(level: number) {
    switch (level) {
      case 0:
        return 'text-violet-400 rounded px-3 py-1.5 text hover:bg-zinc-700';
      case 1:
        return 'text-violet-300 rounded px-8 py-1.5 text-sm hover:bg-zinc-700';
      default:
        return '';
    }
  }
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen bg-zinc-950">
  <aside class="w-64 border-r border-violet-800 bg-zinc-900 p-6 shrink-0">
    <nav class="flex flex-col gap-2">
      {#each docLinks as link (link.href)}
        <a
          href={link.href}
          class={GetClassFromLevel(link.level)}
          class:font-bold={link.href === page.url.pathname}
          class:text-white={link.href === page.url.pathname}
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </aside>

  <main class="flex-1 p-8 prose prose-invert max-w-none">
    {@render children()}
  </main>
</div>
