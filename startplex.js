const Nightmare = require("nightmare")
const nightmare = Nightmare({ show: true })
console.log(nightmare)
nightmare
  .goto("https://app.plex.tv/")
  .type("#user-login-input", "username")
  .type("#user-password-input", "password")
  .click("#user-login-btn")
  .wait(5000)
