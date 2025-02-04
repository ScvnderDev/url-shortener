import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),

      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendResetTokenToResetPassword(to: string, token: string) {
    try {
      const resetLink = `https://url-shortener-04ga.onrender.com:3000/reset-password?token=${token}`; // client
      const mailOption = {
        from: process.env.MAIL_USER,
        to,
        subject: 'Reset Password',
        text: `Please use the following link to reset your password: <a>${resetLink}</a>`,
      };
      const isSent = await this.transporter.sendMail(mailOption);

      if (!isSent) {
        throw new Error('error sending email');
      }
      return isSent ? true : false;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
