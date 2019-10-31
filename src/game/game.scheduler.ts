import {Injectable} from "@nestjs/common";

@Injectable()
export class GameScheduler {
    addTask(callback:()=>void, timeout) {
        setTimeout(callback, timeout);
    }
}