import config from "../config";

export class Game {
    players: number[] = [];
    cardsBank: number[] = [];
    private gameStartCallbacks: Array<() => void> = [];
    private gameEndCallbacks: Array<() => void> = [];

    addPlayer(playerId: number, cards: number[]) {
        this.players.push(playerId);
        this.cardsBank = [...this.cardsBank, ...cards];
    }

    removePlayer(playerId: number) {
        const playerIndex = this.players.indexOf(playerId);
        if (playerIndex == -1) return;
        this.players.splice(playerIndex, 1);
    }

    onStartGame(cb: () => void) {
        this.gameStartCallbacks.push(cb);
    }

    onEndGame(cb: () => void) {
        this.gameEndCallbacks.push(cb);
    }

    protected emitStartGame() {
        this.gameStartCallbacks.forEach(cb => cb());
    }

    protected emitEndGame() {
        this.gameEndCallbacks.forEach(cb => cb());
    }

    startGame() {
        this.emitStartGame();
    }
    endGame(){
        this.emitEndGame();
    }
}

function diff<T>(arr1: T[], arr2: T[]) {
    const result: T[] = [];
    for (let el of arr1) {
        if (arr2.indexOf(el) == -1) {
            result.push(el);
        }
    }
    return result;
}

function getRandomUInt(from: number, to: number): number {
    if (from + 1 == to || from == to) return from;
    const randomInt = Math.floor(Math.random() * (to - 1));
    return randomInt < from ? from : randomInt;
}

export class RouletteGame extends Game {
    winner: number = null;
    startGame() {
        super.startGame();
        this.getWinner();
        this.endGame();
    }

    getWinner(): number | null {
        if (this.players.length == 0) return null;
        const winnerIndex = getRandomUInt(0, this.players.length);
        this.winner = this.players[winnerIndex];
        return this.winner;
    }
}

export class DiceGame extends Game {
    currentPlayer: number | null = null;
    playersMadeRoll: number[] = [];
    nextUserCallbacks: Array<(userId: number | null) => void> = [];
    gameInterval: any;

    startGame() {
        super.startGame();
        this.nextPlayer();
        this.setGameInterval();
    }
    endGame() {
        super.endGame();
        this.clearGameInterval();
    }

    setGameInterval() {
        this.gameInterval = setInterval(this.nextPlayer.bind(this), config.maxStepTime);
    }

    clearGameInterval() {
        clearInterval(this.gameInterval);
    }

    updateGameInterval() {
        this.clearGameInterval();
        this.setGameInterval();
    }

    onNextPlayer(cb: (userId: number | null) => void) {
        this.nextUserCallbacks.push(cb)
    }

    emitNextPlayerCallback(userId: number | null) {
        this.nextUserCallbacks.forEach(cb => cb(userId));
    }

    makeRoll(): number[] | null {
        if (this.currentPlayer == null)return null;
        if (this.cardsBank.length == 0) return null;
        this.updateGameInterval();
        return this.getRandomCards()
    }

    nextPlayer(): number | null {
        const endGame = ()=>{
            this.currentPlayer = null
            this.endGame();
            return null;
        };
        if(this.cardsBank.length == 0 || this.players.length == 0){
            return endGame()
        }
        const playersWithoutRoll = diff<number>(this.players, this.playersMadeRoll);
        if (playersWithoutRoll.length == 0) {
            return endGame()
        }
        const nextUserIndex = getRandomUInt(0, playersWithoutRoll.length);
        const nextUserId = playersWithoutRoll[nextUserIndex];

        this.currentPlayer = nextUserId;
        this.emitNextPlayerCallback(nextUserId);
        return nextUserId;
    }

    private getRandomCards(): number[] {
        const countWonCards = getRandomUInt(config.diceWinRange.from, config.diceWinRange.to + 1);
        if (this.cardsBank.length < countWonCards) {
            return this.cardsBank
        } else {
            return this.cardsBank.splice(0, countWonCards)
        }
    }
}