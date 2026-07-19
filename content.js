/* proposal-hub — per-pitch CONTENT (window.HUB). Chassis (index.html) reads this.
   Pitch: North Star Communications -> Meaning Global (meaning.global).
   House style: no em-dashes, no emojis in agency voice, second person, American
   English, hedge current-state audits with may/could/might. */

var WEB = "website/";

window.HUB = {

  /* ---- AGENCY (North Star Communications; fixed across NSC pitches) ---- */
  agency: {
    name: "North Star",
    unit: "Communications",
    org:  "North Star Communications",
    lang: "en",
    logo: "<svg viewBox='0 0 32 32' fill='none'><path d='M16 2l2.9 9.4L28 11l-7.4 5.6L23 26l-7-5.7L9 26l2.4-9.4L4 11l9.1.4L16 2Z' fill='#C29A4E'/><circle cx='16' cy='15' r='2.1' fill='#10131A'/></svg>",
    favicon: "favicon.svg",
    tokens: {
      accent: "#B4894C", accentStrong: "#8A6836", accentSoft: "#EFE5D2",
      ink: "#14161C", ink2: "#20242E", inkMuted: "rgba(20,22,28,.56)",
      sidebar: "#10131A", bg: "#F6F3EC", bgAlt: "#ECE7DA", hairline: "rgba(20,22,28,.12)",
      onDark: "#EFEADD",
    },
    fonts: {
      display: "'Fraunces',Georgia,serif", body: "'Inter',system-ui,sans-serif",
      import: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Inter:wght@400;500;600;700&display=swap",
    },
  },

  /* ---- PITCH ---- */
  brand: {
    proposalFor: "Meaning Global",
    foot: "North Star Communications.<br>A proposal for Meaning Global. Surfaces are review candidates, not the live meaning.global.",
  },
  favicon: "favicon.svg",
  title: "Meaning Global x North Star",
  defaultView: "intro",
  WEB: "website/",

  nav: [
    { section: "The Proposal", items: [
      { view: "intro", label: "Introduction" },
      { view: "recs",  label: "Recommendations" },
    ]},
    { section: "North Star", items: [
      { view: "about",  label: "Who We Are" },
      { view: "people", label: "Key People" },
      { view: "who",    label: "Our Clients" },
    ]},
    { section: "The Build", items: [
      { view: "website", label: "Website", badge: 6 },
      { view: "cluster", label: "Content Cluster" },
      { view: "crm",     label: "Leads &amp; pipeline", badge: 6 },
    ]},
  ],

  VIEWS: {
    intro:   { title: "Introduction", sub: "A proposal to give Meaning Global the infrastructure its ideas deserve", open: "https://www.meaning.global/", openLabel: "Open meaning.global ↗" },
    recs:    { title: "Recommendations", sub: "What we would build, and why each piece earns its place", open: "https://www.meaning.global/", openLabel: "Open meaning.global ↗" },
    about:   { title: "Who We Are", sub: "North Star Communications · approach, services, and how we work" },
    people:  { title: "Key People", sub: "The people who would run the work" },
    who:     { title: "Our Clients", sub: "A selection of the brands and organizations we have delivered for" },
    website: { title: "Website", sub: "Functional prototype · the rebuilt meaning.global", open: WEB, openLabel: "Open in new tab ↗", tbBadge: "Functional prototype", infoPane: true },
    cluster: { title: "Content Cluster", sub: "Essays → the Creation pillar → the Sovereign Audit, amplified on LinkedIn" },
    crm:     { title: "Leads & pipeline", sub: "Every enquiry from the site's forms · source, page and stage · 6 leads" },
  },

  /* The chassis calls renderSocial() once on load regardless of nav. With no
     Organic Posts view in this pitch, an empty array makes that a no-op, and a
     minimal PF keeps the platform lookup happy. Do not remove these two keys. */
  PF: { linkedin: { name: "LinkedIn", cls: "li", tag: "in" } },
  social: [],

  /* Consulting-appropriate stage labels reusing the chassis's six badge colors.
     STAGE_ORDER = Object.keys(STAGES), so labels are free but the value classes
     (st-*) must stay for the pill colors to resolve. */
  STAGES: { "New":"st-new", "In conversation":"st-contacted", "Call booked":"st-visit", "Proposal sent":"st-quoted", "Won":"st-won", "Lost":"st-lost" },

  crmMeta: {
    heading: "Leads & pipeline",
    lede: "Every enquiry the rebuilt site would capture, from the Sovereign Audit request to keynote, media, partnership and general forms. Each lead carries its source, the page it converted on, and its stage, so authority can be traced back to the content that earned it. Click a lead to open it. Figures are illustrative for the prototype.",
  },

  leads: [
    {id:"L-3051", name:"Camille Verdon", email:"c.verdon@maison-verdon.com", phone:"+33 1 53 90 22 40", postcode:"Paris, FR",
     requestType:"Sovereign Audit", projectType:"Sovereign Audit · Creation pillar", idealStart:"In 1-3 months",
     message:"Read your essay on why luxury has lost its meaning and it named exactly the drift our house is feeling. We would like the audit to map where we create human value and where we are leaving it on the table.",
     page:"/thinking/luxury-has-lost-its-meaning/", pageUrl:"website/thinking/luxury-has-lost-its-meaning/", srcShort:"Essay (organic search)", srcKind:"organic",
     utm:{source:"google",medium:"organic",campaign:"-",content:"-",term:"meaning of luxury"},
     stage:"New", date:"16 Jul 2026", notes:"Organic search into the Creation cornerstone essay, then straight to the Sovereign Audit request. Named house, high intent. Route to Martina for a first call."},
    {id:"L-3049", name:"Daniel Osei", email:"daniel.osei@meridian-private.com", phone:"+44 20 7946 1180", postcode:"London, UK",
     requestType:"Sovereign Audit", projectType:"Sovereign Audit · Wealth pillar", idealStart:"In 3-6 months",
     message:"Came from Dr. Olbert's LinkedIn post, then read What Finance Is For. We are repositioning a private bank around purpose and want an outside read on where we actually create meaning for clients.",
     page:"/thinking/what-finance-is-for/", pageUrl:"website/thinking/what-finance-is-for/", srcShort:"LinkedIn (founder post)", srcKind:"social",
     utm:{source:"linkedin",medium:"social",campaign:"founder-organic",content:"what-finance-is-for-post",term:"-"},
     stage:"In conversation", date:"13 Jul 2026", notes:"Founder LinkedIn post into the Wealth essay, then the audit form. Called 14/07. Strong fit, decision maker engaged."},
    {id:"L-3047", name:"Ingrid Halvorsen", email:"i.halvorsen@nordic-futures-forum.org", phone:"+47 22 90 11 55", postcode:"Oslo, NO",
     requestType:"Keynote", projectType:"Keynote · New Earth Economy", idealStart:"As soon as possible",
     message:"Programming the main stage of our leadership forum in the autumn. Dr. Olbert's framing of humanistic capitalism is exactly the opening our audience needs. Requesting availability and fee.",
     page:"/speaking/", pageUrl:"website/speaking/", srcShort:"Speaking page (direct)", srcKind:"direct",
     utm:{source:"direct",medium:"-",campaign:"-",content:"-",term:"-"},
     stage:"Call booked", date:"10 Jul 2026", notes:"Keynote enquiry through the Speaking page. Intro call booked 22/07 to confirm date and scope. Warm, credible event."},
    {id:"L-3044", name:"Sofia Marchetti", email:"s.marchetti@vitala-longevity.com", phone:"+39 02 9000 4412", postcode:"Milan, IT",
     requestType:"Sovereign Audit", projectType:"Sovereign Audit · Health & Longevity", idealStart:"In 1-3 months",
     message:"Founder of a longevity brand. Found the Health pillar page while researching how to talk about value beyond clinical claims. Want the audit to show where our story is meaningful and where it is just features.",
     page:"/pillars/health/", pageUrl:"website/pillars/health/", srcShort:"Pillar page (organic)", srcKind:"organic",
     utm:{source:"google",medium:"organic",campaign:"-",content:"-",term:"longevity brand meaning"},
     stage:"Proposal sent", date:"5 Jul 2026", notes:"Organic into the Health pillar, then the audit. Scope agreed, proposal sent 11/07. Good proof the pillar pages pull new sectors."},
    {id:"L-3040", name:"Priya Raman", email:"priya@newearth-collective.org", phone:"+1 415 555 0177", postcode:"San Francisco, US",
     requestType:"Partnership", projectType:"Partnership · programming and research", idealStart:"In 3-6 months",
     message:"We convene founders building the new economy and would like to explore a content and programming partnership around the Sovereign Hexagon. Introduced by a mutual contact who pointed us to the site.",
     page:"/contact/", pageUrl:"website/contact/", srcShort:"Partnership form (referral)", srcKind:"direct",
     utm:{source:"referral",medium:"-",campaign:"-",content:"-",term:"-"},
     stage:"Won", date:"28 Jun 2026", notes:"WON. Partnership agreed for a joint content series and a forum session. Referral warmed by reading the thesis pages beforehand."},
    {id:"L-3035", name:"Mark Whitfield", email:"mwhitfield@apex-brandconsult.com", phone:"+44 161 555 0293", postcode:"Manchester, UK",
     requestType:"General", projectType:"General enquiry", idealStart:"Just exploring",
     message:"Consultant asking whether Meaning Global white-labels the Sovereign Hexagon framework for other agencies to resell.",
     page:"/contact/", pageUrl:"website/contact/", srcShort:"General form (direct)", srcKind:"direct",
     utm:{source:"direct",medium:"-",campaign:"-",content:"-",term:"-"},
     stage:"Lost", date:"2 Jul 2026", notes:"Lost, out of scope. Wanted to license the framework to resell, not a fit for the advisory model. Declined politely."},
  ],

  clients: [
    {name:"Belgrade Waterfront", logo:"assets/clients/belgrade-waterfront.svg", desc:"The largest waterfront real estate development project in South East Europe.", did:"SEO, website development, social media management, digital advertising, and photo and video production."},
    {name:"The Clorox Company", logo:"assets/clients/clorox.svg", desc:"A Fortune 500 consumer goods multinational behind household brands including Clorox, Glad, Brita, Pine-Sol, and Burt's Bees.", did:"A full-scale market test of a new product category. We built a complete ecommerce website and ran social and Google Ads campaigns, driving 10,000 purchases in three months."},
    {name:"Citibank", logo:"assets/clients/citi.png", desc:"The global consumer bank of Citigroup, one of the world's largest financial institutions, operating across nearly 90 markets.", did:"Rapid demand-testing to validate new products and offerings across North and South American markets: fast-turnaround websites and campaigns for each short cycle, generating thousands of leads."},
    {name:"Speechify", logo:"assets/clients/speechify.svg", desc:"A text-to-speech and AI voice app that reads books, PDFs and web pages aloud, used by 60M+ people.", did:"An SEO and GEO content engine publishing 50k words a month, until the brand ranked top three for every target keyword and stood as a category leader."},
    {name:"Semrush", logo:"assets/clients/semrush.svg", desc:"A leading online-visibility and SEO platform spanning search, content, PPC and social, used by marketing teams worldwide.", did:"Wrote Semrush's thought-leadership content on emerging trends, audience shifts and algorithm changes. Every article went viral from the first, and the work earned us a place on their partner list."},
    {name:"Miss Universe", logo:"assets/clients/miss-universe.png", desc:"One of the world's largest and most-watched beauty pageants, staged across dozens of countries.", did:"Ran a national edition end to end: brand, marketing, SEO, social, and the full event (sponsors, contestants, venue, media, budget). A 1,000-guest show, delivered under budget, on time, and at a profit."},
    {name:"MVP Workshop", logo:"assets/clients/mvp-workshop.svg", desc:"A Web3 and blockchain solutions studio delivering end-to-end products, from idea to launch.", did:"Lifted SERP performance with a six-pillar content matrix and technical SEO writing that speaks to real buyers, driving a marked rise in top-keyword rankings and target-audience traffic."},
    {name:"Inery", logo:"assets/clients/inery.svg", desc:"Enterprise-grade decentralized data infrastructure and developer tooling for distributed systems.", did:"The full global launch of a new blockchain project (PR, partnerships, community, team, ads) in two months. On launch day the token jumped from its $0.14 ICO to $0.69 within six hours."},
  ],

  sitepane: `
    <p class="sitepane__lede">This is a working prototype, not the live site. Every page, link and form is real and clickable, built on Meaning Global's own brand and ideas.</p>
    <p class="sitepane__note">The copy is a review candidate written in your voice. Some figures and client references are illustrative, marked as a prototype throughout.</p>
    <p class="sitepane__h">How it improves on the current site</p>
    <div class="sp-point"><b>An architecture, not a scroll</b><span>The current site is one long homepage. This is a real structure a board can follow: a thesis hub, the Sovereign Hexagon as navigation, a page per pillar, and reading underneath each.</span></div>
    <div class="sp-point"><b>The Hexagon becomes the navigation</b><span>Your signature framework stops being a static graphic and becomes the interactive spine of the site, where every pillar links to its own content.</span></div>
    <div class="sp-point"><b>Built to be found and cited</b><span>Definitional pages and schema markup give search and AI answer engines something to quote when someone asks what the New Earth Economy or Humanistic Capitalism is.</span></div>
    <div class="sp-point"><b>Vision, laddered to the concrete</b><span>Every page keeps your visionary voice on top, then ladders down to what it means for a business, what we would do, and the evidence.</span></div>
    <p class="sitepane__kicker">In short: the same ideas, given a structure that can be found, trusted, and acted on.</p>
  `,

  html: {

    intro: `
    <div class="brief">
      <p class="brief__eyebrow">North Star Communications &middot; Proposal for Meaning Global</p>
      <h1>The idea is already ahead of its time. The infrastructure carrying it is not yet.</h1>
      <p class="brief__lede">Meaning Global has built one of the most ambitious ideas in business: that meaning is the currency of the next economy, mapped through the Sovereign Hexagon. This hub is our proposal for the engine that idea deserves, written on your brand rather than described in a deck.</p>
      <blockquote class="brief__quote">&ldquo;Meaning is the currency of the new world economy.&rdquo;<cite>Meaning Global</cite></blockquote>
      <div class="brief__body">
        <p>The thinking is world-class and widely recognized, in Forbes, the BBC, Vogue Business and an academic journal. The gap is not the idea. It is the infrastructure that turns an idea into demand:</p>
        <ul>
          <li>A website that is a single long homepage, where a visionary thesis has nowhere to unfold and nothing for search or AI engines to index or cite.</li>
          <li>A signature framework, the Sovereign Hexagon, presented as a static graphic rather than the navigational spine it could be.</li>
          <li>A founder with genuine authority whose LinkedIn presence is infrequent and disconnected from any content it could point back to.</li>
        </ul>
        <p>Your buyers, boards and investors at the luxury, finance and consumer tier, do not commit to a reimagination they cannot first understand and trust. So the work is to give the vision an architecture: a site built on the six pillars, content that answers the questions those buyers ask, and a founder brand that compounds instead of going quiet.</p>
        <p><b>Everything in this hub is what we would actually build for Meaning Global,</b> not a description of it. Start with <b>Recommendations</b> for the plan and why each piece earns its place. Under <b>North Star</b> you will find who we are, the people who would run the work, and the clients we have delivered for. Then <b>The Build</b>: open the <b>Website</b>, a working rebuild of meaning.global with the Sovereign Hexagon as its spine and the Creation pillar built out in full; see the <b>Content Cluster</b> that connects the reading to the audit; and the <b>Leads and pipeline</b> that traces every enquiry back to the content that earned it.</p>
        <p class="brief__aside">You can comment on any of it. Use the Comments control in the website prototype to leave feedback in context, on the exact line or section.</p>
      </div>
      <div class="brief__foot"><div class="brief__star" aria-hidden="true"></div><p>North Star Communications. Prepared for Meaning Global.</p></div>
    </div>`,

    recs: `
    <div class="brief">
      <p class="brief__eyebrow">North Star Communications &middot; Proposal for Meaning Global</p>
      <h1>Give the vision an engine: a website on the Hexagon, then a founder brand that feeds it.</h1>
      <p class="brief__lede">This is the case for the work shown across this hub. Not a menu of tactics, but a single connected system for turning a widely admired idea into demand you can trace: a site built on the six pillars, content clustered under each, and a founder presence that compounds. Here is what we would build, and why each piece earns its place.</p>

      <div class="brief__sec">
        <p class="brief__num">01</p>
        <div class="brief__body">
          <h2>Where you stand today</h2>
          <p>An honest read of the current presence, offered as a starting point, not a verdict. We looked at each asset the way a skeptical board member or an AI assistant would. Some of this could shift as pages change, but a pattern comes through: world-class thinking, under-built online, and a buyer who may struggle to follow it from vision to proof.</p>
          <div class="state">
            <div class="state__row"><div class="state__k">The site</div><div class="state__v">A manifesto without a map. One long homepage carries an enormous, abstract thesis. It may impress a believer and lose a skeptical board, because there is no structure to follow and no path from vision to proof.</div></div>
            <div class="state__row"><div class="state__k">SEO &amp; GEO</div><div class="state__v">For a brand that wants to be the currency of the new economy, there is almost nothing for Google or AI answer engines to index and cite. We did not find definitional pages or visible structured data. The authority exists; the discoverability may not yet.</div></div>
            <div class="state__row"><div class="state__k">The Hexagon</div><div class="state__v">Your strongest asset is presented as a picture beside text, rather than the interactive architecture the whole site could hang from. The framework that should be the navigation is currently a graphic.</div></div>
            <div class="state__row"><div class="state__k">Founder brand</div><div class="state__v">Dr. Olbert's LinkedIn shows real authority but posts infrequently, and the posts point at a homepage rather than into content that deepens them. The presence runs quiet where it could compound.</div></div>
            <div class="state__row"><div class="state__k">Lead capture</div><div class="state__v">There is no visible way to tell which idea, page or channel produced an enquiry. That makes it hard to know what is working, which is the opposite of an engine you can invest behind.</div></div>
          </div>
        </div>
      </div>

      <div class="brief__sec">
        <p class="brief__num">02</p>
        <div class="brief__body">
          <h2>The strategy: website first, then a founder brand that feeds it</h2>
          <p>We turn the Sovereign Hexagon into a content architecture. Six pillars become six topical clusters. The site is where the thesis unfolds and earns citations; the founder's LinkedIn then derives from that content instead of floating free.</p>
          <p><b>Structure the thesis</b> into a site a board can follow: a New Earth Economy hub, the Hexagon as navigation, a page per pillar, and a cluster of reading under each.</p>
          <p><b>Make it citable.</b> Definitional pages and schema markup so answer engines quote your definitions of Humanistic Capitalism and the New Earth Economy. Structured content is reported to be cited far more often than unstructured prose.</p>
          <p><b>Then amplify.</b> Once the content exists, the founder's posts point back into it, on a cadence, so authority compounds instead of going quiet.</p>
          <p class="brief__aside">Every item in this hub plays a part in that system, or proves that it worked.</p>
        </div>
      </div>

      <div class="brief__sec">
        <p class="brief__num">03</p>
        <div class="brief__body">
          <h2>What we would build</h2>
          <p>Each surface in this hub maps to a specific gap in the current state, and to a specific reason it moves the needle.</p>
          <div class="ledger">
            <div class="ledger__head"><span>Surface</span><span>Today</span><span>What we build</span><span>Why it could win</span></div>
            <div class="ledger__row"><span class="lg-seg">Website on the Hexagon</span><span class="lg-now">One long homepage; the framework is a static graphic.</span><span class="lg-build">A rebuilt meaning.global on the six pillars, with the interactive Sovereign Hexagon as its spine and a page per pillar.</span><span class="lg-why">Turns a scroll into an architecture a board can follow from vision to proof.</span></div>
            <div class="ledger__row"><span class="lg-seg">Pillar content clusters</span><span class="lg-now">Ideas live only on the homepage, unstructured.</span><span class="lg-build">Six clusters, each a cornerstone essay plus the pieces that support it. The Creation pillar and its cornerstone are written in full here as the standard.</span><span class="lg-why">Unique, intent-matched content that answers the questions your buyers actually ask.</span></div>
            <div class="ledger__row"><span class="lg-seg">SEO &amp; GEO layer</span><span class="lg-now">No definitional pages or visible schema.</span><span class="lg-build">Definitional pages, FAQ and schema on the thesis and framework, in extractable text.</span><span class="lg-why">Machine-readable visibility that search and AI engines can read and repeat.</span></div>
            <div class="ledger__row"><span class="lg-seg">Founder LinkedIn</span><span class="lg-now">Infrequent posts that point at a homepage.</span><span class="lg-build">A consistent, article-backed programme built from the same content, in the founder's voice. The next phase we would design with you.</span><span class="lg-why">Earns authority in the channel where buyers research and AI answers are trained.</span></div>
            <div class="ledger__row"><span class="lg-seg">Lead capture &amp; CRM</span><span class="lg-now">Enquiries arrive with the source unknown.</span><span class="lg-build">A simple CRM capturing every enquiry, its source, the page it converted on, and its stage.</span><span class="lg-why">Shows which ideas produce revenue, so effort follows the evidence.</span></div>
          </div>
        </div>
      </div>

      <div class="brief__sec">
        <p class="brief__num">04</p>
        <div class="brief__body">
          <h2>How it compounds</h2>
          <p>Meaning, as you argue, is the value that does not depreciate. The same is true of this engine. A structured, citable site plus a founder brand that feeds it does not decay like an ad campaign; it accrues authority, search presence and inbound interest over time.</p>
          <p>Each part feeds the next. A cited essay lifts how often you appear, which sends more of the right people to pages built to convert, which produces enquiries you can trace back to the idea that earned them. The Sovereign Audit becomes the natural entry point, and every piece of content is a path back to it.</p>
          <p class="brief__aside">We would sequence it so the fastest signals move first, the website and the thesis pages, with the clusters and the founder programme scaling as the proof accumulates.</p>
        </div>
      </div>

      <div class="brief__foot">
        <div class="brief__star" aria-hidden="true"></div>
        <p>North Star Communications. Prepared for Meaning Global. Figures and sample content shown across this hub are illustrative until confirmed.</p>
      </div>
    </div>`,

    about: `
    <div class="brief">
      <p class="brief__eyebrow">North Star Communications &middot; Proposal for Meaning Global</p>
      <h1>We build the engines that turn big ideas into demand.</h1>
      <p class="brief__lede">North Star is a content, SEO and brand studio. We work with ambitious brands and founders to structure what they know into content that gets found, trusted and acted on, across web, search, social and paid. Meaning Global is exactly the kind of brief we are built for: a genuinely original idea that needs the infrastructure to carry it.</p>

      <div class="brief__sec">
        <p class="brief__num">01</p>
        <div class="brief__body">
          <h2>How we think</h2>
          <p>We listen, we learn, we adapt, and we deliver. That rhythm is held together by four values that decide how we make trade-offs when the work gets hard.</p>
          <div class="vals">
            <div class="val"><b>Human First</b><span>Technology brings people closer together. It does not replace the relationship at the center of good communication.</span></div>
            <div class="val"><b>Zero Distance</b><span>The best communications disappear. We work toward value flowing both ways, with no friction and no noise.</span></div>
            <div class="val"><b>Sustainable Growth</b><span>Fast is not the same as healthy. We build growth that matches your capacity and compounds over time.</span></div>
            <div class="val"><b>Resilient Outcomes</b><span>Markets shift and plans change. The work is designed so every outcome makes the next one stronger.</span></div>
          </div>
        </div>
      </div>

      <div class="brief__sec">
        <p class="brief__num">02</p>
        <div class="brief__body">
          <h2>How we work</h2>
          <p>Our approach is the one you see in this hub. We do not describe the work; we build it on your brand, then refine it with you in the open. We start by getting two things clear: who you are trying to reach, and what you actually want them to take away. We get them right before we spend any of your budget.</p>
          <p>From there we work in small, complete steps rather than one long plan you have to sign off up front. We put something real in front of your audience, watch what they actually do, and keep what works while dropping what does not. Each step teaches us something we carry into the next, so the work gets sharper as it goes and you can see it paying off along the way.</p>
        </div>
      </div>

      <div class="brief__sec">
        <p class="brief__num">03</p>
        <div class="brief__body">
          <h2>What we do</h2>
          <p>Seven service lines, drawn on in whatever combination the work calls for. This engagement leans on Research and Strategy, Content and Copywriting, Digital Marketing, and Web and App Development.</p>
          <div class="svc">
            <div class="svc__row"><div class="svc__name">Research &amp; Strategy</div><div class="svc__desc">Understand your market and your audience, then turn that into a plan built to move you forward.<span class="svc__tags">Competitive analysis &middot; audience research &middot; positioning &middot; strategy</span></div></div>
            <div class="svc__row"><div class="svc__name">Digital Marketing</div><div class="svc__desc">Reach the right people across search and social, and turn that reach into results.<span class="svc__tags">SEO and GEO &middot; social media management &middot; LinkedIn and Meta Ads &middot; Google Ads</span></div></div>
            <div class="svc__row"><div class="svc__name">Branding</div><div class="svc__desc">Shape how you look and what you stand for, so you are recognized and remembered.<span class="svc__tags">Identity design &middot; storytelling &middot; guidelines &middot; mission, vision and values</span></div></div>
            <div class="svc__row"><div class="svc__name">PR</div><div class="svc__desc">Manage how the world sees you, from everyday reputation to the moments that matter most.<span class="svc__tags">Reputation management &middot; press releases &middot; presentations &middot; crisis response</span></div></div>
            <div class="svc__row"><div class="svc__name">Content &amp; Copywriting</div><div class="svc__desc">Words and stories that earn attention and turn readers into customers.<span class="svc__tags">Storytelling &middot; SEO and GEO copy &middot; articles &middot; conversion copy</span></div></div>
            <div class="svc__row"><div class="svc__name">Design &amp; Production</div><div class="svc__desc">Bring it all to life with design and video made for where people actually watch.<span class="svc__tags">Video &middot; graphic design &middot; digital assets &middot; production</span></div></div>
            <div class="svc__row"><div class="svc__name">Web &amp; App Development</div><div class="svc__desc">Build the websites and apps your customers use, fast, reliable, and made to convert.<span class="svc__tags">Websites &middot; web apps &middot; mobile apps &middot; landing pages and integrations</span></div></div>
          </div>
        </div>
      </div>

      <div class="brief__foot">
        <div class="brief__star" aria-hidden="true"></div>
        <p>North Star Communications. Prepared for Meaning Global.</p>
      </div>
    </div>`,

    people: `
    <div class="brief">
      <p class="brief__eyebrow">North Star Communications &middot; Proposal for Meaning Global</p>
      <h1>The people who would run the work.</h1>
      <p class="brief__lede">You would work directly with the people below. Not an account manager passing notes to a team you never meet, but the people actually doing the thinking and the work.</p>
      <div class="people">
        <div class="person">
          <div class="person__av"><img src="assets/people/milos.jpg" alt="Miloš Milosavljević"></div>
          <div class="person__body">
            <h3>Miloš Milosavljević</h3>
            <p class="person__role">Founder and CEO, North Star Communications</p>
            <p class="person__bio">Miloš has spent more than twenty years turning complicated ideas into clear, human stories, across journalism, media, non-profits, SaaS, HR tech and B2B. He loves the moment a messy problem finally clicks into a simple plan a whole team can get behind, and he has built the platforms, products and campaigns to show it works in practice. Clients tend to value the same three things in him: a systems mind that connects the product, the message and the experience; a knack for saying hard things simply; and a habit of bringing people along rather than leaving them behind. He keeps the work grounded in real discovery, sharp positioning, and a clear path to market.</p>
          </div>
        </div>
        <div class="person">
          <div class="person__av"><img src="assets/people/tijana.jpg" alt="Tijana Damjanović Gertner"></div>
          <div class="person__body">
            <h3>Tijana Damjanović Gertner</h3>
            <p class="person__role">Partner and COO, North Star Communications</p>
            <p class="person__bio">Tijana is the kind of marketer who is as comfortable setting the strategy as she is rolling up her sleeves to run it. She blends creative instinct with a sharp commercial head, across brand identity, SEO and content, and full-funnel campaigns built to bring in real business. She has organized and marketed events on the biggest stage, including Miss Universe, and she is refreshingly straight with clients: she will tell you what she would do, show you why it works, and help you avoid the expensive mistakes. Look after your people and do right by your clients, and she is firmly in your corner.</p>
          </div>
        </div>
      </div>
      <div class="brief__foot">
        <div class="brief__star" aria-hidden="true"></div>
        <p>North Star Communications. Prepared for Meaning Global.</p>
      </div>
    </div>`,

    who: `
    <div class="brief">
      <p class="brief__eyebrow">North Star Communications &middot; Proposal for Meaning Global</p>
      <h1>Who we have worked with.</h1>
      <p class="brief__lede">A selection of the brands and organizations our team has delivered for, from venture-backed software to global consumer and financial names. The through-line: structure the expertise, make it discoverable, and turn attention into enquiries you can trace.</p>
      <div class="brief__body">
        <div class="cwall" data-hub-mount></div>
      </div>
      <div class="brief__foot">
        <div class="brief__star" aria-hidden="true"></div>
        <p>North Star Communications. Prepared for Meaning Global.</p>
      </div>
    </div>`,

    website: `<iframe src="website/" title="Meaning Global website prototype, rebuilt by North Star Communications"></iframe>`,

    cluster: `
    <div class="cluster">
      <h1>Content cluster: the Creation pillar</h1>
      <p class="lede">Every cluster is built the same way. A <strong>cornerstone essay</strong> and the supporting pieces around it all link up to the <strong>pillar page</strong> they serve. That pillar routes readers to the <strong>Sovereign Audit</strong>, which feeds the <strong>CRM</strong>, and every piece is amplified by a <strong>founder LinkedIn post</strong>. Shown below for the <strong>Creation</strong> pillar, meaning creation and self-realization. The nodes open the real, live pages.</p>
      <div class="diagram">
        <svg viewBox="0 0 1180 620" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="arw" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto"><path d="M0,0 L6.5,3 L0,6 Z" fill="#b8b8c0"/></marker>
            <marker id="arwC" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto"><path d="M0,0 L6.5,3 L0,6 Z" fill="#B4894C"/></marker>
          </defs>
          <text class="col-label" x="30" y="82">The content &middot; essays and the Report</text>
          <text class="col-label" x="595" y="250" text-anchor="middle">Creation pillar</text>
          <text class="col-label" x="985" y="250" text-anchor="middle">Web Form Submissions &middot; CRM</text>

          <path class="wire" marker-end="url(#arw)" d="M330 154 C 400 154, 405 330, 462 330"/>
          <path class="wire" marker-end="url(#arw)" d="M330 330 C 405 330, 410 330, 462 330"/>
          <path class="wire" marker-end="url(#arw)" d="M330 506 C 400 506, 405 330, 462 330"/>
          <path class="wire--crm" marker-end="url(#arwC)" d="M720 330 C 785 330, 795 330, 852 330"/>

          <foreignObject x="30" y="100" width="300" height="112"><div xmlns="http://www.w3.org/1999/xhtml" class="node node--case"><a class="node__link" href="website/thinking/luxury-has-lost-its-meaning/" target="_blank" rel="noopener"><span class="node__tag">Cornerstone essay</span><span class="node__title">Luxury has lost its meaning</span></a><span class="node__social"><span class="pf pf--li">in</span> Amplified on LinkedIn</span></div></foreignObject>
          <foreignObject x="30" y="276" width="300" height="112"><div xmlns="http://www.w3.org/1999/xhtml" class="node node--case"><a class="node__link" href="website/thinking/time-is-the-real-luxury/" target="_blank" rel="noopener"><span class="node__tag">Supporting essay</span><span class="node__title">Time is the real luxury</span></a><span class="node__social"><span class="pf pf--li">in</span> Amplified on LinkedIn</span></div></foreignObject>
          <foreignObject x="30" y="452" width="300" height="112"><div xmlns="http://www.w3.org/1999/xhtml" class="node node--case"><a class="node__link" href="website/thinking/the-luxury-report/" target="_blank" rel="noopener"><span class="node__tag">The Report &middot; authority</span><span class="node__title">The Luxury Report</span></a><span class="node__social"><span class="pf pf--li">in</span> Amplified on LinkedIn</span></div></foreignObject>

          <foreignObject x="470" y="270" width="250" height="120"><a xmlns="http://www.w3.org/1999/xhtml" class="node node--lp node__link" href="website/pillars/creation/" target="_blank" rel="noopener"><span class="node__tag">Pillar page</span><span class="node__title">Creation</span><span class="node__meta">Every piece links here &rarr;</span></a></foreignObject>
          <foreignObject x="860" y="278" width="250" height="105"><a xmlns="http://www.w3.org/1999/xhtml" class="node node--crm node__link" style="border-style:solid;cursor:pointer" href="#crm"><span class="node__tag">CRM &middot; live</span><span class="node__title">Leads &amp; pipeline</span><span class="node__meta">6 leads &middot; open the CRM &rarr;</span></a></foreignObject>
        </svg>
      </div>
      <div class="legend">
        <span><span class="swatch" style="background:#fff;border:1px solid var(--hairline)"></span> Essay or report</span>
        <span><span class="swatch" style="background:var(--ink)"></span> Pillar page</span>
        <span><span class="swatch" style="background:var(--accent-soft);border:2px dashed var(--accent)"></span> CRM object</span>
        <span><span class="pf pf--li" style="width:15px;height:15px">in</span> One founder LinkedIn post per piece</span>
      </div>
      <div class="cluster-note"><strong>How it works:</strong> a cornerstone essay, a supporting essay and the Luxury Report all link up to the <strong>Creation</strong> pillar page, which routes readers to the Sovereign Audit and feeds the CRM. Each piece is amplified by a founder LinkedIn post that points back into it. The other five pillars, Health, Nurture, Wealth, Connection and Longevity, cluster the same way. Node links open the real, live pages.</div>
    </div>`,
  },
};

/* --- Progressive enhancement: add a "Request type" column to the CRM table ---
   The chassis renderCrm() (index.html) hardcodes its columns. Rather than edit
   the version-pinned chassis, we override the global renderCrm AFTER it is
   defined. content.js runs before the chassis's inline <script>, so we wait for
   DOMContentLoaded (which fires after that script has executed and defined the
   global renderCrm plus its helpers esc/badge/CRM/STAGE_ORDER/crmState). The
   override mirrors the chassis renderer exactly, inserting one column that reads
   each lead's requestType. Filters and stage edits call the same global, so the
   column persists across every re-render. */
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function')
window.addEventListener('DOMContentLoaded', function () {
  if (typeof window.renderCrm !== 'function') return;
  window.renderCrm = function () {
    var meta = window.HUB.crmMeta || {};
    document.getElementById('crmHeading').textContent =
      meta.heading || (VIEWS.crm && VIEWS.crm.title) || 'Leads & pipeline';
    document.getElementById('crmLede').innerHTML = meta.lede
      || 'Every enquiry captured with source, attribution, the converting page and pipeline stage. Click a lead to open it.';
    var counts = {}; CRM.forEach(function (l) { counts[l.stage] = (counts[l.stage] || 0) + 1; });
    var fil = '<span class="sfil ' + (crmState.stage === "all" ? "active" : "") + '" onclick="setCrmFilter(\'all\')">All <span class="n">' + CRM.length + '</span></span>';
    STAGE_ORDER.forEach(function (s) { if (counts[s]) fil += '<span class="sfil ' + (crmState.stage === s ? "active" : "") + '" onclick="setCrmFilter(\'' + s + '\')">' + s + ' <span class="n">' + counts[s] + '</span></span>'; });
    document.getElementById('stageFilter').innerHTML = fil;
    var reqStyle = 'display:inline-block;padding:.2em .65em;border:1px solid var(--hairline);border-radius:999px;font-size:.78rem;font-weight:600;white-space:nowrap;color:var(--ink)';
    var rows = CRM.filter(function (l) { return crmState.stage === "all" || l.stage === crmState.stage; }).map(function (l) {
      return '<tr onclick="openCrmLead(\'' + l.id + '\')"><td><div class="nm">' + esc(l.name) + '</div><div class="sub">' + esc(l.email) + '</div></td>'
        + '<td><span style="' + reqStyle + '">' + esc(l.requestType || '—') + '</span></td>'
        + '<td>' + esc(l.projectType) + '</td><td><span class="src-pill ' + l.srcKind + '">' + esc(l.srcShort) + '</span></td>'
        + '<td>' + badge(l.stage) + '</td><td class="sub">' + esc(l.date) + '</td></tr>';
    }).join('');
    document.getElementById('crmList').innerHTML = '<div class="table-scroll"><table class="lead-table"><thead><tr><th>Lead</th><th>Request type</th><th>Project</th><th>Source</th><th>Stage</th><th>Received</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  };
  var crmView = document.getElementById('view-crm');
  if (crmView && !crmView.hidden) window.renderCrm();
});
