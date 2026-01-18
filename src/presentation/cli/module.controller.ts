import { CreateModuleCommand } from '../../application/commands/create-module.command';
import { CreateModuleUseCase } from '../../application/use-cases/create-module.use-case';
import { InteractivePromptService } from './interactive-prompt.service';
import ora from 'ora';

export class ModuleController {
  constructor(
    private readonly createModuleUseCase: CreateModuleUseCase,
    private readonly promptService: InteractivePromptService,
  ) {}

  async createModule(
    projectPath: string,
    name?: string,
    options?: { features?: string[] },
  ): Promise<void> {
    let command: CreateModuleCommand;

    if (name) {
      // Flag-based mode
      command = new CreateModuleCommand(name, projectPath, options?.features || []);
    } else {
      // Interactive mode
      const answers = await this.promptService.promptModule();
      command = new CreateModuleCommand(answers.name, projectPath, answers.features);
    }

    const spinner = ora('Creating module...').start();

    try {
      const result = await this.createModuleUseCase.execute(command);
      spinner.succeed(`Module ${result.name} created successfully`);
    } catch (error: any) {
      spinner.fail(`Failed to create module: ${error.message}`);
      throw error;
    }
  }
}
