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
  async append(lastIndex, name, email, discord, nft, goal) {
    const { sheets } = await authentication()
    lastIndex = Number(lastIndex)
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: ID,
      range: range(`A2`),
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [lastIndex, name, email, discord, nft, goal]
        ]
      }
    })
    if (response.status === 200) {
      await this.updateCeilValue('I2', lastIndex + 1)
    }

    const html = `
      Question: ${name} <br/>
      Email: ${email} <br/>
      Discord: ${discord} <br/>
      Test: ${nft} <br/>
      Goal: ${goal}
    `

    await MailService.sendMail(html, 'kravetzoleg123@gmail.com')


    return response
  }
}

module.exports = new ApplicationController()
