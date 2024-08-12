import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon2 from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

// import {User,BookMark} from "@prisma/client"

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config:ConfigService){}

    async signup(dto:AuthDto){
        try{
            const hash = await argon2.hash(dto.password)

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash
            }
        })

        delete user.hash

        return user
        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error;
        }

    }
    
    async signin(dto:AuthDto){
        const user = await this.prisma.user.findUnique({
            where: {
                email:dto.email
            }
        })

        if(!user){
            throw new ForbiddenException('Credentials incorrect')
        }

        const pwMatches = await argon2.verify(user.hash, dto.password)

        if(!pwMatches){
            throw new ForbiddenException('Credentials incorrect')
        }

        delete user.hash

        return user
    }

    async signToken(userId:number,email:string):Promise<string>{
        const payload = {
            sub:userId,
            email
        }

        const secret = this.config.get('JWT_SECRET')
        return this.jwt.signAsync(payload,{
            expiresIn:'15m',
            secret
        })
    }
}