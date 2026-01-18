import { CreateProjectCommand } from '../../application/commands/create-project.command';
import { CreateProjectUseCase } from '../../application/use-cases/create-project.use-case';
import { InteractivePromptService } from './interactive-prompt.service';
import * as chalk from 'chalk';
import ora from 'ora';

export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly promptService: InteractivePromptService,
  ) {}

  async createProject(name?: string, options?: { orm?: string; database?: string; path?: string }): Promise<void> {
    let command: CreateProjectCommand;

    if (name && options?.orm && options?.database) {
      // Flag-based mode
      command = new CreateProjectCommand(name, options.orm, options.database, options.path);
    } else {
      // Interactive mode
      const answers = await this.promptService.promptProject();
      command = new CreateProjectCommand(
        answers.name,
        answers.orm,
        answers.database,
        answers.path || options?.path,
      );
    }

    const spinner = ora('Creating project...').start();

    try {
      const result = await this.createProjectUseCase.execute(command);
      spinner.succeed(chalk.green(`Project ${result.name} created successfully at ${result.path}`));
    } catch (error: any) {
      spinner.fail(chalk.red(`Failed to create project: ${error.message}`));
      throw error;
    }
  }
}
