// 갤러그 게임 메인 로직
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupCanvas();
        this.loadAssets();
        
        this.player = {
            x: this.canvas.width / 2 - 25,
            y: this.canvas.height - 80,
            width: 50,
            height: 50,
            speed: 5,
            bullets: [],
            isInvincible: false
        };
        
        this.enemies = [];
        this.score = 0;
        this.gameStarted = false;
        this.gameTimeLimit = 60000; // 1분 (60초)
        this.gameStartTime = 0;
        this.gameEnded = false;
        
        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        
        // 영어 문장 관련 변수
        this.englishSentences = this.getEnglishSentences();
        this.completedSentences = [];
        this.maxSentences = 8; // 8문장이 되면 게임 종료
        this.currentSentence = null;
        this.wordParticles = [];
        
        this.setupEvents();
        
        // 시작 화면 표시
        this.showStartScreen();
        
        // 게임 루프 시작
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    // 영어 문장 100개를 반환하는 함수
    getEnglishSentences() {
        return [
            "I really enjoy reading good books.",
            "She always walks her dog daily.",
            "They went to the beach yesterday.",
            "He can speak three languages fluently.",
            "We should finish this project soon.",
            "My sister lives in New York.",
            "The movie starts at eight tonight.",
            "Please call me when you arrive.",
            "I need to buy some groceries.",
            "This pizza tastes really delicious today.",
            "Could you help me move this?",
            "The weather is beautiful this morning.",
            "They are traveling to Europe soon.",
            "My car needs to be repaired.",
            "She passed her driving test easily.",
            "We will meet again next week.",
            "He wrote a book about space.",
            "The children are playing in park.",
            "Our flight leaves at six tomorrow.",
            "I forgot to bring my umbrella.",
            "Can you recommend a good restaurant?",
            "The concert was amazing last night.",
            "She makes the best chocolate cookies.",
            "They decided to start a business.",
            "My phone battery is almost dead.",
            "The train arrives in five minutes.",
            "He always tells funny jokes perfectly.",
            "We should save money for vacation.",
            "The baby is sleeping right now.",
            "I received your email this morning.",
            "The game starts at three today.",
            "She drinks coffee every morning regularly.",
            "They bought a new house recently.",
            "My brother graduated from college yesterday.",
            "We need to leave early tomorrow.",
            "He forgot his keys at home.",
            "The meeting ended earlier than expected.",
            "I usually exercise before work daily.",
            "She speaks very good French fluently.",
            "The store closes at nine tonight.",
            "We saw a great movie yesterday.",
            "He teaches math at local school.",
            "My dog loves to play fetch.",
            "They finished the project on time.",
            "I will call you back later.",
            "She planted flowers in her garden.",
            "The book was better than movie.",
            "We should go there next weekend.",
            "He runs five miles every day.",
            "My favorite season is fall definitely.",
            "The cake tastes amazing and delicious.",
            "She lost her wallet last week.",
            "I want to learn another language.",
            "The children built a snow fort.",
            "We watched sunset at the beach.",
            "He plays guitar very well professionally.",
            "The party starts at nine tonight.",
            "I need to clean my room.",
            "She won the tennis tournament yesterday.",
            "They adopted a rescue dog recently.",
            "My computer needs to be fixed.",
            "We ordered takeout for dinner tonight.",
            "He finished reading that book yesterday.",
            "The concert tickets sold out quickly.",
            "I enjoy listening to classical music.",
            "She drives to work every day.",
            "The rain finally stopped this morning.",
            "We should try that new restaurant.",
            "He speaks very quietly in class.",
            "My grandmother makes delicious apple pie.",
            "They moved to another city recently.",
            "I have a meeting at noon.",
            "She takes yoga classes every week.",
            "The movie made me cry yesterday.",
            "We need more paper for printer.",
            "He never misses a basketball game.",
            "The sun sets earlier in winter.",
            "I studied Spanish for three years.",
            "She works at the local hospital.",
            "They arrived home safely last night.",
            "My plants need more sunlight daily.",
            "We saw dolphins at the beach.",
            "He makes breakfast every morning regularly.",
            "The internet is not working today.",
            "I sent the package this morning.",
            "She enjoys hiking on weekends regularly.",
            "The museum opens at ten tomorrow.",
            "We should leave before rush hour.",
            "He bought a new bicycle yesterday.",
            "My neighbors have a beautiful garden.",
            "They celebrate their anniversary every year.",
            "I need to get a haircut.",
            "She knows how to fix cars.",
            "The snow is falling heavily outside.",
            "We made dinner together last night.",
            "He loves watching movies at home.",
            "The class starts in ten minutes.",
            "I found my lost keys yesterday.",
            "She paints beautiful landscape pictures carefully.",
            "They play tennis every Saturday morning.",
            "My watch stopped working this morning."
        ];
    }
    
    // 무작위 영어 문장을 가져오는 함수
    getRandomSentence() {
        const index = Math.floor(Math.random() * this.englishSentences.length);
        const sentence = this.englishSentences[index];
        // 사용한 문장은 배열에서 제거
        this.englishSentences.splice(index, 1);
        return sentence;
    }
    
    // 문장을 단어 배열로 분리하는 함수
    splitSentenceIntoWords(sentence) {
        return sentence.split(' ');
    }
    
    setupCanvas() {
        // 캔버스 크기를 뷰포트에 맞게 설정
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // 화면 크기가 변경되면 캔버스 크기도 조정
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            
            // 플레이어 위치 재조정
            this.player.y = this.canvas.height - 80;
            this.player.x = (this.canvas.width / 2) - 25;
        });
    }
    
    loadAssets() {
        // 플레이어 이미지 로드
        this.playerImage = new Image();
        this.playerImage.src = 'images/player.png';
        
        // 적 이미지 로드 (10개의 다른 적 이미지)
        this.enemyImages = [];
        const enemyTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        enemyTypes.forEach(num => {
            const img = new Image();
            img.src = `images/enemy${num}.png`;
            this.enemyImages.push(img);
        });
        
        // 사운드 로드
        this.sounds = {
            shoot: new Audio('sounds/shoot.mp3'),
            explosion: new Audio('sounds/explosion.mp3'),
            background: new Audio('sounds/background.mp3')
        };
        
        // 배경음악 설정
        this.sounds.background.loop = true;
        this.sounds.background.volume = 0.5;
    }
    
    setupEvents() {
        // 터치 이벤트 설정
        let touchStartX = 0;
        
        // 터치 시작 시 처리
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            // 게임 시작 처리
            if (!this.gameStarted) {
                this.startGame();
                return;
            }
            
            // 게임 종료 후 다시 시작
            if (this.gameEnded) {
                this.resetGame();
                return;
            }
            
            // 터치 시작 위치 저장
            touchStartX = e.touches[0].clientX;
            
            // 총알 발사
            this.shoot();
        });
        
        // 터치 이동 시 처리
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.gameStarted || this.gameEnded) return;
            
            const touch = e.touches[0];
            const diffX = touch.clientX - touchStartX;
            touchStartX = touch.clientX;
            
            // 플레이어 위치 업데이트
            this.player.x += diffX;
            
            // 화면 밖으로 나가지 않도록 제한
            if (this.player.x < 0) {
                this.player.x = 0;
            }
            
            if (this.player.x > this.canvas.width - this.player.width) {
                this.player.x = this.canvas.width - this.player.width;
            }
        });
    }
    
    startGame() {
        this.gameStarted = true;
        this.gameStartTime = Date.now();
        this.sounds.background.play().catch(error => console.log('배경 음악 재생 실패:', error));
    }
    
    resetGame() {
        this.gameStarted = true;
        this.gameEnded = false;
        this.gameStartTime = Date.now();
        this.score = 0;
        this.player.bullets = [];
        this.enemies = [];
        this.completedSentences = [];
        this.wordParticles = [];
        this.currentSentence = null;
        this.englishSentences = this.getEnglishSentences();
        this.sounds.background.currentTime = 0;
        this.sounds.background.play().catch(error => console.log('배경 음악 재생 실패:', error));
    }
    
    showStartScreen() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('갤러그', this.canvas.width / 2, this.canvas.height / 2 - 40);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText('화면을 터치하여 시작하세요', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
    
    shoot() {
        // 총알 객체 생성
        const bullet = {
            x: this.player.x + this.player.width / 2 - 2.5,
            y: this.player.y,
            width: 5,
            height: 15,
            speed: 8
        };
        
        this.player.bullets.push(bullet);
        
        // 발사 효과음 재생
        this.sounds.shoot.currentTime = 0;
        this.sounds.shoot.play().catch(error => console.log('발사 효과음 재생 실패:', error));
    }
    
    spawnEnemy() {
        // 적 객체 생성
        const enemy = {
            x: Math.random() * (this.canvas.width - 40),
            y: -50,
            width: 40,
            height: 40,
            speed: 1 + Math.random() * 2,
            imageIndex: Math.floor(Math.random() * this.enemyImages.length)
        };
        
        this.enemies.push(enemy);
    }
    
    updateBullets() {
        // 총알 위치 업데이트 및 화면 밖으로 나간 총알 제거
        for (let i = this.player.bullets.length - 1; i >= 0; i--) {
            const bullet = this.player.bullets[i];
            bullet.y -= bullet.speed;
            
            // 화면 밖으로 나간 총알 제거
            if (bullet.y + bullet.height < 0) {
                this.player.bullets.splice(i, 1);
            }
        }
    }
    
    // 단어 파티클 업데이트
    updateWordParticles() {
        let allParticlesSettled = true;
        
        for (let i = 0; i < this.wordParticles.length; i++) {
            const particle = this.wordParticles[i];
            
            // 파티클의 생명 주기 단계에 따른 처리
            switch(particle.phase) {
                case 'explosion': // 폭발 단계: 사방으로 퍼짐
                    // 위치 업데이트 (기존 속도와 중력 적용)
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vy += particle.gravity;
                    
                    // 폭발 시간이 지나면 수렴 단계로 전환
                    particle.explosionTime -= 16; // 약 16ms (60fps 기준)
                    if (particle.explosionTime <= 0) {
                        particle.phase = 'convergence';
                        // 폭발 속도를 줄이고 목표를 향해 움직이도록 준비
                        particle.vx *= 0.2;
                        particle.vy *= 0.2;
                    }
                    allParticlesSettled = false;
                    break;
                
                case 'convergence': // 수렴 단계: 천천히 목표 위치로 이동
                    // 목표 위치로의 방향 계산
                    const dx = particle.targetX - particle.x;
                    const dy = particle.targetY - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 2) {
                        // 목표 방향으로 이동 (목표에 가까워질수록 속도 감소)
                        const speed = Math.min(0.05, distance / 100);
                        particle.x += dx * speed;
                        particle.y += dy * speed;
                        
                        // 회전 감소
                        if (particle.rotation > 0) {
                            particle.rotation *= 0.95;
                        }
                        
                        allParticlesSettled = false;
                    } else {
                        // 목표에 도달: 최종 위치로 고정
                        particle.x = particle.targetX;
                        particle.y = particle.targetY;
                        particle.vx = 0;
                        particle.vy = 0;
                        particle.rotation = 0;
                    }
                    break;
            }
        }
        
        // 모든 파티클이 멈추면 문장 완성
        if (allParticlesSettled && this.currentSentence && !this.completedSentences.includes(this.currentSentence)) {
            // 문장을 배열에 추가
            this.completedSentences.push(this.currentSentence);
            this.currentSentence = null;
            this.wordParticles = [];
            
            // 8문장이 완성되면 게임 종료
            if (this.completedSentences.length >= this.maxSentences) {
                this.gameEnded = true;
                this.sounds.background.pause();
            }
        }
    }

    // 단어 파티클을 생성하는 함수
    createWordParticles(x, y, sentence) {
        const words = this.splitSentenceIntoWords(sentence);
        
        // 화면 중앙에 위치하도록 가로 위치 계산
        const centerX = this.canvas.width / 2;
        // 현재 문장이 표시될 위치 계산
        const sentenceCount = this.completedSentences.length;
        const firstSentenceY = this.canvas.height - 100;
        const sentenceGap = 30;
        const finalY = firstSentenceY - (sentenceCount * sentenceGap);
        
        // 각 단어의 최종 위치 계산을 위한 준비
        const wordCount = words.length;
        const totalWidth = words.reduce((sum, word) => sum + word.length * 10, 0); // 대략적인 너비 계산
        const averageWordWidth = totalWidth / wordCount;
        let currentX = centerX - (totalWidth / 2);
        
        // 각 단어에 대한 파티클 생성
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            
            // 불꽃놀이 효과를 위한 랜덤한 방향 및 속도 설정
            const angle = Math.random() * Math.PI * 2; // 완전한 원형으로 퍼짐
            const speed = (1 + Math.random() * 3) * 0.7; // 다양한 속도로 퍼짐, 30% 감소
            
            // 랜덤한 색상 생성 (더 밝고 다양한 색상)
            const colors = [
                '#FF4848', '#FF7F00', '#FFFF00', '#00FF00', 
                '#00FFFF', '#0080FF', '#7F00FF', '#FF00FF',
                '#FF69B4', '#FFFF4D', '#48FF48', '#4D4DFF'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // 단어의 최종 위치 계산
            const wordWidth = word.length * 10; // 대략적인 단어 너비
            const targetX = currentX + (wordWidth / 2);
            currentX += wordWidth + 10; // 다음 단어 위치 (간격 10px)
            
            this.wordParticles.push({
                word: word,
                x: x,
                y: y,
                vx: Math.cos(angle) * speed, // 30% 감소된 속도 적용
                vy: Math.sin(angle) * speed - 0.7, // 위쪽 방향으로의 힘도 30% 감소 (1 → 0.7)
                color: color,
                size: 20,
                alpha: 1,
                gravity: 0.05,          // 중력 감소로 더 오래 공중에 떠있게
                rotation: (Math.random() - 0.5) * 0.3, // 회전 효과 증가
                targetX: targetX,       // 목표 X 위치
                targetY: finalY,        // 목표 Y 위치
                phase: 'explosion',     // 초기 상태는 폭발 단계
                explosionTime: 1000 + Math.random() * 500 // 1~1.5초 동안 폭발 효과
            });
        }
        
        // 현재 문장 저장
        this.currentSentence = sentence;
    }
    
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.y += enemy.speed;
            
            // 화면 밖으로 나간 적 제거
            if (enemy.y > this.canvas.height) {
                this.enemies.splice(i, 1);
                continue;
            }
            
            // 총알과 적 충돌 체크
            for (let j = this.player.bullets.length - 1; j >= 0; j--) {
                const bullet = this.player.bullets[j];
                
                if (this.checkCollision(bullet, enemy)) {
                    // 폭발 효과음 재생
                    this.sounds.explosion.currentTime = 0;
                    this.sounds.explosion.play().catch(error => console.log('폭발 효과음 재생 실패:', error));
                    
                    // 점수 추가
                    this.score += 100;
                    
                    // 영어 문장 파티클 생성
                    if (this.englishSentences.length > 0 && !this.currentSentence) {
                        const randomSentence = this.getRandomSentence();
                        this.createWordParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, randomSentence);
                    }
                    
                    // 적과 총알 제거
                    this.enemies.splice(i, 1);
                    this.player.bullets.splice(j, 1);
                    break;
                }
            }
        }
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    draw() {
        // 화면 지우기
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.gameStarted) {
            this.showStartScreen();
            return;
        }
        
        // 플레이어 그리기
        this.ctx.drawImage(
            this.playerImage,
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );
        
        // 총알 그리기
        this.ctx.fillStyle = 'white';
        for (const bullet of this.player.bullets) {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
        
        // 적 그리기
        for (const enemy of this.enemies) {
            if (this.enemyImages[enemy.imageIndex]) {
                this.ctx.drawImage(
                    this.enemyImages[enemy.imageIndex],
                    enemy.x,
                    enemy.y,
                    enemy.width,
                    enemy.height
                );
            }
        }
        
        // 단어 파티클 그리기
        for (const particle of this.wordParticles) {
            this.ctx.save();
            this.ctx.fillStyle = particle.color;
            this.ctx.font = `${particle.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            this.ctx.fillText(particle.word, 0, 0);
            this.ctx.restore();
        }
        
        // 완성된 문장 그리기
        this.ctx.fillStyle = 'white';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'center';
        
        // 첫 번째 문장이 항상 아래에 오도록 수정
        // 추가된 순서대로 아래에서 위로 그림
        const firstSentenceY = this.canvas.height - 60; // 첫 번째 문장의 Y 좌표
        const sentenceGap = 30; // 문장 간 간격
        
        for (let i = 0; i < this.completedSentences.length; i++) {
            const y = firstSentenceY - (i * sentenceGap);
            this.ctx.fillText(this.completedSentences[i], this.canvas.width / 2, y);
        }
        
        // 점수와 남은 시간 그리기
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`점수: ${this.score}`, 10, 30);
        
        // 남은 시간 그리기 (8문장이 채워지면 시간 표시 안 함)
        if (this.gameStarted && !this.gameEnded && this.completedSentences.length < this.maxSentences) {
            const elapsedTime = Date.now() - this.gameStartTime;
            const remainingTime = Math.max(0, Math.ceil((this.gameTimeLimit - elapsedTime) / 1000));
            
            this.ctx.fillText(`남은 시간: ${remainingTime}초`, 10, 60);
        }
        
        // 게임 종료 화면
        if (this.gameEnded) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '36px Arial';
            this.ctx.textAlign = 'center';
            
            if (this.completedSentences.length >= this.maxSentences) {
                this.ctx.fillText('문장 8개 완성!', this.canvas.width / 2, 100);
            } else {
                this.ctx.fillText('시간 종료!', this.canvas.width / 2, 100);
            }
            
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`최종 점수: ${this.score}`, this.canvas.width / 2, 150);
            
            // 완성된 문장 표시
            this.ctx.font = '18px Arial';
            let sentenceY = 200;
            
            // 첫 번째 문장부터 순차적으로 위에서 아래로 표시
            for (let i = 0; i < this.completedSentences.length; i++) {
                this.ctx.fillText(this.completedSentences[i], this.canvas.width / 2, sentenceY);
                sentenceY += 30;
            }
            
            this.ctx.font = '20px Arial';
            this.ctx.fillText('다시 시작하려면 화면을 터치하세요', this.canvas.width / 2, sentenceY + 40);
        }
    }
    
    gameLoop(timestamp) {
        // 프레임 간의 시간 차이 계산
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        if (this.gameStarted && !this.gameEnded) {
            // 8문장이 모두 채워졌는지 체크
            if (this.completedSentences.length >= this.maxSentences) {
                this.gameEnded = true;
                this.sounds.background.pause();
            }
            // 시간 제한 체크 (8문장이 채워지지 않았을 때만)
            else {
                const elapsedTime = Date.now() - this.gameStartTime;
                if (elapsedTime >= this.gameTimeLimit) {
                    this.gameEnded = true;
                    this.sounds.background.pause();
                }
            }
            
            // 게임 요소 업데이트
            if (!this.gameEnded) {
                // 적 생성 타이머 업데이트
                this.enemySpawnTimer += deltaTime;
                if (this.enemySpawnTimer > 1000) { // 1초마다 적 생성
                    this.spawnEnemy();
                    this.enemySpawnTimer = 0;
                }
                
                // 총알과 적 업데이트
                this.updateBullets();
                this.updateEnemies();
                
                // 단어 파티클 업데이트
                this.updateWordParticles();
            }
        }
        
        // 화면 그리기
        this.draw();
        
        // 다음 프레임 요청
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// 페이지 로드 시 게임 인스턴스 생성
window.addEventListener('load', () => {
    new Game();
});