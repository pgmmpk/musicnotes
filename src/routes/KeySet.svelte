<script>
    import Key from './Key.svelte';
    import BlackKey from './BlackKey.svelte';
    import { notes } from './keyboard.js';

    const { bus, show, from = 'A3', to = 'E5' } = $props();

    const showing = $derived.by(() => {
        let startIndex = 0;
        let endIndex = notes.length;
        for (let i = 0; i < notes.length; i++) {
            if (notes[i] === from) {
                startIndex = i;
            }
            if (notes[i] === to) {
                endIndex = i + 1;
            }
        }

        if (startIndex > 0 && notes[startIndex - 1].toLowerCase() === notes[startIndex - 1]) {
            startIndex -= 1;  // include black note on the left of the white one
        }
        if (endIndex < notes.length && notes[endIndex].toLowerCase() === notes[endIndex]) {
            endIndex += 1;  // include black note on the right of the white one
        }

        const showing = [];
        for (let i = startIndex; i < endIndex; i++) {
            showing.push(notes[i])
        }

        return showing;
    });
</script>
<div class="h-full w-full flex flex-row">
    {#each showing as key (key)}
        {#if key.toLowerCase() == key}
            <BlackKey name={key} {bus} {show} />
        {:else}
            <Key name={key} {bus} {show} />
        {/if}
    {/each}
</div>