import { ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigEnum } from "src/config-enum";


const jwtModuleOptions = (config: ConfigService): JwtModuleOptions =>{
    return ({
        secret: config.get(ConfigEnum.JWT_SECRET),
        signOptions: {
            expiresIn: config.get(ConfigEnum.JWT_EXP)
        }
    })
} 

export const options = ():JwtModuleAsyncOptions => ({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => jwtModuleOptions(configService)
})