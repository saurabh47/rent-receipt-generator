import { HttpService } from '@nestjs/axios';
import { Injectable, StreamableFile } from '@nestjs/common';

@Injectable()
export class AppService {

  constructor(private readonly httpService: HttpService) { }

  getHello() {
    return { message: 'Hello World!' };
  }

  async generateReceipts(details) {
    console.log(details);//

    const generateReceiptRequest = await this.httpService.post('https://pdfgen.app/api/generate?templateId=5648470',
      {
        "data":
        {
          "userName": details.userName,
          "ownerName": details.ownerName,
          "ownersPan": details.ownersPan,
          "startDate": details.startDate,
          "endDate": details.endDate,
          "receiptDate": details.receiptDate,
          "receiptMonth": details.receiptMonth,
          "monthlyRent": details.monthlyRent,
          "address": details.address,
          "pan": details.pan
        }
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
