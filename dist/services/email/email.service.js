"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
class EmailService {
    constructor() {
        this.sendGridClient = mail_1.default;
        this.emailClient = process.env.EMAIL_CLIENT;
        this.apiKey = process.env.SEND_GRID_API_KEY;
        this.origin = process.env.NODE_ENV === "production"
            ? process.env.BASE_URL_PROD
            : process.env.BASE_URL_DEV;
    }
    triggerMailAction() {
        this.sendGridClient.setApiKey(this.apiKey);
    }
    constructBaseUrl(url, token, email) {
        return `${this.origin}/${url}?token=${token}&email=${email}`;
    }
    async sendEmail(createEmailDto) {
        return this.sendGridClient.send({
            to: createEmailDto.email,
            from: this.emailClient,
            subject: createEmailDto.subject,
            text: createEmailDto.text,
            html: createEmailDto.html,
        });
    }
    async sendUserCredentialsEmail(userCredentials) {
        this.triggerMailAction();
        const html = `<h4>hello ${userCredentials.username}</h4>
    <p>
      Your account has been created. Kindly log in with the following credentials:
      <br />
      <br />
      Username : ${userCredentials.username}
      <br />
      Password : ${userCredentials.password}
    </p>
    `;
        const createEmailDto = {
            email: userCredentials.email,
            subject: "Your account has been created",
            text: "your account has been created",
            html,
        };
        return this.sendEmail(createEmailDto);
    }
    async sendVerificationEmail(verificationEmailDto) {
        this.triggerMailAction();
        const baseUrl = this.constructBaseUrl("verify-email", verificationEmailDto.token, verificationEmailDto.email);
        const html = `  <h2>hello ${verificationEmailDto.name}</h2>
    <p>Welcome to gritzza express</p>
    <p>
     Click this link to <br />
      <a href="${baseUrl}">verify your email</a>
    </p>
  `;
        const createEmailDto = {
            email: verificationEmailDto.email,
            subject: "Verify your email",
            text: "verify your email",
            html,
        };
        return this.sendEmail(createEmailDto);
    }
    async sendPasswordResetEmail(verificationEmailDto) {
        this.triggerMailAction();
        const baseUrl = this.constructBaseUrl("reset-password", "token", "email");
        const html = `  <h2>hello ${verificationEmailDto.name}</h2>
        <p>Welcome to gritzza express</p>
        <p>
         Click this link to <br />
            <a href="${baseUrl}">verify your email</a>
        </p>
        `;
        const createEmailDto = {
            email: verificationEmailDto.email,
            subject: "Verify your email",
            text: "verify your email",
            html,
        };
        return this.sendEmail(createEmailDto);
    }
}
exports.EmailService = EmailService;
