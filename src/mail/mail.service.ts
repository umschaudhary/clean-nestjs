import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { UserResponse } from 'src/users/dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserResponse, token: string) {
    const url = `${process.env.HOST_URL}/users/confirm/?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Nest JS App! Confirm your email',
      template: './confirmation',
      context: {
        name: user.name,
        url,
      },
    });
  }
}

@Injectable()
export class MailServiceAsync {
  constructor(@InjectQueue('mail') private mailQueue: Queue) {}
  logger = new Logger(this.constructor.name);

  /** Send email confirmation link to new user account. */
  async sendConfirmationEmail(user: UserResponse): Promise<boolean> {
    try {
      await this.mailQueue.add('confirmation', { user });
      return true;
    } catch (error) {
      this.logger.error(
        `Error queueing confirmation email to user ${user.email}`,
      );
      return false;
    }
  }

  async sendWelcomeEmail(user: UserResponse): Promise<boolean> {
    try {
      await this.mailQueue.add('welcome', { user });
      return true;
    } catch (error) {
      this.logger.error(`Error queueing welcome email to user ${user.email}`);
      return false;
    }
  }
}
