<script>
    const { name, bus, show } = $props();

    let pressed = $state(false);

    $effect(() => {
        return bus.addEventListener (name, what => {
            if (what === 'pressed') {
                pressed = true;
            } else {
                pressed = false;
            }
        });
    });

    function keydown (e) {
        if (!pressed) {
            bus.dispatchEvent(name, 'pressed');
        }
        return false;
    }

    function keyup (e) {
        if (pressed) {
            bus.dispatchEvent(name, 'released');
        }
        return false;
    }
</script>

<div class="flex-none w-0 relative h-2/3" role="presentation">
    <div onmousedown={keydown} onmouseup={keyup} onmouseleave={keyup} ontouchstart={keydown} ontouchend={keyup}
        class:bg-gray-800={pressed && show}
        class="absolute left-1/2 transform -translate-x-1/2 sm:w-10 w-4 h-full rounded-md bg-gray-500 z-1 text-center border border-gray-900 cursor-pointer text-gray-200" role="presentation">
        {name}
    </div>
</div>
