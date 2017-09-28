/**
 * http://usejsdoc.org/


 */

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp.office365.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
        user: "kevin.descamps@wavestone.com",
        pass: "fcmddnzzhgmhbssx"
    },
    requireTLS: true,
    tls: {
        ciphers:'SSLv3'
    }
});

var mailOptions = {
  from: 'kevin.descamps@wavestone.com',
  to: 'melanie.coissard@wavestone.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

/*
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 
*/

function generateEachInscriptionKey() {
	var lineReader = require('readline').createInterface({
		  input: require('fs').createReadStream(mailDataPath)
		});

		lineReader.on('line', function (line) {
		  console.log('Line from file:', line);
			var beforeAt = line.split('@')[0];
			var nameSplit = beforeAt.split('.');
			var name = nameSplit[0];
			var lastName = nameSplit[1];
			
			db.insert({name: name, lastName: lastName, mail: line});
		});
}