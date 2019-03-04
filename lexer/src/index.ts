import { Token, Tokens } from './token';
import { LexerError } from './errors';

type AST = Token[];

export class Lexer {
  private pos: number = 0;
  private len: number = 0;
  public input: string | null = null;
  public tree: AST = [];

  constructor(input?: string) {
    if (input) {
      this.input = input;
      this.len = input.length;
    }
  }

  public setInput(input: string): void {
    this.input = input;
    this.len = input.length;
  }

  public parse(): AST {
    if (!this.input) throw new LexerError('No input provided');

    this.pos = 0;
    this.tree = [new Token(Tokens.SOF)];

    do {
      this.readToken();
    } while (this.pos < this.len);

    return this.tree;
  }

  private readToken(): void {
    this.skipWhitespace();
    if (this.pos >= this.len) {
      this.tree.push(new Token(Tokens.EOF));
      return;
    }

    const code = this.input!.charCodeAt(this.pos);
    switch (code) {
      case 61 /* = */:
        this.tree.push(new Token(Tokens.EQUALS));
      case 59 /* ; */:
        this.tree.push(new Token(Tokens.SEMI));
      case 34 /* " */:
      case 39 /* ' */:
        this.pos++;
        this.tree.push(this.readString());
      case 65 /* A */:
      case 66 /* B */:
      case 67 /* C */:
      case 68 /* D */:
      case 69 /* E */:
      case 70 /* F */:
      case 71 /* G */:
      case 72 /* H */:
      case 73 /* I */:
      case 74 /* J */:
      case 75 /* K */:
      case 76 /* L */:
      case 77 /* M */:
      case 78 /* N */:
      case 79 /* O */:
      case 80 /* P */:
      case 81 /* Q */:
      case 82 /* R */:
      case 83 /* S */:
      case 84 /* T */:
      case 85 /* U */:
      case 86 /* V */:
      case 87 /* W */:
      case 88 /* X */:
      case 89 /* Y */:
      case 90 /* Z */:
      case 95 /* _ */:
      case 97 /* a */:
      case 98 /* b */:
      case 99 /* c */:
      case 100 /* d */:
      case 101 /* e */:
      case 102 /* f */:
      case 103 /* g */:
      case 104 /* h */:
      case 105 /* i */:
      case 106 /* j */:
      case 107 /* k */:
      case 108 /* l */:
      case 109 /* m */:
      case 110 /* n */:
      case 111 /* o */:
      case 112 /* p */:
      case 113 /* q */:
      case 114 /* r */:
      case 115 /* s */:
      case 116 /* t */:
      case 117 /* u */:
      case 118 /* v */:
      case 119 /* w */:
      case 120 /* x */:
      case 121 /* y */:
      case 122 /* z */:
        this.tree.push(this.readDeclarationOrName());
      case 48 /* 0 */:
      case 49 /* 1 */:
      case 50 /* 2 */:
      case 51 /* 3 */:
      case 52 /* 4 */:
      case 53 /* 5 */:
      case 54 /* 6 */:
      case 55 /* 7 */:
      case 56 /* 8 */:
      case 57 /* 9 */:
        this.tree.push(this.readNumber());
      default:
        throw new LexerError(
          `Encountered unrecognized character ${String.fromCharCode(code)}`,
        );
    }
    console.log('read', this.tree[this.tree.length - 1]);
  }

  private skipWhitespace(): void {
    while (this.pos < this.len) {
      const code = this.input!.charCodeAt(this.pos);
      if (
        code === 9 /* tab */ ||
        code === 32 /* space */ ||
        code === 13 /* carriage return */ ||
        code === 10 /* newline */
      ) {
        this.pos++;
      } else {
        break;
      }
    }
  }

  private readDeclarationOrName(): Token {
    if (
      this.input!.charCodeAt(this.pos) === 108 /* l */ &&
      this.input!.charCodeAt(this.pos + 1) === 101 /* e */ &&
      this.input!.charCodeAt(this.pos + 2) === 116 /* t */
    ) {
      return new Token(Tokens.DECLARATION, undefined, true);
    }
    return this.readName();
  }

  private readName(): Token {
    const start = this.pos++;
    let code = 0;
    while (
      this.pos < this.len &&
      (code = this.input!.charCodeAt(this.pos)) !== NaN &&
      (code === 95 /* _ */ ||
      (code >= 48 && code <= 57) /* 0-9 */ ||
      (code >= 65 && code <= 90) /* A-Z */ ||
        (code >= 97 && code <= 122)) /* a-z */
    ) {
      this.pos++;
    }
    return new Token(Tokens.NAME, this.input!.slice(start, this.pos));
  }

  private readNumber(): Token {
    return new Token(Tokens.INT, -1);
  }

  private readDigits(): void {
    // if a character is encountered, throw a LexerError(identifiers can't start with a digit)
  }

  private readString(): Token {
    return new Token(Tokens.STRING, '-1');
  }
}
