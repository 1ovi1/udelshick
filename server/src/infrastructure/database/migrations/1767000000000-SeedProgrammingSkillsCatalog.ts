import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedProgrammingSkillsCatalog1767000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "skills" ("id", "name")
      VALUES
        ('skill-python', 'Python'),
        ('skill-typescript', 'TypeScript'),
        ('skill-javascript', 'JavaScript'),
        ('skill-java', 'Java'),
        ('skill-csharp', 'C#'),
        ('skill-cpp', 'C++'),
        ('skill-go', 'Go'),
        ('skill-rust', 'Rust'),
        ('skill-php', 'PHP'),
        ('skill-kotlin', 'Kotlin'),
        ('skill-swift', 'Swift'),
        ('skill-sql', 'SQL'),
        ('skill-postgresql', 'PostgreSQL'),
        ('skill-mysql', 'MySQL'),
        ('skill-mongodb', 'MongoDB'),
        ('skill-redis', 'Redis'),
        ('skill-angular', 'Angular'),
        ('skill-react', 'React'),
        ('skill-vue', 'Vue.js'),
        ('skill-nodejs', 'Node.js'),
        ('skill-nestjs', 'NestJS'),
        ('skill-docker', 'Docker'),
        ('skill-kubernetes', 'Kubernetes'),
        ('skill-graphql', 'GraphQL'),
        ('skill-rest-api', 'REST API'),
        ('skill-git', 'Git'),
        ('skill-linux', 'Linux'),
        ('skill-aws', 'AWS'),
        ('skill-azure', 'Azure'),
        ('skill-gcp', 'Google Cloud')
      ON CONFLICT ("name") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "skills"
      WHERE "id" IN (
        'skill-python',
        'skill-typescript',
        'skill-javascript',
        'skill-java',
        'skill-csharp',
        'skill-cpp',
        'skill-go',
        'skill-rust',
        'skill-php',
        'skill-kotlin',
        'skill-swift',
        'skill-sql',
        'skill-postgresql',
        'skill-mysql',
        'skill-mongodb',
        'skill-redis',
        'skill-angular',
        'skill-react',
        'skill-vue',
        'skill-nodejs',
        'skill-nestjs',
        'skill-docker',
        'skill-kubernetes',
        'skill-graphql',
        'skill-rest-api',
        'skill-git',
        'skill-linux',
        'skill-aws',
        'skill-azure',
        'skill-gcp'
      )
    `);
  }
}
