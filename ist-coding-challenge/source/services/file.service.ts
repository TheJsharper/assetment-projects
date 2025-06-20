import { readFile } from 'fs';
import path from 'path';


export interface Country {
    countryCode: string;
    regex: string;
}


export class FileService {

    public static readonly  path = path.join(__dirname, '../../resources/countries-regex-list.json');

   
    
    public async readCountries(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            readFile(filePath, 'utf8', (err: any, data: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }    
    public async lodCountries(): Promise<Country[]> {
        try {
            const data = await this.readCountries(FileService.path);
            return JSON.parse(data) as Country[];
        } catch (error) {
            throw error;
        }
    }


}