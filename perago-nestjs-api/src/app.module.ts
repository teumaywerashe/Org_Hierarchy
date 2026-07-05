import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionEntity } from './position/position.entity';
import { PositionModule } from './position/position.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: process.env.DB_HOST || 'localhost',
      // port: Number(process.env.DB_PORT) || 5432,
      // username: process.env.DB_USERNAME || 'postgres',
      // password: process.env.DB_PASSWORD || '',
      // database: process.env.DB_DATABASE || 'orga_structure',
      url:process.env.DATABASE_URL,
      autoLoadEntities:true,
      entities: [PositionEntity],
      synchronize: true,
    }),
    PositionModule,
  ],
})
export class AppModule {}
