package voting;


import java.math.BigInteger;
import java.security.InvalidAlgorithmParameterException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SecureRandom;
import java.security.Security;

import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.interfaces.ECPrivateKey;
import org.bouncycastle.jce.interfaces.ECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.math.ec.ECCurve;
import org.bouncycastle.math.ec.ECPoint;

public class VotingPrivateKeyBuilder {
	
	
	public static void addIn(SHA256Digest sha256, ECPoint point)
    {
        byte[] enc = point.getEncoded(true);

        sha256.update(enc, 0, enc.length);
    }
    

	public static void main(String[] args) {
		
		try {
		
			String aPrivateKeyStr = args[0];
			String bPublicKeyXStr = args[1];
			String bPublicKeyYStr = args[2];
		

			//For test only
			//String aPrivateKeyStr = "68041860016851269899940899293966664216321553529192585628448619442313946135457";
			//String bPublicKeyXStr = "64941288953773185164366685548426933340691544625640596893925277724937993356025";
			//String bPublicKeyYStr = "17525979736768316029250635155396339620668810180096429179158839516047201462732";
			
			
			Security.addProvider(new BouncyCastleProvider());
	    	ECParameterSpec ecSpec = ECNamedCurveTable.getParameterSpec("secp256k1");
	    	KeyPairGenerator g = KeyPairGenerator.getInstance("ECDSA", "BC");
	    	g.initialize(ecSpec, new SecureRandom());
	    		
	    	//KeyPair keypair = g.generateKeyPair();
	    	
	    	//ECPrivateKey privatekey = (ECPrivateKey) keypair.getPrivate();
	    	//ECPublicKey publicKey = (ECPublicKey) keypair.getPublic();
	    	
	    	//BigInteger aPrivateKey = privatekey.getD();
	    	//ECPoint bPublicKey = publicKey.getQ();

	    	ECCurve curve = ecSpec.getCurve();
	    	ECPoint bPublicKey = curve.createPoint(new BigInteger(bPublicKeyXStr), new BigInteger(bPublicKeyYStr));
	    	BigInteger aPrivateKey = new BigInteger(aPrivateKeyStr);
	    	
	    	ECPoint privateVotingKeyPoint = bPublicKey.multiply(aPrivateKey).normalize();
	    	SHA256Digest sha256 = new SHA256Digest();
	    	addIn(sha256, privateVotingKeyPoint);
	    	byte[] res = new byte[sha256.getDigestSize()];
	        sha256.doFinal(res, 0);
	        
	        BigInteger newPrivateKey = new BigInteger(1, res);
	        ECPoint newPublicKey = ecSpec.getG().multiply(newPrivateKey).normalize();

	        System.out.println("{\"privateKey\":\"" + newPrivateKey + "\",\"publicKeyx\":\"" + newPublicKey.getRawXCoord().toBigInteger() + "\",\"publicKeyy\":\"" + newPublicKey.getRawYCoord().toBigInteger() + "\"}");
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace(System.out);
		} catch (NoSuchProviderException e) {
			e.printStackTrace(System.out);
		} catch (InvalidAlgorithmParameterException e) {
			e.printStackTrace(System.out);
		} catch (Exception e) {
			e.printStackTrace(System.out);
		}
		
	}

}
