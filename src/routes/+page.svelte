<script>
    import Mousetrap from "mousetrap";
    import Key from "./Key.svelte";
    import { Scheduler } from './scheduler.js';
    import { Bus } from './bus.js';
    import { generate, toscore } from './generate.js';

    window.addEventListener('touchmove', event => event.preventDefault(), { passive: false });
    
    const bus = new Bus();

    Mousetrap.bind("1", () => bus.dispatchEvent("C4", 'pressed'));
    Mousetrap.bind("1", () => bus.dispatchEvent("C4", "released"), 'keyup');
    Mousetrap.bind("2", () => bus.dispatchEvent("D4", 'pressed'));
    Mousetrap.bind("2", () => bus.dispatchEvent("D4", "released"), 'keyup');
    Mousetrap.bind("3", () => bus.dispatchEvent("E4", 'pressed'));
    Mousetrap.bind("3", () => bus.dispatchEvent("E4", "released"), 'keyup');
    Mousetrap.bind("4", () => bus.dispatchEvent("F4", 'pressed'));
    Mousetrap.bind("4", () => bus.dispatchEvent("F4", "released"), 'keyup');
    Mousetrap.bind("5", () => bus.dispatchEvent("G4", 'pressed'));
    Mousetrap.bind("5", () => bus.dispatchEvent("G4", "released"), 'keyup');
    Mousetrap.bind("6", () => bus.dispatchEvent("A5", 'pressed'));
    Mousetrap.bind("6", () => bus.dispatchEvent("A5", "released"), 'keyup');
    Mousetrap.bind("7", () => bus.dispatchEvent("B5", 'pressed'));
    Mousetrap.bind("7", () => bus.dispatchEvent("B5", "released"), 'keyup');

    let actx = null;

    class KeySound {
        constructor(freq, type = 'sine', decay = 4.0, stopDecay = 0.5) {
            // create oscillator, gain and compressor nodes
            this.freq = freq;
            this.type = type;
            this.decay = decay;
            this.stopDecay = stopDecay;
            this.osc = null;
            this.vol = null;
            this.isKeyDown = false;
        }

        pressed () {
            if (this.isKeyDown || this.osc !== null || this.vol !== null) {
                return;
            }
            this.isKeyDown = true;
            if (actx === null) {
                actx = new AudioContext();
            }
            const osc = actx.createOscillator();
            const vol = actx.createGain();

            // set the supplied values
            osc.frequency.value = this.freq;
            osc.type = this.type;

            // set the volume value so that we do not overload the destination
            // when multiple voices are played simmultaneously
            vol.gain.setValueAtTime(0.1, actx.currentTime);
            // Finally this schedules the fade out.
            vol.gain.exponentialRampToValueAtTime(
                0.0001,
                actx.currentTime + this.decay,
            );
            osc.connect(vol).connect(actx.destination);

            osc.start(actx.currentTime);
            osc.stop(actx.currentTime + this.decay);
            osc.addEventListener('ended', () => {
                if (this.osc === osc && this.vol === vol) {
                    this.osc = null;
                    this.vol = null;
                }
            });

            this.osc = osc;
            this.vol = vol;
        }

        released () {
            this.isKeyDown = false;
            if (this.osc === null || this.vol === null) {
                return;
            }
            this.vol.gain.setValueAtTime(Math.min(0.1, this.vol.gain.value), actx.currentTime);
            this.vol.gain.exponentialRampToValueAtTime(
                0.0001,
                actx.currentTime + this.stopDecay,
            );
            this.osc.stop(actx.currentTime + this.stopDecay);
            this.osc = null;
            this.vol = null;
        }

        process (what) {
            if (what === 'pressed') {
                this.pressed();
            } else {
                this.released();
            }
        }
    }

    // Some musical note values:
    const C4 = new KeySound(261.63),
        D4 = new KeySound(293.66),
        E4 = new KeySound(329.63),
        F4 = new KeySound(349.23),
        G4 = new KeySound(392),
        A5 = new KeySound(440),
        B5 = new KeySound(493.88),
        C5 = new KeySound(523.25),
        D5 = new KeySound(587.33),
        E5 = new KeySound(659.25);

        bus.addEventListener('C4', what => C4.process(what));
        bus.addEventListener('D4', what => D4.process(what));
        bus.addEventListener('E4', what => E4.process(what));
        bus.addEventListener('F4', what => F4.process(what));
        bus.addEventListener('G4', what => G4.process(what));
        bus.addEventListener('A5', what => A5.process(what));
        bus.addEventListener('B5', what => B5.process(what));

    let show = $state(true);
    let score = $state([]);
    let visible = $state(false);
    let num = $state(4);
    const beat = 750;

    async function play () {
        visible = false;
        score = generate({ num });
        await repeat();
    }
    
    async function repeat () {
        show = visible;
        const scheduler = new Scheduler(score.map(x=>toscore(x)), { beat });
        await scheduler.play(bus);
        show  = true;
    }

    function toggleVisible () {
        visible = !visible;
    }
</script>

<div class="flex flex-col h-screen align-center items-center unselectable">
    <div class="flex-none flex flex-row justify-center w-screen flex-wrap my-4">
        <div class="flex-none shrink-0 w-72 items-center flex-cols flex my-1">
            <span class="mr-4 ml-1 text-xl">{num}</span>
            <input class="outline-none p-1 bg-gray-200 grow mr-4 accent-gray-700 rounded-full border border-gray-700 appearance-none cursor-pointer" type="range" bind:value={num} min="3" max="8">
        </div>
        <div class="flex-none shrink-0 w-72 items-center justify-center flex-cols flex my-1 ">
            <button class="flex-none w-12 m-4 text-gray-700 disabled:text-gray-400 outline-none" onclick={repeat} disabled={score.length === 0}>
                <svg class="w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"/>
                </svg>
            </button>
            <button class="flex-none w-12 m-4 text-gray-700 outline-none" onclick={play}>
                <svg class="w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clip-rule="evenodd"/>
                </svg>
            </button>
        </div>
        <div class="flex-none w-72 shrink-0 items-center flex-cols flex my-1">
            <button class="m-4 text-gray-700 disabled:text-gray-400 outline-none" onclick={toggleVisible} disabled={score.length === 0}>
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
            <div class="flex-none my-2 w-64">{#if visible}{score.join(' ')}{/if}</div>
        </div>
    </div>
    <div class="w-full grow bg-gray-500 p-1 flex flex-row mousetrap" >
        <Key name="C4" {bus} {show} />
        <Key name="D4" {bus} {show} />
        <Key name="E4" {bus} {show} />
        <Key name="F4" {bus} {show} />
        <Key name="G4" {bus} {show} />
        <Key name="A5" {bus} {show} />
        <Key name="B5" {bus} {show} />
    </div>
</div>
<style>
    .unselectable {
        user-select: none;
        -webkit-touch-callout: none;
    }
</style>