import { SwaggerModule, DocumentBuilder, SwaggerDocument } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * setups the the swagger doc, by adding it to the current
 * express instance
 */
export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('ULMAX documentation')
        .setDescription('api documentation for various services gateways')
        .addBearerAuth()
        .setBasePath('api/external')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    if (process.env.NODE_ENV === 'production') {
        document.paths = removeInternalApiDefinitions(document.paths);
    }
    SwaggerModule.setup('api/docs', app, document);
}

/**
 * removes the internal api paths from the public swagger file
 * and cleans api auto generation for clent sdks
 */
export function removeInternalApiDefinitions(paths: object) {
    const reformatedPaths = {};
    const publicApis = Object.getOwnPropertyNames(paths).filter((v) => !(/api\/internal\//.test(v)));
    for (const publicApi of publicApis) {
        reformatedPaths[publicApi.replace('/api/external', '')] = paths[publicApi];
    }
    return reformatedPaths;
}