import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class RoleGuard implements CanActivate {
  private rolesPassed: string[];
  constructor(roles: string[]) {
    this.rolesPassed = roles;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    return this.rolesPassed.includes(ctx.req.user.role);
    // return ctx.req.user.role == this.rolePassed;
  }
}
