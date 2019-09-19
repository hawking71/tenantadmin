const runNeoCmd = require("./neocmd.js")

const tempDbUser = "msDevopsTemp"
const tempDbPass = "Sybase123"

var setupEnv = function(dc, landscape) {
  let cpms = { appName: "mobile", account: "hanamobileprod" }
  if (
    landscape.toLowerCase() === "preview" ||
    landscape.toLowerCase() === "prev"
  ) {
    cpms.appName = "mobilepreview"
    cpms.account = "hanamobilepreview"
  }
  cpms.host = dc + ".hana.ondemand.com"
  return cpms
}

var createTempAseDbUser = async function(dc, landscape, user, pass, db) {
  let cpms = setupEnv(dc, landscape)

  console.log("creating db user ...")
  try {
    var res = await runNeoCmd(
      "create-db-user-ase",
      cpms.host,
      cpms.account,
      user,
      pass,
      "-i " +
        db +
        " --db-user " +
        tempDbUser +
        " --db-password " +
        tempDbPass +
        " --output json"
    )
  } catch (err) {
    console.error(err)
    return false
  }
  console.log(res)
  res = JSON.parse(res)
  if (!!res && res.exitCode == 0) {
    return true
  }
  return false
}

var deleteTempAseDbUser = async function(dc, landscape, user, pass, db) {
  let cpms = setupEnv(dc, landscape)

  console.log("deleting db user ...")
  try {
    var res = await runNeoCmd(
      "delete-db-user-ase",
      cpms.host,
      cpms.account,
      user,
      pass,
      "-i " + db + " --db-user " + tempDbUser + " --silent --output json"
    )
  } catch (err) {
    console.error(err)
    return false
  }
  console.log(res)
  res = JSON.parse(res)
  if (!!res && res.exitCode == 0) {
    return true
  }
  return false
}

module.exports = { createTempAseDbUser, deleteTempAseDbUser }
