import { ApiProperty } from "@nestjs/swagger";
import { QueryPriceSubunitDto } from "./query-price-subunit.dto";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class QueryProductDto {
    @ApiProperty({ type: String, name: 'name', example: 'product1', required: true })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ type: QueryPriceSubunitDto, required: true })
    @IsNotEmpty()
    @ValidateNested()
    price_subunit: QueryPriceSubunitDto
}
