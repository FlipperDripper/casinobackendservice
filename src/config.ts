import {UserRoles} from "./users/users.entity";

export default {
    jwtSecret: 'secretKey',
    financier:{
        login: 'financier',
        firstName: 'financier',
        lastName: 'financier',
        role: UserRoles.financier,
        password: 'password'
    }
}