/**
 * Utilities for generating and validating URL slugs
 */

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (except hyphens and spaces)
    .replace(/[\s_-]+/g, '-')  // Replace spaces, underscores and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length < 1 || slug.length > 100) return false;
  // Slug should contain lowercase alphanumeric and hyphens, no consecutive hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

export function sanitizeSlug(slug: string): string {
  const cleaned = generateSlug(slug);
  return cleaned || 'page';
}
