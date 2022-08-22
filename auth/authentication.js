const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

const authentication = async () => {
  const auth = new GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  })

  const client = await auth.getClient();

  const sheets = google.sheets({
    version: 'v4',
    auth: client
  })

  return { sheets }
}

module.exports = authentication;
