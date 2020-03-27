import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { AuroraDataApiConnectionOptions } from 'typeorm/driver/aurora-data-api/AuroraDataApiConnectionOptions';

/**
 * uses the enviroment to select the desired
 * database drivers
 */
export function configDatabase(env: string): MysqlConnectionOptions | AuroraDataApiConnectionOptions {
  if (env === 'production') {
    return {
      type: 'aurora-data-api',
      database: process.env.AWS_DATABASE,
      region: process.env.AWS_DATABASE_REGION,
      secretArn: process.env.AWS_DATABSE_SECRET_ARN,
      resourceArn: process.env.AWS_DATABASE_RESOURCE_ARN,
      synchronize: true,
    };
  }
  const config = JSON.parse(
    readFileSync(join(process.cwd(), 'ormconfig.json'), 'utf8'),
  );
  if (env === 'docker') {
    config.host = 'ulmax-database';
  }
  return config;
}
