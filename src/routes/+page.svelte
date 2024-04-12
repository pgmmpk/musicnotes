<script>
    import Mousetrap from "mousetrap";
    import KeySet from "./KeySet.svelte";
    import { Scheduler } from './scheduler.js';
    import { Bus } from './bus.js';
    import { generate, toscore, pentascale, choose } from './generate.js';
    import { findBounds, notes } from "./keyboard.js";
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

    async function playPentascale () {
        const c4index = notes.indexOf('C4')
        const key = choose(notes.slice(c4index-10, c4index+10));
        const major = choose([true, false]);
        const score = pentascale({ key, major, lengths: [''] });
        console.log({key, major})
        const scheduler = new Scheduler(score, { beat: beat * 0.5 });
        await scheduler.play(bus);
    }

    let chooserVisible = $state(false);
    function chooseGame () {
        settingsVisible = false;
        chooserVisible = true;
    }
</script>

<div class="flex flex-col h-screen align-center items-center unselectable mousetrap">
    <div class="flex-none flex flex-row justify-center w-screen flex-wrap mx-1">
        <div class="flex-none">
            <button class="w-8 m-2 text-gray-700 disabled:text-gray-400 outline-none" onclick={() => { settingsVisible = true; }} >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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
            <button class="flex-none w-8 m-2 text-gray-700 disabled:text-gray-400 outline-none" onclick={play} disabled={score.length === 0}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                    <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
        <div class="flex-1 shrink-0 flex flex-row justify-center">
            <button class="w-8 m-2 text-gray-700 outline-none" onclick={generateAndPlay}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
            </button>
        </div>
        <div class="flex-1 shrink-0 flex flex-row justify-center">
            <button class="w-8 m-2 text-gray-700 disabled:text-gray-400 outline-none" onclick={toggleVisible}>
                {#if visible}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                {:else}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                {/if}
            </button>
        </div>
        <div class="flex-1 shrink-0 flex flex-row justify-end">
            <!-- <button class="w-8 m-2 text-gray-700 disabled:text-gray-400 outline-none" onclick={playPentascale}>Test</button> -->
            <button class="w-8 text-gray-700 disabled:text-gray-400 outline-none" onclick={chooseGame}>
                <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg> -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
            </button>
        </div>
    </div>
    <div class="flex-none items-center flex-cols flex">
        <div class="flex-none w-64 text-lg text-center">{#if visible}{score.join(' ')}{/if}</div>
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