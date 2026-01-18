export type OrmType = 'typeorm' | 'prisma' | 'mongoose';

export class OrmTypeValue {
  private static readonly VALID_ORMS: OrmType[] = ['typeorm', 'prisma', 'mongoose'];

  constructor(public readonly value: OrmType) {
    if (!OrmTypeValue.VALID_ORMS.includes(value)) {
      throw new Error(`Invalid ORM type: ${value}. Must be one of: ${OrmTypeValue.VALID_ORMS.join(', ')}`);
    }
  }

  static fromString(value: string): OrmTypeValue {
    return new OrmTypeValue(value as OrmType);
  }
}
