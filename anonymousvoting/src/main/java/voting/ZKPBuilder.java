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
		
		//a1 = wG
		ECPoint a1 = ecSpec.getG().multiply(w).normalize();
		map.put("a1", a1);
		
		//b1 = wyG
		ECPoint b1 = yG.multiply(w).normalize();
		map.put("b1", b1);
		
		//a2 = r1G + d1xG
		ECPoint r1G = ecSpec.getG().multiply(r1);
		ECPoint d1xG = xG.multiply(d1);
		ECPoint a2 = r1G.add(d1xG).normalize();
		map.put("a2", a2);
		
		//b2 = r1yG*(y*G)^d1
		ECPoint r1yG = yG.multiply(r1);
		ECPoint d1yG = (y.subtract(ecSpec.getG())).multiply(d1);
		ECPoint b2 = r1yG.add(d1yG).normalize();
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
	
	
	public HashMap<String, Object> generateZKP(ECPoint xG, BigInteger x, ECPoint yG, BigInteger w, BigInteger vote, int nombreCandidat, KeyPairGenerator g) {
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		List<ECPoint> aList = new ArrayList<ECPoint>();
		List<ECPoint> bList = new ArrayList<ECPoint>();
		List<ECPoint> GList = new ArrayList<ECPoint>();
		List<BigInteger> dList = new ArrayList<BigInteger>();
		List<BigInteger> rList = new ArrayList<BigInteger>();
		
		List<BigInteger> diList = new ArrayList<BigInteger>();
		List<BigInteger> riList = new ArrayList<BigInteger>();
	
		map.put("xG", xG);
		map.put("yG", yG);
		
		// c = H(y,a1,b1,a2,b2)
    	SHA256Digest sha256 = new SHA256Digest();
    	
    	//Calcul de m
    	int m=2;
		
		//Calcul du vote
		//y = yG+Gi
    	double vi = Math.pow(2, m*vote.intValue());
		ECPoint Gi = ecSpec.getG().multiply(new BigInteger(String.valueOf((long) vi))).normalize();
		ECPoint y = (yG.multiply(x).add(Gi)).normalize();
		System.out.println("y.x : " + y.getRawXCoord().toBigInteger());
		System.out.println("y.y : " + y.getRawYCoord().toBigInteger());
		map.put("y", y);
		addIn(sha256, y);
		
		//Calcul des ai
		for(Integer i=0;i<nombreCandidat;i++) {
			vi = Math.pow(2, m*i);
			Gi = ecSpec.getG().multiply(new BigInteger(String.valueOf((long) vi))).normalize();
			GList.add(Gi);
			if(!(new BigInteger(i.toString()).equals(vote))) {
				
				BigInteger di = ((ECPrivateKey) g.generateKeyPair().getPrivate()).getD();
				BigInteger ri = ((ECPrivateKey) g.generateKeyPair().getPrivate()).getD();
				diList.add(di);
				riList.add(ri);
				
				//a vote = r1G + d1xG
				ECPoint r1G = ecSpec.getG().multiply(ri);
				ECPoint d1xG = xG.multiply(di);
				ECPoint a2 = r1G.add(d1xG).normalize();
				aList.add(a2);
				
				//b1 = r1yG*(y/Gi)^d1
				ECPoint r1yG = yG.multiply(ri);
				ECPoint d1yG = (y.subtract(Gi)).multiply(di);
				ECPoint b2 = r1yG.add(d1yG).normalize();
				bList.add(b2);
				
		    	addIn(sha256, a2);
		    	addIn(sha256, b2);
		    	

		    	
			} else {
				
				
				//a1 = wG
				ECPoint a1 = ecSpec.getG().multiply(w).normalize();
				aList.add(a1);
				
				//b1 = wyG
				ECPoint b1 = yG.multiply(w).normalize();
				bList.add(b1);
				
		    	addIn(sha256, a1);
		    	addIn(sha256, b1);
			}
		}
		
		map.put("GList", GList);
		
    	byte[] res = new byte[sha256.getDigestSize()];
        sha256.doFinal(res, 0);
        BigInteger c = new BigInteger(1, res);
        
        BigInteger sommeDi = new BigInteger("0");
        for(int i=0;i<diList.size();i++) {
        	sommeDi = sommeDi.add(diList.get(i));
        }
        BigInteger nn = new BigInteger("115792089237316195423570985008687907852837564279074904382605163141518161494337");
        sommeDi = sommeDi.mod(nn);
        
        BigInteger dVote = c.subtract(sommeDi).mod(nn);
        BigInteger rVote = w.subtract(x.multiply(dVote)).mod(nn);
   
		for(Integer i=0;i<nombreCandidat;i++) {
			if(new BigInteger(i.toString()).equals(vote)) {
	        	dList.add(dVote);
	        	rList.add(rVote);
			} else {
				dList.add(diList.get(0));
				diList.remove(0);
				rList.add(riList.get(0));
				riList.remove(0);
			}
		}
		
        System.out.println("dList : " + dList);
        System.out.println("rList : " + rList);
        System.out.println("c : " + c);

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
    		
    		System.out.println("r" + i + " : " + ri);
    		System.out.println("d" + i + " : " + di);
    		System.out.println("a.x" + i + " : " + ai.getRawXCoord().toBigInteger());
    		System.out.println("a.y" + i + " : " + ai.getRawYCoord().toBigInteger());
    		System.out.println("b.x" + i + " : " + bi.getRawXCoord().toBigInteger());
    		System.out.println("b.y" + i + " : " + bi.getRawYCoord().toBigInteger());
    		
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
            ECPoint temp2 = (y.subtract(Gi)).multiply(di);
            temp = temp.add(temp2);
            temp = temp.normalize();
            
            if(!temp.equals(bi)) {
            	System.out.println("b" + i + ": " + bi + "!=" + temp);
            	return false;
            }
    	} 
        
    	byte[] res = new byte[sha256.getDigestSize()];
        sha256.doFinal(res, 0);
        BigInteger c = new BigInteger(1, res);
        
        BigInteger nn = new BigInteger("115792089237316195423570985008687907852837564279074904382605163141518161494337");
        sommeD = sommeD.mod(nn);
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
		
		//HashMap<String, Object> map = zkpBuilder.generateZKPOne(xG, x, yG, w, r1, d1, g);
		//System.out.println(map);
		System.out.println(ecSpec.getCurve().getOrder());
		BigInteger nn = new BigInteger("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", 32);
		System.out.println(nn);
		System.out.println(nn.equals(ecSpec.getN()));
		
		int nombreCandidat = 4;
		System.out.println("xG.x : " + xG.getRawXCoord().toBigInteger());
		System.out.println("xG.y : " + xG.getRawYCoord().toBigInteger());
		System.out.println("yG.x : " + yG.getRawXCoord().toBigInteger());
		System.out.println("yG.y : " + yG.getRawYCoord().toBigInteger());
		System.out.println("x : " + x);
		System.out.println("w : " + w);
		
		HashMap<String, Object> map2 = zkpBuilder.generateZKP(xG, x, yG, w, new BigInteger("4"), nombreCandidat, g);
		System.out.println(map2);

		
		//System.out.println(zkpBuilder.verifyZKP(map));
		System.out.println(zkpBuilder.verifyZKPBis(map2, nombreCandidat));

	}

}