import { CreateModuleCommand } from '../commands/create-module.command';
import { ModuleDto } from '../dtos/module.dto';
import { ModuleEntity } from '../../domain/entities/module.entity';
import { ModuleRepository } from '../../domain/repositories/module.repository';

export class CreateModuleUseCase {
  constructor(private readonly moduleRepository: ModuleRepository) {}

  async execute(command: CreateModuleCommand): Promise<ModuleDto> {
    const module = new ModuleEntity(
      command.name,
      command.projectPath,
      command.features,
    );

    await this.moduleRepository.create(module);

    return {
      name: module.name,
      projectPath: module.projectPath,
      features: module.features,
    };
  }
}
