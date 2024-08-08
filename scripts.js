const games = [
    { title: "Card Matching game", description: "", link: "Game1.html" },
    { title: "Whack A Mole", description: "",link: "Game2.html"},
    { title: "Arrow Strike", description: "", link: "Game3.html" },
    { title: "Road Rusher", description: "", link: "Game4.html" },
    { title: "Snake Game", description: "", link: "Game5.html" },
    { title: "Flappy Bird", description: "", link: "Game6.html" },
    { title: "Maze Tilt Master", description: "", link: "Game7.html" },
    { title: "Table Tennis", description: "", link: "Game8.html" },
    { title: "Bounce Battle", description: "", link: "Game9.html" },
    { title: "Bubble Blast", description: "", link: "Game10.html" }
];

function displayGames() {
    const gameList = document.getElementById('game-list');
    gameList.innerHTML = ''; // Clear existing content
    games.forEach(game => {
        const gameItem = document.createElement('div');
        gameItem.className = 'game-item';
        gameItem.innerHTML = `
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <a href="${game.link}" target="_blank">Play Now</a>
        `;
        gameList.appendChild(gameItem);
    });
}

document.getElementById('start-button').onclick = function () {
    document.getElementById('welcome-section').style.display = 'none';
    document.getElementById('game-list-section').style.display = 'block';
    displayGames();
};
