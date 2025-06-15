import { DMMF, generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import * as fs from 'fs';

const toSnakeCase = (str: string): string => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // Add _ between camelCase words
    .replace(/[\s-]+/g, '_') // Replace spaces and hyphens with _
    .toLowerCase();
};

const mapPrismaToTsType = (prismaType: string, prismaEnums: DMMF.DatamodelEnum[]): string => {
  const typeMap: Record<string, string> = {
    String: 'string',
    Boolean: 'boolean',
    Int: 'number',
    Float: 'number',
    DateTime: 'Date',
    Json: 'Record<string, any>',
    Decimal: 'number',
    BigInt: 'bigint',
  };

  // If the type is an enum, use the enum name
  if (prismaEnums.some(e => e.name === prismaType)) {
    return prismaType;
  }

  return typeMap[prismaType] || 'any';
};

const createEnums = (prismaEnums: DMMF.DatamodelEnum[]): string => {
  let enumContent = '';

  if (prismaEnums.length > 0) {
    for (const en of prismaEnums) {
      enumContent += `export enum ${en.name} {\n`;
      for (const value of en.values) {
        enumContent += `  ${value.name} = '${value.name}',\n`;
      }
      enumContent += '}\n\n';
    }
  }

  return enumContent;
};

const createTableType = (modelName: string, modelFields: DMMF.Field[], prismaEnums: DMMF.DatamodelEnum[]): string => {
  let getTypeContent = `export type ${modelName}Table = {\n`;

  for (const field of modelFields) {
    // Exclude relations
    if (field.kind === 'object' || field.relationName) continue;

    const tsType = mapPrismaToTsType(field.type, prismaEnums);

    if (field.type === 'DateTime') {
      getTypeContent += `  ${field.name}: ColumnType<Date, Date | string | undefined, Date | string>;\n`;
    } else if (field.hasDefaultValue) {
      getTypeContent += `  ${field.name}: Generated<${field.isRequired ? tsType : `${tsType} | null`}>;\n`;
    } else {
      getTypeContent += `  ${field.name}: ${field.isRequired ? tsType : `${tsType} | null`};\n`;
    }
  }

  getTypeContent += '};\n';

  return getTypeContent;
};

const createDBType = (prismaModels: DMMF.Model[], sourceFile: string): string => {
  let DBTypeContent = '';

  if (sourceFile.includes('public.prisma')) {
    DBTypeContent = `export type PublicDB = {\n`;
  } else if (sourceFile.includes('tenant.prisma')) {
    DBTypeContent = `export type TenantDB = {\n`;
  } else {
    DBTypeContent = `export type DB = {\n`;
  }

  for (const model of prismaModels) {
    DBTypeContent += `  ${toSnakeCase(model.dbName || '')}: ${model.name}Table;\n`;
  }

  DBTypeContent += `};\n`;

  return DBTypeContent;
};

const onGenerate = async (options: GeneratorOptions) => {
  const outputFile = options.generator.output?.value;
  const sourceFile = options.generator.sourceFilePath;

  if (!outputFile) {
    throw new Error('Output file is not specified in the generator options.');
  }

  let fileContent = `// Auto-generated CRUD types for Kysely
// Generated at ${new Date().toISOString()}

import type { ColumnType, Generated, Selectable, Insertable, Updateable } from 'kysely';

`;

  const prismaEnums = [...options.dmmf.datamodel.enums];
  const prismaModels = [...options.dmmf.datamodel.models];

  fileContent += createEnums(prismaEnums);

  for (const model of prismaModels) {
    const modelName = model.name;
    const modelFields = [...model.fields];

    fileContent += createTableType(modelName, modelFields, prismaEnums);
    fileContent += `export type ${modelName}GetOutput = Selectable<${modelName}Table>;\n`;
    fileContent += `export type ${modelName}CreateInput = Insertable<${modelName}Table>;\n`;
    fileContent += `export type ${modelName}UpdateInput = Updateable<${modelName}Table>;\n\n`;
  }

  fileContent += createDBType(prismaModels, sourceFile);

  fs.writeFileSync(outputFile, fileContent);

  await Promise.resolve();
};

generatorHandler({ onGenerate });
