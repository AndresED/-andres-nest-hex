import { ProjectEntity } from '../entities/project.entity';
import { ProjectStructure } from '../../application/use-cases/get-project-structure.use-case';

export abstract class ProjectRepository {
  abstract create(project: ProjectEntity): Promise<void>;
  abstract exists(path: string): Promise<boolean>;
  abstract getStructure(path: string): Promise<ProjectStructure>;
}
