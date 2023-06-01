import { Controller, Get, Inject, Post, Req, Res } from "@nestjs/common";
import { X509Certificate } from "crypto";
import { Request, Response } from "express";
import constants from "src/idp/constants";
import {
  IdpUser,
  IIdentityProviderService,
  IUpdateUserRequest,
} from "src/idp/types";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(constants.IDENTITY_PROVIDER_SERVICE)
    private IDPService: IIdentityProviderService,
  ) {}

  @Post("login")
  async setCookie(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization;
    console.log(token);
    try {
      const user = await this.IDPService.verify(token);
      console.log(user);
      if (!user) {
        res.status(400).json({ msg: "Login Failed" });
      }
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 30000000),
      });
      res.status(200).json({ msg: "Successfully login" });
    } catch (error) {
      res.status(400).json({ msg: "Login Failed" });
    }
  }

  @Post("logout")
  async removeCookie(@Req() req: Request, @Res() res: Response) {
    res.clearCookie("token");
    res.status(200).json({ msg: "Log Out Successfully" });
  }
}
