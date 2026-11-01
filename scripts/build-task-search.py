#!/usr/bin/env python3
"""Build the /products task search index: public/assets/data/task-search.json.

Usage:  python3 scripts/build-task-search.py   (run by `npm run sync:modelscore`; set MODELSCORE_DIR
        if ModelsCore is not a sibling of this repo)

Reads every task page's copy from ModelsCore (site_builder/task_content) and the catalog it exports,
plus the thesaurus in src/data/task-search-terms.txt, and writes one JSON file for site.js:
  docs       per task: id (<product key>/<slug>), its short fields (title, sub, dept, product) and
             the words of its opening paragraphs (`lede`) and of the rest of the page (`body`, pruned
             to the most distinctive words), each a space-separated list with a word repeated as
             often as it occurs (up to 5 times)
  synonyms   the thesaurus groups (related words)
  equivalents  the thesaurus's exact-equivalent groups (abbreviations, spellings)
  stopwords  words ignored in queries and copy
Words are lower-cased but not stemmed: the browser stems both index and query with one stemmer.
Never put a product's `repo` in the index; it names model types.
"""
import json
import math
import os
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODELSCORE = Path(os.environ.get("MODELSCORE_DIR", ROOT.parent / "ModelsCore")).resolve()
SITE_BUILDER = MODELSCORE / "site_builder"
TERMS = ROOT / "src" / "data" / "task-search-terms.txt"
OUT = ROOT / "public" / "assets" / "data" / "task-search.json"

LEDE_PARAS = 2    # the opening paragraphs say what the task is; later ones are how it works
BODY_TERMS = 60   # distinctive words kept per task from the rest of the page

# English function words, plus the filler people type around a need ("I want a tool to ...").
STOPWORDS = sorted(set("""
a about above after again against all almost also although always am among an and another any anyone
anything are aren't around as at be became because become been before being below between both but by
can can't cannot could couldn't did didn't do does doesn't doing don't done down during each either else
enough even ever every few for from further get gets getting give given go goes going got had hadn't has
hasn't have haven't having he her here hers herself him himself his how however i i'd i'll i'm i've if in
into is isn't it it's its itself just let let's like lot lots made make makes making many may me might more
most much must my myself need needs no nor not now of off often on once one ones only onto or other others
otherwise our ours ourselves out over own per perhaps please quite rather really same say says shall she
should shouldn't since so some something sometimes soon still such than that that's the their theirs them
themselves then there there's these they they'd they'll they're they've thing things this those though
through thus to too toward towards under until up upon us very via want wants was wasn't way ways we we'd
we'll we're we've well were weren't what what's whatever when whenever where whereas wherever whether which
while who who's whom whose why will with within without won't would wouldn't yet you you'd you'll you're
you've your yours yourself yourselves
able across already anybody etc eg ie kind kinds new simply sure via whole
help helps helping know show find finds finding tool tools solution solutions
use used uses using task tasks model models ai ml platform want looking
better best good great easy easily quick quickly lot something someone way able automatically
symnexus symnexuspredict symnexusforecast symnexussentinel symnexusextract symnexusgen symnexusvision
symnexusmatch symnexusdecide symnexusvoice delighted visit imagine ready together
""".split()))


def normalize(text):
    """Lower-case, strip accents, join R&D / M&A, and turn other punctuation into spaces."""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    text = text.replace("’", "'")
    text = re.sub(r"\b([a-z])&([a-z])\b", r"\1\2", text)
    return re.sub(r"[^a-z0-9']+", " ", text)


def words(text):
    out = []
    for w in normalize(text).split():
        w = w.strip("'")
        if w.endswith("'s"):
            w = w[:-2]
        if len(w) > 1 and w not in STOPWORDS and not w.isdigit():
            out.append(w)
    return out


def load_tasks():
    sys.path.insert(0, str(SITE_BUILDER))
    from build_sites import load_tasks as load  # noqa: E402  (ModelsCore's own task loader)

    catalog = json.loads((SITE_BUILDER / "export" / "symnexus_catalog.json").read_text())
    docs = []
    for p in catalog["products"]:
        pages = {t["slug"]: t for t in load(p["key"])}
        for t in p["tasks"]:
            paras = pages[t["slug"]].get("paras", [])
            docs.append(dict(
                id=f"{p['key']}/{t['slug']}",
                title=t["title"], sub=t["sub"], dept=t["dept"],
                product=f"{p['word']} {p['tagline']} {p['lead']}",
                lede=Counter(words(" ".join(paras[:LEDE_PARAS]))),
                body=Counter(words(" ".join(paras[LEDE_PARAS:]))),
            ))
    return docs


def prune_body(docs):
    """Keep each page's most distinctive words (tf-idf), so the index stays small."""
    df = Counter(w for d in docs for w in set(d["body"]) | set(d["lede"]))
    n = len(docs)
    for d in docs:
        ranked = sorted(d["body"].items(), key=lambda kv: (-(1 + math.log(kv[1])) * math.log(n / df[kv[0]]), kv[0]))
        d["body"] = flatten(kv for kv in ranked[:BODY_TERMS] if df[kv[0]] < n * 0.5)
        d["lede"] = flatten(d["lede"].items())


def flatten(counts):
    """{"churn": 2, "risk": 1} -> "churn churn risk": compact, and gzip folds the repeats."""
    return " ".join(" ".join([w] * min(c, 5)) for w, c in sorted(counts))


def load_thesaurus():
    """(synonym groups, equivalent groups) from the terms file; "=" lines are equivalents."""
    synonyms, equivalents = [], []
    for line in TERMS.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        target = equivalents if line.startswith("=") else synonyms
        target.append([t.strip().lower() for t in line.lstrip("=").split(",") if t.strip()])
    return synonyms, equivalents


def main():
    if not SITE_BUILDER.is_dir():
        sys.exit(f"ModelsCore not found at {MODELSCORE} (set MODELSCORE_DIR)")
    docs = load_tasks()
    prune_body(docs)
    synonyms, equivalents = load_thesaurus()
    data = dict(
        generated_by="scripts/build-task-search.py",
        stopwords=STOPWORDS,
        synonyms=synonyms,
        equivalents=equivalents,
        docs=docs,
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, separators=(",", ":"), ensure_ascii=False) + "\n")
    print(f"indexed {len(docs)} tasks, {len(synonyms)} synonym and {len(equivalents)} equivalent groups -> "
          f"{OUT.relative_to(ROOT)} "
          f"({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
