import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeedDummyData1783530000000 implements MigrationInterface {
  name = 'FeedDummyData1783530000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get a user to be the creator
    const userRes = await queryRunner.query(`SELECT id FROM users LIMIT 1`);
    const userId = userRes.length > 0 ? userRes[0].id : null;

    // Insert dummy events
    const eventCategoryRes = await queryRunner.query(`SELECT id FROM categories WHERE type='EVENT' LIMIT 1`);
    const eventCategoryId = eventCategoryRes.length > 0 ? eventCategoryRes[0].id : null;
    
    if (eventCategoryId && userId) {
      await queryRunner.query(
        `INSERT INTO "events" (title, description, location, start_time, end_time, capacity, registration_deadline, created_by, category_id) VALUES 
        ('Tech Conference 2026', 'A huge tech conference for developers.', 'Main Hall', '2026-10-01 10:00:00', '2026-10-01 18:00:00', 500, '2026-09-25 00:00:00', $1, $2),
        ('Coding Bootcamp Intro', 'Introduction to the upcoming coding bootcamp.', 'Online', '2026-10-05 14:00:00', '2026-10-05 16:00:00', 100, '2026-10-01 00:00:00', $1, $2)
        `,
        [userId, eventCategoryId]
      );
    }

    // Insert dummy workshops
    const workshopCategoryRes = await queryRunner.query(`SELECT id FROM categories WHERE type='WORKSHOP' LIMIT 1`);
    const workshopCategoryId = workshopCategoryRes.length > 0 ? workshopCategoryRes[0].id : null;

    if (workshopCategoryId && userId) {
      await queryRunner.query(
        `INSERT INTO "workshops" (title, description, content, location, start_time, end_time, capacity, registration_deadline, created_by, category_id) VALUES 
        ('React Advanced Patterns', 'Learn advanced React patterns and hooks.', '[{"title":"Hooks","description":"Learn hooks"}]', 'Room 402', '2026-10-10 10:00:00', '2026-10-10 14:00:00', 50, '2026-10-08 00:00:00', $1, $2),
        ('Node.js Microservices', 'Building scalable microservices with NestJS.', '[{"title":"NestJS","description":"Learn NestJS"}]', 'Room 403', '2026-10-15 12:00:00', '2026-10-15 16:00:00', 40, '2026-10-12 00:00:00', $1, $2)
        `,
        [userId, workshopCategoryId]
      );
    }

    // Insert dummy vacancies
    const recruitmentCategoryRes = await queryRunner.query(`SELECT id FROM categories WHERE type='RECRUITMENT' LIMIT 1`);
    const recruitmentCategoryId = recruitmentCategoryRes.length > 0 ? recruitmentCategoryRes[0].id : null;

    if (recruitmentCategoryId) {
      await queryRunner.query(
        `INSERT INTO "vacancies" (title, description, is_open, category_id) VALUES 
        ('Frontend Developer Intern', 'Join our frontend team and build awesome user interfaces with React and Tailwind.', true, $1),
        ('Backend Engineering Lead', 'Lead our backend development using NestJS, Postgres, and Redis. Great compensation.', true, $1),
        ('Marketing Specialist', 'Help us reach more students and professionals through social media campaigns.', true, $1)
        `,
        [recruitmentCategoryId]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "vacancies" WHERE title IN ('Frontend Developer Intern', 'Backend Engineering Lead', 'Marketing Specialist')`);
    await queryRunner.query(`DELETE FROM "workshops" WHERE title IN ('React Advanced Patterns', 'Node.js Microservices')`);
    await queryRunner.query(`DELETE FROM "events" WHERE title IN ('Tech Conference 2026', 'Coding Bootcamp Intro')`);
  }
}
