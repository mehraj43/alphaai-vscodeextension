const esbuild = require('esbuild');
const path = require('path');

async function build() {
  let ctx = await esbuild.context({
    entryPoints: [path.join(__dirname, 'src', 'extension.ts')],
    bundle: true,
    platform: 'node',
    target: 'node14',
    outfile: path.join(__dirname, 'out', 'extension.js'),
    external: ['vscode'],
    sourcemap: false,
    // minify: process.env.NODE_ENV === 'production'
    minify: true,
  });

  if (process.argv.includes('--watch')) {
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await ctx.rebuild();
    console.log('Build completed.');
    ctx.dispose();
  }
}

build().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
