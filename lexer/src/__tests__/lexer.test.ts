import anyTest, { TestInterface } from 'ava';

import { Lexer } from '..';
import { LexerError } from '../errors';
import { Token, Tokens } from '../token';

interface Context {
  lexer: Lexer;
}

const test = anyTest as TestInterface<Context>;

test.beforeEach(t => {
  t.context = {
    lexer: new Lexer(),
  };
});

test("doesn't throw on empty constructor", t => {
  t.truthy(t.context.lexer);
  t.is(t.context.lexer.input, null);
});

test('parse // throws on no input', t => {
  t.throws<LexerError>(t.context.lexer.parse);
});

test('parse // parses whitespace', t => {
  t.context.lexer.setInput('    ');
  t.deepEqual(t.context.lexer.parse(), [
    new Token(Tokens.SOF),
    new Token(Tokens.EOF),
  ]);
});

test('parse // parses variable declaration', t => {
  t.context.lexer.setInput('let a;');
  t.deepEqual(t.context.lexer.parse(), [
    new Token(Tokens.SOF),
    new Token(Tokens.DECLARATION, undefined, true),
    new Token(Tokens.NAME, 'a'),
    new Token(Tokens.SEMI),
    new Token(Tokens.EOF),
  ]);
});
