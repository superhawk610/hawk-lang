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

test('parse // parses integer assignment statement', t => {
  t.context.lexer.setInput('let a = 123;');
  t.deepEqual(t.context.lexer.parse(), [
    new Token(Tokens.SOF),
    new Token(Tokens.DECLARATION, undefined, true),
    new Token(Tokens.NAME, 'a'),
    new Token(Tokens.EQUALS),
    new Token(Tokens.INT, 123),
    new Token(Tokens.SEMI),
    new Token(Tokens.EOF),
  ]);
});

test('parse // parses float assignment statement', t => {
  t.context.lexer.setInput('let foo = 123.456;');
  t.deepEqual(t.context.lexer.parse(), [
    new Token(Tokens.SOF),
    new Token(Tokens.DECLARATION, undefined, true),
    new Token(Tokens.NAME, 'foo'),
    new Token(Tokens.EQUALS),
    new Token(Tokens.FLOAT, 123.456),
    new Token(Tokens.SEMI),
    new Token(Tokens.EOF),
  ]);
});

test('parse // throws on identifier starting with digit', t => {
  t.context.lexer.setInput('let 1foo;');
  t.throws<LexerError>(t.context.lexer.parse);
});

test('parse // parses string assignment statement', t => {
  t.context.lexer.setInput('let str = "foo";');
  t.deepEqual(t.context.lexer.parse(), [
    new Token(Tokens.SOF),
    new Token(Tokens.DECLARATION, undefined, true),
    new Token(Tokens.NAME, 'str'),
    new Token(Tokens.EQUALS),
    new Token(Tokens.STRING, 'foo'),
    new Token(Tokens.SEMI),
    new Token(Tokens.EOF),
  ]);
});

test('parse // throws on string with newline', t => {
  t.context.lexer.setInput('let str = "\n";');
  t.throws<LexerError>(t.context.lexer.parse);
  t.context.lexer.setInput('let str = "\r\n";');
  t.throws<LexerError>(t.context.lexer.parse);
});
