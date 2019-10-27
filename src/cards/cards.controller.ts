import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Injectable,
    Param, Post,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwtAuth.guard";
import {CardsService} from "./cards.service";
import {ancestorWhere} from "tslint";
import {PackDto} from "./dto/pack.dto";
import {ItemDto} from "./dto/item.dto";
import {CardDto} from "./dto/card.dto";

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Injectable()
@Controller('cards')
export class CardsController {
    constructor(
        private readonly cardService: CardsService
    ) {
    }

    @Post('create-pack')
    async createPack(@Body() packDto: PackDto){
        return await this.cardService.createPack(packDto)
    }

    @Post('create-item')
    async createItem(@Body() itemDto: ItemDto){
        return await this.cardService.createItem(itemDto)
    }

    @Post('create-card')
    async createCard(@Body() cardDto: CardDto){
        return await this.cardService.createCard(cardDto)
    }

    @Get('packs')
    async getPacks() {
        return await this.cardService.getPacks();
    }

    @Get('pack/:id')
    async getPackById(@Param('id') id: number) {
        return await this.cardService.getPackById(id);
    }

    @Get('items')
    async getItems() {
        return await this.cardService.getItems();
    }

    @Get('item/:id')
    async getItemById(@Param('id') id: number) {
        return await this.cardService.getItemById(id)
    }

    @Get('user/:id')
    async getCardsByUserId(@Param('id') id: number) {
        return await this.cardService.getCardsByUserId(id);
    }

    @Get('/:id')
    async getCardById(@Param('id') id: number) {
        return await this.cardService.getCardById(id);
    }

    @Post('/transfer')
    transfer() {
    }
}