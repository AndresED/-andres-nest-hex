import { ResourceEntity } from '../entities/resource.entity';

export abstract class ResourceRepository {
  abstract create(resource: ResourceEntity): Promise<void>;
  abstract exists(projectPath: string, moduleName: string, resourceName: string): Promise<boolean>;
}
