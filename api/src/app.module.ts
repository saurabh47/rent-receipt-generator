import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [HttpModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'ui','dist'),
      exclude: ['/api*'],
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
