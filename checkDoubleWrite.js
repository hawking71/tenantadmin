const { getTenant, getTenantList } = require("./tenantinfo")
const { openTunnel, closeTunnel } = require("./dbtunnel")
const readline = require("readline")

const util = require("util")
const execFile = util.promisify(require("child_process").execFile)

let prepareTenants = async function(userInput) {
  let list = []
  try {
    list = await getTenantList(
      userInput.dc,
      userInput.landscape,
      userInput.user,
      userInput.pass
    )
  } catch (err) {
    console.error(err)
  }
  console.log("before for")

  let traceTop3 = [],
    clientTop3 = [],
    serverTop3 = []
  for (let element of list) {
    if (element.tableSizes.length > 0) {
      element.tableSizes.forEach(tbl => {
        if (tbl.name === "SMP_APPLICATION_TRACES") {
          traceTop3 = handleTenant(traceTop3, element, 1)
        } else if (tbl.name === "SMP_CLIENT_LOGS") {
          clientTop3 = handleTenant(clientTop3, element, 3)
        } else if (tbl.name === "SMP_SERVER_LOGS") {
          serverTop3 = handleTenant(serverTop3, element, 2)
        }
      })
    }
  }
  return { traceTop3, serverTop3, clientTop3 }
}

let handleTenant = function(arr, ele, logType) {
  console.log("handle " + ele.name)
  if (arr.length == 0) {
    arr[0] = ele
    return arr
  }
  let val = getRowCount(ele, logType)
  if (val > getRowCount(arr[0], logType)) {
    console.log("1st " + ele.name)
    if (arr.length > 1) {
      arr[2] = arr[1]
    }
    arr[1] = arr[0]
    arr[0] = ele
  } else if (val > getRowCount(arr[1], logType)) {
    console.log("2nd " + ele.name)
    if (arr.length > 1) {
      arr[2] = arr[1]
    }
    arr[1] = ele
  } else if (val > getRowCount(arr[2], logType)) {
    console.log("3rd " + ele.name)
    arr[2] = ele
  }
  return arr
}

let getRowCount = function(ele, logType) {
  if (ele === undefined) {
    return 0
  }
  if (ele.tableSizes.length < 1) {
    return 0
  }
  let rows = 0
  for (let tbl of ele.tableSizes) {
    if (logType === 1 && tbl.name === "SMP_APPLICATION_TRACES") {
      console.log(ele.name + "." + tbl.name + ": " + tbl.rowCount)
      rows = tbl.rowCount
      break
    }
    if (logType === 2 && tbl.name === "SMP_SERVER_LOGS") {
      console.log(ele.name + "." + tbl.name + ": " + tbl.rowCount)
      rows = tbl.rowCount
      break
    }
    if (logType === 3 && tbl.name === "SMP_CLIENT_LOGS") {
      console.log(ele.name + "." + tbl.name + ": " + tbl.rowCount)
      rows = tbl.rowCount
      break
    }
  }
  return rows
}

let myTest = async function(userInput, dbSizeTop3, logType) {
  if (!dbSizeTop3 || dbSizeTop3.length < 1) {
    return
  }

  //open tunnel
  let tunnel = {}
  //logType = 1 //default for 1 - trace
  let dbname = "mobileservices.apptracelog"
  let tableName = "SMP_APPLICATION_TRACES_"
  if (logType === 2) {
    dbname = "mobileservices.serverlog"
    tableName = "SMP_SERVER_LOGS_"
  } else if (logType === 3) {
    dbname = "mobileservices.clientlog"
    tableName = "SMP_CLIENT_LOGS_"
  }

  try {
    tunnel = await openTunnel(
      userInput.dc + ".hana.ondemand.com",
      userInput.landscape === "production"
        ? "hanamobileprod"
        : "hanamobilepreview",
      userInput.user,
      userInput.pass,
      "-i " + dbname
    )
  } catch (err) {
    console.error(err)
    return
  }

  for (let element of dbSizeTop3) {
    if (element.tableSizes.length > 0) {
      element.tableSizes.forEach(tbl => {
        if (
          (tbl.name === "SMP_APPLICATION_TRACES" && logType === 1) ||
          (tbl.name === "SMP_CLIENT_LOGS" && logType === 3) ||
          (tbl.name === "SMP_SERVER_LOGS" && logType === 2)
        ) {
          console.log(element.name + "-" + JSON.stringify(tbl))
        }
      })
    }
    //do query
    try {
      var args = [
        '-d "' + tunnel.jdbcUrl + '"',
        "-u " + "i063065temp", //userInput.user,
        "-p " + "Sybase123", //userInput.pass,
        '-q "SELECT COUNT(*) FROM ' +
          tableName +
          element.name.toUpperCase() +
          '"',
        "-o " + element.name + "_" + tableName + ".txt"
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
  //close tunnel
  try {
    await closeTunnel(tunnel.sessionId)
  } catch (err) {
    console.error(err)
    return
  }
}

let fun = async function() {
  if (process.argv.length != 2) {
    console.log("This tool does not accept argument")
  }
  let userInput = {}

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

  rl.on("close", async () => {
    console.log(
      "Collected all inputs, will start task with " + JSON.stringify(userInput)
    )

    try {
      let top3 = await prepareTenants(userInput)
      top3.traceTop3.forEach(ele => {
        console.log("trace for " + ele.name)
      })
      top3.serverTop3.forEach(ele => {
        console.log("server for " + ele.name)
      })
      top3.clientTop3.forEach(ele => {
        console.log("client for " + ele.name)
      })
      await myTest(userInput, top3.traceTop3, 1)
      await myTest(userInput, top3.serverTop3, 2)
      await myTest(userInput, top3.clientTop3, 3)
    } catch (err) {
      console.error(err)
    }
  })
}

fun()
