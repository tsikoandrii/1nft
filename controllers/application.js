const MailService = require('../services/mail.service')
const authentication = require('../auth/authentication')
const range = require('../utils/range')

const ID = process.env.SHEET_ID

class ApplicationController {
  async getCeilValue(ceil) {
    const { sheets } = await authentication()
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: ID,
      range: range(ceil),
    })
    return data.values[0][0]
  }
  async updateCeilValue(ceil, value) {
    const { sheets } = await authentication()
    return await sheets.spreadsheets.values.update({
      spreadsheetId: ID,
      range: range(ceil),
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [value]
        ]
      }
    })
  }
  async append(lastIndex, name, email, discord, stage, people, type, marketingBudget, website, twitter, idea, nft) {
    const { sheets } = await authentication()
    lastIndex = Number(lastIndex)
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: ID,
      range: range(`A2`),
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [lastIndex, name, email, discord, stage, people, type, marketingBudget, website, twitter, idea, nft]
        ]
      }
    })
    if (response.status === 200) {
      await this.updateCeilValue('I2', lastIndex + 1)
    }

    const html = `
      Project Name: ${name} <br/>
      Stage: ${stage} <br/>
      Number of employees: ${people} <br/>
      Type of Collection: ${type || 'None'} <br/>
      Marketing Budget: ${marketingBudget} <br/>
      Website: ${website || 'None'} <br/>
      Twitter: ${twitter || 'None'} <br/>
      Discord: ${discord || 'None'} <br/>
      Email: ${email} <br/>
      Is this your <br> first project with the NFT? : ${nft} <br/>
      Idea: <p>${idea || 'None'}</p>
    `

    await MailService.sendMail(html, '0xdmtr@gmail.com')
    await MailService.sendMail(html, 'aleksey.chusov@gmail.com')
    await MailService.sendMail(html, 'kravetzoleg123@gmail.com')

    return response;
  }
}

module.exports = new ApplicationController()
