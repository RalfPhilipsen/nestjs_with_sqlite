import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class QueryPriceSubunitDto {
    @ApiProperty({ type: Number, name: 'price_subunit[gte]', example: 10, required: false })
    @IsNumber()
    @IsOptional()
    gte: number;

    @ApiProperty({ type: Number, name: 'price_subunit[lte]', example: 10000, required: false })
    @IsNumber()
    @IsOptional()
    lte: number;
}
