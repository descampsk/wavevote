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
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;

import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.interfaces.ECPrivateKey;
import org.bouncycastle.jce.interfaces.ECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.math.ec.ECPoint;

public class VotingProccess {
	   
   static class ECPointComparator implements Comparator<ECPoint> {
	    public int compare(ECPoint a, ECPoint b) {
	    	if (a.isInfinity() && b.isInfinity()) {
	    		return 0;
	    	} else {
	    		if (a.isInfinity()) {
	    			return new BigInteger("0").compareTo(b.getAffineXCoord().toBigInteger());
	    		} else if (b.isInfinity()) {
	    			return a.getAffineXCoord().toBigInteger().compareTo(new BigInteger("0"));
	    		} else {
	    			return a.getAffineXCoord().toBigInteger().compareTo(b.getAffineXCoord().toBigInteger());
	    		}
	    	}
	        	
	    }
   }
   
   public static Long logBabyStepGiantStepEC(ECPoint base, ECPoint result, long N) {
	   long timeDebut = System.currentTimeMillis();
	   
	  //1 : Pick an integer m > sqrt(N)
	  int m= (int)(Math.sqrt(N))+1;
	  System.out.println(m);
	  //2 : compute mBase
	  ECPoint mBase = base.multiply(new BigInteger(String.valueOf(m))).normalize();
	  
      List<ECPoint> iBaseList=new ArrayList<ECPoint>();
      List<ECPoint> Q_imBaseList=new ArrayList<ECPoint>();
      HashMap<ECPoint, Long> hQ_imBase= new HashMap<ECPoint, Long>();
      HashMap<ECPoint, Long> hiBase =new HashMap<ECPoint, Long>();
     
      
      for(long i=0;i<m;i++) {
    	  ECPoint iBase = base.multiply(new BigInteger(String.valueOf(i))).normalize();
    	  ECPoint Q_imBase = result.subtract(mBase.multiply(new BigInteger(String.valueOf(i)))).normalize();
    	  iBaseList.add(iBase);
    	  Q_imBaseList.add(Q_imBase);
    	  hiBase.put(iBase, i);
    	  hQ_imBase.put(Q_imBase, i);
    	  
      }
      
      
      for(Entry<ECPoint, Long> entry : hiBase.entrySet()) {
    	  ECPoint pointA = entry.getKey();
    	  if (hQ_imBase.containsKey(pointA)) {
    		  long i = entry.getValue();
    		  long j = hQ_imBase.get(pointA);
			  long timeFin = System.currentTimeMillis();
			  System.out.println("logBabyStepGiantStepEC a pris : " + String.valueOf(timeFin-timeDebut) + " ms");
			  System.out.println("result = " + result + "et g^p = " + (base.multiply(new BigInteger(String.valueOf(i+j*m))).normalize()));
			  System.out.println("i=" + i + ";j=" + j);
    		  return (i+j*m);
    	  }
      }
      
      
      iBaseList.sort(new ECPointComparator());
      Q_imBaseList.sort(new ECPointComparator());
      System.out.println("iBase_list = " + iBaseList.subList(0, 10));
      System.out.println("Q_imbaseList = " + Q_imBaseList.subList(0, 10));
      
      ECPointComparator ecPointComparator = new ECPointComparator();
      for(int i=0;i<iBaseList.size();i++) {
    	  ECPoint pointA = iBaseList.get(i);
    	  int j=0;
    	  
    	  int index = Collections.binarySearch(Q_imBaseList, pointA, ecPointComparator);
    	  if (index>=0) {
    		  ECPoint pointB = Q_imBaseList.get(index);
			  System.out.println(pointA + "," + pointB);
			  long timeFin = System.currentTimeMillis();
			  System.out.println("logBabyStepGiantStepEC a pris : " + String.valueOf(timeFin-timeDebut) + " ms");
			  System.out.println("i=" + i + ";j=" + index);
			  System.out.println();
			  System.out.println("result = " + result + "et g^p = " + (base.multiply(new BigInteger(String.valueOf(i+j*m)))).normalize());
			  return (long)(i+j*m); 
    	  }
    	  
    	  /*
    	  do {
    		  pointB = Q_imBaseList.get(j);
    		  if (pointA.equals(pointB)) {
    			  System.out.println(pointA + "," + pointB);
    			  long timeFin = System.currentTimeMillis();
    			  System.out.println("logBabyStepGiantStepEC a pris : " + String.valueOf(timeFin-timeDebut) + " ms");
    			  System.out.println("i=" + i + ";j=" + j);
    			  return (i+j*m); 
    		  }
    		  j++;
    	  } while(j<Q_imBaseList.size() && ecPointComparator.compare(pointA, pointB)==-1);
    	  
    	  for(int j=0;j<Q_imBaseList.size();j++) {
    		  ECPoint pointB = Q_imBaseList.get(j);
    		  if (pointA.equals(pointB)) {
    			  System.out.println(pointA + "," + pointB);
    			  long timeFin = System.currentTimeMillis();
    			  System.out.println("logBabyStepGiantStepEC a pris : " + String.valueOf(timeFin-timeDebut) + " ms");
    			  System.out.println("i=" + i + ";j=" + j);
    			  return (i+j*m);
    		  }
    	  }*/
      }
      
      
	  return null;
   }
   

	public static void main(String[] args) throws NoSuchAlgorithmException, NoSuchProviderException, InvalidAlgorithmParameterException {	
    	Security.addProvider(new BouncyCastleProvider());
    	ECParameterSpec ecSpec = ECNamedCurveTable.getParameterSpec("secp256k1");
    	KeyPairGenerator g = KeyPairGenerator.getInstance("ECDSA", "BC");
    	g.initialize(ecSpec, new SecureRandom());
    	
    	int nombre_votants = 20;
    	
    	//Initialisation des clés des votants
    	List<KeyPair> key_list = new ArrayList<KeyPair>();
    	for(int i=0;i<nombre_votants;i++) {
    		key_list.add(g.generateKeyPair());
    	}
    	
    	KeyPair keypair1 = g.generateKeyPair();
    	KeyPair keypair2 = g.generateKeyPair();
    	
    	ECPrivateKey privatekey1 = (ECPrivateKey) keypair1.getPrivate();
    	ECPrivateKey privatekey2 = (ECPrivateKey) keypair2.getPrivate();
    	
    	BigInteger sommePrivateKey = (privatekey1.getD().add(privatekey2.getD()));
    	
    	//Fin du round 1 : on calcule g^yi pour chaque xi
    	List<ECPoint> gyi_list = new ArrayList<ECPoint>();
    	for(int i=0;i<key_list.size();i++) {
    		
    		if (i==0) {
            	ECPoint pointTotal = ((ECPublicKey) key_list.get(1).getPublic()).getQ();
            	pointTotal = pointTotal.negate();
            	for(int j=i+2;j<key_list.size();j++) {
            		ECPoint point = ((ECPublicKey) key_list.get(j).getPublic()).getQ();
            		pointTotal = pointTotal.subtract(point);
            	}
            	gyi_list.add(pointTotal);
    		} else if (i==key_list.size()-1) {
            	ECPoint pointTotal = ((ECPublicKey) key_list.get(0).getPublic()).getQ();
               	for(int j=1;j<key_list.size()-1;j++) {
            		ECPoint point = ((ECPublicKey) key_list.get(j).getPublic()).getQ();
            		pointTotal = pointTotal.add(point);
            	}
            	gyi_list.add(pointTotal);
    		} else {
            	ECPoint pointTotal = ((ECPublicKey) key_list.get(0).getPublic()).getQ();
            	for(int j=1;j<i;j++) {
            		ECPoint point = ((ECPublicKey) key_list.get(j).getPublic()).getQ();
            		pointTotal = pointTotal.add(point);
            	}
            	for(int j=i+1;j<key_list.size();j++) {
            		ECPoint point = ((ECPublicKey) key_list.get(j).getPublic()).getQ();
            		pointTotal = pointTotal.subtract(point);
            	}
            	gyi_list.add(pointTotal);
    		}	

    	}
    	
    	//On test si produit des gxiyi = g^0
    	ECPoint pointTotal = gyi_list.get(0);
    	BigInteger private_key_init = ((ECPrivateKey) key_list.get(0).getPrivate()).getD();
    	pointTotal = pointTotal.multiply(private_key_init);
    	for(int i=1;i<key_list.size();i++) {
    		ECPoint point = gyi_list.get(i);
    		BigInteger private_key = ((ECPrivateKey) key_list.get(i).getPrivate()).getD();
    		point = point.multiply(private_key);
    		pointTotal = pointTotal.add(point);
    	}
    	   	
    	System.out.println("gyiList = " + gyi_list);
    	System.out.println(pointTotal); 	
    	
    	ECPoint baseG = ecSpec.getG();
    	System.out.println("BaseG =  " + baseG);
    	
    	Random random = new Random(); 	
    	//On prépare le vote pour chaque candidat
    	int nombreCandidat = 5;
    	Map<Integer, Integer> nombreVotantParCandidat = new HashMap<Integer, Integer>();
    	List<Integer> voteCandidatList = new ArrayList<Integer>();
    	for(int i=0;i<nombre_votants;i++) {
    		int randomVote = random.nextInt(nombreCandidat);
    		//randomVote = 0;
    		voteCandidatList.add(randomVote);
    		if (nombreVotantParCandidat.containsKey(randomVote)) {
    			nombreVotantParCandidat.put(randomVote, nombreVotantParCandidat.get(randomVote)+1);
    		} else {
    			nombreVotantParCandidat.put(randomVote, 1);
    		}
    	}
    	
    	System.out.println("Vote list = " + voteCandidatList);
    	System.out.println("Nombre Vote par candidat = " + nombreVotantParCandidat);
    	
    	//On trouve m tel que 2^m>n
    	int m=1;
    	while (Math.pow(2, m)<=nombre_votants) {
    		m++;
    	}
    	
    	System.out.println("m = " + m);
		
    	//On calcule gvi
    	List<ECPoint> gviList = new ArrayList<ECPoint>();
    	for (int i=0;i<voteCandidatList.size();i++) {
    		int vote = voteCandidatList.get(i);
    		double vi = Math.pow(2, m*vote);
    		ECPoint point = baseG.multiply(new BigInteger(String.valueOf((long) vi)));
    		gviList.add(point);
    	}
    	
    	System.out.println("gviList = " + gviList);
    	
    	//On calcule chaque gxiyigvi
    	List<ECPoint> gxiyigviList = new ArrayList<ECPoint>();
    	for(int i=0;i<nombre_votants;i++) {
    		ECPoint gxiyigvi = gyi_list.get(i);
    		BigInteger xi = ((ECPrivateKey) key_list.get(i).getPrivate()).getD();
    		gxiyigvi = gxiyigvi.multiply(xi);
    		ECPoint gvi = gviList.get(i);
    		gxiyigvi = gxiyigvi.add(gvi);
    		gxiyigviList.add(gxiyigvi);
    	}
    	System.out.println("--------------------------------Votes cryptés envoyés !-----------------------------");
    	
    	//On calcule le produit des gxiyigvi
    	ECPoint Pgxiyigvi = gxiyigviList.get(0);
    	for (int i=1;i<gxiyigviList.size();i++) {
    		Pgxiyigvi = Pgxiyigvi.add(gxiyigviList.get(i));
    	}
    	Pgxiyigvi = Pgxiyigvi.normalize();
    	System.out.println("--------------------------------Calcul du résulat crypté du dépouillement terminé !-----------------------------");
    	
    	//Faire l'algo Baby-step giant-step
    	System.out.println("2^km= " + (long)Math.pow(2, nombreCandidat*m));
    	long sommeVi = logBabyStepGiantStepEC(baseG, Pgxiyigvi, (long)Math.pow(2, nombreCandidat*m));
    	System.out.println("sommeViBaby = " + sommeVi);
    	
    	
    	/*
    	long timeDebut = System.currentTimeMillis();
    	//On cherche le résultat
    	int sommeVi = 1;
        ECPoint gTotal = baseG;
        while (!gTotal.equals(Pgxiyigvi)) {
        	sommeVi++;
        	gTotal = gTotal.add(baseG).normalize();
    	}
        long timeFin = System.currentTimeMillis();
        System.out.println("Recherche exhaustive a pris : " + String.valueOf(timeFin-timeDebut) + " ms");
    	System.out.println("Produit = " + Pgxiyigvi);
    	System.out.println("SommeVi = " + sommeVi);
    	System.out.println("g^8 = " + baseG.multiply(new BigInteger(String.valueOf(sommeVi))).normalize());
    	*/
    	
    	double x = 0;
    	ArrayList<Double> depouillementVoteCandidatList = new ArrayList<Double>();
    	System.out.println("--------------------Dépouillement en cours--------------------");
    	for(int i=nombreCandidat-1;i>=0;i--) {
    		System.out.println("--------------------Dépouillement à " + (nombreCandidat-i-1)*100/nombreCandidat + "--------------------");
    		double c = 1;
    		while(Math.pow(2, m*i)*c<=sommeVi-x) {
    			c++;
    		}
    		c--;
    		depouillementVoteCandidatList.add(c);
    		x+=c*Math.pow(2, m*i);
    		
    	}
    	System.out.println("--------------------Dépouillement terminé !--------------------");
    	Collections.reverse(depouillementVoteCandidatList);
    	System.out.println("Depouillement = " + depouillementVoteCandidatList);
	}

}
