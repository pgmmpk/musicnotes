<script>
    import Mousetrap from "mousetrap";
    import KeySet from "./KeySet.svelte";
    import { Scheduler } from './scheduler.js';
    import { Bus } from './bus.js';
    import { generate, toscore } from './generate.js';
    import { findBounds, keyboard } from "./keyboard.js";
    import { settings } from './settings.svelte.js';
    import SettingsPanel from "./SettingsPanel.svelte";
    

    // window.addEventListener('touchmove', event => event.preventDefault(), { passive: false });
    
    const bus = new Bus();
    const keys = $derived(findBounds(settings.key, 10));
    const keyRange = $derived({
        from: keys[0],
        to:   keys[keys.length - 1],
    });

    $effect(() => {
        settings;
        const releases = [];
        let button = 0;
        for (const key of keys) {
            button += 1;
            if (button === 10) button = 0;
            Mousetrap.bind('' + button, () => bus.dispatchEvent(key, 'pressed'));
            Mousetrap.bind('' + button, () => bus.dispatchEvent(key, 'released'), 'keyup');
            releases.push(['' + button]);
            releases.push(['' + button, 'keyup']);
        }

        return () => {
            for (const x of releases) {
                Mousetrap.unbind(...x);
            }
        };
    });

    let show = $state(true);
    let score = $state([]);
    let visible = $state(false);
    const beat = 750;

    async function generateAndPlay () {
        const notes = Object.keys(keyboard);
        const start = notes.indexOf(settings.key);
        const keys = [];
        if (settings.major) {
            keys.push(
                notes[start], notes[start+2], notes[start+2], notes[start+4],
            )
        } else {
            keys.push(
                notes[start], notes[start+2], notes[start+2], notes[start+3],
            )
        }

        score = generate({ num: settings.numNotes, keys });
        await play();
    }
    
    async function play () {
        show = visible;
        const scheduler = new Scheduler(score.map(x=>toscore(x)), { beat });
        await scheduler.play(bus);
        show  = true;
    }

    function toggleVisible () {
        visible = !visible;
    }

    let settingsVisible = $state(false);
</script>

<div class="flex flex-col h-screen align-center items-center unselectable mousetrap">
    <div class="flex-none flex flex-row justify-center w-screen flex-wrap mx-1">
        <div class="flex-none">
            <button class="w-12 m-4 text-gray-700 disabled:text-gray-400 outline-none" onclick={() => { settingsVisible = true; }} >
                <svg class="w-12 h-12 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
                </svg>
            </button>
        </div>
        <div class="flex-none shrink-0 items-center flex-cols mx-1 flex">
            <div class="flex-none w-32 text-lg text-center">
                {settings.key}
                {settings.major ? 'major' : 'minor'}
                x{settings.numNotes}
            </div>
        </div>
        <div class="flex-1 shrink-0 flex flex-row justify-center">
            <button class="flex-none w-12 m-4 text-gray-700 disabled:text-gray-400 outline-none" onclick={play} disabled={score.length === 0}>
                <svg class="w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"/>
                </svg>
            </button>
        </div>
        <div class="flex-1 shrink-0 flex flex-row justify-center">
            <button class="w-12 m-4 text-gray-700 outline-none" onclick={generateAndPlay}>
                <svg class="w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clip-rule="evenodd"/>
                </svg>
            </button>
        </div>
        <div class="flex-1 shrink-0 flex flex-row justify-center">
            <button class="w-12 m-4 text-gray-700 disabled:text-gray-400 outline-none" onclick={toggleVisible}>
                {#if visible}
                <svg class="w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                    <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
                {:else}
                <svg class="w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
                {/if}
            </button>
        </div>
        <div class="flex-none shrink-0 items-center flex-cols mx-1 flex">
            <div class="flex-none w-64 text-lg text-center">{#if visible}{score.join(' ')}{/if}</div>
        </div>
    </div>
    <div class="w-full grow bg-gray-500 p-1" >
        <KeySet {bus} {show} voice={settings.voice} {...keyRange} />
    </div>
</div>
<SettingsPanel bind:visible={settingsVisible} />
<style>
    .unselectable {
        user-select: none;
        -webkit-touch-callout: none;
    }
</style>