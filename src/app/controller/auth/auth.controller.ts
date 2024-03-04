import {
    Controller,
    Post,
    Body,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDTO } from 'src/app/dto/user';
import { LoginResponseData } from 'src/app/interface/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiBody({ type: UserLoginDTO })
    @ApiResponse({
        status: 201,
        description: 'Login successful',
    })
    @ApiResponse({
        status: 500,
        description: 'An internal error occured',
    })
    async login(
        @Body() userLoginDTO: UserLoginDTO,
    ): Promise<any> {
        return this.authService.login(userLoginDTO);
    }

}