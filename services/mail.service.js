const nodemailer = require('nodemailer')

class MailService {
  constructor(props) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'smtp.tsiko@gmail.com',
        pass: 'znoeudetpndegafs',
      },
    })
  }

  async sendMail(html, to) {
    await this.transporter.sendMail({
      from: '1NFT Agency Form',
      to,
      subject: '1NFT Agency Form',
      text: '1NFT Agency Form',
      html,
    })
  }
}

module.exports = new MailService()
