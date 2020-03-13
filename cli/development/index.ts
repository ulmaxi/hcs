import { prompt } from 'enquirer';
import {  Operation, question, answer } from '../utils';
import { compileProtobuf } from './protobuf-compile';
import { buildNestLibraries } from './nest-libraries';

/**
 * The various operations allowed for develop environment
 */
enum DevelopmentOperations {
  protobuf = 'protobuf',
  'nest libraries' = 'nest libraries'
}

/**
 * maps to development sub menu required
 */
export async function development() {
  const { protobuf } = DevelopmentOperations;
  const res: Operation<DevelopmentOperations> = await prompt({
    name: 'operation',
    message: question('Which development operation are you looking for?'),
    type: 'select',
    choices: Object.values(DevelopmentOperations).map(answer)
  });

  switch (res.operation) {
    case protobuf:
      return compileProtobuf();
    case DevelopmentOperations["nest libraries"]:
      return buildNestLibraries();
    default:
      break;
  }
}
