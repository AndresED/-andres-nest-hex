import { CreateProjectCommand } from '../commands/create-project.command';
import { ProjectDto } from '../dtos/project.dto';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { ProjectRepository } from '../../domain/repositories/project.repository';

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: CreateProjectCommand): Promise<ProjectDto> {
    const projectPath = command.path || process.cwd();
    const fullPath = `${projectPath}/${command.name}`;

    const project = new ProjectEntity(
      command.name,
      command.orm,
      command.database,
      fullPath,
    );

    await this.projectRepository.create(project);

    return {
      name: project.name,
      orm: project.orm,
      database: project.database,
      path: project.path,
    };
  }
}
