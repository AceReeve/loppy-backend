import { Module } from '@nestjs/common';
import { AbstractUserService } from 'src/app/interface/user';
import { AbstractUserRepository } from 'src/app/interface/user';
import { UserController } from 'src/app/controller/user/user.controller';
import { UserRepository } from 'src/app/repository/user/user.repository';
import { UserService } from 'src/app/services/user/user.service';
import { UserSchemaModule } from 'src/app/models/user/user.schema.module';
import { RoleSchemaModule } from 'src/app/models/role/role.schema.module';
import { JwtService } from '@nestjs/jwt';
@Module({
    imports: [
        UserSchemaModule,
        RoleSchemaModule
    ],
    controllers: [UserController],
    providers: [
        {
            provide: AbstractUserRepository,
            useClass: UserRepository,
        },
        {
            provide: AbstractUserService,
            useClass: UserService,
        },
        JwtService
    ],

    exports: [
        {
            provide: AbstractUserService,
            useClass: UserService,
        },

    ],
})
export class UserModule { }
