import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import packageJson from './package.json';
import { DEFAULT_EXTENSIONS } from '@babel/core';

export default [
    {
        input: 'src/scss/index.scss',
        output: {
            file: packageJson.style,
            format: 'es',
            sourcemap: true,
        },
        plugins: [
            postcss({
                extract: true,
            }),
        ],
    },
    {
        input: 'src/scss/index.scss',
        output: {
            file: packageJson.style.replace(/\.css$/, '.min.css'),
            format: 'es',
            sourcemap: true,
        },
        plugins: [
            postcss({
                extract: true,
                minimize: true,
            }),
        ],
    },
    {
        input: 'src/ts/index.ts',
        output: {
            name: 'CanvasEqualizer',
            file: packageJson.browser,
            format: 'umd',
            sourcemap: true,
        },
        plugins: [
            resolve({
                extensions: ['.js', '.ts'],
            }),
            commonjs(),
            json(),
            babel({
                exclude: 'node_modules/**',
                extensions: [...DEFAULT_EXTENSIONS, '.ts'],
            }),
        ],
    },
    {
        input: 'src/ts/index.ts',
        output: {
            name: 'CanvasEqualizer',
            file: packageJson.browser.replace(/\.js$/, '.min.js'),
            format: 'umd',
            sourcemap: true,
        },
        plugins: [
            resolve({
                extensions: ['.js', '.ts'],
            }),
            commonjs(),
            json(),
            babel({
                exclude: 'node_modules/**',
                extensions: [...DEFAULT_EXTENSIONS, '.ts'],
            }),
            terser(),
        ],
    },
    {
        input: 'src/ts/index.ts',
        external: ['deep-assign'],
        plugins: [
            resolve({
                extensions: ['.ts'],
            }),
            json(),
            babel({
                babelrc: false,
                presets: ['@babel/preset-typescript'],
                plugins: ['@babel/plugin-proposal-class-properties'],
                exclude: 'node_modules/**',
                extensions: [...DEFAULT_EXTENSIONS, '.ts'],
            }),
        ],
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: 'es',
                sourcemap: true,
            },
        ],
    },
];
