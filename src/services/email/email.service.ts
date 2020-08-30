import { Injectable } from '@nestjs/common';
import nodemailer = require('nodemailer');
import { IEmail } from 'src/models/email';
import * as mailGun from 'nodemailer-mailgun-transport';
import { MAILGUN_USERNAME, MAILGUN_KEY } from 'src/utils/config';

@Injectable()
export class EmailService {
    private transporter: any;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.mailgun.org",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: MAILGUN_USERNAME,
              pass: MAILGUN_KEY
            },
        });
    }

    public async send(email: IEmail): Promise<any> {
        try {
            const mailOptions = {
                from: `"${email.firstName} ${email.lastName} 👻" <${email.from}>`,
                to: email.to,
                subject: email.subject
            };

            if (email.html) {
                mailOptions['html'] = email.html;
            } else if (email.text) {
                mailOptions['text'] = email.text;
            } else {
                mailOptions['text'] = 'no content provided';
            }
        
            await this.transporter.sendMail(mailOptions)
        } catch (err) {
            throw new Error(err);
        }
       
    }

}
