// Starter pages, written into an empty wiki on first visit. After that they
// are ordinary pages: edit them in the app, not here.

export const SEED_PAGES: { slug: string; title: string; body: string }[] = [
  {
    slug: 'how-we-work',
    title: 'How we work',
    body: `# Where things live

- **Messages** (this app): day-to-day conversation. Use channels for topics, direct messages for one-to-one.
- **CRM** (this app): every prospect, customer and partner, and where each stands. Website contact and demo forms land here automatically.
- **Tasks** (this app): anything someone has agreed to do. If it isn't on the board, it isn't happening.
- **Wiki** (this app): how we do things. If you explain something twice, write it here.
- **Campaigns** (this app, admins): outbound email and newsletters from info@symnexus.co, with follow-ups and unsubscribe handling.
- **Email and calendar**: Microsoft 365 (Outlook). Customer-facing mail comes from a symnexus.co address, never a personal one.
- **Code**: GitHub.
- **Files**: one shared drive, with a *Brand* folder for logos, colors, fonts and product sheets.

# Weekly rhythm

- **Monday**: 30-minute team sync. Walk the task board: what's done, what's stuck, who owns what this week.
- **Tuesday and Thursday**: LinkedIn posts (company page, plus the CEO and CTO from their own profiles).
- **Friday**: pipeline review in the CRM. Every open contact has an owner and a dated next step.
- **Monthly**: newsletter (Campaigns) and a look at website analytics and Search Console.

# Ground rules

- Every tool account is registered to a company address (info@, or your own @symnexus.co), never a personal one.
- Shared logins live in the password manager, not in chat or documents.
- Customer data stays in company systems. Do not paste it into personal tools or AI services that are not approved.
- Write decisions down: a short note in the CRM, a task, or a wiki page.
`,
  },
  {
    slug: 'onboarding-checklist',
    title: 'Onboarding checklist',
    body: `For each new team member. Copy this list into a task for them on day one.

# Before day one (admin)

- [ ] Invite them to SymNexus Team (Accounts → Invite) with their @symnexus.co address
- [ ] Create their Microsoft 365 mailbox, or an alias if they share info@
- [ ] Add them to GitHub and the shared drive as their role needs
- [ ] Share the password-manager collections they need

# Day one

- [ ] Set a password and sign in to SymNexus Team; join the main channels
- [ ] Read this wiki: *How we work*, *Product one-pagers*, *Sales playbook*
- [ ] Set up email signature (name, title, symnexus.co, phone)
- [ ] Update LinkedIn: current position at SymNexus, linked to the company page
- [ ] Meet the CEO and CTO; agree on first-month goals, recorded as tasks

# First week

- [ ] Shadow a customer call or demo
- [ ] Walk through FluorocellAI and ComplianceCall with an engineer
- [ ] Pick up a first task from the board and close it

# Leaving

- [ ] Deactivate their SymNexus Team account (Accounts) and Microsoft 365 sign-in
- [ ] Remove GitHub, drive and password-manager access; rotate any shared passwords they used
- [ ] Reassign their CRM contacts and open tasks
`,
  },
  {
    slug: 'product-one-pagers',
    title: 'Product one-pagers',
    body: `Keep these in step with symnexus.co. If a number changes, change it in both places.

# FluorocellAI

- **What it is**: automated cell identification, counting, segmentation and QC for cell and cancer-research labs.
- **The result**: a cell-analysis workflow that took three to four days of manual review becomes a same-day first pass. Slide prep and imaging stay unchanged.
- **Who buys it**: cancer-research institutes, academic cell-biology cores, CRO and pharma/biotech R&D, regulatory affairs teams.
- **Why us**: built with working scientists, an audit trail behind every result, a REST API for lab pipelines.
- **Links**: https://symnexus.co/fluorocellai · case study https://symnexus.co/research/fluorocellai-cancer-research-lab

# ComplianceCall

- **What it is**: benchmarks pharmaceutical development against current federal regulation and tracks how each chemical's hazard category changed, and why.
- **The result**: a continuously auditable record, instead of reconstructing history at audit time.
- **Who buys it**: pharma regulatory and compliance teams.
- **Link**: https://symnexus.co/compliancecall

# Custom systems

- **What it is**: domain-native software and AI systems built around how a client already works.
- **Example**: Yashara, AI inventory and quality monitoring plus wholesale-account automation for an ethically sourced goods retailer.
- **Links**: https://symnexus.co/about · https://symnexus.co/products

# Pricing

Custom, sized to the deployment (sites, data volume, workflow complexity). Every engagement starts with an evaluation on the client's own data. Monthly or annual billing; academic and non-profit pricing available.
`,
  },
  {
    slug: 'sales-playbook',
    title: 'Sales playbook',
    body: `# Pipeline stages (CRM)

1. **Lead**: we know who they are. Website forms arrive here automatically.
2. **Contacted**: we have reached out or replied.
3. **Qualified**: they have the problem we solve, a budget holder is involved, and there is a timeline.
4. **Proposal**: scope and price sent.
5. **Won** / **Lost**: always record why in a note.

Every open contact needs an **owner** and a **next step with a date**. The Friday review clears anything without one.

# Responding to website inquiries

- Reply within one business day, from a symnexus.co address.
- Thank them, ask two or three questions about their workflow and data, and offer two meeting times.
- Log the reply in the CRM (Add entry → Email) and move them to *Contacted*.

# Running a demo

- Domain specialists run demos, not sales staff. Build the demo around their workflow and, where possible, their own data.
- Before: read their CRM history and website, and agree on the goal of the call.
- After: send a recap within 24 hours, log it as a *Meeting* entry, and set the next step.

# Outbound

- Use Campaigns with a short first email and at most two follow-ups to people who haven't replied.
- Write to a named person about a specific problem. Never buy lists.
- Unsubscribes are honored automatically and permanently.

# Proof we can use

- Only use customer names, logos or quotes with written permission. Record the permission in the contact's CRM notes.
`,
  },
  {
    slug: 'brand-kit',
    title: 'Brand kit',
    body: `# Basics

- **Name**: SymNexus in running text. The legal name appears in the website footer.
- **Primary color**: teal #009688.
- **Typefaces**: Montserrat (headings), Karla and Open Sans (body), all free on Google Fonts.
- **Voice**: precise, plain and domain-literate. Claim only what we can show; give numbers with their source.

# Where the files are

Keep one *Brand* folder on the shared drive with:

- Logo and wordmark (SVG and PNG, light and dark)
- A one-page product sheet for each product (Canva free works well)
- LinkedIn banner and post templates
- Team headshots, all with the same background and crop
- Email signature template
`,
  },
  {
    slug: 'setup-checklist',
    title: 'Setup checklist',
    body: `The one-off setup from the October 2026 website and operations review. Tick items off as they are done.

# Website

- [x] Contact email on the site is info@symnexus.co
- [x] One FluorocellAI figure everywhere (three to four days → same-day first pass)
- [x] Fuller privacy policy (retention, rights, cookies, sub-processors)
- [x] One label for the demo button ("Request a demo"), US spelling, location line
- [x] Website forms go into the CRM
- [ ] Team login at app.symnexus.co (DNS record in GoDaddy)
- [ ] Leadership headshots and LinkedIn links
- [ ] Company LinkedIn and YouTube links in the footer
- [ ] At least one customer quote or named lab, with written permission
- [ ] Demo booking calendar on /demo (Cal.com free)

# Email

- [x] SPF, DKIM and DMARC for symnexus.co
- [ ] Aliases hello@, support@ and privacy@ on the info@ mailbox (Microsoft 365 admin, free)
- [ ] Campaigns connected to Microsoft 365 (Campaigns → Settings)

# Accounts (free tiers; register each with a company address)

- [ ] Bitwarden (password manager), free organization for two people, or Teams later
- [ ] Google Search Console: verify symnexus.co with a DNS TXT record and submit /sitemap.xml
- [ ] Vercel Web Analytics: enable on the *symnexus* project
- [ ] LinkedIn company page
- [ ] YouTube channel for demos; Loom free for recording
- [ ] Cal.com free for demo booking, connected to the Outlook calendar
- [ ] Wave (free) for invoicing and bookkeeping
- [ ] Canva free for the brand kit
- [ ] Buffer free for scheduling posts (optional)
`,
  },
];
