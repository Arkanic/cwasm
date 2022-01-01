const cp = require("child_process");

cp.exec("rm -rf dist");
cp.exec("mkdir dist");
cp.exec("cp -r ./static/. dist");
cp.exec("cp ./c/out/main.wasm dist");