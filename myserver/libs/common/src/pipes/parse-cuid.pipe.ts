import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import {isCuid} from '@paralleldrive/cuid2';

@Injectable()
export class ParseCuidPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string' && isCuid(value)) {
      return value;
    } 
    throw new BadRequestException('Неправильный формат CUID');
  }
}
