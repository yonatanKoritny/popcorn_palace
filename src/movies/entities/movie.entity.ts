import { ShowTime } from 'src/showTimes/entities/showtimes.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column()
  duration: number;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  rating: Number;

  @Column()
  releaseYear: number;
}
