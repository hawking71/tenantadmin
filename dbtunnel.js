const runNeoCmd = require("./neocmd.js")

var openTunnel = async function(dc, acc, user, pass, db) {
  console.log("running open-db-tunnel ...")
  try {
    var res = await runNeoCmd(
      "open-db-tunnel",
      dc,
      acc,
      user,
      pass,
      db + " --background --output json"
    )
  } catch (err) {
    console.error(err)
    return false
  }
  console.log("after running open-db-tunnel")
  return JSON.parse(res).result
}

var closeTunnel = async function(sessionId) {
  console.log("running close-db-tunnel sessionId = " + sessionId)
  try {
    var res = await runNeoCmd("close-db-tunnel", "--session-id " + sessionId)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
  console.log("after running close-db-tunnel")
}

module.exports = { openTunnel, closeTunnel }
