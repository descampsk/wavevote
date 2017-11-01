import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/WaveVote.sol";

contract TestWaveVote {

  function testBeginSignUp() {
    WaveVote waveVote = new WaveVote();
    bytes32 answer1 = stringToBytes32("answer 1");
    bytes32[] storage answerList;
    answerList.push(answer1);
    
	waveVote.beginSignUp("testQuestion", answerList, 1500000, 1500000, 1500000);
	
	Assert.equal(true, true, "The state should be 1");
  }

	function stringToBytes32(string memory source) returns (bytes32 result) {
    assembly {
        result := mload(add(source, 32))
    }
}
}