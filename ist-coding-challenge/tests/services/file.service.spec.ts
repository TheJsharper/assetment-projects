import { FileService } from "../../source/services/file.service";


describe("FileService test suite", () => {
    let fileService: FileService;


    beforeEach(() => {
        fileService = new FileService();
    });

    it('should be defined', () => {
        expect(fileService).toBeDefined();
    });

    it('should read a file successfully', async () => {
        const data = await fileService.readCountries(FileService.path);
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
    });

    
    it('should throw an error when reading a non-existent file', async () => {
        await expect(fileService.readCountries('path/to/non-existent-file.json')).rejects.toThrow();
    });

    it('should load countries from file', async () => {
        const countries = await fileService.lodCountries();
        expect(countries).toBeDefined();
        expect(countries.length).toBeGreaterThan(0);
    });

    it('should throw an error when loading countries from a non-existent file', async () => {
        jest.spyOn(fileService, 'readCountries').mockImplementation(() => {
            throw new Error('File not found');
        });
        await expect(fileService.lodCountries()).rejects.toThrow('File not found');
    });
});
