import { ResourceField } from '../../domain/entities/resource.entity';

export interface ResourceDto {
  name: string;
  moduleName: string;
  projectPath: string;
  fields: ResourceField[];
}
