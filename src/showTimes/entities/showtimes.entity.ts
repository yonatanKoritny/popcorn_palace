import { PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity()
export class ShowTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  movieId: number;

  @Column()
  theater: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  price: number;
}
