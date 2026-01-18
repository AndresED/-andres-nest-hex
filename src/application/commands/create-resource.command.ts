import { ResourceField } from '../../domain/entities/resource.entity';

export class CreateResourceCommand {
  constructor(
    public readonly name: string,
    public readonly moduleName: string,
    public readonly projectPath: string,
    public readonly fields: ResourceField[] = [],
  ) {}
}
