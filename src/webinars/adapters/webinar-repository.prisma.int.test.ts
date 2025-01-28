
import { PrismaClient } from '@prisma/client';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { exec } from 'child_process';
import { TestServerFixture } from 'src/tests/fixtures';
import { PrismaWebinarRepository } from 'src/webinars/adapters/webinar-repository.prisma';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { promisify } from 'util';
const asyncExec = promisify(exec);

describe('PrismaWebinarRepository', () => {
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;
  let repository: PrismaWebinarRepository;
  let fixture: TestServerFixture;
  
  
  beforeAll(async () => {
    fixture = new TestServerFixture();
    await fixture.init();
  });

  beforeEach(async () => {
    repository = new PrismaWebinarRepository(fixture.getPrismaClient());
    await fixture.reset();
  });

  afterAll(async () => {
    await fixture.stop();
  });

  describe('Scenario : repository.create', () => {
    it('should create a webinar', async () => {
      // ARRANGE
      const webinar = new Webinar({
        id: 'webinar-id',
        organizerId: 'organizer-id',
        title: 'Webinar title',
        startDate: new Date('2022-01-01T00:00:00Z'),
        endDate: new Date('2022-01-01T01:00:00Z'),
        seats: 100,
      });
  
      // ACT
      await repository.create(webinar);
  
      // ASSERT
      const maybeWebinar = await fixture.getPrismaClient().webinar.findUnique({
        where: { id: 'webinar-id' },
      });
      expect(maybeWebinar).toEqual({
        id: 'webinar-id',
        organizerId: 'organizer-id',
        title: 'Webinar title',
        startDate: new Date('2022-01-01T00:00:00Z'),
        endDate: new Date('2022-01-01T01:00:00Z'),
        seats: 100,
      });
    });
  });

  describe('Scenario : repository.findById', () => {
    it('should return a webinar', async () => {
      // ARRANGE
      await fixture.getPrismaClient().webinar.create({
        data: {
          id: 'webinar-id',
          organizerId: 'organizer-id',
          title: 'Webinar title',
          startDate: new Date('2022-01-01T00:00:00Z'),
          endDate: new Date('2022-01-01T01:00:00Z'),
          seats: 100,
        },
      });
  
      // ACT
      const maybeWebinar = await repository.findById('webinar-id');

      // ASSERT
      expect(maybeWebinar).toEqual(
        new Webinar({
          id: 'webinar-id',
          organizerId: 'organizer-id',
          title: 'Webinar title',
          startDate: new Date('2022-01-01T00:00:00Z'),
          endDate: new Date('2022-01-01T01:00:00Z'),
          seats: 100,
        }),
      );
    });
  });

  describe('Scenario : repository.update', () => {
    it('should update a webinar', async () => {
      // ARRANGE
      await fixture.getPrismaClient().webinar.create({
        data: {
          id: 'webinar-id',
          organizerId: 'organizer-id',
          title: 'Webinar title',
          startDate: new Date('2022-01-01T00:00:00Z'),
          endDate: new Date('2022-01-01T01:00:00Z'),
          seats: 100,
        },
      });
  
      const webinar = new Webinar({
        id: 'webinar-id',
        organizerId: 'organizer-id',
        title: 'New webinar title',
        startDate: new Date('2022-01-01T01:00:00Z'),
        endDate: new Date('2022-01-01T02:00:00Z'),
        seats: 200,
      });
  
      // ACT
      await repository.update(webinar);
  
      // ASSERT
      const maybeWebinar = await fixture.getPrismaClient().webinar.findUnique({
        where: { id: 'webinar-id' },
      });
      expect(maybeWebinar).toEqual({
        id: 'webinar-id',
        organizerId: 'organizer-id',
        title: 'New webinar title',
        startDate: new Date('2022-01-01T01:00:00Z'),
        endDate: new Date('2022-01-01T02:00:00Z'),
        seats: 200,
      });
    });
  });
});
// Test d'intégration
// C. Ecriture de notre premier test d'intégration