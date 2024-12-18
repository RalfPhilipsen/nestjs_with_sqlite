import { ApiProperty } from "@nestjs/swagger";
import { QueryPriceSubunitDto } from "./query-price-subunit.dto";
import { IsOptional, IsString, ValidateNested } from "class-validator";

export class QueryProductDto {
    @ApiProperty({ type: String, name: 'name', example: 'product1', required: false })
    @IsString()
    @IsOptional()
    name: string

    @ApiProperty({ type: QueryPriceSubunitDto, required: false })
    @IsOptional()
    @ValidateNested()
    price_subunit: QueryPriceSubunitDto
}
