import { CreateResourceCommand } from '../../application/commands/create-resource.command';
import { CreateResourceUseCase } from '../../application/use-cases/create-resource.use-case';
import { GetProjectStructureUseCase } from '../../application/use-cases/get-project-structure.use-case';
import { InteractivePromptService } from './interactive-prompt.service';
import ora from 'ora';

export class ResourceController {
  constructor(
    private readonly createResourceUseCase: CreateResourceUseCase,
    private readonly getProjectStructureUseCase: GetProjectStructureUseCase,
    private readonly promptService: InteractivePromptService,
  ) {}

  async createResource(
    projectPath: string,
    name?: string,
    options?: { moduleName?: string; fields?: Array<{ name: string; type: string; required: boolean }> },
  ): Promise<void> {
    // Get project structure to list available modules
    const structure = await this.getProjectStructureUseCase.execute({ projectPath });
    
    if (!structure.exists) {
      throw new Error(`Project not found at ${projectPath}`);
    }

    if (structure.modules.length === 0) {
      throw new Error('No modules found in project. Create a module first.');
    }

    let command: CreateResourceCommand;

    if (name && options?.moduleName) {
      // Flag-based mode
      command = new CreateResourceCommand(
        name,
        options.moduleName,
        projectPath,
        options.fields || [],
      );
    } else {
      // Interactive mode
      const answers = await this.promptService.promptResource(structure.modules);
      command = new CreateResourceCommand(
        answers.name,
        answers.moduleName,
        projectPath,
        answers.fields,
      );
    }

    const spinner = ora('Creating resource...').start();

    try {
      const result = await this.createResourceUseCase.execute(command);
      spinner.succeed(`Resource ${result.name} created successfully in module ${result.moduleName}`);
    } catch (error: any) {
      spinner.fail(`Failed to create resource: ${error.message}`);
      throw error;
    }
  }
}
