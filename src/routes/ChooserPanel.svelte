<script>
    import { fly } from 'svelte/transition';
    import { chooser } from './chooser.svelte.js';

    const games = {
        'ear-training': 'Ear Training',
        'major-or-minor': 'Major or Minor?',
    };

    let { visible = $bindable() } = $props();
</script>
{#if visible}
<div class="h-screen absolute top-0 right-0 w-2/3 border bg-white border-gray-700 z-2 flex flex-col shadow-xl shadow-gray-700" transition:fly={{ duration: 400, opacity: 1.0, x: '200%' }}>
    <div class="flex flex-row">
        <div class="grow"></div>
        <button class="flex-none m-2 w-8" onclick={() => {visible = false;}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    </button>
    </div>
    <div class="flex flex-row items-center m-2 ml-4">
        <span class="mx-2 flex-2">Game: </span>
        <select bind:value={chooser.choice} class="flex-1 bg-gray-50 border border-gray-700 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5 ">
            {#each Object.entries(games) as [code, label] (code)}
                <option selected={chooser.choice == code} value={code}>{label}</option>
            {/each}
        </select>
    </div>
</div>
{/if}