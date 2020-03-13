import { prompt } from 'enquirer';
import { Operation, answer, question } from './utils';
import { development } from './development';

/**
 * the top level operations especially for enviroments
 */
enum TopLevelOperations {
  Development = 'development',
  Production = 'production',
  Maintenace = 'maintenace'
}

/**
 * intiates the cli application
 */
async function cli() {
  const { Development } = TopLevelOperations;
  const res: Operation<TopLevelOperations> = await prompt({
    name: 'operation',
    message: question('Which enviroment operation are you operating for?'),
    type: 'select',
    choices: Object.values(TopLevelOperations).map(answer)
  });
  console.log(res);

  switch (res.operation) {
    case Development:
      return development();
    default:
      break;
  }
}

cli();
