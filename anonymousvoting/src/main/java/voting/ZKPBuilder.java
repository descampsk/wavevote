package voting;

import java.math.BigInteger;
import java.security.InvalidAlgorithmParameterException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SecureRandom;
import java.security.Security;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.swing.event.ListSelectionEvent;

import org.bouncycastle.asn1.ess.ESSCertID;
import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.interfaces.ECPrivateKey;
import org.bouncycastle.jce.interfaces.ECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.math.ec.ECPoint;

public class ZKPBuilder {
	
	ECParameterSpec ecSpec = ECNamedCurveTable.getParameterSpec("secp256k1");
	
	public static void addIn(SHA256Digest sha256, ECPoint point)
    {
        byte[] enc = point.getEncoded(true);

        sha256.update(enc, 0, enc.length);
    }
	
	
	public HashMap<String, Object> generateZKPOne(ECPoint xG, BigInteger x, ECPoint yG, BigInteger w, BigInteger r1, BigInteger d1, KeyPairGenerator g) {
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("xG", xG);
		map.put("yG", yG);
		map.put("d1", d1);
		map.put("r1", r1);
		
		//y = yG+G
		ECPoint y = (yG.multiply(x).add(ecSpec.getG())).normalize();
		map.put("y", y);
		
		//a1 = r1G + d1xG
		ECPoint r1G = ecSpec.getG().multiply(r1);
		ECPoint d1xG = xG.multiply(d1);
		ECPoint a1 = r1G.add(d1xG).normalize();
		map.put("a1", a1);
		
		//b1 = r1yG*(y*G)^d1
		ECPoint r1yG = yG.multiply(r1);
		ECPoint d1yG = (y.add(ecSpec.getG())).multiply(d1);
		ECPoint b1 = r1yG.add(d1yG).normalize();
		map.put("b1", b1);
		
		//a2 = wG
		ECPoint a2 = ecSpec.getG().multiply(w).normalize();
		map.put("a2", a2);
		
		//b2 = wyG
		ECPoint b2 = yG.multiply(w).normalize();
		map.put("b2", b2);
		
		// c = H(y,a1,b1,a2,b2)
    	SHA256Digest sha256 = new SHA256Digest();
    	addIn(sha256, y);
    	addIn(sha256, a1);
    	addIn(sha256, b1);
    	addIn(sha256, a2);
    	addIn(sha256, b2);
    	byte[] res = new byte[sha256.getDigestSize()];
        sha256.doFinal(res, 0);
        BigInteger c = new BigInteger(1, res);
        
        BigInteger d2 = c.subtract(d1);
        map.put("d2", d2);
        
        BigInteger r2 = w.subtract(x.multiply(d2));
        map.put("r2", r2);
        
        return map;
	}
	
	
	public HashMap<String, Object> generateZKP(ECPoint xG, BigInteger x, ECPoint yG, BigInteger ri, BigInteger w, BigInteger di, int vote, int nombreCandidat, KeyPairGenerator g) {
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		List<ECPoint> aList = new ArrayList<ECPoint>();
		List<ECPoint> bList = new ArrayList<ECPoint>();
		List<ECPoint> GList = new ArrayList<ECPoint>();
		List<BigInteger> dList = new ArrayList<BigInteger>();
		List<BigInteger> rList = new ArrayList<BigInteger>();
	
		GList.add(ecSpec.getG());
		GList.add(ecSpec.getG().negate());
		map.put("GList", GList);
		
		map.put("xG", xG);
		map.put("yG", yG);
		
		// c = H(y,a1,b1,a2,b2)
    	SHA256Digest sha256 = new SHA256Digest();
		
		//Calcul du vote
		//y = yG+Gi
		ECPoint Gi;
		if(vote==0) {
			Gi = ecSpec.getG();
		} else {
			Gi = ecSpec.getG().negate();
		}
		ECPoint y = (yG.multiply(x).add(Gi)).normalize();
		map.put("y", y);
		addIn(sha256, y);
		
		//Calcul des ai
		for(int i=0;i<nombreCandidat;i++) {
			if(i==vote) {
				//a vote = r1G + d1xG
				ECPoint r1G = ecSpec.getG().multiply(ri);
				ECPoint d1xG = xG.multiply(di);
				ECPoint a1 = r1G.add(d1xG).normalize();
				aList.add(a1);
				
				//b1 = r1yG*(y*G)^d1
				ECPoint r1yG = yG.multiply(ri);
				ECPoint d1yG = (y.add(Gi)).multiply(di);
				ECPoint b1 = r1yG.add(d1yG).normalize();
				bList.add(b1);
				
		    	addIn(sha256, a1);
		    	addIn(sha256, b1);
		    	

		    	
			} else {
				//a2 = wG
				ECPoint a2 = ecSpec.getG().multiply(w).normalize();
				aList.add(a2);
				
				//b2 = wyG
				ECPoint b2 = yG.multiply(w).normalize();
				bList.add(b2);
				
		    	addIn(sha256, a2);
		    	addIn(sha256, b2);
			}
		}

    	byte[] res = new byte[sha256.getDigestSize()];
        sha256.doFinal(res, 0);
        BigInteger c = new BigInteger(1, res);
        
        
        if(vote==0) {
        	dList.add(di);
        	rList.add(ri);
            dList.add(c.subtract(di));
            BigInteger r2 = w.subtract(x.multiply(c.subtract(di)));
            rList.add(r2);
        } else {
            dList.add(c.subtract(di));
            BigInteger r2 = w.subtract(x.multiply(c.subtract(di)));
            rList.add(r2);
        	dList.add(di);
        	rList.add(ri);
        }
        
        map.put("aList", aList);
        map.put("bList", bList);
        map.put("rList", rList);
        map.put("dList", dList);
        return map;
	}
	
	
	
	public boolean verifyZKP(HashMap <String,Object> map) {
		
		ECPoint xG = (ECPoint) map.get("xG");
		ECPoint yG = (ECPoint) map.get("yG");
		ECPoint y = (ECPoint) map.get("y");
		ECPoint a1 = (ECPoint) map.get("a1");
		ECPoint b1 = (ECPoint) map.get("b1");
		ECPoint a2 = (ECPoint) map.get("a2");
		ECPoint b2 = (ECPoint) map.get("b2");
		BigInteger d1 = (BigInteger) map.get("d1");
		BigInteger d2 = (BigInteger) map.get("d2");
		BigInteger r1 = (BigInteger) map.get("r1");
		BigInteger r2 = (BigInteger) map.get("r2");
		
		// c = H(y,a1,b1,a2,b2)
    	SHA256Digest sha256 = new SHA256Digest();
    	addIn(sha256, y);
    	addIn(sha256, a1);
    	addIn(sha256, b1);
    	addIn(sha256, a2);
    	addIn(sha256, b2);
    	byte[] res = new byte[sha256.getDigestSize()];
        sha256.doFinal(res, 0);
        BigInteger c = new BigInteger(1, res);
        
        if(!c.equals(d1.add(d2))) {
        	System.out.println("c !=");
        	return false;
        }
        
        //a1 = r1Gd1xG
        ECPoint temp = ecSpec.getG().multiply(r1);
        temp = temp.add(xG.multiply(d1));
        temp = temp.normalize();
        
        if(!temp.equals(a1)) {
        	System.out.println("a1 !=");
        	return false;
        }
        
        //b1 = r1yG * (y*G)^d1
        temp = yG.multiply(r1);
        ECPoint temp2 = (y.add(ecSpec.getG())).multiply(d1);
        temp = temp.add(temp2);
        temp = temp.normalize();
        
        if(!temp.equals(b1)) {
        	System.out.println("b1 !=");
        	return false;
        }
		
        //a2 = r2G*d2xG
        temp = ecSpec.getG().multiply(r2);
        temp = temp.add(xG.multiply(d2));
        temp = temp.normalize();
        
        if(!temp.equals(a2)) {
        	System.out.println("a2 !=");
        	return false;
        }
        
        //b2 = r2yG * (y*G)^d2
        temp = yG.multiply(r2);
        temp2 = (y.subtract(ecSpec.getG())).multiply(d2);
        temp = temp.add(temp2);
        temp = temp.normalize();
        
        if(!temp.equals(b2)) {
        	System.out.println("b2 !=");
        	return false;
        }
		
		return true;
	}
	
	public boolean verifyZKPBis(HashMap <String,Object> map, int nombreCandidat) {
		
		ECPoint xG = (ECPoint) map.get("xG");
		ECPoint yG = (ECPoint) map.get("yG");
		ECPoint y = (ECPoint) map.get("y");
		
		
		
		List<ECPoint> aList = (List<ECPoint>) map.get("aList");
		List<ECPoint> bList = (List<ECPoint>) map.get("bList");
		List<ECPoint> GList = (List<ECPoint>) map.get("GList");
		List<BigInteger> rList = (List<BigInteger>) map.get("rList");
		List<BigInteger> dList = (List<BigInteger>) map.get("dList");

		
		// c = H(y,a1,b1,a2,b2)
    	SHA256Digest sha256 = new SHA256Digest();
    	addIn(sha256, y);
    	
    	BigInteger sommeD = new BigInteger("0");
    	for(int i=0;i<nombreCandidat;i++) {
    		//Check ai
    		BigInteger ri = rList.get(i);
    		BigInteger di = dList.get(i);
    		ECPoint ai = aList.get(i);
    		ECPoint bi = bList.get(i);
    		ECPoint Gi = GList.get(i);
    		
    		System.out.println("ri : " + ri);
    		System.out.println("di : " + di);
    		System.out.println("ai : " + ai);
    		
    		sommeD = sommeD.add(di);
    		
        	addIn(sha256, ai);
        	addIn(sha256, bi);
        	
            //ai = riGdixG
            ECPoint temp = ecSpec.getG().multiply(ri);
            temp = temp.add(xG.multiply(di));
            temp = temp.normalize();
            
            if(!temp.equals(ai)) {
            	System.out.println("a" + i + ": " + ai + "!=" + temp);
            	return false;
            }
            
            //b1 = r1yG * (y*G)^d1
            temp = yG.multiply(ri);
            ECPoint temp2 = (y.add(Gi)).multiply(di);
            temp = temp.add(temp2);
            temp = temp.normalize();
            
            if(!temp.equals(bi)) {
            	System.out.println("bi !=");
            	return false;
            }
    	} 
        
    	byte[] res = new byte[sha256.getDigestSize()];
        sha256.doFinal(res, 0);
        BigInteger c = new BigInteger(1, res);
        
        if(!c.equals(sommeD)) {
        	System.out.println("c !=");
        	return false;
        }
		
		return true;
	}

	public static void main(String[] args) throws NoSuchAlgorithmException, NoSuchProviderException, InvalidAlgorithmParameterException {
    	Security.addProvider(new BouncyCastleProvider());
    	ECParameterSpec ecSpec = ECNamedCurveTable.getParameterSpec("secp256k1");
    	KeyPairGenerator g = KeyPairGenerator.getInstance("ECDSA", "BC");
    	g.initialize(ecSpec, new SecureRandom());
		
		ZKPBuilder zkpBuilder = new ZKPBuilder();
		
		KeyPair votingKeys = g.generateKeyPair();
		ECPoint xG = ((ECPublicKey) votingKeys.getPublic()).getQ();
		BigInteger x = ((ECPrivateKey) votingKeys.getPrivate()).getD();
		ECPoint yG = ((ECPublicKey) g.generateKeyPair().getPublic()).getQ();
		
		BigInteger w = ((ECPrivateKey) g.generateKeyPair().getPrivate()).getD();
		BigInteger r1 = ((ECPrivateKey) g.generateKeyPair().getPrivate()).getD();
		BigInteger d1 = ((ECPrivateKey) g.generateKeyPair().getPrivate()).getD();
		
		HashMap<String, Object> map = zkpBuilder.generateZKPOne(xG, x, yG, w, r1, d1, g);
		System.out.println(map);
		
		HashMap<String, Object> map2 = zkpBuilder.generateZKP(xG, x, yG, w, r1, d1, 1, 2, g);
		System.out.println(map2);

		
		System.out.println(zkpBuilder.verifyZKP(map));
		System.out.println(zkpBuilder.verifyZKPBis(map2, 2));

	}

}