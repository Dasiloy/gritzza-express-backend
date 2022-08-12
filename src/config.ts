export const config = {
  sendgrid: {
    apiKey: process.env.SEND_GRID_API_KEY!,
    emailClient: process.env.EMAIL_CLIENT!,
  },
};
