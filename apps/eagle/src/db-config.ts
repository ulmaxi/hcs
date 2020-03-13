import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';

export function configDatabase(env: string): TypeOrmModuleOptions {
  if (env === 'production') {
    return {
      type: 'aurora-data-api',
      database: process.env.AWS_DATABASE,
      region: process.env.AWS_DATABASE_REGION,
      secretArn: process.env.AWS_DATABSE_SECRET_ARN,
      resourceArn: process.env.AWS_DATABASE_RESOURCE_ARN,
      synchronize: true,
      entities: ['**/*.entity{.ts,.js}'],
    };
  }
  return JSON.parse(readFileSync(join(process.cwd(), 'ormconfig.json'), 'utf8'));
}
