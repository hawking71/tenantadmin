const { getTenant, getTenantList } = require("./tenantinfo")
const { openTunnel, closeTunnel } = require("./dbtunnel")
const readline = require("readline")

const util = require("util")
const execFile = util.promisify(require("child_process").execFile)

let myTest = async function(userInput) {
  //do query
  try {
    var args = [
      "myUrl",
      "myUser",
      "myPass",
      '"SELECT COUNT(*) FROM SMP_APPLICATION_TRACES_"',
      "_traces.txt"
    ]
    //args[2] = tunnel.jdbcUrl
    //args[3] = userInput.user
    //args[4] = userInput.pass
    //args[5] =
    //  '"SELECT COUNT(*) FROM SMP_APPLICATION_TRACES_' +
    //  element.name.toUpperCase() +
    //  '"'
    //args[6] = element.name + "_traces.txt"
    let { stdout, stderror } = await execFile("./query-database.bash", args, {
      shell: true
    })
    console.log(stdout)
    //return stdout
  } catch (err) {
    console.error(err)
  }
}

let fun = async function() {
  myTest()
    .then(res => {
      console.log("tenantInfo: ")
      process.exit(0)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

fun()
