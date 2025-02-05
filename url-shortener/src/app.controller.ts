import { Controller, Get, Res } from "@nestjs/common";
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus";
import { Response } from "express";
import { join } from "path";

@Controller()
export class AppController {
  constructor(private health: HealthCheckService,
    private http: HttpHealthIndicator){}
  @Get('*')
  serveClient(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }


}