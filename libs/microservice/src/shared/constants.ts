/**
 * loaction of the default Rabbit MQ
 */
export const AMQ_URL = 'amqp://ulmax-mq:5672';

/**
 * The various messaging queue for each services
 */
export enum Queues {
  Authorization = 'authorization_queue',
  MessageAlert = 'messaging_queue',
  Users = 'users_queue',
  EHR = 'ehr_queue',
  HistoryManager = 'history_queue',
  CardNode = 'cardnode_queue',
}

/**
 * The various injection name for various services
 */
export enum MicroService {
  Authorization = 'AUTHORIZATION_SERVICE',
  MessageAlert = 'MESSAGING_SERVICE',
  Users = 'USERS_SERVICE',
  EHR = 'EHR_SERVICE',
  HistoryManager = 'HISTORY_SERVICE',
  CardNode = 'CARDNODE_SERVICE',
}
