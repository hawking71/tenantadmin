const { getTenant, getTenantList } = require("../tenantinfo")
const readline = require("readline")

let myTest = async function(userInput) {
  try {
    let list = await getTenantList(
      userInput.dc,
      userInput.landscape,
      userInput.user,
      userInput.pass
    )
    console.log("before for")
    console.log("subaccount = " + userInput.subAccount)
    let count = 0
    for (let element of list) {
      if (count < 10) {
        console.log("element name = " + element.name)
        count++
      }
      if (element.name === userInput.subAccount) {
        userInput.tenantId = element.id
        console.log("got id, break")
        break
      }
    }
    console.log("Got tenantId: " + userInput.tenantId)
    try {
      let tenant = await getTenant(
        userInput.dc,
        userInput.landscape,
        userInput.user,
        userInput.pass,
        userInput.tenantId
      )
      if (tenant.tableSizes.length > 0) {
        tenant.tableSizes.forEach(tbl => {
          console.log(JSON.stringify(tbl))
        })
      }
      return tenant
    } catch (err) {
      console.error("getTenant error: " + err)
    }
  } catch (err) {
    console.error("getTenantList error: " + err)
  }
}

let fun = async function() {
  if (process.argv.length != 3) {
    console.error("This tool only accept 1 argument i.e. subaccount")
    process.exit(1)
  }
  let userInput = { subAccount: process.argv[2].trim() }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.prompt()
  rl.question("Input a DC (eu1,eu2,ap1,...) : ", answer => {
    userInput.dc = answer
    console.log("dc:" + answer)
    rl.prompt()
    rl.question(
      "Input landscape (default(production), preview/prev for preview) : ",
      answer => {
        userInput.landscape = "production"
        if (
          answer.toLowerCase() === "preview" ||
          answer.toLowerCase() === "prev"
        ) {
          userInput.landscape = answer
        }
        console.log("landscape:" + answer)
        rl.prompt()
        rl.question("Input username : ", answer => {
          userInput.user = answer
          console.log("user:" + answer)
          rl.prompt()
          rl.question("Input password : ", answer => {
            userInput.pass = answer
            console.log("pass:" + answer)
            rl.close()
          })
        })
      }
    )
  })

  rl.on("close", () => {
    console.log(
      "Collected all inputs, will start task with " + JSON.stringify(userInput)
    )
    myTest(userInput)
      .then(res => {
        console.log("tenantInfo: " + JSON.stringify(res))
        process.exit(0)
      })
      .catch(err => {
        console.error(err)
        process.exit(1)
      })
  })
}

//fun()
