let selectedChar = 0;

export function setupUI() {
    window.selectChar = (i) => {
        selectedChar = i;
        document.querySelectorAll('.char').forEach((el, j) => {
            el.className = j === i ? 'char sel' : 'char';
        });
        window.gameState.selectedChar = i;
    };

    window.startGame = () => {
        const name = document.getElementById('playerName').value.trim() || 'Oyuncu';
        document.getElementById('lobby').style.display = 'none';
        document.getElementById('hud').style.display = 'flex';
        document.getElementById('collectBtn').style.display = 'flex';
        window.gameState.startGame(name);
    };

    window.collectNearby = () => window.gameState.collect();
    window.closeLetterInfo = () => window.gameState.closeInfo();
    window.closeChestInfo = () => window.gameState.closeInfo();
}

export function updateHUD(letters, total, gold, mapName) {
    document.getElementById('hLetters').textContent = letters;
    document.getElementById('hTotal').textContent = total;
    document.getElementById('hGold').textContent = gold;
    document.getElementById('hMap').textContent = mapName;
}

export function showLetterInfo(letter) {
    document.getElementById('liChar').textContent = letter[0];
    document.getElementById('liName').textContent = letter[1];
    document.getElementById('liSound').textContent = '[ ' + letter[2] + ' ]';
    document.getElementById('liDetail').textContent = letter[3];
    document.getElementById('letterInfo').style.display = 'block';
}

export function showChestInfo(gold) {
    document.getElementById('ciGold').textContent = '+' + gold + ' Altin!';
    document.getElementById('chestInfo').style.display = 'block';
}

export function showPortal() {
    document.getElementById('portalMsg').style.display = 'block';
}

export function showGameOver(text) {
    document.getElementById('goScore').textContent = text;
    document.getElementById('gameOver').style.display = 'flex';
}

export function hideAllPopups() {
    document.getElementById('letterInfo').style.display = 'none';
    document.getElementById('chestInfo').style.display = 'none';
}
