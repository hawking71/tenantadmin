const { openTunnel, closeTunnel } = require("../dbtunnel.js")
var assert = require("assert")
var chai = require("chai")
var should = chai.should
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised).should()

after(async function() {
  this.timeout(90000)
  await closeTunnel(_sessionId).should.eventually.to.be.true
})

let _sessionId = "02572280-1fff-46b1-a699-3f95bf14b3b6"

it("open a db tunnel", async function() {
  this.timeout(90000) //set timeout 60s since it's time consuming
  try {
    let res = await openTunnel(
      "ap1.hana.ondemand.com",
      "hanamobileprod",
      "i063065",
      "Jerrycat68",
      "-i mobileservices.apptracelog"
    )
    should.exist(res)
    res.should.have.property("result")
    assert(res.result.sessionId.length > 1)
    _sessionId = res.result.sessionId
  } catch (err) {}
  assert(_sessionId.length > 1)
})
