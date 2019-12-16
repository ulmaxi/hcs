import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * setups the the swagger doc, by adding it to the current
 * express instance
 */
export function setupSwagger(app: INestApplication) {
    let options = new DocumentBuilder()
    .setTitle('ULMAX documentation')
    .setDescription('api documentation for various services gateways')
    .addBearerAuth('ULMAX_MPI_APIKEY_KEY'.toLowerCase(), 'header')
    .setVersion('1.0');
    if (process.env.NODE_ENV === 'production') {
        options = options.setHost('api.ulmax.tech');
    }
    const internalApiDoc = _internalDocs(app, options);
    SwaggerModule.setup('docs/swagger-internal-api', app, internalApiDoc);
    const externalApiDoc = _externalDocs(app, options);
    SwaggerModule.setup('docs/swagger-api', app, externalApiDoc);
}

/**
 * creates internal swagger documentation
 */
export function _internalDocs(app: INestApplication, baseOptions: DocumentBuilder) {
    const options = baseOptions
        .setBasePath('/')
        .build();
    return SwaggerModule.createDocument(app, options);
}

/**
 * creates cleaned external swagger documentation
 */
export function _externalDocs(app: INestApplication, baseOptions: DocumentBuilder) {
    const options = baseOptions
        .setBasePath('api/external')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    document.paths = removeInternalApiDefinitions(document.paths);
    return document;
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
