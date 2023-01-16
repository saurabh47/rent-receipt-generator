import { HttpService } from '@nestjs/axios';
import { Injectable, StreamableFile } from '@nestjs/common';

@Injectable()
export class AppService {

  constructor(private readonly httpService: HttpService) { }

  getHello() {
    return { message: 'Hello World!' };
  }

  private saveDetail(receipt) {
    //TODO: Save details to DB
    // Also store start & end to selected duration
    console.log({
      "userName": receipt.userName,
      "ownerName": receipt.ownerName,
      "ownersPan": receipt.ownersPan,
      "startDate": receipt.startDate,
      "endDate": receipt.endDate,
      "receiptDate": receipt.receiptDate,
      "receiptMonth": receipt.receiptMonth,
      "monthlyRent": receipt.monthlyRent,
      "address": receipt.address,
      "pan": receipt.pan
    });
  }

  async generateReceipts(details: { receipts: any[], ownerSignature: string}) {
    
    this.saveDetail(details.receipts[0]);
    
    const generateReceiptRequest = await this.httpService.post('https://pdfgen.app/api/generate?templateId=4514529',
      {
        "data": details
      }, {
      headers: {
        "api_key": "noLxnIYLCn4EZJs4JH8u3"
      },
      responseType: "stream"
    }).toPromise();
    const result = await new StreamableFile(generateReceiptRequest.data);
    return result;
  }
}
