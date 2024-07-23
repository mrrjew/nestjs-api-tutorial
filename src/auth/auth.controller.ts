import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('test')
    test() {
        return 'Server is healthy';
    }
    
    @Post('signup') 
    signup(@Body() dto:AuthDto) {
        return this.authService.signup(dto);
    }
    
    @Post('signin')
    signin(){
        return this.authService.signin();
    }
}
