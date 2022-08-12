import sendgrid from "@sendgrid/mail";
import { CreateEmailDto } from "./create-email.dto";
import { SendVerificationEmailDto } from "./send-verification-email.dto";
import { UserCredentialsEmailDto } from "./user-credentials-email.dto";

export class EmailService {
  private sendGridClient: typeof sendgrid = sendgrid;
  private emailClient: string = process.env.EMAIL_CLIENT!;
  private apiKey: string = process.env.SEND_GRID_API_KEY!;
  private origin: string =
    process.env.NODE_ENV === "production"
      ? process.env.BASE_URL_PROD!
      : process.env.BASE_URL_DEV!;

  private triggerMailAction() {
    this.sendGridClient.setApiKey(this.apiKey);
  }

  private constructBaseUrl(
    url: string,
    token: string,
    email: string
  ) {
    return `${this.origin}/${url}?token=${token}&email=${email}`;
  }

  private async sendEmail(createEmailDto: CreateEmailDto) {
    return this.sendGridClient.send({
      to: createEmailDto.email,
      from: this.emailClient,
      subject: createEmailDto.subject,
      text: createEmailDto.text,
      html: createEmailDto.html,
    });
  }

  public async sendUserCredentialsEmail(
    userCredentials: UserCredentialsEmailDto
  ) {
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

    const createEmailDto: CreateEmailDto = {
      email: userCredentials.email,
      subject: "Your account has been created",
      text: "your account has been created",
      html,
    };
    return this.sendEmail(createEmailDto);
  }

  public async sendVerificationEmail(
    verificationEmailDto: SendVerificationEmailDto
  ) {
    this.triggerMailAction();
    const baseUrl = this.constructBaseUrl(
      "verify-email",
      verificationEmailDto.token,
      verificationEmailDto.email
    );
    const html = `  <h2>hello ${verificationEmailDto.name}</h2>
    <p>Welcome to gritzza express</p>
    <p>
     Click this link to <br />
      <a href="${baseUrl}">verify your email</a>
    </p>
  `;
    const createEmailDto: CreateEmailDto = {
      email: verificationEmailDto.email,
      subject: "Verify your email",
      text: "verify your email",
      html,
    };
    return this.sendEmail(createEmailDto);
  }

  public async sendPasswordResetEmail(
    verificationEmailDto: SendVerificationEmailDto
  ) {
    this.triggerMailAction();
    const baseUrl = this.constructBaseUrl(
      "reset-password",
      "token",
      "email"
    );
    const html = `  <h2>hello ${verificationEmailDto.name}</h2>
        <p>Welcome to gritzza express</p>
        <p>
         Click this link to <br />
            <a href="${baseUrl}">verify your email</a>
        </p>
        `;
    const createEmailDto: CreateEmailDto = {
      email: verificationEmailDto.email,
      subject: "Verify your email",
      text: "verify your email",
      html,
    };
    return this.sendEmail(createEmailDto);
  }
}
