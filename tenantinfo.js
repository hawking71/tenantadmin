const runNeoCmd = require("./neocmd.js")
var rp = require("request-promise-native")

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

var getTenant = async function(dc, landscape, user, pass, tenantId) {
  let cpms = setupEnv(dc, landscape)
  let url =
    "https://" +
    cpms.appName +
    "." +
    cpms.host +
    "/tenantadmin/rest/tenants/" +
    tenantId +
    "?&includePassword=yes"

  var options = {
    method: "GET",
    uri: url,
    json: true,
    headers: { Accept: "application/json" }
  }

  try {
    const result = await rp(options).auth(user, pass)
    console.log(result)
    return result
  } catch (err) {
    console.error(err)
  }
}

var getTenantList = async function(dc, landscape, user, pass) {
  let cpms = setupEnv(dc, landscape)
  let url =
    "https://" + cpms.appName + "." + cpms.host + "/tenantadmin/rest/tenants"

  var options = {
    method: "GET",
    uri: url,
    json: true,
    headers: { Accept: "application/json" }
  }

  try {
    const result = await rp(options).auth(user, pass)
    console.log(result.tenants.length)
    //let tenants = JSON.parse(result)
    return result.tenants
  } catch (err) {
    console.error(err)
  }
}

module.exports = { getTenant, getTenantList }
