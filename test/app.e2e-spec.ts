import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const generateMovieData = () => ({
    title: `Test Movie ${Date.now()}`,
    genre: 'Test',
    duration: 100,
    rating: 5,
    releaseYear: 2023,
  });

  const generateShowtimeData = (
    movieId: number,
    theater?: string,
    startTime?: string,
  ) => ({
    movieId,
    price: 10,
    theater: theater || `Test Theater ${Date.now()}`,
    startTime: startTime || new Date().toISOString(),
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
  });

  const generateBookingData = (showtimeId: number, seatNumber = 1) => ({
    seatNumber,
    showtimeId,
    userId: '123e4567-e89b-12d3-a456-426614174000',
  });

  const api = {
    movies: {
      create: (data) => request(app.getHttpServer()).post('/movies').send(data),
      update: (title, data) =>
        request(app.getHttpServer()).post(`/movies/update/${title}`).send(data),
      getAll: () => request(app.getHttpServer()).get('/movies/all'),
      delete: (title) =>
        request(app.getHttpServer()).delete(`/movies/${title}`),
    },
    showtimes: {
      create: (data) =>
        request(app.getHttpServer()).post('/showtimes').send(data),
      update: (id, data) =>
        request(app.getHttpServer()).post(`/showtimes/update/${id}`).send(data),
      get: (id) => request(app.getHttpServer()).get(`/showtimes/${id}`),
      delete: (id) => request(app.getHttpServer()).delete(`/showtimes/${id}`),
    },
    bookings: {
      create: (data) =>
        request(app.getHttpServer()).post('/bookings').send(data),
    },
  };

  describe('Movies API', () => {
    it('should perform full CRUD operations', async () => {
      const movieData = generateMovieData();

      const createResponse = await api.movies.create(movieData).expect(201);

      await api.movies
        .update(createResponse.body.title, {
          ...createResponse.body,
          rating: 6,
        })
        .expect(201)
        .expect({
          ...createResponse.body,
          rating: '6.0',
          id: createResponse.body.id,
        });

      await api.movies.getAll().expect(200);

      await api.movies.delete(createResponse.body.title).expect(200);
    });
  });

  describe('Showtimes API', () => {
    let movie;
    const theaterName = `Test Theater ${Date.now()}`;

    beforeEach(async () => {
      movie = await api.movies.create(generateMovieData()).expect(201);
    });

    afterEach(async () => {
      await api.movies.delete(movie.body.title).expect(200);
    });

    it('should create and retrieve a showtime', async () => {
      const showtimeData = generateShowtimeData(movie.body.id);
      const showtime = await api.showtimes.create(showtimeData).expect(201);

      await api.showtimes.get(showtime.body.id).expect(200);

      await api.showtimes.delete(showtime.body.id).expect(200);
    });

    it('should create and update a showtime', async () => {
      const showtimeData = generateShowtimeData(movie.body.id);
      const showtime = await api.showtimes.create(showtimeData).expect(201);

      await api.showtimes
        .update(showtime.body.id, { theater: 'Yosi' })
        .expect(201)
        .expect({
          ...showtimeData,
          theater: 'Yosi',
          id: showtime.body.id,
          price: '10.00',
        });

      await api.showtimes.delete(showtime.body.id).expect(200);
    });

    it('should prevent overlapping showtimes in same theater', async () => {
      const startTime = new Date().toISOString();
      const showtime1 = await api.showtimes
        .create(generateShowtimeData(movie.body.id, theaterName, startTime))
        .expect(201);

      await api.showtimes
        .create({
          ...generateShowtimeData(movie.body.id, theaterName, startTime),
          endTime: new Date(
            new Date(startTime).getTime() + 30 * 60 * 1000,
          ).toISOString(),
        })
        .expect(409);

      await api.showtimes.delete(showtime1.body.id).expect(200);
    });
  });

  describe('Bookings API', () => {
    let movie, showtime;

    beforeEach(async () => {
      movie = await api.movies.create(generateMovieData()).expect(201);
      showtime = await api.showtimes
        .create(generateShowtimeData(movie.body.id))
        .expect(201);
    });

    afterEach(async () => {
      await api.showtimes.delete(showtime.body.id).expect(200);
      await api.movies.delete(movie.body.title).expect(200);
    });

    it('should create a booking', async () => {
      await api.bookings
        .create(generateBookingData(showtime.body.id))
        .expect(201);
    });

    it('should prevent duplicate seat bookings', async () => {
      const bookingData = generateBookingData(showtime.body.id, 42);

      await api.bookings.create(bookingData).expect(201);
      await api.bookings.create(bookingData).expect(409);
    });

    it('should allow same seat in different showtimes', async () => {
      const showtime2 = await api.showtimes
        .create(generateShowtimeData(movie.body.id))
        .expect(201);

      const bookingData1 = generateBookingData(showtime.body.id, 42);
      const bookingData2 = generateBookingData(showtime2.body.id, 42);

      await api.bookings.create(bookingData1).expect(201);
      await api.bookings.create(bookingData2).expect(201);

      await api.showtimes.delete(showtime2.body.id).expect(200);
    });
  });
});
