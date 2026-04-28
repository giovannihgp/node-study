import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProxyService {
    private readonly logger = new Logger(ProxyService.name);

    constructor(private readonly httpService: HttpService) {}
}
