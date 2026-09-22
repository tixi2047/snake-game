
var selectedTableSize;
var selectedGameSpeed;
var gridSize = 0;
var gameConfigStorageKey = "gameConfig";

var gameData = [];
var lastGame = [];

$(document).ready(function () {
    $("#playButton").click(function () {
        openGamePage();
    });

    $("#resultsButton").click(function () {
        openResultsPage();
    });

    function saveGameConfiguration() {
        gameData = [];
        gameData.push(selectedTableSize);
        gameData.push(selectedGameSpeed);
        gameData.push(gridSize);
        localStorage.setItem(gameConfigStorageKey, gameData);

        if (localStorage.getItem("last") == null) {
            lastGame = [];
            lastGame.push("");
            lastGame.push("-1");
            localStorage.setItem("last", lastGame);
        }
    }

    function openGamePage() {
        selectedTableSize = $("input[name='tableSize']:checked").val();
        selectedGameSpeed = $("input[name='gameSpeed']:checked").val();

        if (selectedTableSize == null) {
            alert("YOU HAVE TO SELECT TABLE SIZE");
            return;
        }

        if (selectedGameSpeed == null) {
            alert("YOU HAVE TO SELECT GAME LEVEL");
            return;
        }

        if (selectedTableSize == 0) gridSize = 15;
        if (selectedTableSize == 1) gridSize = 20;
        if (selectedTableSize == 2) gridSize = 25;

        saveGameConfiguration();
        window.location.href = "game.html";
    }

    function openResultsPage() {
        if (localStorage.getItem("last") == null) {
            lastGame = [];
            lastGame.push("");
            lastGame.push("-1");
            localStorage.setItem("last", lastGame);
        }

        window.location.href = "results.html";
    }
});



                

        


