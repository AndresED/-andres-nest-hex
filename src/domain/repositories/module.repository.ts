import { ModuleEntity } from '../entities/module.entity';

export abstract class ModuleRepository {
  abstract create(module: ModuleEntity): Promise<void>;
  abstract exists(projectPath: string, moduleName: string): Promise<boolean>;
}
