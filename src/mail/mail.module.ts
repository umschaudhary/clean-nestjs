import { Module } from '@nestjs/common'
import { MailService, MailServiceAsync } from './mail.service'
import { MailProcessor } from './mail.processor'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { ConfigService } from '@nestjs/config'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: config.get('SMTP_TRANSPORT'),
        defaults: {
          from: `"No Reply" <${config.get('SMTP_USER')}>`,
        },
        template: {
          dir: '/src/src/mail/templates',
          adapter: new HandlebarsAdapter(),

          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'mail',
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get('QUEUE_HOST'),
          port: config.get('QUEUE_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService, MailServiceAsync, MailProcessor, BullModule],
  exports: [MailService, MailServiceAsync, BullModule],
})
export class MailModule {}
