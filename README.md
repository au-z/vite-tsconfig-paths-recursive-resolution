## Problem

Using `vite-tsconfig-paths`, modules placed outside the includes array are normally resolved. However, this only extends to first order dependencies - dependencies referenced directly from project source.

However, if these first order dependencies, depend on other pathed modules which are similarly outside the tsconfig include array, errors are produced during module resolution.

## Example Annotated Output

`DEBUG=vite-tsconfig-paths vite`

Here we crawl for a tsconfig.json.
Notably, two paths `@moduleA` and `@moduleB` are configured which point to TS modules in ./modules.

```
> DEBUG=vite-tsconfig-paths vite

  vite-tsconfig-paths crawling "/mnt/f/dev/forked/vite-tsconfig-paths-example" +0ms
  vite-tsconfig-paths options: {
  projects: [ '/mnt/f/dev/forked/vite-tsconfig-paths-example/tsconfig.json' ],
  extensions: [ '.ts', '.tsx', '.js', '.jsx', '.mjs' ]
} +9ms
  vite-tsconfig-paths config loaded: {
  configPath: '/mnt/f/dev/forked/vite-tsconfig-paths-example/tsconfig.json',
  include: [ 'src/**/*.ts' ],
  exclude: undefined,
  allowJs: undefined,
  baseUrl: undefined,
  paths: {
    '@moduleA': [ './modules/moduleA' ],
    '@moduleB': [ './modules/moduleB' ]
  },
  outDir: undefined
} +4ms
```

Here, we see that the tsconfig only includes TS modules within ./src.

```
  vite-tsconfig-paths compiled globs: {
  included: [ /^\.\/src\/((?:[^/]*(?:\/|$))*)([^/]*)\.ts$/ ],
  excluded: [
    /^\.\/node_modules\/((?:[^/]*(?:\/|$))*)$/,
    /^\.\/bower_components\/((?:[^/]*(?:\/|$))*)$/,
    /^\.\/jspm_packages\/((?:[^/]*(?:\/|$))*)$/
  ]
} +0ms
```

Here we start up the dev server and begin resolving modules.

```
  vite v2.9.9 dev server running at:

  > Local: http://localhost:3000/
  > Network: use `--host` to expose

  ready in 575ms.
```

Here we resolve @moduleA.

```
  vite-tsconfig-paths resolved: {
  id: '@moduleA',
  importer: '/mnt/f/dev/forked/vite-tsconfig-paths-example/src/index.ts',
  resolvedId: '/mnt/f/dev/forked/vite-tsconfig-paths-example/modules/moduleA.ts',
  configPath: '/mnt/f/dev/forked/vite-tsconfig-paths-example/tsconfig.json'
} +125ms
```

Here we resolve @moduleB.

```
  vite-tsconfig-paths resolved: {
  id: '@moduleB',
  importer: '/mnt/f/dev/forked/vite-tsconfig-paths-example/src/index.ts',
  resolvedId: '/mnt/f/dev/forked/vite-tsconfig-paths-example/modules/moduleB.ts',
  configPath: '/mnt/f/dev/forked/vite-tsconfig-paths-example/tsconfig.json'
} +8ms
```

Here we see that we cannot resolve @moduleA depended on by @moduleB:

```
The following dependencies are imported but could not be resolved:

  @moduleA (imported by /mnt/f/dev/forked/vite-tsconfig-paths-example/modules/moduleB.ts)

Are they installed?
Failed to resolve import "@moduleA" from "modules/moduleB.ts". Does the file exist?
5:14:16 PM [vite] Internal server error: Failed to resolve import "@moduleA" from "modules/moduleB.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /mnt/f/dev/forked/vite-tsconfig-paths-example/modules/moduleB.ts
  1  |  import { A } from "@moduleA";
     |                     ^
  2  |  export function B() {
  3  |    return `MODULE B: ${A}`;
      at formatError (/mnt/f/dev/forked/vite-tsconfig-paths-example/node_modules/vite/dist/node/chunks/dep-59dc6e00.js:38663:46)
      at TransformContext.error (/mnt/f/dev/forked/vite-tsconfig-paths-example/node_modules/vite/dist/node/chunks/dep-59dc6e00.js:38659:19)
      at normalizeUrl (/mnt/f/dev/forked/vite-tsconfig-paths-example/node_modules/vite/dist/node/chunks/dep-59dc6e00.js:56830:26)
      at processTicksAndRejections (node:internal/process/task_queues:96:5)
      at async TransformContext.transform (/mnt/f/dev/forked/vite-tsconfig-paths-example/node_modules/vite/dist/node/chunks/dep-59dc6e00.js:56979:57)
      at async Object.transform (/mnt/f/dev/forked/vite-tsconfig-paths-example/node_modules/vite/dist/node/chunks/dep-59dc6e00.js:38900:30)
      at async doTransform (/mnt/f/dev/forked/vite-tsconfig-paths-example/node_modules/vite/dist/node/chunks/dep-59dc6e00.js:55857:29)
```
