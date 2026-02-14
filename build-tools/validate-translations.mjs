#!/usr/bin/env node
/**
 * Translation Validation Script
 * Validates that all translation files have identical key structures
 * and reports missing translations
 * 
 * Run with: node build-tools/validate-translations.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, '../src/locales');
const BASE_LOCALE = 'en';

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function getAllKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(getAllKeys(obj[key], fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

function validateTranslations() {
    log('\n🔍 Translation Validation Report\n', 'cyan');

    // Read all locale files
    const localeFiles = fs.readdirSync(LOCALES_DIR).filter(file => file.endsWith('.json'));

    if (localeFiles.length === 0) {
        log('❌ No translation files found!', 'red');
        process.exit(1);
    }

    log(`Found ${localeFiles.length} translation files\n`, 'blue');

    // Load base translation
    const baseLocale = BASE_LOCALE + '.json';
    if (!localeFiles.includes(baseLocale)) {
        log(`❌ Base locale ${baseLocale} not found!`, 'red');
        process.exit(1);
    }

    const baseContent = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, baseLocale), 'utf-8'));
    const baseKeys = getAllKeys(baseContent).sort();

    log(`Base locale (${BASE_LOCALE}): ${baseKeys.length} keys\n`, 'green');

    let hasErrors = false;
    const results = [];

    // Validate each locale
    for (const file of localeFiles) {
        if (file === baseLocale) continue;

        const locale = file.replace('.json', '');
        const content = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, file), 'utf-8'));
        const keys = getAllKeys(content).sort();

        const missingKeys = baseKeys.filter(key => !keys.includes(key));
        const extraKeys = keys.filter(key => !baseKeys.includes(key));

        results.push({
            locale,
            totalKeys: keys.length,
            missingKeys,
            extraKeys,
            coverage: ((keys.length / baseKeys.length) * 100).toFixed(2),
        });

        if (missingKeys.length > 0 || extraKeys.length > 0) {
            hasErrors = true;
        }
    }

    // Display results
    log('─'.repeat(80), 'blue');
    log('Locale\t\tKeys\tCoverage\tStatus', 'cyan');
    log('─'.repeat(80), 'blue');

    for (const result of results) {
        const status = result.missingKeys.length === 0 && result.extraKeys.length === 0 ? '✅ OK' : '❌ ERRORS';
        const statusColor = status.includes('✅') ? 'green' : 'red';

        console.log(
            `${result.locale}\t\t${result.totalKeys}\t${result.coverage}%\t\t${colors[statusColor]}${status}${colors.reset}`
        );

        if (result.missingKeys.length > 0) {
            log(`  Missing ${result.missingKeys.length} keys:`, 'yellow');
            result.missingKeys.slice(0, 5).forEach(key => {
                log(`    - ${key}`, 'yellow');
            });
            if (result.missingKeys.length > 5) {
                log(`    ... and ${result.missingKeys.length - 5} more`, 'yellow');
            }
        }

        if (result.extraKeys.length > 0) {
            log(`  Extra ${result.extraKeys.length} keys (not in base):`, 'yellow');
            result.extraKeys.slice(0, 5).forEach(key => {
                log(`    + ${key}`, 'yellow');
            });
            if (result.extraKeys.length > 5) {
                log(`    ... and ${result.extraKeys.length - 5} more`, 'yellow');
            }
        }
    }

    log('─'.repeat(80) + '\n', 'blue');

    // Summary
    const totalLocales = results.length;
    const validLocales = results.filter(r => r.missingKeys.length === 0 && r.extraKeys.length === 0).length;

    log('Summary:', 'cyan');
    log(`  Total locales: ${totalLocales}`, 'blue');
    log(`  Valid: ${validLocales}`, validLocales === totalLocales ? 'green' : 'yellow');
    log(`  With errors: ${totalLocales - validLocales}`, totalLocales - validLocales > 0 ? 'red' : 'green');

    if (hasErrors) {
        log('\n❌ Translation validation FAILED!', 'red');
        log('Some locales have missing or extra translation keys.', 'red');
        log('Please ensure all translation files have identical key structures.\n', 'yellow');
        process.exit(1);
    } else {
        log('\n✅ All translations are valid!', 'green');
        log('All locales have identical key structures.\n', 'green');
        process.exit(0);
    }
}

// Run validation
try {
    validateTranslations();
} catch (error) {
    log(`\n❌ Error during validation: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
}
