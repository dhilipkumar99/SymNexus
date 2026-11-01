/**
 * Task search for /products: ranks the SymNexus tasks against a free-text query, in the browser,
 * with no server or AI service. site.js loads the index (public/assets/data/task-search.json, built
 * by scripts/build-task-search.py) and calls SymNexusTaskSearch.create(index).search(query).
 *
 * How a query is understood:
 *   - words are normalised and stemmed, so "predicting", "predictive" and "prediction" all match;
 *   - phrases and words in the thesaurus (src/data/task-search-terms.txt) also find their
 *     synonyms, so "attrition" finds Customer Churn and "call center" finds Customer Service;
 *   - misspelt words are corrected against the index vocabulary ("invocie" → invoice);
 *   - the word still being typed matches as a prefix ("forec" → forecast);
 *   - tasks are ranked with BM25F over the title, subtitle, department, product and page copy,
 *     favouring tasks that match every part of the query and match it in their title.
 */
(function (root) {
    'use strict';

    // Field weights (w) and length normalisation (b) for BM25F; K1 sets how fast repeats saturate.
    var FIELDS = {
        title:   { w: 8,   b: 0.3 },
        sub:     { w: 4,   b: 0.4 },
        dept:    { w: 3,   b: 0.2 },
        lede:    { w: 2,   b: 0.6 },
        body:    { w: 1,   b: 0.75 },
        product: { w: 0.8, b: 0.5 }
    };
    var K1 = 2;
    var SYNONYM_WEIGHT = 0.7;   // a synonym counts a little less than the word itself
    var PREFIX_WEIGHT = 0.9;    // the word still being typed
    var PARTIAL_PHRASE = 0.4;   // a typed phrase with only some of its words in the task
    var PHRASE_BONUS = 0.25;    // per extra word of a thesaurus phrase found in the query
    var MAX_PREFIXES = 40;
    var MIN_RELATIVE = 0.12;    // drop results scoring under this share of the best one

    // ── Text ─────────────────────────────────────────────────────────────────
    // Must match normalize()/words() in scripts/build-task-search.py.
    function normalize(text) {
        return String(text).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
            .replace(/[‘’]/g, "'")
            .replace(/\b([a-z])&([a-z])\b/g, '$1$2')
            .replace(/[^a-z0-9']+/g, ' ');
    }

    /** Every word in the text, stopwords included (phrases need them). */
    function rawWords(text) {
        var out = [];
        normalize(text).split(' ').forEach(function (w) {
            w = w.replace(/^'+|'+$/g, '').replace(/'s$/, '');
            if (w.length > 1 && !/^\d+$/.test(w)) out.push(w);
        });
        return out;
    }

    // ── Stemmer ──────────────────────────────────────────────────────────────
    // A compact Porter-style stemmer. It only has to be consistent (index and query go through
    // the same function), so it favours conflating the forms people actually type.
    var STEP2 = [
        ['ization', 'ize'], ['isation', 'ize'], ['ification', 'ifi'], ['ational', 'ate'],
        ['iveness', 'ive'], ['fulness', 'ful'], ['ousness', 'ous'], ['biliti', 'ble'],
        ['iviti', 'ive'], ['aliti', 'al'], ['ation', 'ate'], ['ator', 'ate'], ['ically', 'ic'], ['alli', 'al']
    ];
    // [suffix, shortest stem allowed to remain]
    var STEP3 = [
        ['ement', 5], ['ment', 5], ['ness', 3], ['ance', 3], ['ence', 3], ['able', 4], ['ible', 4],
        ['sion', 3], ['tion', 3], ['ful', 3], ['ous', 3], ['ive', 3], ['ize', 3], ['ise', 3],
        ['ate', 4], ['iti', 3], ['ism', 3], ['al', 4], ['li', 5]
    ];
    var stemCache = new Map();

    function hasVowel(s) { return /[aeiouy]/.test(s); }

    function stem(word) {
        var cached = stemCache.get(word);
        if (cached !== undefined) return cached;
        var w = word;
        if (w.length > 3) {
            if (w.length > 5) w = w.replace(/([a-z]{3})our$/, '$1or');          // colour → color
            if (/sses$/.test(w)) w = w.slice(0, -2);
            else if (/ies$/.test(w)) w = w.length > 4 ? w.slice(0, -2) : w.slice(0, -1);
            else if (/[^sui]s$/.test(w)) w = w.slice(0, -1);

            var m = /^(.*?)(ing|ed)$/.exec(w);
            if (m && m[1].length >= 3 && hasVowel(m[1])) {
                w = m[1];
                if (/(at|bl|iz|is)$/.test(w)) w += 'e';                          // automating → automate
                else if (/([^aeioulsfz])\1$/.test(w)) w = w.slice(0, -1);         // planning → plan
                else if (w.length >= 6 && /ell$/.test(w)) w = w.slice(0, -1);    // labelling → label
            }
            if (w.length > 3 && /[^aeiou]y$/.test(w)) w = w.slice(0, -1) + 'i'; // policy, policies → polici

            var i;
            for (i = 0; i < STEP2.length; i++) {
                if (w.length > STEP2[i][0].length + 2 && w.slice(-STEP2[i][0].length) === STEP2[i][0]) {
                    w = w.slice(0, -STEP2[i][0].length) + STEP2[i][1];
                    break;
                }
            }
            for (i = 0; i < STEP3.length; i++) {
                var suffix = STEP3[i][0];
                if (w.slice(-suffix.length) === suffix && w.length - suffix.length >= STEP3[i][1]) {
                    // -sion/-tion only lose the "ion": prediction → predict, decision → decis
                    w = (suffix === 'sion' || suffix === 'tion') ? w.slice(0, -3) : w.slice(0, -suffix.length);
                    break;
                }
            }
            if (w.length > 3 && /[^aeiou]e$/.test(w)) w = w.slice(0, -1);
        }
        stemCache.set(word, w);
        return w;
    }

    // ── Edit distance (optimal string alignment), bounded ────────────────────
    function editDistance(a, b, max) {
        if (Math.abs(a.length - b.length) > max) return max + 1;
        var prev2 = null, prev = [], cur, i, j;
        for (j = 0; j <= b.length; j++) prev[j] = j;
        for (i = 1; i <= a.length; i++) {
            cur = [i];
            var rowMin = i;
            for (j = 1; j <= b.length; j++) {
                var cost = a[i - 1] === b[j - 1] ? 0 : 1;
                var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
                if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                    v = Math.min(v, prev2[j - 2] + 1);
                }
                cur[j] = v;
                if (v < rowMin) rowMin = v;
            }
            if (rowMin > max) return max + 1;
            prev2 = prev;
            prev = cur;
        }
        return prev[b.length];
    }

    function bigrams(seq) {
        var out = [];
        for (var i = 1; i < seq.length; i++) out.push(seq[i - 1] + ' ' + seq[i]);
        return out;
    }

    function maxTypos(word) {
        return word.length >= 8 ? 2 : word.length >= 4 ? 1 : 0;
    }

    // ── Index ────────────────────────────────────────────────────────────────
    function create(data) {
        var stop = new Set(data.stopwords || []);
        var docs = [];
        var postings = new Map();   // stem → Map(doc index → BM25F term weight)
        var surface = new Map();    // word as written → stem (for prefixes, typos and display)
        var display = new Map();    // stem → shortest word that produced it

        function remember(word, s) {
            if (!surface.has(word)) surface.set(word, s);
            var shown = display.get(s);
            if (!shown || word.length < shown.length) display.set(s, word);
        }

        function stems(text) {
            var out = [];
            rawWords(text).forEach(function (w) {
                if (stop.has(w)) return;
                var s = stem(w);
                remember(w, s);
                out.push(s);
            });
            return out;
        }

        var lengths = {};
        Object.keys(FIELDS).forEach(function (f) { lengths[f] = 0; });

        (data.docs || []).forEach(function (d) {
            var doc = { id: d.id, fields: {}, headline: null };
            Object.keys(FIELDS).forEach(function (f) {
                var list = stems(d[f] || '');
                var tf = new Map();
                list.forEach(function (s) { tf.set(s, (tf.get(s) || 0) + 1); });
                doc.fields[f] = { tf: tf, len: list.length };
                lengths[f] += list.length;
            });
            // Title and subtitle: a query that names the task gets a boost.
            doc.headline = new Set(Array.from(doc.fields.title.tf.keys()).concat(Array.from(doc.fields.sub.tf.keys())));
            // Word pairs of the title and subtitle, stopwords kept, so "what to do next" in a
            // query recognises the subtitle "What to do next on every deal".
            doc.headPairs = new Set(bigrams(rawWords(d.title).map(stem)).concat(bigrams(rawWords(d.sub).map(stem))));
            doc.titleNorm = rawWords(d.title).join(' ');
            docs.push(doc);
        });

        var n = docs.length || 1;
        var avg = {};
        Object.keys(FIELDS).forEach(function (f) { avg[f] = lengths[f] / n || 1; });

        docs.forEach(function (doc, di) {
            var weights = new Map();
            Object.keys(FIELDS).forEach(function (f) {
                var cfg = FIELDS[f], field = doc.fields[f];
                var norm = 1 - cfg.b + cfg.b * (field.len / avg[f]);
                field.tf.forEach(function (count, s) {
                    weights.set(s, (weights.get(s) || 0) + cfg.w * count / norm);
                });
            });
            weights.forEach(function (tt, s) {
                if (!postings.has(s)) postings.set(s, new Map());
                postings.get(s).set(di, tt);
            });
        });

        var idf = new Map();
        postings.forEach(function (list, s) {
            idf.set(s, Math.log(1 + (n - list.size + 0.5) / (list.size + 0.5)));
        });

        // ── Thesaurus ────────────────────────────────────────────────────────
        // Each entry keeps its full word sequence (to spot phrases in a query) and its
        // searchable stems (stopwords dropped). Synonym groups match at SYNONYM_WEIGHT,
        // equivalent groups (abbreviations, spellings) at full weight.
        var groups = [];                // [{ entries, w }]
        var groupsByStem = new Map();   // one-word entry stem → [group index]
        var phrases = [];               // multi-word entries, longest first
        var thesaurus = (data.synonyms || []).map(function (terms) { return [terms, SYNONYM_WEIGHT]; })
            .concat((data.equivalents || []).map(function (terms) { return [terms, 1]; }));
        thesaurus.forEach(function (group, gi) {
            var terms = group[0];
            var entries = [];
            terms.forEach(function (term) {
                var words = rawWords(term);
                var entry = {
                    seq: words.map(stem),
                    stems: words.filter(function (w) { return !stop.has(w); }).map(stem),
                    group: gi
                };
                if (entry.seq.length > 1) {
                    // Kept even if every word is a stopword ("what if"): it still
                    // recognises the phrase in a query and brings in its group.
                    phrases.push(entry);
                    if (entry.stems.length) entries.push(entry);
                } else if (entry.stems.length) {
                    entries.push(entry);
                    var s = entry.stems[0];
                    if (!groupsByStem.has(s)) groupsByStem.set(s, []);
                    if (groupsByStem.get(s).indexOf(gi) === -1) groupsByStem.get(s).push(gi);
                    if (!surface.has(words[0])) surface.set(words[0], s);
                    if (!display.has(s)) display.set(s, words[0]);
                }
            });
            groups.push({ entries: entries, w: group[1] });
        });
        phrases.sort(function (a, b) { return b.seq.length - a.seq.length; });
        var surfaceWords = Array.from(surface.keys());

        // ── Query ────────────────────────────────────────────────────────────
        function known(s) { return postings.has(s) || groupsByStem.has(s); }

        /** Weighted alternatives for one concept: [{ stems, w, exact }]. */
        // A synonym is never rarer than the word typed: a rare synonym ("pump") must not
        // outrank a task that uses the word itself ("machine"). cap = that word's idf.
        function synonymsOf(groupIds, w, cap, out) {
            groupIds.forEach(function (gi) {
                var group = groups[gi];
                group.entries.forEach(function (entry) {
                    out.push({ stems: entry.stems, w: w * group.w, exact: group.w === 1, cap: group.w === 1 ? Infinity : cap });
                });
            });
        }

        function idfOf(stems) {
            var known = stems.filter(function (s) { return idf.has(s); });
            if (!known.length) return Infinity;
            return known.reduce(function (sum, s) { return sum + idf.get(s); }, 0) / known.length;
        }

        function wordConcept(word, partial, corrections) {
            var s = stem(word);
            var alts = [];
            var seeds = [];   // [stem, weight] the word itself or its corrections

            if (known(s)) {
                seeds.push([s, 1]);
            }
            if (partial && word.length >= 3) {
                var added = 0;
                for (var i = 0; i < surfaceWords.length && added < MAX_PREFIXES; i++) {
                    var cand = surfaceWords[i];
                    if (cand.length > word.length && cand.lastIndexOf(word, 0) === 0) {
                        var cs = surface.get(cand);
                        if (cs !== s) { seeds.push([cs, PREFIX_WEIGHT]); added++; }
                    }
                }
            }
            if (!seeds.length) {
                var max = maxTypos(word), best = max + 1, fixes = [];
                if (max) {
                    surfaceWords.forEach(function (cand) {
                        if (cand[0] !== word[0] && max < 2) return; // one typo: trust the first letter
                        var d = editDistance(word, cand, max);
                        if (d < best) { best = d; fixes = [cand]; }
                        else if (d === best && d <= max) fixes.push(cand);
                    });
                }
                // Of equally close words, prefer swapped letters ("fial" → fail, not final or
                // file), then words used by more tasks; a few at most, so noise stays out.
                var sorted = word.split('').sort().join('');
                var anagrams = fixes.filter(function (cand) { return cand.split('').sort().join('') === sorted; });
                if (anagrams.length) fixes = anagrams;
                fixes.sort(function (a, b) {
                    var pa = postings.get(surface.get(a)), pb = postings.get(surface.get(b));
                    return (pb ? pb.size : 0) - (pa ? pa.size : 0);
                });
                fixes.slice(0, 3).forEach(function (cand) {
                    seeds.push([surface.get(cand), 0.85 - 0.1 * (best - 1)]);
                });
                if (fixes.length) corrections.push({ from: word, to: fixes[0] });
            }

            seeds.forEach(function (seed) {
                alts.push({ stems: [seed[0]], w: seed[1], exact: seed[1] >= 0.85, cap: Infinity });
                if (groupsByStem.has(seed[0])) synonymsOf(groupsByStem.get(seed[0]), seed[1], idfOf([seed[0]]), alts);
            });
            return { label: word, alts: alts, weight: 1 };
        }

        function parse(query) {
            var words = rawWords(query);
            var seq = words.map(stem);
            var partial = !/[\s"']$/.test(query);
            var concepts = [], corrections = [];
            var i = 0;
            while (i < words.length) {
                var phrase = null;
                for (var p = 0; p < phrases.length && !phrase; p++) {
                    var e = phrases[p];
                    if (e.seq.length > seq.length - i) continue;
                    var ok = true;
                    for (var k = 0; k < e.seq.length && ok; k++) ok = e.seq[k] === seq[i + k];
                    if (ok) phrase = e;
                }
                if (phrase) {
                    var alts = phrase.stems.length ? [{ stems: phrase.stems, w: 1, exact: true, cap: Infinity }] : [];
                    // A phrase is rarer than its words, so its synonyms may weigh up to all of them.
                    synonymsOf([phrase.group], 1,
                        phrase.stems.length ? idfOf(phrase.stems) * phrase.stems.length : Infinity, alts);
                    concepts.push({
                        label: words.slice(i, i + phrase.seq.length).join(' '),
                        alts: alts,
                        weight: Math.min(1.75, 1 + PHRASE_BONUS * (phrase.seq.length - 1))
                    });
                    i += phrase.seq.length;
                    continue;
                }
                if (!stop.has(words[i])) {
                    concepts.push(wordConcept(words[i], partial && i === words.length - 1, corrections));
                }
                i++;
            }
            return { concepts: concepts, corrections: corrections, norm: words.join(' '), bigrams: bigrams(seq) };
        }

        function termScore(s, di, cap) {
            var list = postings.get(s);
            var tt = list && list.get(di);
            return tt ? Math.min(idf.get(s), cap) * tt / (K1 + tt) : 0;
        }

        function altScore(alt, di) {
            var sum = 0, hits = 0;
            alt.stems.forEach(function (s) {
                var v = termScore(s, di, alt.cap);
                if (v) { sum += v; hits++; }
            });
            if (!hits) return 0;
            var mean = sum / alt.stems.length;
            if (hits === alt.stems.length) return mean;
            // Half a synonym phrase means little ("talent acquisition" is not M&A); half of
            // what was typed still counts for something.
            return alt.exact ? mean * PARTIAL_PHRASE : 0;
        }

        /**
         * Rank tasks for a query.
         * @return {{results: Array<{id: string, score: number}>, corrections: Array<{from, to}>}}
         */
        function search(query) {
            var q = parse(query);
            var concepts = q.concepts.filter(function (c) { return c.alts.length; });
            if (!concepts.length) return { results: [], corrections: q.corrections, understood: false };

            // How much each concept matters: rare words and recognised phrases count for more
            // than everyday words ("team"), so missing one of those costs a task less.
            var importance = concepts.map(function (c) {
                var best = 0;
                c.alts.forEach(function (alt) {
                    if (alt.cap === Infinity) best = Math.max(best, alt.w * Math.min(idfOf(alt.stems), 10));
                });
                return c.weight * (best || 1);
            });
            var totalImportance = importance.reduce(function (a, b) { return a + b; }, 0);

            var scored = [];
            docs.forEach(function (doc, di) {
                var total = 0, matched = 0, named = 0;
                concepts.forEach(function (c, ci) {
                    var best = 0, inHeadline = false;
                    c.alts.forEach(function (alt) {
                        var v = alt.w * altScore(alt, di);
                        if (v > best) best = v;
                        if (alt.exact && !inHeadline) {
                            inHeadline = alt.stems.every(function (s) { return doc.headline.has(s); });
                        }
                    });
                    if (best > 0) { total += best * c.weight; matched += importance[ci]; }
                    if (inHeadline) named++;
                });
                if (!matched) return;
                // Favour tasks that match every part of the query, then those it names outright,
                // then those whose title or subtitle it quotes.
                var coverage = matched / totalImportance;
                var pairs = q.bigrams.filter(function (b) { return doc.headPairs.has(b); }).length;
                var score = total * Math.pow(coverage, 1.5) * (1 + 0.6 * named / concepts.length)
                    * (1 + 0.3 * Math.min(pairs, 3));
                if (doc.titleNorm === q.norm) score *= 2;
                scored.push({ id: doc.id, score: score });
            });

            scored.sort(function (a, b) { return b.score - a.score; });
            var floor = scored.length ? scored[0].score * MIN_RELATIVE : 0;
            return {
                results: scored.filter(function (r) { return r.score >= floor; }),
                corrections: q.corrections,
                understood: true
            };
        }

        return { search: search };
    }

    var api = { create: create, stem: stem, editDistance: editDistance };
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.SymNexusTaskSearch = api;
})(typeof self !== 'undefined' ? self : this);
