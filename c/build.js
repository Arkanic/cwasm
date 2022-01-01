const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const out = path.join(__dirname, "out");
cp.exec(`rm -rf ${out}`);
cp.exec(`mkdir ${out}`)

let files = fs.readdirSync(path.resolve(__dirname, "src"));
files.forEach(file => {
    let pcs = file.split(".");
    let ext = pcs[pcs.length-1];
    let name = pcs[0];

    if(ext !== "c") return;

    const clangargs = [
        "--target=wasm32",
        "-emit-llvm",
        "-c",
        "-S",
        "-o",
        path.resolve(out, `${name}.ll`),
        path.resolve(__dirname, "src", file)
    ];
    cp.execFileSync("clang", clangargs, {"stdio": process.stdio});

    const llcargs = [
        "-march=wasm32",
        "-filetype=obj",
        path.resolve(out, `${name}.ll`)
    ];
    cp.execFileSync("llc", llcargs, {"stdio": process.stdio});
});

let objfiles = files.map(o => {
    let pcs = o.split(".");
    let ext = pcs[pcs.length-1];
    let name = pcs[0];

    let oname = `${name}.o`;
    return path.resolve(__dirname, "out", oname);
});

let ldargs = [
    "--no-entry",
    "--export-all",
    "-o",
    path.resolve(__dirname, "out", "main.wasm"),
    objfiles.join(" ")
];
cp.execFileSync("wasm-ld", ldargs, {"stdio": process.stdio});