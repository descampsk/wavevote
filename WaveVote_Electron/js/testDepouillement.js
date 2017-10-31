/**
 * Use a java child process to compute the discret logarithme of the sum of all votes
 * and then send a transaction to compute the tally.
 * @param totalVoter Total of the voters
 * @param totalCandidat Total of the candidates
 * @param sumVote_x X coordinate of the point which represents the sum of all votes
 * @param sumVote_y Y coordinate of the point which represents the sum of all votes
 * @returns
 */
function computeTallyFromJavaChildProcess(totalVoter, totalCandidat, sumVote_x, sumVote_y) {
	var path = require('path');
	const jarPath = path.join(__dirname, '../jar/WaveVote-1.0-jar-with-dependencies.jar');
	var child = require('child_process').spawn(
			  'java', ['-jar', jarPath, totalVoter, totalCandidat, sumVote_x, sumVote_y]
			);
	
	child.stdout.on('data', function(data) {
	    console.log(data.toString());
	});

	child.stderr.on("data", function (data) {
		console.log("erreur")
	    console.log(data.toString());
	});
}

computeTallyFromJavaChildProcess(4, 4 , 
		"23593695842213704323894249109946233988291594176434645859101973539580417621171",
		"7147000257485557637214317311000081656385903187614466348461371803012398235439");