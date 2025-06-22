import { Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { request, RequestOptions } from 'https'
export interface CheckVatRequest {
    countryCode: string;
    vatNumber: string;
}

export interface CheckVatResponse {
    countryCode: string;
    vatNumber: string;
    requestDate: string;
    format: string
    valid: boolean;
    requestIdentifier: string;
    name: string;
    address: string;
    traderName: string;
    traderStreet: string;
    traderPostalCode: string;
    traderCity: string;
    traderCompanyType: string;
}

@Injectable()
export class ValidationExternalReqService {

    public static readonly host = 'ec.europa.eu';

    private _path: string;

    public get path(): string {
        return this._path;
    }

    public set path(value) {
        this._path = value;
    }

    constructor() {
        this._path = '/taxation_customs/vies/rest-api//check-vat-number';
    }




    async validateVatRequest(req: CheckVatRequest): Promise<Partial<CheckVatResponse>> {

        if (!req) return await Promise.reject(new Error(`Error passing payload`));

        const payload = JSON.stringify({ ...req });


        const result = await new Promise<Partial<CheckVatResponse>>((resolve: (value: Partial<CheckVatResponse>) => void, reject: (reason?: any) => void) => {

            const headers = {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
            }

            const post_options: RequestOptions = {
                host: ValidationExternalReqService.host,
                path: this.path,
                method: 'POST',
                headers
            };


            const httpsRequest = request(post_options, (res) => this.getInCommingMessage(resolve, reject)(res));

            httpsRequest.on('error', (err: Error) => reject(new Error(`statuscode ===>: ${err.message}`)));

            httpsRequest.write(payload);

            httpsRequest.end();

        });


        return result;
    }

    private getInCommingMessage(resolve: (value: Partial<CheckVatResponse>) => void, reject: (reason?: any) => void): (res: IncomingMessage) => void {
        return (res: IncomingMessage) => {

            res.setEncoding('utf-8');

            if (res.statusCode !== 200) reject(new Error(`statuscode:====>x ${res.statusCode}`));

            const chunks: Array<string> = [];

            res.on('data', (chunch) => chunks.push(chunch))

            res.on('end', () => {
                try {

                    resolve(JSON.parse(chunks.join()) as Partial<CheckVatResponse>);

                } catch (err) {

                    const message = chunks.join();

                    reject(new Error(`redirect HTML or failed  ${message}` ))
                }

            })

            res.on('error', (err: Error) => reject(new Error(`statuscode: ${err.message}`)))
        }
    }



}