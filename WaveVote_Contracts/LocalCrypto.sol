pragma solidity ^0.4.10;

/**
 * @title ECCMath_noconflict
 *
 * Functions for working with integers, curve-points, etc.
 *
 * @author Andreas Olofsson (androlo1980@gmail.com)
 */
library ECCMath_noconflict {
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

library Secp256k1_noconflict {

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

    /// @dev See Curve.validateSignature
    function validateSignature(bytes32 message, uint[2] rs, uint[2] Q) internal constant returns (bool) {
        uint n = nn;
        uint p = pp;
        if(rs[0] == 0 || rs[0] >= n || rs[1] == 0 || rs[1] > lowSmax)
            return false;
        if (!isPubKey(Q))
            return false;

        uint sInv = ECCMath_noconflict.invmod(rs[1], n);
        uint[3] memory u1G = _mul(mulmod(uint(message), sInv, n), [Gx, Gy]);
        uint[3] memory u2Q = _mul(mulmod(rs[0], sInv, n), Q);
        uint[3] memory P = _add(u1G, u2Q);

        if (P[2] == 0)
            return false;

        uint Px = ECCMath_noconflict.invmod(P[2], p); // need Px/Pz^2
        Px = mulmod(P[0], mulmod(Px, Px, p), p);
        return Px % n == rs[0];
    }

    /// @dev See Curve.compress
    function compress(uint[2] P) internal constant returns (uint8 yBit, uint x) {
        x = P[0];
        yBit = P[1] & 1 == 1 ? 1 : 0;
    }

    /// @dev See Curve.decompress
    function decompress(uint8 yBit, uint x) internal constant returns (uint[2] P) {
        uint p = pp;
        var y2 = addmod(mulmod(x, mulmod(x, x, p), p), 7, p);
        var y_ = ECCMath_noconflict.expmod(y2, (p + 1) / 4, p);
        uint cmp = yBit ^ y_ & 1;
        P[0] = x;
        P[1] = (cmp == 0) ? y_ : p - y_;
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

        INV[7] = ECCMath_noconflict.invmod(INV[6], p);             // a7inv
        INV[8] = INV[7];                                // aNinv (a7inv)

        INV[15] = mulmod(INV[5], INV[8], p);            // z7inv
        for(uint k = 6; k >= 2; k--) {                  // z6inv to z2inv
            INV[8] = mulmod(PREC[k + 1][2], INV[8], p);
            INV[8 + k] = mulmod(INV[k - 2], INV[8], p);
        }
        INV[9] = mulmod(PREC[2][2], INV[8], p);         // z1Inv
        for(k = 0; k < 7; k++) {
            ECCMath_noconflict.toZ1(PREC[k + 1], INV[k + 9], mulmod(INV[k + 9], INV[k + 9], p), p);
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

/*
 * @title LocalCrypto
 * Allow local calls to create and verify zkp.
 *  Author: Patrick McCorry
 */
contract LocalCrypto {

  // Modulus for public keys
  uint constant pp = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F;

  // Base point (generator) G
  uint constant Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
  uint constant Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;

  // New  point (generator) Y
  uint constant Yx = 98038005178408974007512590727651089955354106077095278304532603697039577112780;
  uint constant Yy = 1801119347122147381158502909947365828020117721497557484744596940174906898953;

  // Modulus for private keys (sub-group)
  uint constant nn = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;

  uint[2] G;
  uint[2] Y;

  event Debug(uint x1, uint x2);

  // 2 round anonymous voting protocol
  // TODO: Right now due to gas limits there is an upper limit
  // on the number of participants that we can have voting...
  // I need to split the functions up... so if they cannot
  // finish their entire workload in 1 transaction, then
  // it does the maximum. This way we can chain transactions
  // to complete the job...
  function LocalCrypto() {
    G[0] = Gx;
    G[1] = Gy;

    Y[0] = Yx;
    Y[1] = Yy;
  }

  // vG (blinding value), xG (public key), x (what we are proving)
  // c = H(g, g^{v}, g^{x});
  // r = v - xz (mod p);
  // return(r,vG)
  function createZKP(uint x, uint v, uint[2] xG) constant returns (uint[4] res) {
      
      if(!Secp256k1_noconflict.isPubKey(xG)) {
          throw; //Must be on the curve!
      }

      // Get g^{v}
      uint[3] memory vG = Secp256k1_noconflict._mul(v, G);

      // Convert to Affine Co-ordinates
      ECCMath_noconflict.toZ1(vG, pp);

      // Get c = H(g, g^{x}, g^{v});
      bytes32 b_c = sha256(msg.sender, Gx, Gy, xG, vG);
      uint c = uint(b_c);

      // Get 'r' the zkp
      uint xc = mulmod(x,c,nn);

      // v - xc
      uint r = submod(v,xc);

      res[0] = r;
      res[1] = vG[0];
      res[2] = vG[1];
      res[3] = vG[2];
      return;
  }
  
  // vG (blinding value), xG (public key), x (what we are proving)
  // c = H(g, g^{v}, g^{x});
  // r = v - xz (mod p);
  // return(r,vG)
  function createZKPNullVote(uint x, uint v, uint[2] yG) constant returns (uint[7] res) {

      if(!Secp256k1_noconflict.isPubKey(yG)) {
          throw; //Must be on the curve!
      }

      // Get g^{v}
      uint[3] memory vG = Secp256k1_noconflict._mul(v, G);
      // Convert to Affine Co-ordinates
      ECCMath_noconflict.toZ1(vG, pp);
      
      // Get g^{yi*v} = h^v
      uint[3] memory vH = Secp256k1_noconflict._mul(v, yG);
      // Convert to Affine Co-ordinates
      ECCMath_noconflict.toZ1(vH, pp);

      // Get c = H(g, g^{x}, g^{v});
      bytes32 b_c = sha256(msg.sender, Gx, Gy, yG, vG, vH);
      uint c = uint(b_c);

      // Get 'r' the zkp
      uint xc = mulmod(x,c,nn);

      // v - xc
      uint r = submod(v,xc);

      res[0] = r;
      res[1] = vG[0];
      res[2] = vG[1];
      res[3] = vG[2];
      res[4] = vH[0];
      res[5] = vH[1];
      res[6] = vH[2];
      return;
  }

  // a - b = c;
  function submod(uint a, uint b) returns (uint){
      uint a_nn;

      if(a>b) {
        a_nn = a;
      } else {
        a_nn = a+nn;
      }

      uint c = addmod(a_nn - b,0,nn);

      return c;
  }

  // Parameters xG, r where r = v - xc, and vG.
  // Verify that vG = rG + xcG!
  function verifyZKP(uint[2] xG, uint r, uint[3] vG) constant returns (bool _successful, string _error){

      // Check both keys are on the curve.
      if(!Secp256k1_noconflict.isPubKey(xG) || !Secp256k1_noconflict.isPubKey(vG)) {
    	_successful = false;
    	_error = "xG or vG isnt a PubKey";
        return; //Must be on the curve!
      }

      // Get c = H(g, g^{x}, g^{v});
      bytes32 b_c = sha256(msg.sender, Gx, Gy, xG, vG);
      uint c = uint(b_c);

      // Get g^{r}, and g^{xc}
      uint[3] memory rG = Secp256k1_noconflict._mul(r, G);
      uint[3] memory xcG = Secp256k1_noconflict._mul(c, xG);

      // Add both points together
      uint[3] memory rGxcG = Secp256k1_noconflict._add(rG,xcG);

      // Convert to Affine Co-ordinates
      ECCMath_noconflict.toZ1(rGxcG, pp);

      // Verify. Do they match?
      if(rGxcG[0] == vG[0] && rGxcG[1] == vG[1]) {
    	  _successful = true;
    	  return;
      } else {
    	  _successful = false;
    	  _error = "Error : equality is false.";
         return;
      }
  }
  
  // Parameters xG, r where r = v - xc, and vG.
  // Verify that vG = rG + xcG
  // And that vH = rH + (y/G)^c
  function verifyZKPNullVote(uint[2] xG, uint[2] yG, uint[2] voteNull, uint r, uint[3] vG, uint[3] vH) constant returns (bool _successful, string _error, uint[2] temp_affine){
	  
      // Check both keys are on the curve.
      if(!Secp256k1_noconflict.isPubKey(xG) || !Secp256k1_noconflict.isPubKey(vG) || !Secp256k1_noconflict.isPubKey(voteNull) || !Secp256k1_noconflict.isPubKey(vH)) {
    	_successful = false;
    	_error = "xG or vG or yiG or yivG isnt a PubKey";
        return; //Must be on the curve!
      }

      // Get c = H(g, g^{x}, g^{v});
      uint c = uint(sha256(msg.sender, Gx, Gy, yG, vG, vH));

      // Get g^{r}, and g^{xc}
      uint[3] memory temp1 = Secp256k1_noconflict._mul(r, G);
      uint[3] memory temp2 = Secp256k1_noconflict._mul(c, xG);

      // Add both points together
      temp1 = Secp256k1_noconflict._add(temp1,temp2);
      ECCMath_noconflict.toZ1(temp1, pp);
      
      if (temp1[0] != vG[0] || temp1[1] != vG[1]) {
          _successful = false;
          _error = "vG != rG*xcG";
          return;
      }
      
      // Get g^{yi*r}
      temp1 = Secp256k1_noconflict._mul(r, yG);
      
      
      // Get g^{yix}/G*c
      // Negate the 'y' co-ordinate of G
      temp2[0] = G[0];
      temp2[1] = pp - G[1];
      temp2[2] = 1;
      
      temp2 = Secp256k1_noconflict._addMixed(temp2,voteNull);
      ECCMath_noconflict.toZ1(temp2, pp);
      //uint[2] memory temp_affine;
      temp_affine[0] = temp2[0];
      temp_affine[1] = temp2[1];
      
      temp2 = Secp256k1_noconflict._mul(c, temp_affine);

      // Add both points together
      uint[3] memory ryiGyixcG = Secp256k1_noconflict._add(temp1,temp2);
      ECCMath_noconflict.toZ1(ryiGyixcG, pp);

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
  
  function createNullVote(uint[2] yG, uint x) constant returns (uint[2] res) {
      uint[3] memory temp1 = Secp256k1_noconflict._mul(x,yG);
      Secp256k1_noconflict._addMixedM(temp1,G);
      ECCMath_noconflict.toZ1(temp1, pp);

      // Store y_x and y_y
      res[0] = temp1[0];
      res[1] = temp1[1];
  }
  
  function checkVote(uint x, uint[2] yG, uint[2] voteCrypted, uint totalVoter, uint totalCandidat) constant returns(bool _successful, string _message, uint _result) {
      //On calcule g^yixi
	  uint[3] memory temp1 = Secp256k1_noconflict._mul(x,yG);
	  ECCMath_noconflict.toZ1(temp1, pp);
	  
	  	//On trouve m tel que 2^m>n
	  	uint m=1;
	  	while (2**m<=totalVoter) {
	  		m+=1;
	  	}
	  	
	  	uint[3] memory result;
	  	//On additione g^(2^i*m)
		for(uint i=0;i<totalCandidat;i++) {
			uint vi = 2**(m*i);
			result = Secp256k1_noconflict._mul(vi,G);
			result = Secp256k1_noconflict._add(result, temp1);
			ECCMath_noconflict.toZ1(result, pp);
			if(result[0] == voteCrypted[0] && result[1] == voteCrypted[1]) {
				_successful = true;
				_result = i;
				return;
			}
		}
	  	
		_successful = false;
		_message = "Error : impossible to find your vote";
		return;
  }
  
  function createVote(uint[2] yG, uint x, uint choice, uint totalVoters) constant returns (uint[2] vote, uint _m, uint _vi, uint[3] _viG, uint[3] _xyG) {
  	//On trouve m tel que 2^m>n
  	uint m=1;
  	while (2**m<=totalVoters) {
  		m+=1;
  	}
  	
  	_m = m;
  	
	uint vi = 2**(m*choice);
	_vi = vi;
	
	uint[3] memory viG = Secp256k1_noconflict._mul(vi,G);
	ECCMath_noconflict.toZ1(viG, pp);
	
	_viG = viG;
	
	uint[3] memory xyGviG = Secp256k1_noconflict._mul(x,yG);
	ECCMath_noconflict.toZ1(xyGviG, pp);
	
	_xyG = xyGviG;
	
	xyGviG = Secp256k1_noconflict._add(xyGviG, viG);
	ECCMath_noconflict.toZ1(xyGviG, pp);
	
	vote[0] = xyGviG[0];
	vote[1] = xyGviG[1];
  }
  
  function buildVotingPrivateKey(uint aPrivateKey, uint[2] bPublicKey) constant returns (uint _privateKey, uint[2] _publicKey) {
	  uint[3] memory temp = Secp256k1_noconflict._mul(aPrivateKey,bPublicKey);
	  ECCMath_noconflict.toZ1(temp, pp);
	  
      bytes32 b_c = sha256(temp);
      uint newPrivateKey = uint(b_c);
      
	  uint[3] memory temp2 = Secp256k1_noconflict._mul(newPrivateKey,G);
	  ECCMath_noconflict.toZ1(temp2, pp);
    	
	  _privateKey = newPrivateKey;
	  _publicKey[0] = temp2[0];
	  _publicKey[1] = temp2[1];
  }

  /*
   * uint[5] res1D : 
   * 0 => x
   * 1 => w
   * 2 => vote
   * 3 => totalAnswers
   * 4 => totalVoters
   * 
   * uint[2][2] res2D : 
   * 0 => xG
   * 1 => yG
   * 
   * uint[2][] diAndRiList;
   * 0 => diList
   * 1 => riList
   */
  function generateZKP(uint[5] res1D, uint[2][2] res2D, uint[2][] diAndriList) returns(uint[3] _y, uint[2][10] _aList,  uint[2][10] _bList, uint[2][10] _dAndrList) {
		
	if(diAndriList.length!=res1D[3]-1) {
		//_successful = false;
		//_message = "The length of diList or riList isn't equal of totalAnswers-1";
		//return;
	}
	
	uint[8] memory tempUint;
	// 0 => m
	// 1 => di
	// 2 => ri
	// 3 => sumDi
	// 4 => voteEqualI
	// 7 => c
		
  	//Calcul de m
	tempUint[0]=1;
  	while (2**tempUint[0]<=res1D[4]) {
  		tempUint[0]+=1;
  	}
  	
  	
  	uint[3] memory temp1;
  	uint[3] memory temp2;
  	uint[2] memory temp_affine;
		
	//Calcul du vote
	//y = yG+Gi
  	temp1 = Secp256k1_noconflict._mul(2**(tempUint[0]*res1D[2]),G);
  	temp2 = Secp256k1_noconflict._mul(res1D[0],res2D[1]);
  	_y = Secp256k1_noconflict._add(temp1, temp2);
  	ECCMath_noconflict.toZ1(_y, pp);

  	
  	tempUint[4]=0;
	//Calcul des ai
  	//On boucle de 0 à totalAnswers-1
	for(uint i=0;i<res1D[3];i++) {
		
		//Si i!=vote
		if(i!=res1D[2]) {
			
			//tempUint[2] = diAndriList[1][i-1-tempUint[4]];
			//tempUint[1] = diAndriList[0][i-1-tempUint[4]];
			tempUint[2] = diAndriList[i-tempUint[4]][1];
			tempUint[1] = diAndriList[i-tempUint[4]][0];

			//ai = riG + dixG
			temp1 = Secp256k1_noconflict._mul(tempUint[2],G);
			temp2 = Secp256k1_noconflict._mul(tempUint[1],res2D[0]);
			temp1 = Secp256k1_noconflict._add(temp1, temp2);
			ECCMath_noconflict.toZ1(temp1, pp);
			_aList[i] = [temp1[0], temp1[1]];
			
			
			//b1 = r1yG*(y/Gi)^d1
			temp1 = Secp256k1_noconflict._mul(tempUint[2], res2D[1]);
			//Negation of Gi
			temp2 = Secp256k1_noconflict._mul(2**(tempUint[0]*i),G);
			ECCMath_noconflict.toZ1(temp2, pp);
			temp2[0] = temp2[0];
			temp2[1] = pp-temp2[1];
			temp2[2] = 1;
			//temp2 = y/Gi
			temp2 = Secp256k1_noconflict._add(_y,temp2);
			ECCMath_noconflict.toZ1(temp2, pp);
			temp_affine[0] = temp2[0];
			temp_affine[1] = temp2[1];
			//temp2=(y/gi)^di
			temp2 = Secp256k1_noconflict._mul(tempUint[1],temp_affine);
			//temp2 = riyG + (y/Gi)^di
			temp2 = Secp256k1_noconflict._add(temp1, temp2);
			ECCMath_noconflict.toZ1(temp2, pp);
			_bList[i] = [temp2[0], temp2[1]];
			
			
	    	
		} else {
			
			tempUint[4]=1;
				
			//ai = wG
			temp1 = Secp256k1_noconflict._mul(res1D[1],G);
			ECCMath_noconflict.toZ1(temp1, pp);
			_aList[i] = [temp1[0], temp1[1]];

			//bi = wyG
			temp2 = Secp256k1_noconflict._mul(res1D[1],res2D[1]);
			ECCMath_noconflict.toZ1(temp2, pp);
			_bList[i] = [temp2[0], temp2[1]];

		}
	}

	// c = H(y,a1,b1,a2,b2)	
	tempUint[7] = uint(sha256(msg.sender, res2D, _aList, _bList));
	//tempUint[7] = uint(sha256(msg.sender, res2D[0], res2D[1], _aList[0], _bList[0], _aList[1], _bList[1], _aList[2], _bList[2], _aList[3], _bList[3], _aList[4], _bList[4], _aList[5], _bList[5], _aList[6], _bList[6], _aList[7], _bList[7], _aList[8], _bList[8], _aList[9], _bList[9]));

	tempUint[3] = 0;
	for(i=0;i<diAndriList.length;i++) {
		tempUint[3]= addmod(tempUint[3], diAndriList[i][0], nn);
	}
	
	
	tempUint[4]=0;
	for(i=0;i<res1D[3];i++) {
		if(i==res1D[2]) {
			tempUint[4]=1;
			//dVote = c - summDi
			tempUint[5] = submod(tempUint[7], tempUint[3]);
			//rVote = w-x*dVote
			tempUint[6] = submod(res1D[1], mulmod(res1D[0],tempUint[5],nn));
			_dAndrList[i] = [tempUint[5],tempUint[6]];
		} else {
			tempUint[5] = diAndriList[i-tempUint[4]][0];
			tempUint[6] = diAndriList[i-tempUint[4]][1];
			_dAndrList[i] = [tempUint[5], tempUint[6]];
		}
	}
	
	return;
  }
  
  
  /*
   * uint[2] res1D : 
   * 0 => totalAnswers
   * 1 => totalVoters
   * 
   * uint[2][2] res2D : 
   * 0 => xG
   * 1 => yG
   * 
   * uint[2][] diAndRiList;
   * 0 => diList
   * 1 => riList
   */
	function verifyZKPVote(uint[2] res1D, uint[3] y, uint[2][2] res2D, uint[2][] diAndriList, uint[2][10] aList,  uint[2][10] bList) returns (bool _successful, string _message) {
		
	  	//Calcul de m
		uint m=1;
	  	while (2**m<=res1D[1]) {
	  		m+=1;
	  	}
	  	
	  	uint[3] memory temp1;
	  	uint[3] memory temp2;
	  	uint[2] memory temp_affine;
	  	
		uint sumDi = 0;
    	for(uint i=0;i<res1D[0];i++) {
    		//Calcul de 1/Gi
    		uint[3] memory negateGi = Secp256k1_noconflict._mul(2**(m*i),G);
    		ECCMath_noconflict.toZ1(negateGi, pp);
    		negateGi[0] = negateGi[0];
    		negateGi[1] = pp-negateGi[1];
    		negateGi[2] = 1;
    		
    		sumDi=addmod(sumDi, diAndriList[i][0],nn);
        	
            //ai = riGdixG
    		//Calcul riG
			temp1 = Secp256k1_noconflict._mul(diAndriList[i][1],G);
			//Calcul dixG
			temp2 = Secp256k1_noconflict._mul(diAndriList[i][0],res2D[0]);
			temp1 = Secp256k1_noconflict._add(temp1, temp2);
			ECCMath_noconflict.toZ1(temp1, pp);
            
            if(temp1[0]!=aList[i][0] || temp1[1]!=aList[i][1]) {
            	_successful = false;
            	_message = "The verification of the zkp failed : ai failed";
            	//_debug[0] = [temp1[0], temp1[1]];
            	//_debug[1] = [aList[i][0], aList[i][1]];
            	return;
            }
            
			//bi = riyG*(y/Gi)^di
            //temp1=riyG
			temp1 = Secp256k1_noconflict._mul(diAndriList[i][1], res2D[1]);
			//temp2 = y/Gi
			temp2 = Secp256k1_noconflict._add(y,negateGi);
			ECCMath_noconflict.toZ1(temp2, pp);
			temp_affine[0] = temp2[0];
			temp_affine[1] = temp2[1];
			//temp2=(y/gi)^di
			temp2 = Secp256k1_noconflict._mul(diAndriList[i][0],temp_affine);
			//temp2 = riyG + (y/Gi)^di
			temp2 = Secp256k1_noconflict._add(temp1, temp2);
			ECCMath_noconflict.toZ1(temp2, pp);
            
            if(temp2[0]!=bList[i][0] || temp2[1]!=bList[i][1]) {
            	_successful = false;
            	//_debug[0] = [temp2[0], temp2[1]];
            	//_debug[1] = [bList[i][0], bList[i][1]];
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
