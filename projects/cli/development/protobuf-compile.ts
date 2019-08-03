import { prompt } from 'enquirer';
import { DevelopmentLanguages, question } from '../utils';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { exec } from 'shelljs';

/**
 * the configuration for proto
 */
export interface ProtobufCompileOption {
  lang: DevelopmentLanguages;
  inputDir: string;
  protos: string[];
  outputDir: string;
  outputFileName: string;
}

/**
 * creates promot to get if it should compilation parameters
 */
export async function compileProtobuf() {
  const res: ProtobufCompileOption = await prompt([
    {
      name: 'lang',
      message: question('Which language are you compiling for?'),
      type: 'select',
      choices: Object.values(DevelopmentLanguages)
    },
    {
      name: 'inputDir',
      message: question('Where are the protobufs located?'),
      type: 'input',
      initial: './libraries/protobufs'
    },
    {
      name: 'protos',
      message: question(
        'Names of each proto which you are compiling and seperated them by a comma?'
      ),
      type: 'list'
    },
    {
      name: 'outputDir',
      message: question('Which directory should it compile to?'),
      type: 'input'
    },
    {
      name: 'outputFileName',
      message: question('What is the name for the compiled output?'),
      type: 'input'
    }
  ]);
  compileDir(res);
}

/**
 * triggers compilation for the specified language
 */
async function compileDir({
  inputDir,
  lang,
  protos,
  outputDir,
  outputFileName
}: ProtobufCompileOption) {
  const confirmedPaths = confirmedProtos(inputDir, protos);
  const comfirmedOutputDir = confirmOutputDir(outputDir);
  const { Typescript } = DevelopmentLanguages;
  switch (lang) {
    case Typescript:
      return compileTypescript(confirmedPaths, {
        jsOutputPath: join(comfirmedOutputDir, `${outputFileName}.js`),
        tsOutputPath: join(comfirmedOutputDir, `${outputFileName}.d.ts`)
      });
    default:
      break;
  }
}

/** check if the protobuffs exist at the location  */
function confirmedProtos(inputDir: string, protos: string[]) {
  const folderPath = join(inputDir);
  const mappedPaths = protos.map(proto => join(folderPath, proto));
  mappedPaths.forEach(p => {
    if (!existsSync(p)) {
      throw new Error(`proto: ${p} path doesn't exist`);
    }
  });
  return mappedPaths;
}

/**
 * comfirms if the output dir exist else mkdir
 */
function confirmOutputDir(outputDir: string) {
  outputDir = join(outputDir, 'generated');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }
  return outputDir;
}

interface TypescriptCompileOptions {
  jsOutputPath: string;
  tsOutputPath: string;
}

function compileTypescript(
  paths: string[],
  { jsOutputPath, tsOutputPath }: TypescriptCompileOptions
) {
  const pbjsCommand = pbjsCommandCompiler(paths, jsOutputPath);
  console.log(pbjsCommand);
  exec(pbjsCommand);
  const pbtsCommand = pbtsCommandCompiler(jsOutputPath, tsOutputPath);
  exec(pbtsCommand);
  console.log(pbtsCommand);
}

const argsManager = (p: string, c: string) => p + c + ' ';

function pbjsCommandCompiler(paths: string[], outputPath: string) {
  let commands = [
    'npx',
    'pbjs',
    '-t static-module',
    '--es6',
    '--no-create',
    '--no-encode',
    '--no-decode',
    '--no-verify',
    '--no-convert',
    '--no-delimited',
    `-o ${outputPath}`,
    ...paths
  ];
  return commands.reduce(argsManager, '');
}

function pbtsCommandCompiler(compiledJsPath: string, outputPath: string) {
  let commands = ['npx', 'pbts', `-o ${outputPath}`, `${compiledJsPath}`];
  return commands.reduce(argsManager, '');
}
