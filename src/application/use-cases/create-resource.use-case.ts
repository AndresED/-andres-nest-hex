import { CreateResourceCommand } from '../commands/create-resource.command';
import { ResourceDto } from '../dtos/resource.dto';
import { ResourceEntity } from '../../domain/entities/resource.entity';
import { ResourceRepository } from '../../domain/repositories/resource.repository';

export class CreateResourceUseCase {
  constructor(private readonly resourceRepository: ResourceRepository) {}

  async execute(command: CreateResourceCommand): Promise<ResourceDto> {
    const resource = new ResourceEntity(
      command.name,
      command.moduleName,
      command.projectPath,
      command.fields,
    );

    await this.resourceRepository.create(resource);

    return {
      name: resource.name,
      moduleName: resource.moduleName,
      projectPath: resource.projectPath,
      fields: resource.fields,
    };
  }
}
