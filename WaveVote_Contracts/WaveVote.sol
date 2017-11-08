pragma solidity ^0.4.3;

/**
 * @title ECCMath
 *
 * Functions for working with integers, curve-points, etc.
 *
 * @author Andreas Olofsson (androlo1980@gmail.com)
 */
library ECCMath {
    /// @dev Modular inverse of a (mod p) using euclid.
    /// "a" and "p" must be co-prime.
    /// @param a The number.
    /// @param p The mmodulus.
    /// @return x such that ax = 1 (mod p)
    function invmod(uint a, uint p) internal constant returns (uint) {
        if (a == 0 || a == p || p == 0)
            throw;
        if (a > p)
            a = a % p;
        int t1;
        int t2 = 1;
        uint r1 = p;
        uint r2 = a;
        uint q;
        while (r2 != 0) {
            q = r1 / r2;
            (t1, t2, r1, r2) = (t2, t1 - int(q) * t2, r2, r1 - q * r2);
        }
        if (t1 < 0)
            return (p - uint(-t1));
        return uint(t1);
    }

    /// @dev Modular exponentiation, b^e % m
    /// Basically the same as can be found here:
    /// https://github.com/ethereum/serpent/blob/develop/examples/ecc/modexp.se
    /// @param b The base.
    /// @param e The exponent.
    /// @param m The modulus.
    /// @return x such that x = b**e (mod m)
    function expmod(uint b, uint e, uint m) internal constant returns (uint r) {
        if (b == 0)
            return 0;
        if (e == 0)
            return 1;
        if (m == 0)
            throw;
        r = 1;
        uint bit = 2 ** 255;
		bit = bit;
        assembly {
            loop:
                jumpi(end, iszero(bit))
                r := mulmod(mulmod(r, r, m), exp(b, iszero(iszero(and(e, bit)))), m)
                r := mulmod(mulmod(r, r, m), exp(b, iszero(iszero(and(e, div(bit, 2))))), m)
                r := mulmod(mulmod(r, r, m), exp(b, iszero(iszero(and(e, div(bit, 4))))), m)
                r := mulmod(mulmod(r, r, m), exp(b, iszero(iszero(and(e, div(bit, 8))))), m)
                bit := div(bit, 16)
                jump(loop)
            end:
        }
    }

    /// @dev Converts a point (Px, Py, Pz) expressed in Jacobian coordinates to (Px", Py", 1).
    /// Mutates P.
    /// @param P The point.
    /// @param zInv The modular inverse of "Pz".
    /// @param z2Inv The square of zInv
    /// @param prime The prime modulus.
    /// @return (Px", Py", 1)
    function toZ1(uint[3] memory P, uint zInv, uint z2Inv, uint prime) internal constant {
        P[0] = mulmod(P[0], z2Inv, prime);
        P[1] = mulmod(P[1], mulmod(zInv, z2Inv, prime), prime);
        P[2] = 1;
    }

    /// @dev See _toZ1(uint[3], uint, uint).
    /// Warning: Computes a modular inverse.
    /// @param PJ The point.
    /// @param prime The prime modulus.
    /// @return (Px", Py", 1)
    function toZ1(uint[3] PJ, uint prime) internal constant {
        uint zInv = invmod(PJ[2], prime);
        uint zInv2 = mulmod(zInv, zInv, prime);
        PJ[0] = mulmod(PJ[0], zInv2, prime);
        PJ[1] = mulmod(PJ[1], mulmod(zInv, zInv2, prime), prime);
        PJ[2] = 1;
    }

}

library Secp256k1 {

    // TODO separate curve from crypto primitives?

    // Field size
    uint constant pp = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F;

    // Base point (generator) G
    uint constant Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
    uint constant Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;

    // Order of G
    uint constant nn = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;

    // Cofactor
    // uint constant hh = 1;

    // Maximum value of s
    uint constant lowSmax = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0;

    // For later
    // uint constant lambda = "0x5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72";
    // uint constant beta = "0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee";

    /// @dev See Curve.onCurve
    function onCurve(uint[2] P) internal constant returns (bool) {
        uint p = pp;
        if (0 == P[0] || P[0] == p || 0 == P[1] || P[1] == p)
            return false;
        uint LHS = mulmod(P[1], P[1], p);
        uint RHS = addmod(mulmod(mulmod(P[0], P[0], p), P[0], p), 7, p);
        return LHS == RHS;
    }

    /// @dev See Curve.isPubKey
    function isPubKey(uint[2] memory P) internal constant returns (bool isPK) {
        isPK = onCurve(P);
    }

    /// @dev See Curve.isPubKey
    // TODO: We assume we are given affine co-ordinates for now
    function isPubKey(uint[3] memory P) internal constant returns (bool isPK) {
        uint[2] memory a_P;
        a_P[0] = P[0];
        a_P[1] = P[1];
        isPK = onCurve(a_P);
    }

    // Point addition, P + Q
    // inData: Px, Py, Pz, Qx, Qy, Qz
    // outData: Rx, Ry, Rz
    function _add(uint[3] memory P, uint[3] memory Q) internal constant returns (uint[3] memory R) {
        if(P[2] == 0)
            return Q;
        if(Q[2] == 0)
            return P;
        uint p = pp;
        uint[4] memory zs; // Pz^2, Pz^3, Qz^2, Qz^3
        zs[0] = mulmod(P[2], P[2], p);
        zs[1] = mulmod(P[2], zs[0], p);
        zs[2] = mulmod(Q[2], Q[2], p);
        zs[3] = mulmod(Q[2], zs[2], p);
        uint[4] memory us = [
            mulmod(P[0], zs[2], p),
            mulmod(P[1], zs[3], p),
            mulmod(Q[0], zs[0], p),
            mulmod(Q[1], zs[1], p)
        ]; // Pu, Ps, Qu, Qs
        if (us[0] == us[2]) {
            if (us[1] != us[3])
                return;
            else {
                return _double(P);
            }
        }
        uint h = addmod(us[2], p - us[0], p);
        uint r = addmod(us[3], p - us[1], p);
        uint h2 = mulmod(h, h, p);
        uint h3 = mulmod(h2, h, p);
        uint Rx = addmod(mulmod(r, r, p), p - h3, p);
        Rx = addmod(Rx, p - mulmod(2, mulmod(us[0], h2, p), p), p);
        R[0] = Rx;
        R[1] = mulmod(r, addmod(mulmod(us[0], h2, p), p - Rx, p), p);
        R[1] = addmod(R[1], p - mulmod(us[1], h3, p), p);
        R[2] = mulmod(h, mulmod(P[2], Q[2], p), p);
    }

    // Point addition, P + Q. P Jacobian, Q affine.
    // inData: Px, Py, Pz, Qx, Qy
    // outData: Rx, Ry, Rz
    function _addMixed(uint[3] memory P, uint[2] memory Q) internal constant returns (uint[3] memory R) {
        if(P[2] == 0)
            return [Q[0], Q[1], 1];
        if(Q[1] == 0)
            return P;
        uint p = pp;
        uint[2] memory zs; // Pz^2, Pz^3, Qz^2, Qz^3
        zs[0] = mulmod(P[2], P[2], p);
        zs[1] = mulmod(P[2], zs[0], p);
        uint[4] memory us = [
            P[0],
            P[1],
            mulmod(Q[0], zs[0], p),
            mulmod(Q[1], zs[1], p)
        ]; // Pu, Ps, Qu, Qs
        if (us[0] == us[2]) {
            if (us[1] != us[3]) {
                P[0] = 0;
                P[1] = 0;
                P[2] = 0;
                return;
            }
            else {
                _double(P);
                return;
            }
        }
        uint h = addmod(us[2], p - us[0], p);
        uint r = addmod(us[3], p - us[1], p);
        uint h2 = mulmod(h, h, p);
        uint h3 = mulmod(h2, h, p);
        uint Rx = addmod(mulmod(r, r, p), p - h3, p);
        Rx = addmod(Rx, p - mulmod(2, mulmod(us[0], h2, p), p), p);
        R[0] = Rx;
        R[1] = mulmod(r, addmod(mulmod(us[0], h2, p), p - Rx, p), p);
        R[1] = addmod(R[1], p - mulmod(us[1], h3, p), p);
        R[2] = mulmod(h, P[2], p);
    }

    // Same as addMixed but params are different and mutates P.
    function _addMixedM(uint[3] memory P, uint[2] memory Q) internal constant {
        if(P[1] == 0) {
            P[0] = Q[0];
            P[1] = Q[1];
            P[2] = 1;
            return;
        }
        if(Q[1] == 0)
            return;
        uint p = pp;
        uint[2] memory zs; // Pz^2, Pz^3, Qz^2, Qz^3
        zs[0] = mulmod(P[2], P[2], p);
        zs[1] = mulmod(P[2], zs[0], p);
        uint[4] memory us = [
            P[0],
            P[1],
            mulmod(Q[0], zs[0], p),
            mulmod(Q[1], zs[1], p)
        ]; // Pu, Ps, Qu, Qs
        if (us[0] == us[2]) {
            if (us[1] != us[3]) {
                P[0] = 0;
                P[1] = 0;
                P[2] = 0;
                return;
            }
            else {
                _doubleM(P);
                return;
            }
        }
        uint h = addmod(us[2], p - us[0], p);
        uint r = addmod(us[3], p - us[1], p);
        uint h2 = mulmod(h, h, p);
        uint h3 = mulmod(h2, h, p);
        uint Rx = addmod(mulmod(r, r, p), p - h3, p);
        Rx = addmod(Rx, p - mulmod(2, mulmod(us[0], h2, p), p), p);
        P[0] = Rx;
        P[1] = mulmod(r, addmod(mulmod(us[0], h2, p), p - Rx, p), p);
        P[1] = addmod(P[1], p - mulmod(us[1], h3, p), p);
        P[2] = mulmod(h, P[2], p);
    }

    // Point doubling, 2*P
    // Params: Px, Py, Pz
    // Not concerned about the 1 extra mulmod.
    function _double(uint[3] memory P) internal constant returns (uint[3] memory Q) {
        uint p = pp;
        if (P[2] == 0)
            return;
        uint Px = P[0];
        uint Py = P[1];
        uint Py2 = mulmod(Py, Py, p);
        uint s = mulmod(4, mulmod(Px, Py2, p), p);
        uint m = mulmod(3, mulmod(Px, Px, p), p);
        var Qx = addmod(mulmod(m, m, p), p - addmod(s, s, p), p);
        Q[0] = Qx;
        Q[1] = addmod(mulmod(m, addmod(s, p - Qx, p), p), p - mulmod(8, mulmod(Py2, Py2, p), p), p);
        Q[2] = mulmod(2, mulmod(Py, P[2], p), p);
    }

    // Same as double but mutates P and is internal only.
    function _doubleM(uint[3] memory P) internal constant {
        uint p = pp;
        if (P[2] == 0)
            return;
        uint Px = P[0];
        uint Py = P[1];
        uint Py2 = mulmod(Py, Py, p);
        uint s = mulmod(4, mulmod(Px, Py2, p), p);
        uint m = mulmod(3, mulmod(Px, Px, p), p);
        var PxTemp = addmod(mulmod(m, m, p), p - addmod(s, s, p), p);
        P[0] = PxTemp;
        P[1] = addmod(mulmod(m, addmod(s, p - PxTemp, p), p), p - mulmod(8, mulmod(Py2, Py2, p), p), p);
        P[2] = mulmod(2, mulmod(Py, P[2], p), p);
    }

    // Multiplication dP. P affine, wNAF: w=5
    // Params: d, Px, Py
    // Output: Jacobian Q
    function _mul(uint d, uint[2] memory P) internal constant returns (uint[3] memory Q) {
        uint p = pp;
        if (d == 0) // TODO
            return;
        uint dwPtr; // points to array of NAF coefficients.
		dwPtr = dwPtr;
        uint i;

        // wNAF
        assembly
        {
                let dm := 0
                dwPtr := mload(0x40)
                mstore(0x40, add(dwPtr, 512)) // Should lower this.
            loop:
                jumpi(loop_end, iszero(d))
                jumpi(even, iszero(and(d, 1)))
                dm := mod(d, 32)
                mstore8(add(dwPtr, i), dm) // Don"t store as signed - convert when reading.
                d := add(sub(d, dm), mul(gt(dm, 16), 32))
            even:
                d := div(d, 2)
                i := add(i, 1)
                jump(loop)
            loop_end:
        }

        // Pre calculation
        uint[3][8] memory PREC; // P, 3P, 5P, 7P, 9P, 11P, 13P, 15P
        PREC[0] = [P[0], P[1], 1];
        var X = _double(PREC[0]);
        PREC[1] = _addMixed(X, P);
        PREC[2] = _add(X, PREC[1]);
        PREC[3] = _add(X, PREC[2]);
        PREC[4] = _add(X, PREC[3]);
        PREC[5] = _add(X, PREC[4]);
        PREC[6] = _add(X, PREC[5]);
        PREC[7] = _add(X, PREC[6]);

        uint[16] memory INV;
        INV[0] = PREC[1][2];                            // a1
        INV[1] = mulmod(PREC[2][2], INV[0], p);         // a2
        INV[2] = mulmod(PREC[3][2], INV[1], p);         // a3
        INV[3] = mulmod(PREC[4][2], INV[2], p);         // a4
        INV[4] = mulmod(PREC[5][2], INV[3], p);         // a5
        INV[5] = mulmod(PREC[6][2], INV[4], p);         // a6
        INV[6] = mulmod(PREC[7][2], INV[5], p);         // a7

        INV[7] = ECCMath.invmod(INV[6], p);             // a7inv
        INV[8] = INV[7];                                // aNinv (a7inv)

        INV[15] = mulmod(INV[5], INV[8], p);            // z7inv
        for(uint k = 6; k >= 2; k--) {                  // z6inv to z2inv
            INV[8] = mulmod(PREC[k + 1][2], INV[8], p);
            INV[8 + k] = mulmod(INV[k - 2], INV[8], p);
        }
        INV[9] = mulmod(PREC[2][2], INV[8], p);         // z1Inv
        for(k = 0; k < 7; k++) {
            ECCMath.toZ1(PREC[k + 1], INV[k + 9], mulmod(INV[k + 9], INV[k + 9], p), p);
        }

        // Mult loop
        while(i > 0) {
            uint dj;
            uint pIdx;
            i--;
            assembly {
                dj := byte(0, mload(add(dwPtr, i)))
            }
            _doubleM(Q);
            if (dj > 16) {
                pIdx = (31 - dj) / 2; // These are the "negative ones", so invert y.
                _addMixedM(Q, [PREC[pIdx][0], p - PREC[pIdx][1]]);
            }
            else if (dj > 0) {
                pIdx = (dj - 1) / 2;
                _addMixedM(Q, [PREC[pIdx][0], PREC[pIdx][1]]);
            }
        }
    }

}

/**
 * 
 */
contract owned {
    address public owner;

    /* Initialise contract creator as owner */
    function owned() {
        owner = msg.sender;
    }

    /* Function to dictate that only the designated owner can call a function */
	  modifier onlyOwner {
        if(owner != msg.sender) throw;
        _;
    }

    /* Transfer ownership of this contract to someone else */
    function transferOwnership(address newOwner) onlyOwner() {
        owner = newOwner;
    }
}

/*
 * @title WaveVote
 *  Open Vote Network
 *  A self-talling protocol that supports voter privacy.
 *
 *  Author: Kévin DESCAMPS
 */
contract WaveVote is owned {

  // Modulus for public keys
  uint constant pp = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F;

  // Base point (generator) G
  uint constant Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
  uint constant Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;

  // Modulus for private keys (sub-group)
  uint constant nn = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;
  
  //Containt Gx and Gy
  uint[2] G;
  
  //Every address has an index
  //This makes looping in the program easier.
  address[] public addresses;
  
  
  //WARNING : begin to uint 1 ! 0 is used for the empty object
  mapping (address => uint) public addressid; // Address to Counter
  mapping (uint => VoterBis) public voterMapBis;
  
  mapping (address => bool) public hasReceivedOneEther;
  mapping (bytes32 => bool) public inscriptionCodeUsed;
  
  
  //To save all people which ask to register
  address[] public addressesToRegister;
  mapping (address => PeopleToRegister) public peopleToRegisterMap;
  struct PeopleToRegister {
	  address addr;
	  bool registrationAsked;
      uint[2] personalPublicKey;
      bytes32 inscriptionCode;
  }
  
  
  //Struct to save all voters
  struct VoterBis {
	  address addr;
	  bool registered;
	  bool voteCast;
      uint[2] personalPublicKey;
      uint[2] adminPublicKey;
      uint[2] registeredkey;
      uint[2] reconstructedkey;
      uint[2] vote;
  }
  
  // Work around function to fetch details about someone which asked to register
  function getPeopleToRegister(address _address) constant returns (bool _registrationAsked, uint[2] _personalPublicKey, bytes32 _inscriptionCode) {
	  _registrationAsked = peopleToRegisterMap[_address].registrationAsked;
	  _personalPublicKey = peopleToRegisterMap[_address].personalPublicKey;
	  _inscriptionCode = peopleToRegisterMap[_address].inscriptionCode;
  }
  
  // Work around function to fetch details about a voter
  function getVoterBis(address _address) constant returns (bool _registered, bool _voteCast, uint[2] _personalPublicKey, uint[2] _adminPublicKey, uint[2] _registeredkey, uint[2] _reconstructedkey, uint[2] _vote) {
	  uint index = addressid[_address];
	  if (index==0) {
		  uint256[2] memory nullArray;
		  _registered = false;
		  _voteCast = false;
		  _personalPublicKey = nullArray;
	      _adminPublicKey = nullArray;
	      _registeredkey = nullArray;
	      _reconstructedkey = nullArray;
	      _vote = nullArray; 
	  } else {
		  _registered = voterMapBis[index].registered;
		  _voteCast = voterMapBis[index].voteCast;
		  _personalPublicKey = voterMapBis[index].personalPublicKey;
	      _adminPublicKey = voterMapBis[index].adminPublicKey;
	      _registeredkey = voterMapBis[index].registeredkey;
	      _reconstructedkey = voterMapBis[index].reconstructedkey;
	      _vote = voterMapBis[index].vote; 
	  }
  }
  
  //Getter for all boolean of the voter
  function hasAskedForRegistration(address _address) constant returns(bool) {
	  return peopleToRegisterMap[_address].registrationAsked;
  }
  
  function isRegistered(address _address) constant returns(bool) {
	  uint index = addressid[_address];
	  return voterMapBis[index].registered; 
  }
  
  function hasCastVote(address _address) constant returns(bool) {
	  uint index = addressid[_address];
	  return voterMapBis[index].voteCast; 
  }
  
  function getTotalAnswers() constant returns (uint) {
	  return answerList.length;
  }

  // List of timers that each phase MUST end by an explicit time in UNIX timestamp.
  // Ethereum works in SECONDS. Not milliseconds.
  uint public finishSignupPhase; // Election Authority to transition to next phase.
  uint public endSignupPhase; // Election Authority does not transition to next phase by this time.
  uint public endVotingPhase; // Voters have not submitted their vote by this stage.
    
  uint public totalRegistrationAsked; //Total number of people that have asked a registration
  uint public totalRecalculatedKey; //Number to track how many recalculated key are computed
  uint public totalregistered; //Total number of participants that are registered
  uint public totalvoted; //Total number of participants that have cast their vote

  string public question; //The question
  bytes32[] public answerList; //The list of the answers of the question
  
  bool manualComputationTally;

  mapping (uint => uint) public finalTally; // Final tally

  enum State { SETUP, SIGNUP, VOTE, FINISHED }
  State public state;

  modifier inState(State s) {
    if(state != s) {
        throw;
    }
    _;
  }

  //Constructor of the contract
  function WaveVote() payable {
    G[0] = Gx;
    G[1] = Gy;
    state = State.SETUP;
    question = "No question set";
  }
  
  function addEther() payable {
	  
  }
  
  //Used to send one eth to a voter to allow him to send transactions
  function sendOneEtherToVoter(address addr) returns (bool _successful, string _error) {
	  if(hasReceivedOneEther[addr]) {
		  _successful = false;
		  _error = "This account has already received one ether";
	  } else {
		  hasReceivedOneEther[addr] = true;
		  _successful = true;
		  addr.transfer(1 ether);
	  }
  }

  // Owner of contract declares that eligible addresses begin round 1 of the protocol
  // Time is the number of 'blocks' we must wait until we can move onto round 2.
  //function beginSignUp(string _question, bool enableCommitmentPhase, uint _finishSignupPhase, uint _endSignupPhase, uint _endCommitmentPhase, uint _endVotingPhase, uint _endRefundPhase, uint _depositrequired) inState(State.SETUP) onlyOwner payable returns (bool){
  function beginSignUp(string _question, bytes32[] _answerListBytes, uint _finishSignupPhase, uint _endSignupPhase, uint _endVotingPhase) inState(State.SETUP) onlyOwner payable returns (bool){
    // We have lots of timers. let's explain each one
    // _finishSignUpPhase - Voters should be signed up before this timer

    // Voter is refunded if any of the timers expire:
    // _endSignUpPhase - Election Authority never finished sign up phase
    // _endCommitmentPhase - One or more voters did not send their commitments in time
    // _endVotingPhase - One or more voters did not send their votes in time

    // Represented in UNIX time...
    // TODO: Set to block timestamp...
    // Deposit can be zero or more WEI
	if(_finishSignupPhase > 0) {

        // Ensure each time phase finishes in the future...
        // Ensure there is a gap of 'x time' between each phase.
        if(_endSignupPhase < _finishSignupPhase) {
          return false;
        }
        
        // We have no commitment phase.
        // Make sure there is a gap between 'end of registration' and 'end of vote' phases.
        if(_endVotingPhase < _endSignupPhase) {
          return false;
        }

      // All time stamps are reasonable.
      // We can now begin the signup phase.
      state = State.SIGNUP;

      // All timestamps should be in UNIX..
      finishSignupPhase = _finishSignupPhase;
      endSignupPhase = _endSignupPhase;
      endVotingPhase = _endVotingPhase;
      question = _question;
      answerList = _answerListBytes;

      return true;
    }

    return false;
  }

  // This function determines if one of the deadlines have been missed
  // If a deadline has been missed - then we finish the election,
  // and allocate refunds to the correct people depending on the situation.
  function deadlinePassed() returns (bool){

      //TODO : cette fonction ne sert peut-être à rien
      // Has the Election Authority missed the signup deadline?
      // Election Authority will forfeit his deposit.
      if(state == State.SIGNUP && block.timestamp > endSignupPhase) {
         // Nothing to do. All voters are refunded.
         state = State.FINISHED;
         return true;
      }

      // Has a voter failed to send in their vote?
      // Eletion Authority does NOT forfeit his deposit.
      if(state == State.VOTE && block.timestamp > endVotingPhase) {
         state = State.FINISHED;
         return true;
      }
      
      if (state == State.FINISHED) {
    	  return true;
      }

      // No deadlines have passed...
      return false;
  }
  
  /*
   * ONLY FOR TEST PURPOSE
   */
  function forceCancelElection() onlyOwner {
      
      uint256[2] memory nullArray;

      for(uint i=0; i<addressesToRegister.length; i++) {
      	 address addr = addressesToRegister[i];
      	 bytes32 inscriptionCode = peopleToRegisterMap[addr].inscriptionCode;
      	 inscriptionCodeUsed[inscriptionCode] = false;
      	 peopleToRegisterMap[addr] = PeopleToRegister({
      		  addr: 0,
      		  registrationAsked: false,
      	      personalPublicKey: nullArray,
      	      inscriptionCode: 0
      	  });
        }
      
      totalRegistrationAsked = 0;
      delete addressesToRegister;

      for(i=0; i<addresses.length; i++) {
         addr = addresses[i];
         voterMapBis[i] = VoterBis({
         	addr: 0,
        	registered: false,
        	voteCast: false,
        	personalPublicKey: nullArray,
        	adminPublicKey: nullArray,
        	registeredkey: nullArray, 
        	reconstructedkey: nullArray,
        	vote: nullArray});
         addressid[addr] = 0; // Remove index
      }
      
      for(i=0;i<answerList.length;i++) {
    	  finalTally[i]=0;
      }
      
      delete addresses;  
      delete answerList;
      
      manualComputationTally = false;

      // Reset timers.
      finishSignupPhase = 0;
      endSignupPhase = 0;
      endVotingPhase = 0;  

      // Keep track of voter activity
      totalRecalculatedKey = 0;
      totalregistered = 0;
      totalvoted = 0;

      // General values that need reset
      question = "No question set";

      state = State.SETUP;  
  }
  
  /**
   * The voter ask for a registration for this vote.
   * @param personalPublicKey : the personalPublicKey of the voter
   * @param inscriptionCode : the inscriptionCode of the voter
   */
  function askForRegistration(uint[2] personalPublicKey, bytes32 inscriptionCode) inState(State.SIGNUP) returns (bool _successful, string _error) {
     if(block.timestamp > finishSignupPhase) {
         _successful = false;
         _error = "The signup phase is already over. You can't ask for registration anymore";
       }
     
     if (hasAskedForRegistration(msg.sender)) {
         _successful = false;
         _error = "You already asked for a registration. Please wait for the confirmation of an administrator.";
     } else if(inscriptionCodeUsed[inscriptionCode]) {
         _successful = false;
         _error = "This inscription code is already used";
     } else {
    	 addressesToRegister.push(msg.sender);
    	 inscriptionCodeUsed[inscriptionCode] = true;
    	 peopleToRegisterMap[msg.sender] = PeopleToRegister({addr: msg.sender, 
    		 								registrationAsked: true,  
    		 								personalPublicKey: personalPublicKey,
    		 								inscriptionCode: inscriptionCode});
    	 totalRegistrationAsked +=1;
    	 _successful = true;
     }
  }
     
  
  //Used to follow each registration
  event RegisterAccountEvent(address indexed accountToRegister, bool _successful, string message);
  
  // Called by the administrator to register a voter
  function registerAccount(address accountToRegister, uint[2] adminPublicKey, uint[2] xG, uint[3] vG, uint r) inState(State.SIGNUP) onlyOwner returns (bool _successful, string _error) {
	  
	uint256[2] memory nullArray;  
	  
     // HARD DEADLINE
     if(block.timestamp > finishSignupPhase) {
    	 _successful = false;
    	 _error = "The deadline to signup is over";
     }
     
    //TODO : doit vérifier que xG est unique !!!
     //TODO : need one ZKP for AdminPublicKey
	if (!isRegistered(accountToRegister)) {
        if(verifyZKP(xG,r,vG) ) {
            // Update voter's registration
            addresses.push(accountToRegister);	
            totalregistered += 1;
            addressid[accountToRegister] = totalregistered;
            voterMapBis[totalregistered] = VoterBis({
            	addr: accountToRegister,
            	registered: true,
            	voteCast: false,
            	personalPublicKey: peopleToRegisterMap[accountToRegister].personalPublicKey,
            	adminPublicKey: adminPublicKey,
            	registeredkey: xG, 
            	reconstructedkey: nullArray,
            	vote: nullArray});
            
            _successful = true;
            RegisterAccountEvent(accountToRegister, true, "Account register");
        } else {
        	_successful = false;
        	_error = "Impossible to verify correctly the ZKP";
        	RegisterAccountEvent(accountToRegister, _successful, _error);
        }
	} else {
    	_successful = false;
    	_error = "This ethereum account is already registred.";
    	RegisterAccountEvent(accountToRegister, _successful, _error);
	}

  }
  
  
  //Used to follow the computation
  event ComputationReconstructedKeyEvent(address indexed addressVoter, bool _successful, string _error, uint[2] _yG);
  
  /**
   * Function to compute one of the reconstructedKey of one Voter
   * @param indexVoter : the index of map VoterMap
   */
  function computeReconstructedKey(uint indexVoter) onlyOwner returns(bool _successful, string _message, uint[2] _yG){
      	  
	  // Make sure at least 3 people have signed up...
      if(totalregistered < 3) {
    	_successful = false;
    	_message = "Less than 3 people have signed up";
        return;
      } 
      
      // We can only compute the public keys once participants
      // have been given an opportunity to register their
      // voting public key.
      //TODO : enlever le false : DEBUG ONLY
      if(block.timestamp < finishSignupPhase &&  false) {
      	_successful = false;
    	_message = "The signup phase isn't finished";   
        return;
      }

      // Election Authority has a deadline to begin election
      if(block.timestamp > endSignupPhase) {
      	_successful = false;
    	_message = "It is too late to begin the election";
        return;
      }
      
      if(indexVoter<1 || indexVoter>totalregistered) {
        	_successful = false;
        	_message = "IndexVoter must be between 1 and totalregistered";
            return;
      }
      
      
      //Check if we have not already compute the reconstructedKey.
      //If we don't have, then we add one to the total
      if (voterMapBis[indexVoter].reconstructedkey[0]==0) {
    	  totalRecalculatedKey+=1;
    	  //If the total is equal to the totalregistered, then we have compute all keys and the vote can begin.
    	  if (totalRecalculatedKey==totalregistered) {
    		  state = State.VOTE;
    	  }
      }
 
      
      //We compute the recalculatedKey
      //@dev DAT to understand the computation
      address addressVoter = addresses[indexVoter-1];
      
      uint[2] memory yG;
      uint[3] memory temp;
      uint[3] memory beforei;
      uint[3] memory afteri;
      
		if (indexVoter==1) {
		      afteri[0] = voterMapBis[2].registeredkey[0];
		      afteri[1] = voterMapBis[2].registeredkey[1];
		      afteri[2] = 1;

		      for(uint i=3; i<=totalregistered; i++) {
		         Secp256k1._addMixedM(afteri, voterMapBis[i].registeredkey);
		      }

		      ECCMath.toZ1(afteri,pp);
		      yG[0] = afteri[0];
		      yG[1] = pp-afteri[1];
		} else if (indexVoter==totalregistered) {
			beforei[0] = voterMapBis[1].registeredkey[0];
			beforei[1] = voterMapBis[1].registeredkey[1];
			beforei[2] = 1;
           	for(i=2;i<totalregistered;i++) {
           		Secp256k1._addMixedM(beforei, voterMapBis[i].registeredkey);
        	}
           	ECCMath.toZ1(beforei,pp);
		    yG[0] = beforei[0];
		    yG[1] = beforei[1];
		} else {
			beforei[0] = voterMapBis[1].registeredkey[0];
			beforei[1] = voterMapBis[1].registeredkey[1];
			beforei[2] = 1;
        	for(uint j=2;j<indexVoter;j++) {
        		Secp256k1._addMixedM(beforei, voterMapBis[j].registeredkey);
        	}
        	ECCMath.toZ1(beforei,pp);
        	
        	afteri[0] = voterMapBis[indexVoter+1].registeredkey[0];
        	afteri[1] = voterMapBis[indexVoter+1].registeredkey[1];
        	afteri[2] = 1;
        	for(j=indexVoter+2;j<=totalregistered;j++) {
        		Secp256k1._addMixedM(afteri, voterMapBis[j].registeredkey);
        	}
        	ECCMath.toZ1(afteri,pp);
        	afteri[0] = afteri[0];
        	afteri[1] = pp-afteri[1];
        	
        	temp = Secp256k1._add(afteri, beforei);
        	ECCMath.toZ1(temp,pp);
        	
		    yG[0] = temp[0];
		    yG[1] = temp[1];
		}		
      _yG = yG;
      voterMapBis[indexVoter].reconstructedkey = yG;
      _successful = true;
      ComputationReconstructedKeyEvent(addressVoter, _successful, "Computation was a success", yG);
      

      
      return;
      
  }
  
  /**
   * Function to submit the vote from a voter
   * @param y : the vote of the voter
   * @param diAndriList : informations of the ZKP
   * @param aList : informations of the ZKP
   * @param bList : informations of the ZKP
   * @dev the DAT to know what is di, ri, ai and bi
   */
  function submitVote(uint[3] y, uint[2][10] diAndriList, uint[2][10] aList,  uint[2][10] bList) inState(State.VOTE) returns (bool _successful, string _message) {

     // HARD DEADLINE
     if(block.timestamp > endVotingPhase) {
    	 _successful = false;
    	 _message = "The vote is closed. You can't vote anymore";
       return;
     }

     // Make sure the sender can vote, and hasn't already voted.
     if(isRegistered(msg.sender) && !hasCastVote(msg.sender)) {
    	 
	 	uint c = addressid[msg.sender];
		uint[2] xG = voterMapBis[c].registeredkey;
		uint[2] yG = voterMapBis[c].reconstructedkey;
		uint[2][2] memory res2D;
		res2D[0] = xG;
		res2D[1] = yG;
		
		//Check the ZKP
		(_successful, _message) = verifyZKPVote(y, res2D, diAndriList, aList,  bList);
		if(_successful) {
	    	 voterMapBis[c].vote[0] = y[0];
	    	 voterMapBis[c].vote[1] = y[1];

	    	 voterMapBis[c].voteCast = true;

	         totalvoted += 1;

	    	 _successful = true;
	    	 _message = "You cast your vote with success";
	         return;
		} else {
			return;
		}
           

     } else {
    	 _successful = false;
    	 _message = "You have already cast your vote";
       return;
     }
  }
  
  //To follow the cast of a vote
  event IsVoteCastEvent(address indexed _from, bool _isVoteCast, string _error);
  
  
  /**
   * Function used by the administrator to send null votes
   * @param addressToDoNullVote : address of the voter who has not cast his vote
   * @param nullVote : the nullVote
   * @param vG : ZKP for the null vote
   * @param yvG : ZKP for the null vote
   * @param r : random number for the ZKP
   */
  function submitNullVote(address addressToDoNullVote, uint[2] nullVote, uint[3] vG, uint[3] yvG, uint r) inState(State.VOTE) onlyOwner returns (bool _successful, string _error) {
     // HARD DEADLINE
	  
	  //A modifier pour pouvoir lancer la fonction qu'après la fin du vote
	  
	  /*
     if(block.timestamp > endVotingPhase) {
    	 _successful = false;
    	 _error = "The voting phase is already finished"
       return;
     }
     */

     // Make sure the sender can vote, and hasn't already voted.
     if(isRegistered(addressToDoNullVote) && !hasCastVote(addressToDoNullVote)) {
        
    	uint c = addressid[addressToDoNullVote];
    	uint[2] xG = voterMapBis[c].registeredkey;
    	uint[2] yG = voterMapBis[c].reconstructedkey;
    	
       // Verify the ZKP for the vote being cast
       (_successful, _error) = verifyZKPNullVote(xG, yG, nullVote, r, vG, yvG);
       if(_successful) {
           
    	 voterMapBis[c].vote[0] = nullVote[0];
    	 voterMapBis[c].vote[1] = nullVote[1];

    	 voterMapBis[c].voteCast = true;

         totalvoted += 1;

    	 _successful = true;
       } else {
    	   return;
       }
     } else {
    	 _successful = false;
    	 _error = "The voter is not registered or has already cast his vote";
     }
     
     IsVoteCastEvent(addressToDoNullVote, _successful, _error);
     
  }
  
  /**
   * Constant function to sum all the votes
   */
  function computeSumAllVote() constant returns(uint[2] _sum) {
	 uint[3] memory temp;
     uint[2] memory vote;

     // Sum all votes : map is 1 to n ...
     for(uint i=1; i<=totalregistered; i++) {

         // Confirm all votes have been cast...
         if(!voterMapBis[i].voteCast) {
            throw;
         }

         vote = voterMapBis[i].vote;

         if(i==1) {
           temp[0] = vote[0];
           temp[1] = vote[1];
           temp[2] = 1;
         } else {
             Secp256k1._addMixedM(temp, vote);
         }
     }
     
     ECCMath.toZ1(temp,pp);
     
     _sum[0] = temp[0];
     _sum[1] = temp[1];
     return;
  }
  
  
  /**
   * Function called by the administrator to compute the Tally
   */
  function computeTally() inState(State.VOTE) onlyOwner returns(bool _successful, string _message) {
	  //We check that all people have cast their vote
	  if(totalregistered==totalvoted) {
		     uint[2] memory sumAllVoteTemp = computeSumAllVote();

		     // All votes have been accounted for...
		     // Get tally, and change state to 'Finished'
		     if(sumAllVoteTemp[0] == 0) {
		    	 _successful = false;
		    	 _message = "Error : the computation of the sum of all votes give 0";
		    	 return;
		     } else {
		    	 uint result;
		    	 (_successful, _message, result) = discretLogarithme(sumAllVoteTemp);
		    	 if (_successful) {
				     state = State.FINISHED;
				     (_successful, _message) = computeFinalTally(result);
				     return;
		    	 } else {
				     state = State.FINISHED;
				     manualComputationTally = true;
				     _successful = false;
				     _message = "Impossible to do the discret logarithme of the sum of all votes. Please do it externaly and send the result of the computation.";
				     return;
		    	 }
		     }		  
	  } else {
		  _successful = false;
		  _message = "Impossible to compute tally because not all registered people has voted.";
		  return;
	  }
}
  
  
  /**
   * Function called by the administrator to do a Tally
   * @param result : result of the discret logarithm of the sum of all votes
   */
  function computeFinalTally(uint result) onlyOwner returns (bool _successful, string _message){
	  //Check that all voters has cast their vote
	  if(totalregistered==totalvoted) {
	  
		  //Check that the result is correct
		  uint[3] memory temp = Secp256k1._mul(result,G);
		  ECCMath.toZ1(temp,pp);
		  uint[2] memory sumAllVoteTemp = computeSumAllVote();
		  
		  if (sumAllVoteTemp[0]==temp[0]) {
			  //The result is correct  
			  uint totalAnswers = getTotalAnswers();
			  	
			  	//On trouve m tel que 2^m>n
			  	uint m=1;
			  	while (2**m<=totalregistered) {
			  		m+=1;
			  	}
			  	
			  	uint x = 0;
				for(int i=int(totalAnswers-1);i>=0;i--) {
					uint c = 1;
					while((2**(m*uint(i)))*c<=result-x) {
						c+=1;
					}
					c-=1;
					finalTally[uint(i)]=c;
					x+=c*(2**(m*uint(i)));
				}
					
				_successful = true;
				state = State.FINISHED;
			  return;
		  } else {
			  _successful = false;
			  state = State.FINISHED;
			  manualComputationTally = false;
			  _message = "The result isn't compatible with the sum of all votes. The smart contract can't get the tally";
			  return;
		  }
	  } else {
		  _successful = false;
		  _message = "Impossible to compute tally because not all registered people has voted.";
		  return;
	  }
	  
  }
  
  /**
   * Constant function to compute the discret Logarithme of a elliptic point
   */
  function discretLogarithme(uint[2] point) constant returns (bool _successful, string _message, uint _result){
	  if(point[0] == 0) {
	       _successful = false;
	       _message = "The point was null";
	       _result = 0;
	       return;
	     } else {
	       // There must be a vote. So lets
	       // start adding 'G' until we
	       // find the result.
	       uint[3] memory tempG;
	       tempG[0] = G[0];
	       tempG[1] = G[1];
	       tempG[2] = 1;

	       // Start adding 'G' and looking for a match
	       uint x = 1;
	       while(point[0] != tempG[0]) {
	         Secp256k1._addMixedM(tempG, G);
	         ECCMath.toZ1(tempG,pp);
	         x+=1;
	       }
	       _successful = true;
	       _result = x;
	       return;
	     }
  }
  
  /**
   * Constant function to verify if the tally is correct. This function can be called by all voters to be sure of the result.
   */
  function verifyTally(uint[2] sumVotes) constant returns (bool) {
  	uint totalAnswers = getTotalAnswers();
  	
  	//On trouve m tel que 2^m>n
  	uint m=1;
  	while (2**m<=totalregistered) {
  		m+=1;
  	}
	  
	  uint sumAnswers = 0;
	  for(uint i=0;i<totalAnswers;i++) {
		  uint numberVote = finalTally[i];
		  sumAnswers += (2**(m*i))*numberVote;
	  }
	  
	  if(sumAnswers==0) {
		  return false;
	  } else {
		  uint[3] memory temp = Secp256k1._mul(sumAnswers, G);
		  ECCMath.toZ1(temp, pp);
		  
		  if(temp[0]!=sumVotes[0] || temp[1]!=sumVotes[1]) {
			  return false;
		  } else {
			  return true;
		  }
	  }  
  }

  // Parameters xG, r where r = v - xc, and vG.
  // Verify that vG = rG + xcG!
  function verifyZKP(uint[2] xG, uint r, uint[3] vG) returns (bool){
      // Check both keys are on the curve.
      if(!Secp256k1.isPubKey(xG) || !Secp256k1.isPubKey(vG)) {
        return false; //Must be on the curve!
      }

      // Get c = H(g, g^{x}, g^{v});
      bytes32 b_c = sha256(msg.sender, Gx, Gy, xG, vG);
      uint c = uint(b_c);

      // Get g^{r}, and g^{xc}
      uint[3] memory rG = Secp256k1._mul(r, G);
      uint[3] memory xcG = Secp256k1._mul(c, xG);

      // Add both points together
      uint[3] memory rGxcG = Secp256k1._add(rG,xcG);

      // Convert to Affine Co-ordinates
      ECCMath.toZ1(rGxcG, pp);

      // Verify. Do they match?
      if(rGxcG[0] == vG[0] && rGxcG[1] == vG[1]) {
         return true;
      } else {
         return false;
      }
  }
  
  
  // Parameters xG, r where r = v - xc, and vG.
  // Verify that vG = rG + xcG
  // And that vH = rH + (y/G)^c
  function verifyZKPNullVote(uint[2] xG, uint[2] yG, uint[2] voteNull, uint r, uint[3] vG, uint[3] vH) constant returns (bool _successful, string _error){
	  
      // Check both keys are on the curve.
      if(!Secp256k1.isPubKey(xG) || !Secp256k1.isPubKey(vG) || !Secp256k1.isPubKey(voteNull) || !Secp256k1.isPubKey(vH)) {
    	_successful = false;
    	_error = "xG or vG or yiG or yivG isnt a PubKey";
        return; //Must be on the curve!
      }

      // Get c = H(g, g^{x}, g^{v});
      uint c = uint(sha256(msg.sender, Gx, Gy, yG, vG, vH));

      // Get g^{r}, and g^{xc}
      uint[3] memory temp1 = Secp256k1._mul(r, G);
      uint[3] memory temp2 = Secp256k1._mul(c, xG);

      // Add both points together
      temp1 = Secp256k1._add(temp1,temp2);
      ECCMath.toZ1(temp1, pp);
      
      if (temp1[0] != vG[0] || temp1[1] != vG[1]) {
          _successful = false;
          _error = "vG != rG*xcG";
          return;
      }
      
      // Get g^{yi*r}
      temp1 = Secp256k1._mul(r, yG);
      
      
      // Get g^{yix}/G*c
      // Negate the 'y' co-ordinate of G
      temp2[0] = G[0];
      temp2[1] = pp - G[1];
      temp2[2] = 1;
      
      temp2 = Secp256k1._addMixed(temp2,voteNull);
      ECCMath.toZ1(temp2, pp);
      uint[2] memory temp_affine;
      temp_affine[0] = temp2[0];
      temp_affine[1] = temp2[1];
      
      temp2 = Secp256k1._mul(c, temp_affine);

      // Add both points together
      uint[3] memory ryiGyixcG = Secp256k1._add(temp1,temp2);
      ECCMath.toZ1(ryiGyixcG, pp);

      // Verify. Do they match?
      if(ryiGyixcG[0] == vH[0] && ryiGyixcG[1] == vH[1]) {
    	  _successful = true;
    	  return;
      } else {
    	  _successful = false;
    	  _error = "Error : equality is false.";
         return;
      }
  }
  
  /*
   * uint[2][2] res2D : 
   * 0 => xG
   * 1 => yG
   * 
   * uint[2][] diAndRiList;
   * 0 => diList
   * 1 => riList
   * 
   * We verify that the vote is well constructed
   */
	function verifyZKPVote(uint[3] y, uint[2][2] res2D, uint[2][10] diAndriList, uint[2][10] aList,  uint[2][10] bList) returns (bool _successful, string _message) {
		
	  	//Calcul de m
		uint m=1;
	  	while (2**m<=totalregistered) {
	  		m+=1;
	  	}
	  	
	  	uint[3] memory temp1;
	  	uint[3] memory temp2;
	  	uint[2] memory temp_affine;
	  	
		uint sumDi = 0;
    	for(uint i=0;i<getTotalAnswers();i++) {
    		//Calcul de 1/Gi
    		uint[3] memory negateGi = Secp256k1._mul(2**(m*i),G);
    		ECCMath.toZ1(negateGi, pp);
    		negateGi[0] = negateGi[0];
    		negateGi[1] = pp-negateGi[1];
    		negateGi[2] = 1;
    		
    		sumDi=addmod(sumDi, diAndriList[i][0],nn);
        	
            //ai = riGdixG
    		//Calcul riG
			temp1 = Secp256k1._mul(diAndriList[i][1],G);
			//Calcul dixG
			temp2 = Secp256k1._mul(diAndriList[i][0],res2D[0]);
			temp1 = Secp256k1._add(temp1, temp2);
			ECCMath.toZ1(temp1, pp);
            
            if(temp1[0]!=aList[i][0] || temp1[1]!=aList[i][1]) {
            	_successful = false;
            	_message = "The verification of the zkp failed : ai failed";
            	return;
            }
            
			//bi = riyG*(y/Gi)^di
            //temp1=riyG
			temp1 = Secp256k1._mul(diAndriList[i][1], res2D[1]);
			//temp2 = y/Gi
			temp2 = Secp256k1._add(y,negateGi);
			ECCMath.toZ1(temp2, pp);
			temp_affine[0] = temp2[0];
			temp_affine[1] = temp2[1];
			//temp2=(y/gi)^di
			temp2 = Secp256k1._mul(diAndriList[i][0],temp_affine);
			//temp2 = riyG + (y/Gi)^di
			temp2 = Secp256k1._add(temp1, temp2);
			ECCMath.toZ1(temp2, pp);
            
            if(temp2[0]!=bList[i][0] || temp2[1]!=bList[i][1]) {
            	_successful = false;
            	_message = "The verification of the zkp failed : bi failed";
            	return;
            }
    	} 
        
    	// c = H(y,a1,b1,a2,b2)	
        //uint c = uint(sha256(msg.sender, res2D[0], res2D[1], aList[0], bList[0], aList[1], bList[1], aList[2], bList[2], aList[3], bList[3], aList[4], bList[4], aList[5], bList[5], aList[6], bList[6], aList[7], bList[7], aList[8], bList[8], aList[9], bList[9]));
    	uint c = uint(sha256(msg.sender, res2D, aList, bList));
    	
        if(c!=sumDi) {
        	_successful = false;
        	_message = "The verification of the zkp failed : c failed";
        	return;
        }
		
    	_successful = true;
    	_message = "The verification of the zkp is a success";
    	return;
	}
}
