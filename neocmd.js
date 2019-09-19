const util = require("util")
const execFile = util.promisify(require("child_process").execFile)

const NEO_PATH =
  "/Users/i063065/Applications/neo-java-web-sdk-3.19.5/tools/neo.sh"

var runNeoCmd = async function() {
  if (arguments.length != 1 && arguments.length != 2 && arguments.length != 6) {
    console.error(
      "Args num = " +
        arguments.length +
        ", only 1, 2 or 6 arguments are allowed"
    )
    return 0
  }

  var args = []
  args[0] = arguments[0] // the neo cmd
  if (arguments.length == 2) {
    args[1] = arguments[1]
  } else {
    args[1] = "-h " + arguments[1] //host
    args[2] = "-a " + arguments[2] //account
    args[3] = "-u " + arguments[3] //user
    args[4] = "-p " + arguments[4] //pass
    args[5] = arguments[5] // other args
  }
  try {
    const { stdout, stderror } = await execFile(NEO_PATH, args, { shell: true })
    //console.log(stdout)
    return stdout
  } catch (err) {
    console.error(err)
    return err.stdout
  }
}

module.exports = runNeoCmd
