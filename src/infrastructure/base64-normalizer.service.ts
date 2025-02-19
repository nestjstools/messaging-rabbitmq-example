import { Injectable } from '@nestjs/common';
import {
  MessagingNormalizer, MessageNormalizer,
} from '@nestjstools/messaging';
import { Buffer } from 'buffer';

@Injectable()
@MessagingNormalizer()
export class Base64Normalizer implements MessageNormalizer {
  denormalize(message: string | object, type: string): Promise<object> {
    if (typeof message === 'object') {
      throw new Error('Message must be a string!');
    }
    console.log(message); // here is base64
    const decoded = Buffer.from(message, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  }

  normalize(message: object, type: string): Promise<string> {
    const jsonString = JSON.stringify(message);
    const encoded =  Buffer.from(jsonString, 'utf-8').toString('base64');
    console.log(encoded); // here is base64
    return Promise.resolve(encoded);
  }
}
