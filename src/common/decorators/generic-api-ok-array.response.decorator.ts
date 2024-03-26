import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponseDto } from '../dto/response.dto';

export const ApiOkDataResponseArray = <DataDto extends Type<unknown>>(data: {
  description: string;
  type: DataDto;
}) =>
  applyDecorators(
    ApiExtraModels(ApiResponseDto, data.type),
    ApiOkResponse({
      description: data.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(data.type) },
              },
            },
          },
        ],
      },
    }),
  );
