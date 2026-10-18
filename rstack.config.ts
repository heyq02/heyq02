// Configuration guide: https://rstack.rs/config
import { nodeLib } from '@heyq02/rstack-config/rslib';
import { rstack } from '@heyq02/rstack-config/rstack';
import { define } from 'rstack';

define.extends([
  rstack({
    lib: false,
    lint: {
      typescript: true,
      node: 'module',
      react: true,
      jest: false,
      rstest: true,
    },
    fmt: {
      singleQuote: true,
      sortPackageJson: true,
      ignorePatterns: ['.github/**', 'README.md'],
    },
    test: {
      include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
      strictCoverage: false,
      coverage: {
        provider: 'v8',
        reporters: ['text', 'json', 'html', 'lcov'],
        include: ['src/**/*.{ts,tsx}'],
      },
      tools: {
        swc: {
          jsc: {
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
      },
    },
    staged: {
      formatAll: true,
      lintFix: true,
    },
  }),
]);

define.lib(() => {
  const config = nodeLib(
    {
      entry: {
        index: './src/index.ts',
        cli: './src/cli.ts',
      },
      publint: true,
      attw: true,
      rsdoctor: true,
    },
    {
      output: {
        autoExternal: false,
        externals: ['react-devtools-core'],
      },
      tools: {
        rspack: (config, { rspack }) => {
          config.plugins ??= [];
          config.plugins.push({
            // Ink's package.json is copied in for DEV=true. Drop its exports
            // field so the published tarball does not contain a nested package.
            name: 'heyq02:ink-package-json',
            apply(compiler: InstanceType<(typeof rspack)['Compiler']>) {
              compiler.hooks.thisCompilation.tap(
                'heyq02:ink-package-json',
                (compilation) => {
                  compilation.hooks.processAssets.tap(
                    {
                      name: 'heyq02:ink-package-json',
                      stage:
                        rspack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
                    },
                    () => {
                      for (const { name } of compilation.getAssets()) {
                        if (!name.endsWith('package.json')) {
                          continue;
                        }
                        compilation.updateAsset(
                          name,
                          new rspack.sources.RawSource(
                            `${JSON.stringify({ name: 'ink', version: '8.0.0' })}\n`,
                          ),
                        );
                      }
                    },
                  );
                },
              );
            },
          });
          return config;
        },
        swc: {
          jsc: {
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
      },
    },
  );
  const lib = config.lib?.[0];
  if (lib) {
    lib.dts = { bundle: true };
  }
  return config;
});
