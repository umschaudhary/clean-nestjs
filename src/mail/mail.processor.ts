import { Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { UserResponse } from 'src/users/dto';

@Processor('mail')
export class MailProcessor {
  constructor(private readonly mailerService: MailerService) {}
  logger = new Logger(this.constructor.name);

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('confirmation')
  async sendConfirmationEmail(job: Job<{ user: UserResponse}>): Promise<any> {
    this.logger.log(`Sending confirmation email to '${job.data.user.email}'`);

    const url = `${process.env.HOST_URL}/confirmation/${job.data.user.email}`;

    try {
      const result = await this.mailerService.sendMail({
        template: './confirmation',
        context: {
          name: job.data.user.name || job.data.user.email,
          url: url,
        },
        subject: 'Confirmation Email',
        to: job.data.user.email,
      });
      return result;
    } catch (error) {
      this.logger.error('Failed to send email', error.stack);
      throw error;
    }
  }

  @Process('welcome')
  async sendWelcomeEmail(job: Job<{ user: UserResponse }>): Promise<any> {
    this.logger.log(`Sending welcome email to '${job.data.user.email}'`);
    try {
      const result = await this.mailerService.sendMail({
        template: './welcome',
        context: {
          name: job.data.user.name || job.data.user.email,
        },
        subject: 'Welcome Email',
        to: job.data.user.email,
      });
      return result;
    } catch (error) {
      this.logger.error('Failed to send welcome email', error.stack);
      throw error;
    }
  }
}
