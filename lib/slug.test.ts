import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSlug, isValidSlug, sanitizeSlug } from './slug';

test('generateSlug converts strings to valid url-safe slugs', () => {
  assert.equal(generateSlug('Halaman Utama & Profil!'), 'halaman-utama-profil');
  assert.equal(generateSlug('   Landing Page 2026   '), 'landing-page-2026');
  assert.equal(generateSlug('Promosi_Hebat___Jualan'), 'promosi-hebat-jualan');
});

test('isValidSlug accurately checks format', () => {
  assert.equal(isValidSlug('hello-world'), true);
  assert.equal(isValidSlug('page123'), true);
  assert.equal(isValidSlug('test-page-45'), true);
  assert.equal(isValidSlug('Hello-World'), false); // Uppercase not allowed
  assert.equal(isValidSlug('hello--world'), false); // Double hyphens not allowed
  assert.equal(isValidSlug('-hello'), false); // Leading hyphen not allowed
  assert.equal(isValidSlug('hello-'), false); // Trailing hyphen not allowed
  assert.equal(isValidSlug(''), false); // Empty string not allowed
});

test('sanitizeSlug provides fallback for blank or invalid strings', () => {
  assert.equal(sanitizeSlug(''), 'page');
  assert.equal(sanitizeSlug('   '), 'page');
  assert.equal(sanitizeSlug('###'), 'page');
  assert.equal(sanitizeSlug('Promosi Khas!'), 'promosi-khas');
});
