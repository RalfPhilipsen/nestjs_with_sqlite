
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ example: 'user1', required: false, type: String })
    @IsString()
    @IsOptional()
    username: string;
}
