export const Tokens = Object.freeze({
  SOF: '<SOF>',
  EOF: '<EOF>',
  EQUALS: '=',
  SEMI: ';',
  DECLARATION: 'Declaration',
  NAME: 'Name',
  INT: 'Int',
  FLOAT: 'Float',
  STRING: 'String',
});

export type TokenKind = string;

export class Token {
  kind: TokenKind;
  value: string | number | null;
  mutable?: boolean;

  constructor(kind: TokenKind, value?: string | number, mutable?: boolean) {
    this.kind = kind;
    this.value = value || null;
    this.mutable = mutable;
  }
}
