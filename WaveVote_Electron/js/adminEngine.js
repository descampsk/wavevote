/**
 * http://usejsdoc.org/


 */

var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtp.office365.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  auth: {
    user: "kevin.descamps@wavestone.com",
    pass: "************",
  },
  requireTLS: true,
  tls: {
    ciphers: "SSLv3",
  },
});

function sendAuthentificationCodeTo(doc, question) {
  var to = doc.mail;
  var name = doc.name;
  var lastName = doc.lastName;
  var authentificationCode = doc._id;
  var mailOptions = {
    from: "kevin.descamps@wavestone.com",
    to: to,
    subject: "[WaveVote] Code d'authentification",
    html:
      "Bonjour " +
      name +
      " " +
      lastName +
      " !<br><br>" +
      "Votre code d’authentification pour le vote « " +
      question +
      " » est : <br>" +
      "<FONT COLOR=#4B088A>&nbsp;&nbsp;&nbsp;<b>" +
      authentificationCode +
      "</b><br><br></FONT>" +
      "N’oubliez pas d’aller voter !<br><br>" +
      "Kévin DESCAMPS<br>" +
      "Administrateur WaveVote",
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      db.update({ _id: doc._id }, { $set: { AuthentificationMail: true } }, {});
    }
  });
}

function sendRegistrationAccepted(doc, question) {
  var to = doc.mail;
  var name = doc.name;
  var lastName = doc.lastName;
  var mailOptions = {
    from: "kevin.descamps@wavestone.com",
    to: to,
    subject: "[WaveVote] Inscription acceptée !",
    html:
      "Bonjour " +
      name +
      " " +
      lastName +
      " !<br><br>" +
      "L'administrateur a accepté votre demande d'inscription pour le vote « " +
      question +
      " ».<br>" +
      "Le vote commence jeudi à 9h00.<br><br>" +
      "N’oubliez pas d’aller voter !<br><br>" +
      "Kévin DESCAMPS<br>" +
      "Administrateur WaveVote",
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      db.update(
        { _id: doc._id },
        { $set: { RegistrationAcceptedMail: true } },
        {}
      );
      console.log("Email sent: " + info.response);
    }
  });
}

function sendRappelRegistration(doc, question) {
  var to = doc.mail;
  var name = doc.name;
  var lastName = doc.lastName;
  var mailOptions = {
    from: "kevin.descamps@wavestone.com",
    to: to,
    subject: "[WaveVote] Rappel d'inscription au vote !",
    html:
      "Bonjour " +
      name +
      " " +
      lastName +
      " !<br><br>" +
      "Vous n'avez pas encore envoyé votre demande d'inscription pour le vote « " +
      question +
      " ».<br>" +
      "Vous avez jusqu'à mardi soir minuit pour vous inscrire.<br><br>" +
      "N’hésitez surtout pas !<br><br>" +
      "Kévin DESCAMPS<br>" +
      "Administrateur WaveVote",
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      db.update(
        { _id: doc._id },
        { $set: { RegistrationAcceptedMail: true } },
        {}
      );
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

function sendAllRegistrationAccepted(question) {
  db.find(
    { RegistrationAcceptedMail: { $exists: false }, registered: true },
    function (error, docs) {
      if (error) {
        console.log(error);
      } else {
        for (var i = 0; i < docs.length; i++) {
          var doc = docs[i];
          sendRegistrationAccepted(doc, question);
        }
      }
    }
  );
}

function printAllMailNotRegistered() {
  db.find({ registered: false }, function (error, docs) {
    if (error) {
      console.log(error);
    } else {
      var strList = "";
      for (var i = 0; i < docs.length; i++) {
        var doc = docs[i];
        strList = strList + doc.mail + "\n";
      }
      console.log(strList);
    }
  });
}

function sendAllAuthentificationCode(question) {
  db.find({ AuthentificationMail: { $exists: false } }, function (error, docs) {
    if (error) {
      console.log(error);
    } else {
      for (var i = 0; i < docs.length; i++) {
        var doc = docs[i];
        sendAuthentificationCodeTo(doc, question);
      }
    }
  });
}

/**
 * Insert in the database each person who is eligible to vote.
 * Find the mail in the mail.csv file and write the adminKey database.
 */
function generateEachInscriptionKey() {
  var lineReader = require("readline").createInterface({
    input: require("fs").createReadStream(mailDataPath),
  });

  var numero = 0;
  lineReader.on("line", function (line) {
    var beforeAt = line.split("@")[0];
    var nameSplit = beforeAt.split(".");
    var name = nameSplit[0];
    var lastName = nameSplit[1];

    db.insert({ numero: numero, name: name, lastName: lastName, mail: line });
    numero += 1;
  });
}

/**
 * Print all mail that are registered
 */
function printAllMailRegistered() {
  db.find({ registered: true }, function (error, docs) {
    if (error) {
      console.log(error);
    } else {
      var allMail = "";
      for (var i = 0; i < docs.length; i++) {
        var doc = docs[i];
        allMail = allMail + doc.mail + "\n";
      }
      console.log(allMail);
    }
  });
}
