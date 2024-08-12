import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const UserAgent = createParamDecorator((_, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest()
    const userAgent = req.headers['user-agent'];
    if(!userAgent) throw new BadRequestException('User-Agent заголовок отсутствует');
    return userAgent
})