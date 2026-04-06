<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { afterNavigate } from '$app/navigation';

  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();

  let mainElement: HTMLElement;

  const docLinks = [
    { href: resolve('/'),                  label: 'Getting Started', level: 0 },
    { href: resolve('/setup'),             label: 'Setup', level: 1 },
    { href: resolve('/creating-a-window'), label: 'Creating a Window', level: 1 },
    { href: resolve('/my-first-triangle'), label: 'My First Triangle', level: 0 },
  ] as const;

  function GetClassFromLevel(level: number) {
    const classBase = 'rounded py-1.5 font-mono hover:bg-zinc-700 border-l-4 ';
    switch (level) {
      case 0:
        return classBase + 'text-violet-400 px-3 underline';
      case 1:
        return classBase + 'text-violet-300 px-7 text-sm';
      case 2:
        return classBase + 'text-violet-300 px-11 text-sm';
      case 3:
        return classBase + 'text-violet-300 px-14 text-sm';
      default:
        return '';
    }
  }

  type heading = {
    id: string;
    text: string;
    level: number;
  };

  let headings = $state<heading[]>([]);
  let activeId = $state('');

  function CollectHeadings() {
    headings = [];
    const headingElements = document.querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6');

    headingElements.forEach((element) => {
      if (element.id) {
        headings.push({
          id: element.id,
          text: element.textContent || '',
          level: parseInt(element.tagName.substring(1)),
        });
      }
    });
  }

  let observer: IntersectionObserver | null = null;

  $effect(() => {
    const pathname = page.url.pathname;
    if (!pathname) return;

    setTimeout(() => {

      CollectHeadings();
      observer?.disconnect();

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) activeId = entry.target.id;
          }
        },
        { rootMargin: '0px 0px -80% 0px' }
      );

      const els = document.querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6');
      els.forEach((el) => observer!.observe(el));
    }, 50);

    return () => observer?.disconnect();
  });

  afterNavigate(() => {
    mainElement.scrollTo({ top: 0, behavior: 'smooth' });
  });
</script>

<svelte:head>
  <title>Vertex: { docLinks.find((link) => link.href === page.url.pathname)?.label || 'Docs'}</title>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col h-screen overflow-hidden bg-zinc-950">
  <!-- Header -->
  <header class="shrink-0 h-14 border-b border-violet-800 bg-zinc-900 flex items-center px-6">
    <h1 class="text-lg font-bold text-violet-400 font-mono select-none">Vertex - YSWS guide</h1>
  </header>

  <!-- Left sidebar -->
  <div class="flex flex-1 overflow-hidden bg-zinc-950">
    <aside class="w-64 border-r border-violet-800 bg-zinc-900 p-6 shrink-0">
      <nav class="flex flex-col gap-2">
        {#each docLinks as link (link.href)}
          <a
            href={link.href}
            class={GetClassFromLevel(link.level)}
            class:font-bold={link.href === page.url.pathname}
            class:text-white={link.href === page.url.pathname}
            class:border-transparent={link.href !== page.url.pathname}
          >
            {link.label}
          </a>
        {/each}
      </nav>
    </aside>
  
    <!-- Main content -->
    <main class="flex-1 p-8 prose prose-invert font-mono max-w-none overflow-auto no-scrollbar scroll-smooth" bind:this={mainElement}>
      {@render children()}
    </main>
  
    <!-- Right sidebar -->
    {#if headings.length > 0}
      <aside class="w-52 h-full shrink-0 border-l border-violet-900 bg-zinc-900 p-4 sticky top-0 overflow-auto">
        <p class="select-none text-xs text-center font-bold font-mono uppercase text-violet-400 mb-3">On this page</p>
        <nav class="flex flex-col gap-1">
          {#each headings as heading (heading.id)}
            <a
              href="#{heading.id}"
              class="border-l font-mono text-sm hover:text-zinc-100 transition-colors duration-250 py-1 {activeId === heading.id ? 'text-violet-400 font-bold border-white' : 'text-zinc-400 border-zinc-700'}"
              style="padding-left: {(heading.level) * 12}px"
            >
              {heading.text}
            </a>
          {/each}
        </nav>
      </aside>
    {/if}
  </div>
</div>
