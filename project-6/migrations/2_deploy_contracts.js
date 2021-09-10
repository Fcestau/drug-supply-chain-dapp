// migrating the appropriate contracts
var ManufacturerRole = artifacts.require("./ManufacturerRole.sol");
var DistributorRole = artifacts.require("./DistributorRole.sol");
var InspectorRole = artifacts.require("./InspectorRole.sol");
var BuyerRole = artifacts.require("./BuyerRole.sol");

module.exports = function(deployer) {
  deployer.deploy(ManufacturerRole);
  deployer.deploy(DistributorRole);
  deployer.deploy(InspectorRole);
  deployer.deploy(BuyerRole);
};
