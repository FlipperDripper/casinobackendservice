import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Injectable,
    Param, Post,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwtAuth.guard";

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Injectable()
@Controller('cards')
class CardsController {
    constructor(
        // private readonly cardService:
    ) {}

    @Get('packs')
    getPacks(){

    }

    @Get('pack/:id')
    getPackById(@Param('id') id:number){}

    @Get('items')
    getItems(){}

    @Get('item/:id')
    getItemById(){}

    @Get('user/:id')
    getCardsByUserId(@Param('id') id:number){}

    @Get('/:id')
    getCardsById(@Param('id') id:number){}

    @Post('/transfer')
    transfer(){}
}