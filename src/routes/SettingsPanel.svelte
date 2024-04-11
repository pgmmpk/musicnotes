<script>
    import { settings } from './settings.svelte.js';
    import { keyboard } from './keyboard.js';

    let { visible = $bindable() } = $props();
</script>
{#if visible}
<div class="h-screen absolute top-0 left-0 w-2/3 border bg-white border-gray-700 z-2 flex flex-col">
    <div class="flex flex-row">
        <div class="grow"></div>
        <div class="flex-none m-1 w-12">
            <svg class="w-12 h-12 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"
                onclick={() => {visible = false; }}
            >
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
        </div>
    </div>
    <div class="flex flex-row items-center m-2 ml-4">
        <select bind:value={settings.key} class="bg-gray-50 border mx-4 border-gray-700 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 ">
            {#each Object.keys(keyboard).slice() as k (k)}
                <option selected={k===settings.key} value={k}>{k}</option>
            {/each}
        </select>
    
        <select bind:value={settings.major} class="bg-gray-50 border border-gray-700 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5 ">
            <option selected={settings.major} value={true}>major</option>
            <option selected={!settings.major} value={false}>minor</option>
        </select>
    </div>
    <div>
        <div class="mx-4 flex-none shrink-0 w-64 items-center flex-cols flex">
            <input class="outline-none p-1 bg-gray-200 grow mr-4 accent-gray-700 rounded-full border border-gray-700 appearance-none cursor-pointer" type="range" bind:value={settings.numNotes} min="3" max="8">
            <span class="mx-2 text-xl">{settings.numNotes}</span>
        </div>
    </div>
</div>
{/if}