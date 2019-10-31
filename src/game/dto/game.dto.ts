import {IsInt, IsNumber} from "class-validator";

export enum GameStatuses {
    waiting = 'waiting',
    started = 'started',
    ended = 'ended',
    canceled = 'canceled'
}
export enum GameType {
    roulette = 'roulette',
    dice = 'dice'
}
export class GameDto {
    minCardValue: number;
    maxCardValue: number;
    minSumValue: number;
    maxSumValue: number;
    minCards: number;
    maxCards: number;
    gameStatus: GameStatuses;
    gameType: GameType
}