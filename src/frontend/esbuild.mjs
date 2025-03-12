import * as esbuild from "esbuild";
import * as http from "http";

// ./node_modules/.bin/esbuild src/index.tsx index.html --bundle --loader:.html=file --loader:.png=file --loader:.ttf=file --loader:.tsx=tsx --minify --sourcemap --asset-names=[name] --outdir=esbuild/ --allow-overwrite --watch --serve=localhost:5173

const options = {
    entryPoints: ["src/index.tsx", "index.html"],
    outdir: "esbuild/",
    allowOverwrite: true,
    bundle: true,
    minify: false,
    sourcemap: true,
    loader: {
        ".png": "file",
        ".ttf": "file",
        ".html": "file",
    },
    assetNames: "[name]",
}

//await esbuild.build(options);

const context = await esbuild.context(options);
context.watch();
const server = context.serve({
    host: "localhost",
    port: 1234,
    fallback: "index.html",
    onRequest: (args) => {
        console.log(args);
    }
});

const proxy = http.createServer((req, res) => {
    const forwardRequest = (path) => {
        const options = {
            hostname: server.host,
            port: 1234,
            path: path,
            method: req.method,
            headers: req.headers,
        };

        const proxyReq = http.request(options, (proxyRes) => {
            if (proxyRes.statusCode === 404) {
                return forwardRequest("/");
            }

            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });

        req.pipe(proxyReq, { end: true });
    };

    forwardRequest(req.url);
});

proxy.listen(5173);


console.log("Watching and serving - http://localhost:5173");