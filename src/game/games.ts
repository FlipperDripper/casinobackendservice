import config from "../config";

export class RouletteGame {
    rouletteRange = config.rouletteRange;
    bets: { [userId: number]: number } = {};
    result: number = null;

    makeBet(bet: number, userId: number) {
        this.bets[userId] = bet;
    }

    getResult() {
        let result = Math.round(Math.random() * this.rouletteRange.to);
        if (result < this.rouletteRange.from) result = this.rouletteRange.from;
        this.result = result;
        return result;
    }
    getWinners():number[]{
        if(this.result == null) return [];
        return Object.keys(this.bets).map(userId=>{
            if(this.bets[userId] == this.result) return Number(userId);
        })
    }
    clear(){
        this.bets = {};
        this.result = null;
    }
}

export class DiceGame {
    countOfCubes: number;
    maxCubeValue: number;
    results: {[userId: number]: {cubes:number[]}} | null = null;
    users: number[] = [];
    nextUser: number = null;

    constructor(countOfCubes: number, maxCubeValue: number){
        this.countOfCubes = countOfCubes;
        this.maxCubeValue = maxCubeValue;
    }
    addUser(userId: number) {
        this.users.push(userId);
    }
    nextStep(){
        const indexOfPreventUser = this.users.indexOf(thus.nextUser);
        if(this.users.length - 1 == indexOfPreventUser){
            return;
        }
        this.nextUser = this.users[indexOfPreventUser+1];
    }
    rollDice(userId: number){
        if(userId != this.nextUser) throw new Error('The turn of different user');
        for(let i = 0; i < this.countOfCubes; i++){
            const cubeValue = Math.floor(Math.random()*(this.maxCubeValue-1) + 1);
            if(this.results[userId]){
                this.results[userId].cubes.push(cubeValue);
            }else{
                this.results[userId].cubes = [cubeValue];
            }
        }
        return this.results[userId];
    }
    getWinners(): number[]{
        if(!this.results) return [];
        let maxCubeSum = 0;
        let usersIdWithMaxCubeSum = [];
        Object.keys(this.results).map(userId=>{
            let sum = this.results[Number(userId)].cubes.reduce((acc, val)=>acc+val,0);
            if(sum == maxCubeSum) usersIdWithMaxCubeSum.push(userId);
            if(sum > maxCubeSum){
                usersIdWithMaxCubeSum = [userId];
            }
            maxCubeSum = sum;
        })
        return  usersIdWithMaxCubeSum;
    }
    clear(){
        this.results = {};
    }
}