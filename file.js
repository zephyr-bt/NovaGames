const home = document.getElementById('home');
const gameArea = document.getElementById('game-area');
const gameContainer = document.getElementById('game-container');

function loadGame(gameName) {
    home.classList.add('hidden');
    gameArea.classList.remove('hidden');
    gameContainer.innerHTML = ''; // Clear previous game

    let html = '';
    let scriptCode = '';

    if (gameName === 'tictactoe') {
        html = `<h2>Tic Tac Toe</h2><div id="board" style="display:grid;grid-template-columns:repeat(3,100px);gap:10px;margin:auto;width:320px;"></div><p id="status">Player X's turn</p>`;
        scriptCode = `
            const board = Array(9).fill(null);
            const cells = document.querySelectorAll('#board div');
            let currentPlayer = 'X';
            const status = document.getElementById('status');
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement('div');
                cell.style.height = '100px';
                cell.style.background = '#fff';
                cell.style.border = '2px solid #333';
                cell.style.fontSize = '50px';
                cell.style.cursor = 'pointer';
                cell.onclick = () => makeMove(i);
                document.getElementById('board').appendChild(cell);
            }
            function makeMove(index) {
                if (board[index] || checkWinner()) return;
                board[index] = currentPlayer;
                cells[index].textContent = currentPlayer;
                if (checkWinner()) status.textContent = currentPlayer + ' wins!';
                else if (board.every(c => c)) status.textContent = 'Draw!';
                else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    status.textContent = 'Player ' + currentPlayer + "'s turn";
                }
            }
            function checkWinner() {
                const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
                return wins.some(combo => combo.every(i => board[i] === currentPlayer));
            }
        `;
    } else if (gameName === 'pong') {
        html = `<h2>Ping Pong</h2><canvas id="canvas" width="600" height="400"></canvas>`;
        scriptCode = `
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            let ballX = 300, ballY = 200, ballDX = 4, ballDY = 4;
            let paddle1Y = 150, paddle2Y = 150;
            const paddleHeight = 100, paddleWidth = 10;
            let score1 = 0, score2 = 0;
            document.addEventListener('keydown', e => {
                if (e.key === 'w') paddle1Y -= 20;
                if (e.key === 's') paddle1Y += 20;
                if (e.key === 'ArrowUp') paddle2Y -= 20;
                if (e.key === 'ArrowDown') paddle2Y += 20;
            });
            function draw() {
                ctx.clearRect(0,0,600,400);
                ctx.fillStyle = '#fff';
                ctx.fillRect(20, paddle1Y, paddleWidth, paddleHeight); // Left paddle
                ctx.fillRect(570, paddle2Y, paddleWidth, paddleHeight); // Right paddle
                ctx.fillRect(ballX, ballY, 10, 10); // Ball
                ballX += ballDX; ballY += ballDY;
                if (ballY < 0 || ballY > 390) ballDY = -ballDY;
                if (ballX < 30 && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) ballDX = -ballDX;
                if (ballX > 560 && ballY > paddle2Y && ballY < paddle2Y + paddleHeight) ballDX = -ballDX;
                if (ballX < 0) { score2++; ballX = 300; ballY = 200; }
                if (ballX > 600) { score1++; ballX = 300; ballY = 200; }
                ctx.font = '30px Arial';
                ctx.fillText(score1, 200, 50);
                ctx.fillText(score2, 400, 50);
                requestAnimationFrame(draw);
            }
            draw();
        `;
    } else if (gameName === 'dino') {
        html = `<h2>Dino Run</h2><canvas id="canvas" width="800" height="300"></canvas>`;
        scriptCode = `
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            let dinoY = 200, gravity = 0, isJumping = false;
            let obstacles = [];
            let score = 0;
            document.addEventListener('keydown', () => { if (!isJumping) { gravity = -10; isJumping = true; } });
            function draw() {
                ctx.clearRect(0,0,800,300);
                // Dino
                ctx.fillStyle = '#333';
                ctx.fillRect(50, dinoY, 40, 60);
                dinoY += gravity;
                if (dinoY > 200) { dinoY = 200; gravity = 0; isJumping = false; } else gravity += 0.5;
                // Obstacles
                if (Math.random() < 0.02) obstacles.push(800);
                obstacles = obstacles.map(x => x - 5).filter(x => x > -50);
                obstacles.forEach(x => ctx.fillRect(x, 240, 20, 60));
                // Collision/Score
                if (obstacles.some(x => x < 90 && x > 30)) alert('Game Over! Score: ' + score);
                score++;
                ctx.fillText('Score: ' + score, 700, 50);
                requestAnimationFrame(draw);
            }
            draw();
        `;
    } else if (gameName === 'snake') {
        html = `<h2>Snake (Cloud Fly)</h2><canvas id="canvas" width="400" height="400"></canvas>`;
        scriptCode = `
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            let snake = [{x:200, y:200}];
            let dx = 20, dy = 0, food = {x: Math.floor(Math.random()*20)*20, y: Math.floor(Math.random()*20)*20};
            document.addEventListener('keydown', e => {
                if (e.key === 'ArrowUp') { dx=0; dy=-20; }
                if (e.key === 'ArrowDown') { dx=0; dy=20; }
                if (e.key === 'ArrowLeft') { dx=-20; dy=0; }
                if (e.key === 'ArrowRight') { dx=20; dy=0; }
            });
            function draw() {
                ctx.clearRect(0,0,400,400);
                snake.forEach(part => ctx.fillRect(part.x, part.y, 20, 20));
                ctx.fillStyle = 'red';
                ctx.fillRect(food.x, food.y, 20, 20);
                let head = {x: snake[0].x + dx, y: snake[0].y + dy};
                snake.unshift(head);
                if (head.x === food.x && head.y === food.y) {
                    food = {x: Math.floor(Math.random()*20)*20, y: Math.floor(Math.random()*20)*20};
                } else snake.pop();
                if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400 || snake.slice(1).some(p => p.x === head.x && p.y === head.y)) alert('Game Over!');
                setTimeout(draw, 100);
            }
            draw();
        `;
    } else if (gameName === 'chess') {
        html = `<h2>Chess (Basic - Click to move pieces)</h2><div id="chessboard" style="display:grid;grid-template-columns:repeat(8,60px);width:480px;margin:auto;"></div>`;
        scriptCode = `
            // Basic chess board setup (white pieces only for demo, full logic is complex - extend it!)
            const board = document.getElementById('chessboard');
            for (let i = 0; i < 64; i++) {
                const square = document.createElement('div');
                square.style.height = '60px';
                square.style.background = (Math.floor(i/8) + i%8) % 2 === 0 ? '#eee' : '#888';
                square.innerHTML = i >= 48 ? '♟' : ''; // Pawns example
                board.appendChild(square);
            }
            alert('Basic board loaded. Full chess logic needs more code - check open source for full implementation!');
        `;
    } else {
        // Placeholders for the other 15
        html = `<h2>${gameName.charAt(0).toUpperCase() + gameName.slice(1).replace(/([A-Z])/g, ' $1')}</h2><p>Game coming soon! Add your code here.</p><button onclick="alert('Score: 100!')">Play Demo</button>`;
    }

    gameContainer.innerHTML = html;
    if (scriptCode) {
        const script = document.createElement('script');
        script.text = scriptCode;
        document.body.appendChild(script);
    }
}

function backToHome() {
    gameArea.classList.add('hidden');
    home.classList.remove('hidden');
    gameContainer.innerHTML = '';
}.