interface Address {
  name: string;
  address: string;
}

export interface IMailerConfigOption {
  smtpURL: string;
  templatesPath: string;
  templateExt: '.html' | '.hbs';
}

export interface ISendMailOption {
  from: string | Address;
  sender?: string | Address;
  to: string | Address | Array<string | Address>;
  cc?: string | Address | Array<string | Address>;
  bcc?: string | Address | Array<string | Address>;
  subject: string;
  replyTo?: string | Address;
}
