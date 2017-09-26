/**
 * http://usejsdoc.org/
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