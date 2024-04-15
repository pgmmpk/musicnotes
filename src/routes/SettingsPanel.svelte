<script>
    import { fly } from 'svelte/transition';
    import { settings } from './settings.svelte.js';
    import { chooser }  from './chooser.svelte.js';
    import { notes, voices } from './keyboard.js';

    let { visible = $bindable() } = $props();
</script>
{#if visible}
<div class="h-screen absolute top-0 left-0 w-2/3 border bg-white border-gray-700 z-2 flex flex-col shadow-xl shadow-gray-700 p-2 pr-4" transition:fly={{ duration: 400, opacity: 1.0, x: '-100%' }}>
    <div class="flex flex-row">
        <div class="grow"></div>
        <button class="flex-none m-2 w-8" onclick={() => {visible = false;}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    </button>
    </div>
    <div class="flex flex-row items-center my-4">
        <span class="flex-none w-16 mr-2">Voice: </span>
        <select bind:value={settings.voice} class="grow bg-gray-50 border border-gray-700 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 ">
            {#each voices as v (v)}
                <option selected={settings.voice == v} value={v}>{v}</option>
            {/each}
        </select>
    </div>
    <div class="flex flex-row items-center my-4">
        <span class="flex-none w-16 mr-2">Triplet: </span>
        <div class="grow flex flex-row">
            <select bind:value={settings.key} class="grow mr-2 bg-gray-50 border border-gray-700 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 ">
                {#each notes.slice(0, notes.length - 4) as k (k)}
                    <option selected={k===settings.key} value={k}>{k}</option>
                {/each}
            </select>
        
            <select bind:value={settings.major} class="flex-1 ml-2 bg-gray-50 border border-gray-700 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 ">
                <option selected={settings.major} value={true}>major</option>
                <option selected={!settings.major} value={false}>minor</option>
            </select>
        </div>
    </div>
    <div class="flex flex-row items-center my-4">
        <span class="flex-none w-16 mr-2">Notes: </span>
        <div class="shrink-0 items-center flex-cols flex grow">
            <span class="text-xl mr-4">{settings.numNotes}</span>
            <input class="outline-none bg-gray-200 grow accent-gray-700 p-2 rounded-full border border-gray-700 appearance-none cursor-pointer" type="range" bind:value={settings.numNotes} min="3" max="8">
        </div>
    </div>
    <div class="flex flex-row items-center my-4">
        <span class="flex-none w-16 mr-2">Scale: </span>
        <div class="grow flex flex-row">
            <select bind:value={settings.fromPentascale} class="flex-1 mr-2 bg-gray-50 border border-gray-700 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 ">
                {#each notes.slice(0, notes.length - 7) as k (k)}
                    <option selected={k===settings.fromPentascale} value={k}>{k}</option>
                {/each}
            </select>
            <select bind:value={settings.toPentascale} class="flex-1 ml-2 bg-gray-50 border border-gray-700 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 ">
                {#each notes.slice(0, notes.length - 7) as k (k)}
                    <option selected={k===settings.toPentascale} value={k}>{k}</option>
                {/each}
            </select>
        </div>
    </div>
</div>
{/if}