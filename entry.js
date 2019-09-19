const runNeoCmd = require("./neocmd.js")
const readline = require("readline")

if (
  process.argv.length === 3 &&
  process.argv[2].trim().toLowerCase() === "open"
) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.prompt()

  rl.question("Input your password: ", pass => {
    // TODO: Log the answer in a database
    console.log(`Your password is: ${pass}`)
    rl.close()
    console.log("running open-db-tunnel ...")
    runNeoCmd(
      "open-db-tunnel",
      "ap1.hana.ondemand.com",
      "hanamobileprod",
      "i063065",
      pass,
      "-i mobileservices.apptracelog --background --output json"
    ).then(res => {
      res = JSON.parse(res)
      console.log("result port=" + res.result.port)
      console.log("result jdbcUrl=" + res.result.jdbcUrl)
      console.log("result sessionId= " + res.result.sessionId)
    })
    console.log("after running open-db-tunnel ")
  })
} else if (
  process.argv.length === 4 &&
  process.argv[2].trim().toLowerCase() === "close"
) {
  console.log("running close-db-tunnel ...")
  runNeoCmd("close-db-tunnel", "--session-id " + process.argv[3].trim()).then(
    res => {
      console.log("Close finished")
    }
  )
  console.log("after running close-db-tunnel ...")
}
