import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(){
        super(
            {
                datasources: {
                    db: {
                        url:'postgresql://postgres:123@172.18.0.2:5432/nest?schema=public'
                    }
                }
            }
        )
    }
}
