import { IJwtPayload } from "@auth/interfaces";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator((key: keyof IJwtPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return key ? request.user[key] : request.user
})