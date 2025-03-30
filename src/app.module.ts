  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { Movie } from './movies/entities/movie.entity';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { ShowTime } from './showTimes/entities/showTimes.entity';
import { ShowTimesModule } from './showTimes/showTimes.module';

  @Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'popcorn-palace',
        password: 'popcorn-palace',
        database: 'popcorn-palace',
        entities: [Movie, ShowTime],
        synchronize: true,
      }),
    MoviesModule,
    ShowTimesModule,],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}