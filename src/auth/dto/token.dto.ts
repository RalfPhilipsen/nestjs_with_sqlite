import { ApiProperty } from "@nestjs/swagger";

export class TokenDto {
    @ApiProperty({ type: String, example: 'string' })
    accessToken: string;
}
