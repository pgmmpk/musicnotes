<script>
    import SettingsPanel from "./SettingsPanel.svelte";
    import ChooserPanel from "./ChooserPanel.svelte";

    let settingsVisible = $state(false);
    let chooserVisible = $state(false);
    $effect(() => {
        if (settingsVisible) {
            chooserVisible = false;
        }
        if (chooserVisible) {
            settingsVisible = false;
        }
    });
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
        <div class="grow">
            <slot name="header" />
        </div>
        <div class="flex-none flex flex-row justify-end">
            <button class="w-8 text-gray-700 disabled:text-gray-400 outline-none" onclick={() => {chooserVisible = true;}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
            </button>
        </div>
    </div>
    <slot />
    <SettingsPanel bind:visible={settingsVisible} />
    <ChooserPanel bind:visible={chooserVisible} />
</div>
<style>
    .unselectable {
        user-select: none;
        -webkit-touch-callout: none;
    }
</style>
