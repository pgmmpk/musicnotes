<script>
    const { name, bus, show } = $props();

    let pressed = $state(false);

    $effect.pre(() => {
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

<div onmousedown={keydown} onmouseup={keyup} onmouseleave={keyup} ontouchstart={keydown} ontouchend={keyup}
    class:bg-gray-300={pressed && show}
    class="flex-1 h-full bg-gray-100 text-center border border-gray-500 rounded-md cursor-pointer" role="presentation">
    {name}
</div>
