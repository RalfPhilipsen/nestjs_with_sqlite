import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class QueryPriceSubunitDto {
    @ApiProperty({ type: Number, name: 'price_subunit[gte]', example: 10, required: true })
    @IsNumber()
    @IsNotEmpty()
    gte: number;

    @ApiProperty({ type: Number, name: 'price_subunit[lte]', example: 10000, required: true })
    @IsNumber()
    @IsNotEmpty()
    lte: number;
}
