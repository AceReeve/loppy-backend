import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as _ from 'lodash';
import { ItemsData } from 'src/app/interface/email-notification';
@Injectable()
export class MaileService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) { }
  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport: {
        host: this.configService.get<string>('SMTP_HOST'),
        secure: true,
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASSWORD'),
        },
      },

      defaults: {
        from: `"No Reply" <${this.configService.get<string>(
          'EMAIL_NO_REPLY_ADDRESS',
        )}>`,
      },
      template: {
        dir: join(__dirname, 'config/mail/templates'),
        adapter: new HandlebarsAdapter({
          toFixed: (price): string | number | undefined => {
            if (price) {
              return price
                .toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })
                .toString();
            }
          },
          toUpperCase: (text: string) => {
            if (text) {
              return text.toUpperCase();
            }
          },
          toLowerCase: (text: string) => {
            if (text) {
              return text.toLowerCase();
            }
          },
          displayItemLength: (items: ItemsData[]) => {
            if (items?.length > 1) {
              return `${items.length} items`;
            } else {
              return `${items.length} item`;
            }
          },

          formatDate: (date: Date) => {
            if (date) {
              const newDate = new Date(
                date.toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
              );
              let hours = newDate.getHours();
              let minutes: number | string = newDate.getMinutes();
              const dayIndicator: string = hours >= 12 ? 'PM' : 'AM';
              const s = newDate.getSeconds();
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              minutes = minutes < 10 ? '0' + minutes : minutes;

              const month = newDate.toLocaleString('en-US', { month: 'short' });
              const day = newDate.getDate();
              const year = newDate.getFullYear();

              const finalHr = hours > 9 ? hours : _.toString('0' + hours);

              const finalTime =
                finalHr + ':' + minutes + ':' + s + ' ' + dayIndicator;
              const finalDate = `${month} ${_.toNumber(day) < 10 ? '0' + day : day
                }, ${year}`;

              return finalDate + ' | ' + finalTime;
            }
          },
          formatDateSupplier: (originalDateString: string) => {
            const date = new Date(originalDateString);
            const formattedDateString = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              timeZone: 'UTC',
            });

            const parts = formattedDateString.split('/');
            const newDateString = `${parts[0]}-${parts[1]}-${parts[2]}`;

            return newDateString;
          },
          formatDateMonth: (originalDateString: string) => {
            const date = new Date(originalDateString);
            const options = {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              timeZone: 'UTC',
            } as any;
            const formattedDate = date.toLocaleDateString('en-US', options);
            return formattedDate;
          },
          formatDateToTimeStamp: (
            originalDateString: string,
            shortDate = true,
          ) => {
            const date = new Date(originalDateString);
            const options = {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            } as any;

            const formattedDate = shortDate
              ? date.toLocaleDateString('en-US', options)
              : `${date.toLocaleDateString(
                'en-US',
                options,
              )} ${date.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZone: 'Asia/Manila',
              })}`;

            return formattedDate;
          },
          isItemReceived(received: boolean): string {
            return received ? 'Item Received' : 'Not Received';
          },
          isItemIconReceived(received: boolean): string {
            return received
              ? 'cid:icon-small-green-check'
              : 'cid:icon-small-red-cross';
          },
          formatAttachmentName(originalname: string, date: any) {
            const fileDate =
              !date || _.isNil(date) ? new Date() : new Date(date);
            const splitIndex = originalname.split('.').length;
            const formattedDate = fileDate
              .toLocaleDateString('en-US', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/[/]/g, '-');
            const extension = originalname.split('.')[splitIndex - 1];

            return formattedDate + '.' + extension;
          },
        },
          {
            inlineCssEnabled: true,
            /** See https://www.npmjs.com/package/inline-css#api */
            // inlineCssOptions: {
            //   url: ' ',
            //   preserveMediaQueries: true,
            // },
          }), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    };
  }
}
