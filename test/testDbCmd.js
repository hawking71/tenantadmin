const { createTempAseDbUser, deleteTempAseDbUser } = require("../dbCmd")

var chai = require("chai")
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised).should()

it.skip("create/delete temp ase db user", async function() {
  this.timeout(30000) //set timeout 30s since it's time consuming
  await createTempAseDbUser(
    "cn1",
    "production",
    "i063065",
    "Jerrycat68",
    "mobileservices.apptracelog"
  ).should.eventually.be.true

  await deleteTempAseDbUser(
    "cn1",
    "production",
    "i063065",
    "Jerrycat68",
    "mobileservices.apptracelog"
  ).should.eventually.to.be.true
})
