import { MigrationInterface, QueryRunner } from 'typeorm';
import { CategoryType } from '../categories/entities/category.entity';

export class SeedCategories1783520000000 implements MigrationInterface {
  name = 'SeedCategories1783520000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_categories_name"`);
    } catch (e) {}
    
    const categories = [
      // Committees
      { name: 'Technical', type: CategoryType.COMMITTEE },
      { name: 'Non-Technical', type: CategoryType.COMMITTEE },
      { name: 'High Board', type: CategoryType.COMMITTEE },
      
      // Events
      { name: 'Technical', type: CategoryType.EVENT },
      { name: 'Non-Technical', type: CategoryType.EVENT },
      { name: 'Social', type: CategoryType.EVENT },
      { name: 'Hackathon', type: CategoryType.EVENT },
      { name: 'Seminar', type: CategoryType.EVENT },
      
      // Workshops
      { name: 'Technical', type: CategoryType.WORKSHOP },
      { name: 'Soft Skills', type: CategoryType.WORKSHOP },
      { name: 'AI & Data', type: CategoryType.WORKSHOP },
      { name: 'Web Development', type: CategoryType.WORKSHOP },
      { name: 'Hardware', type: CategoryType.WORKSHOP },

      // Recruitment (Vacancies)
      { name: 'Technical', type: CategoryType.RECRUITMENT },
      { name: 'Marketing', type: CategoryType.RECRUITMENT },
      { name: 'Media', type: CategoryType.RECRUITMENT },
      { name: 'HR', type: CategoryType.RECRUITMENT },
      { name: 'Finance', type: CategoryType.RECRUITMENT },
      { name: 'Event Planning', type: CategoryType.RECRUITMENT },
      { name: 'PR', type: CategoryType.RECRUITMENT },
    ];

    for (const cat of categories) {
      await queryRunner.query(
        `INSERT INTO "categories" ("name", "type") 
         VALUES ($1, $2) 
         ON CONFLICT ("name", "type") DO NOTHING`,
        [cat.name, cat.type]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete the seeded categories
    await queryRunner.query(
      `DELETE FROM "categories" WHERE "name" != 'Other'`
    );
  }
}
