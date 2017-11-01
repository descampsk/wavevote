var WaveVote = artifacts.require("./WaveVote.sol");
var WaveVoteContractRegistery = artifacts.require("./WaveVoteContractRegistery.sol");
var LocalCrypto = artifacts.require("./LocalCrypto.sol");

module.exports = function(deployer) {
  deployer.deploy(WaveVote, {gas: 9000000});
  //deployer.deploy(WaveVoteContractRegistery);
  //deployer.deploy(LocalCrypto);
};
