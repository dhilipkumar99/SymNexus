#!/usr/bin/env node
/**
 * Checks the /products task search against the current index: `npm run test:search`
 * (also run by `npm run sync:modelscore`, so a catalog or copy change that breaks search fails
 * the sync instead of reaching the site).
 *
 *   1. the index and src/data/modelscore.php list the same tasks;
 *   2. every task is the top result for its own title and in the top 3 for its own subtitle;
 *   3. every thesaurus entry finds at least one task (a dead entry is usually a typo);
 *   4. the queries below, the way people actually ask, find the task they mean.
 * When a task is renamed or removed, update its expected id in QUERIES.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const TaskSearch = require('../public/assets/js/task-search.js');

const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/assets/data/task-search.json'), 'utf8'));
const engine = TaskSearch.create(data);

// [query, expected task id, rank it must reach]. A trailing space marks a finished word.
const QUERIES = [
    ['churn ', 'predict/customer-churn', 1],
    ['customers cancelling their subscription ', 'predict/customer-churn', 1],
    ['chrun ', 'predict/customer-churn', 1],
    ['staff quitting ', 'predict/retention', 1],
    ['why are good people leaving ', 'predict/retention', 1],
    ['invocie ', 'extract/automated-invoicing', 1],
    ['scan paper invoices ', 'extract/automated-invoicing', 1],
    ['read receipts ', 'extract/expenses', 1],
    ['which machines will fial ', 'predict/predictive-maintenance', 1],
    ['machine breakdown ', 'predict/predictive-maintenance', 1],
    ['x-ray ', 'vision/medical-imaging', 1],
    ['chatbot for hr ', 'gen/hr-bots', 1],
    ['credit card scams ', 'sentinel/fraud-detection', 1],
    ['r&d ', 'predict/drug-rd', 1],
    ['m&a ', 'predict/investment-analysis', 1],
    ['resume screening ', 'predict/screening', 1],
    ['hire faster ', 'predict/cycle-time', 3],
    ['write blog posts ', 'gen/content-generation', 2],
    ['sql dashboard ', 'gen/data-search-visualization', 1],
    ['self driving ', 'vision/self-driving-vehicles', 1],
    ['crop yield ', 'forecast/yield-analysis', 2],
    ['electricity demand ', 'forecast/energy-demand-prediction', 1],
    ['gdpr personal data ', 'extract/data-compliance', 1],
    ['route support tickets ', 'extract/problem-identification-routing', 1],
    ['contract clauses ', 'extract/contract-review', 1],
    ['price insurance ', 'predict/insurance-quotes', 1],
    ['which leads will buy ', 'predict/lead-scoring', 1],
    ['marketing budget ', 'decide/romi', 2],
    ['construction safety hard hats ', 'vision/jobsite-safety', 1],
    ['find duplicate records ', 'sentinel/data-accuracy', 2],
    ['deman forcasting ', 'forecast/demand-forecasting', 1],
    ['forec', 'forecast/demand-forecasting', 1],
    ['personalisation ', 'match/personalization-marketing', 2],
    ['trading ', 'decide/algorithmic-trading', 1],
    ['robot ', 'decide/robotics', 1],
    ['angry callers ', 'voice/customer-service-sentiment', 1],
    ['I want something to help my sales team know what to do next ', 'predict/recommended-next-steps', 1],
];

const failures = [];
const fail = (msg) => failures.push(msg);
const rankOf = (query, id) => engine.search(query).results.findIndex((r) => r.id === id) + 1;

// 1. Index and catalog agree.
const php = fs.readFileSync(path.join(ROOT, 'src/data/modelscore.php'), 'utf8');
const catalog = [];
let key = null;
for (const line of php.split('\n')) {
    const k = line.match(/"key" => '([^']+)'/);
    if (k) key = k[1];
    const s = line.match(/"slug" => '([^']+)'/);
    if (s) catalog.push(`${key}/${s[1]}`);
}
const indexed = data.docs.map((d) => d.id);
catalog.filter((id) => !indexed.includes(id)).forEach((id) => fail(`not in the index: ${id} (run scripts/build-task-search.py)`));
indexed.filter((id) => !catalog.includes(id)).forEach((id) => fail(`in the index but not the catalog: ${id}`));

// 2. Every task can be found by its own words.
for (const d of data.docs) {
    const top = engine.search(d.title + ' ').results[0];
    const topTitle = top && data.docs.find((x) => x.id === top.id).title;
    if (topTitle !== d.title) fail(`"${d.title}" is not the top result for its own title (got ${top ? top.id : 'nothing'})`);
    const rank = rankOf(d.sub + ' ', d.id);
    if (!rank || rank > 3) fail(`${d.id} is not in the top 3 for its subtitle "${d.sub}" (rank ${rank || 'none'})`);
}

// 3. No dead thesaurus entries.
for (const group of [...data.synonyms, ...data.equivalents]) {
    for (const term of group) {
        if (!engine.search(term + ' ').results.length) fail(`thesaurus entry finds no task: "${term}"`);
    }
}

// 4. Real queries.
for (const [query, id, within] of QUERIES) {
    const rank = rankOf(query, id);
    if (!rank || rank > within) fail(`"${query.trim()}" should rank ${id} in the top ${within} (rank ${rank || 'none'})`);
}

if (failures.length) {
    console.error(`task search: ${failures.length} problem(s)\n  ` + failures.join('\n  '));
    process.exit(1);
}
console.log(`task search: ${data.docs.length} tasks, ${QUERIES.length} queries, all checks passed`);
