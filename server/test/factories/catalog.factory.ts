import { SkillEntity } from '../../src/infrastructure/entities/skill.entity';
import { DataSource } from 'typeorm';
import { uniqueSuffix } from '../helpers/test-ids.helper';

export class CatalogFactory {
  constructor(private readonly dataSource: DataSource) {}

  async createSkill(namePrefix = 'Skill'): Promise<SkillEntity> {
    const repository = this.dataSource.getRepository(SkillEntity);

    const skill = repository.create({
      id: `skill-${uniqueSuffix()}`,
      name: `${namePrefix}-${uniqueSuffix()}`,
    });

    return repository.save(skill);
  }
}
