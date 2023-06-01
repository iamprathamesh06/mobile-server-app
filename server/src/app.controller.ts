import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/hello")
  getHello(@Req() request: Request, @Res() response: Response) {
    console.log("in hello route : " + request["user"]);
    response.send("Hello " + request["user"]?.email + "!");
  }

  @Get("/")
  getHome(){
    return "Hello";
  }

  // @Post('create')
  // addUser(@Body() userData) {
  //   return this.IDPService.createUser(userData);
  // }
}
