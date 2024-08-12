import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const Cookie = createParamDecorator((key: string, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest()
    return key && key in req.cookies ? req.cookies[key] : null
})