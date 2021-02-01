import nodeMailer from 'nodemailer';

const {
  EMAIL_SERVICE,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  EMAIL_FROM,
} = process.env;

const sendEmail = ({ to, subject, html }) => {
  const transporter = nodeMailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) console.log(err);
    else console.log(info);
  });
};

export default sendEmail;
