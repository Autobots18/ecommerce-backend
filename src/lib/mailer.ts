import { readFile } from 'fs';
import { resolve as pathResolve } from 'path';
import { compile } from 'handlebars';
import { fromString } from 'html-to-text';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';
import { ISendMailOption, IMailerConfigOption } from '../interfaces/IMailerOption';


class Mailer {
  readonly _smtpURL: string;
  readonly _templatesPath: string;
  readonly _templateExt: '.html' | '.hbs';
  readonly _transporter: Transporter;

  constructor(options: IMailerConfigOption) {
    this._smtpURL = options.smtpURL;
    this._templatesPath = options.templatesPath;
    this._templateExt = options.templateExt;
    this._transporter = createTransport(this._smtpURL);
  }

  private prepareTemplate(file: string, data: any): Promise<Error | object> {
    return new Promise((resolve, reject) => {
      const template: string = `${file}.${this._templateExt}`;
      const filePath: string = pathResolve(this._templatesPath, template);
      readFile(filePath, 'utf8', (err: Error, content: string) => {
        if (err) {
          return reject(new Error('Cannot read email template.'));
        }
        const compiledTemplate: any = compile(content);
        const html: string = compiledTemplate(data);
        // Generate a plain text version of the html email
        const text: string = fromString(html);

        return resolve({
          html,
          text
        });
      });
    });
  }

  public send(template: string, data: any, options: ISendMailOption): Promise<Error | any> {
    return new Promise((resolve, reject) => {
      this.prepareTemplate(template, data)
        .then((res: object) => {
          const mailOptions: SendMailOptions = {
            ...options,
            ...res
          };

          return this._transporter.sendMail(mailOptions);
        })
        .then((res: any) => resolve(res))
        .catch((err: Error) => reject(err));
    });
  }
}


export default Mailer;
