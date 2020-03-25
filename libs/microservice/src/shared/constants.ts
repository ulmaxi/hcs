/**
 * loaction of the default Rabbit MQ
 */
export const AMQ_URL = 'amqp://ulmax-mq:5672';

/**
 * The various messaging queue for each services
 */
export enum Queues {
  Authorization = 'authorization_queue',
  Admin = 'admin_queue',
  Public = 'public_queue',
  Lota = 'lota_queue',
  CardNode = 'cardnode_queue',
}

/**
 * The various injection name for various services
 */
export enum MicroService {
  Authorization = 'AUTHORIZATION_SERVICE',
  Admin = 'ADMIN_SERVICE',
  Public = 'PUBLIC_SERVICE',
  Lota = 'LOTA_SERVICE',
  CardNode = 'CARDNODE_SERVICE',
}
