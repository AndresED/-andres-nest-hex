import { GetProjectStructureQuery } from '../queries/get-project-structure.query';
import { ProjectRepository } from '../../domain/repositories/project.repository';

export interface ProjectStructure {
  exists: boolean;
  modules: string[];
  resources: Array<{ module: string; resources: string[] }>;
}

export class GetProjectStructureUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(query: GetProjectStructureQuery): Promise<ProjectStructure> {
    return await this.projectRepository.getStructure(query.projectPath);
  }
}
