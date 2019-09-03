import * as shell from 'shelljs';
import { join } from 'path';
import { existsSync } from 'fs';
import {  yellow } from 'ansi-colors';

/**
 * compiles the typescript files, copy package 
 * files and generated files and also
 *  run yarn link on the packages
 */
export function buildNestLibraries(rootDir = join(process.cwd(), 'projects', 'eagle')) {
  compileLibFiles(rootDir);
  console.log(yellow('finished compiling typescript files'));
  copyPackageFiles(rootDir);
  console.log(yellow('finished copying package files'));
  copyGeneratedFiles(rootDir);
  console.log(yellow('finished copying generated files'));
  yarnLinkPackages(rootDir);
  console.log(yellow('finished linking packages has node modules'));
}

/** 
 * iterate through every folder under the libs
 * to copy its package.json
 */
function copyPackageFiles(rootDir: string) {
  const inputLibDir = join(rootDir, 'libs');
  const outputLibDir = join(rootDir, 'dist', 'libs');
  shell.ls(inputLibDir).forEach(Subdir => {
    copyProjectFiles({ Subdir, inputLibDir, outputLibDir });
  });
}

/**
 * the generated file already has a type-def and not recompile
 * its just copyed to the dist folder.
 */
function copyGeneratedFiles(rootDir: string) {
  const inputGenDir = join(rootDir, 'libs', 'generated');
  const outputGenDir = join(rootDir, 'dist', 'libs');
  shell.cp('-rf', inputGenDir, outputGenDir);
}

/**
 * copy the files in the array to the right folder in the 
 * destination folder
 */
function copyProjectFiles({ inputLibDir, outputLibDir, Subdir }: CopyOptions) {
  ['tsconfig.lib.json', 'package.json', 'tslint.json'].forEach(file =>
    copyFile(file, { Subdir, inputLibDir, outputLibDir })
  );
}

interface CopyOptions {
  inputLibDir: string;
  outputLibDir: string;
  Subdir: string;
}

/**
 * execute copy command on all the files with the desired
 * input path and output path
 */
function copyFile(
  file: string,
  { inputLibDir, outputLibDir, Subdir }: CopyOptions
) {
  const filePath = join(outputLibDir, Subdir, file);
  if (existsSync(filePath)) {
    shell.rm(filePath);
  }
  shell.cp(
    '-rf',
    `${join(inputLibDir, Subdir)}/${file}`,
    `${join(outputLibDir, Subdir)}/${file}`
  );
}

/**
 * runs npm build in the project path itself
 */
function compileLibFiles(rootDir: string) {
  shell.cd(rootDir);
  shell.exec('npm run build');
}

function yarnLinkPackages(rootDir: string) {
  const outputLibDir = join(rootDir, 'dist', 'libs');
  shell.ls(outputLibDir).forEach(Subdir => {
    shell.cd(join(outputLibDir, Subdir));
    shell.exec(`yarn link`);
  });
}
