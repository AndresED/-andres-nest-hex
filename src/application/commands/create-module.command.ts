export class CreateModuleCommand {
  constructor(
    public readonly name: string,
    public readonly projectPath: string,
    public readonly features: string[] = [],
  ) {}
}
