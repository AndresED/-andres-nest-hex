export class CreateProjectCommand {
  constructor(
    public readonly name: string,
    public readonly orm: string,
    public readonly database: string,
    public readonly path?: string,
  ) {}
}
