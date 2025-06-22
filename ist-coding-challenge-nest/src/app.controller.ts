import { Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Test')
@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/getAll')
  @ApiOperation({ summary: 'Get all data from this api' })
  @ApiResponse({
    status: 200,
    description: 'All Data list',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 5,
            description: 'this is an unique key', required: [],
          },
          name: {
            type: 'string',
            example: 'test',
            description: ' this is a simple test name'
          }
        },

      }



    }
  })
  @ApiResponse({
    status: 203,
    description: 'Forbitten access for unregistered users'
  })
  @ApiResponse({
    status: 500,
    description: 'Intermal server error'
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/create')
  @ApiOperation({ summary: 'create a new dataset set record' })
  @ApiBody({

    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 5,
          description: 'this is an unique key'
        },
        name: {
          type: 'string',
          example: 'test',
          description: ' this is a simple test name'
        }
      },
    }

  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    required: true
  })
  @ApiResponse({
    status: 401,
    description: 'Operation is succesfully been saved on the recorrd list'
  })
  @ApiResponse({
    status: 403,
    description: 'This operation is not acces for unregistered users'
  })
  save(): string {
    return 'saved...';
  }

  @Put('/create/:id')
  @ApiOperation({ summary: 'update an dataset on the registered' })
  @ApiBody({

    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 5,
          description: 'this is an unique key', required: [],
        },
        name: {
          type: 'string',
          example: 'test',
          description: ' this is a simple test name'
        }
      },
    }

  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Operation is successfully been updated on the record list'
  })
  @ApiResponse({
    status: 403,
    description: 'This operation is not access for unregistered users'
  })
  upadate(id: number, @Req() request: Request): string {
    console.log("Request Object", request.params, request)
    return 'updated...';
  }

  @Delete('/create/:id')
  @ApiOperation({ summary: 'Delete an dataset from  record list' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Operation removes an dataset from record list based by given id'
  })
  @ApiResponse({
    status: 403,
    description: 'This operation is not access for unregistered users'
  })
  delete(id: number): string {
    return 'deleted...';
  }

}
