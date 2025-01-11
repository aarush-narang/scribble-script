import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: {},
});

const eslintConfig = [
    ...compat.config({
        plugins: [
            'react',
            '@typescript-eslint',
        ],
        extends: [
            'next/typescript',
            'eslint:recommended',
            'plugin:react/recommended',
            'plugin:@typescript-eslint/recommended',
            'next',
            'next/core-web-vitals',
            'plugin:import/errors',
            'plugin:import/warnings',
            'airbnb',
        ],
        rules: {
            'linebreak-style': 'off',
            indent: [
                'error',
                4,
            ],
            'react/react-in-jsx-scope': 'off',
            'react/jsx-indent': [
                'error',
                4,
            ],
            'react/no-unescaped-entities': 'off',
            quotes: 'off',
            'import/prefer-default-export': 'off',
            'no-plusplus': 'off',
            'no-unused-vars': 'warn',
            'max-len': 'off',
            semi: 'error',
            'no-trailing-spaces': 'warn',
            'no-console': 'warn',
            'import/extensions': 'off',
            'no-duplicate-imports': 'error',
            'react/jsx-indent-props': 'off',
            'react/jsx-filename-extension': [
                1,
                {
                    extensions: [
                        '.ts',
                        '.tsx',
                    ],
                },
            ],
            'react/jsx-props-no-spreading': 'off',
            camelcase: 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            'no-underscore-dangle': 'warn',
            'no-restricted-syntax': [
                'off',
                'ForOfStatement',
            ],
            'react/require-default-props': 'off',
            "import/no-extraneous-dependencies": [
                "error",
                {
                    devDependencies: true,
                },
            ],
        },
    }),
];

export default eslintConfig;
