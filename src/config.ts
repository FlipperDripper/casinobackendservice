import {UserRoles} from "./users/users.entity";

export default {
    jwtSecret: 'secretKey',
    financier: {
        login: 'financier',
        firstName: 'financier',
        lastName: 'financier',
        role: UserRoles.financier,
        password: 'password'
    },
    maxUsersInRoom: 5,
    minUserInRoom: 2,
    waitingRoomTime: 1000 * 60 * 5,
    maxStepTime: 1000 * 60, // время ожидания хода
    rouletteRange:{
        from:0,
        to: 39
    },
    countOfCubes: 3,
    maxCubeValue: 6,
}