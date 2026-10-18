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
  const config = nodeLib({
    entry: {
      index: './src/index.ts',
      cli: './src/cli.ts',
    },
    publint: true,
    attw: true,
    rsdoctor: true,
  });
  const lib = config.lib?.[0];
  if (lib) {
    lib.dts = { bundle: true };
  }
  return config;
});
