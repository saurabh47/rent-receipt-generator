import { Body, Controller, Get, Post, StreamableFile, Response } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post('generate-receipts')
  async generateReceipts(@Body() details, @Response({ passthrough: true }) res): Promise<StreamableFile> {
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=receipt.pdf`
    });

    return this.appService.generateReceipts(details);
  }

}
