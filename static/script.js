async function init() {
    const {instance} = await WebAssembly.instantiateStreaming(
        fetch("./main.wasm")
    );
    console.log(instance.exports.add(4, 1));
}

init();