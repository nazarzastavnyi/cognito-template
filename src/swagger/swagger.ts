import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default (app) => {
  const options = new DocumentBuilder()
    .setTitle('Nest.js Cognito Template implementation')
    .setDescription('Nest.js Cognito Template implementation')
    .setVersion('1.0')
    .addTag('Template')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};
