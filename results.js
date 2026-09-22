
var playerNames = ["", "", "", "", ""];
var topScores = [-1, -1, -1, -1, -1];
var currentGame = [];
var lastGame = [];

function sortTopScores() {
    for (let i = 0; i < 5; i++) {
        for (let j = i; j < 5; j++) {
            if (parseInt(topScores[j]) > parseInt(topScores[i])) {
                let tempScore = topScores[i];
                let tempName = playerNames[i];

                topScores[i] = topScores[j];
                topScores[j] = tempScore;

                playerNames[i] = playerNames[j];
                playerNames[j] = tempName;
            }
        }
    }
}

function updateTopPlayers() {
    if (parseInt(currentGame[1]) > parseInt(topScores[4])) {
        topScores[4] = parseInt(currentGame[1]);
        playerNames[4] = currentGame[0];
        sortTopScores();
    }

    return;
}

function initializeResultsPage() {
    if (localStorage.getItem("currentGame") == null) {
        localStorage.setItem("currentGame", currentGame);
    } else {
        currentGame = localStorage.getItem("currentGame");
        currentGame = currentGame.split(",");
    }

    if (localStorage.getItem("playerNames") == null) {
        localStorage.setItem("playerNames", playerNames);
    } else {
        playerNames = localStorage.getItem("playerNames");
        playerNames = playerNames.split(",");
    }

    if (localStorage.getItem("topScores") == null) {
        localStorage.setItem("topScores", topScores);
    } else {
        topScores = localStorage.getItem("topScores");
        topScores = topScores.split(",");
    }

    if (localStorage.getItem("playerNames") != null && localStorage.getItem("topScores") != null) {
        if (parseInt(currentGame[1]) != -1) {
            updateTopPlayers();
        }
        localStorage.setItem("topScores", topScores);
        localStorage.setItem("playerNames", playerNames);
    }

    lastGame = localStorage.getItem("last");
    lastGame = lastGame.split(",");

    populateTables();
}

function goToStartPage() {
    if (currentGame[0] != '') {
        lastGame[0] = currentGame[0];
        lastGame[1] = currentGame[1];
        localStorage.setItem("last", lastGame);
    }

    localStorage.setItem("currentGame", "");
    currentGame = [];
    currentGame.push("");
    currentGame.push("-1");
    localStorage.setItem("currentGame", currentGame);
    window.location.href = "index.html";
}

function populateTables() {
    if (parseInt(currentGame[1]) != -1) {
        document.getElementById("latestName").innerHTML = currentGame[0];
        document.getElementById("latestScore").innerHTML = currentGame[1];
    } else {
        if (lastGame[0] != '') {
            document.getElementById("latestName").innerHTML = lastGame[0];
            document.getElementById("latestScore").innerHTML = lastGame[1];
        } else {
            document.getElementById("latestName").innerHTML = '';
            document.getElementById("latestScore").innerHTML = '';
        }
    }

    if (topScores[0] != -1) {
        document.getElementById("top1Name").innerHTML = playerNames[0];
        document.getElementById("top1Score").innerHTML = topScores[0];
    }
    if (topScores[1] != -1) {
        document.getElementById("top2Name").innerHTML = playerNames[1];
        document.getElementById("top2Score").innerHTML = topScores[1];
    }
    if (topScores[2] != -1) {
        document.getElementById("top3Name").innerHTML = playerNames[2];
        document.getElementById("top3Score").innerHTML = topScores[2];
    }
    if (topScores[3] != -1) {
        document.getElementById("top4Name").innerHTML = playerNames[3];
        document.getElementById("top4Score").innerHTML = topScores[3];
    }
    if (topScores[4] != -1) {
        document.getElementById("top5Name").innerHTML = playerNames[4];
        document.getElementById("top5Score").innerHTML = topScores[4];
    }
}