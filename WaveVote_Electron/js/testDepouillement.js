/**
 * Use a java child process to compute the discret logarithme of the sum of all votes
 * and then send a transaction to compute the tally.
 * @param totalVoter Total of the voters
 * @param totalCandidat Total of the candidates
 * @param sumVote_x X coordinate of the point which represents the sum of all votes
 * @param sumVote_y Y coordinate of the point which represents the sum of all votes
 * @returns
 */
function computeTallyFromJavaChildProcess(
  totalVoter,
  totalCandidat,
  sumVote_x,
  sumVote_y
) {
  var path = require("path");
  const jarPath = path.join(
    __dirname,
    "../jar/WaveVote-1.0-jar-with-dependencies.jar"
  );
  var child = require("child_process").spawn("java", [
    "-jar",
    jarPath,
    totalVoter,
    totalCandidat,
    sumVote_x,
    sumVote_y,
  ]);

  child.stdout.on("data", function (data) {
    //console.log(parseInt(data));
    var output = parseInt(data);
    if (!isNaN(output)) {
      console.log(data.toString() + " ok ");
    }
  });

  child.stderr.on("data", function (data) {
    console.log("erreur");
    console.log(data.toString());
  });
}

computeTallyFromJavaChildProcess(
  21,
  5,
  "107952543076626429943462417033159301330402174594016601212249657809727033303422",
  "65367218548505295699149818696372470913178035247521762526945976449086021239580"
);
