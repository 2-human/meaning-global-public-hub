#!/usr/bin/env python3
"""Static-site builder for the Meaning Global website rebuild (prototype).

Wraps each page's body fragment (in _src/pages/) in a shared brand header/footer
and writes pretty-URL pages into website/. Depth-relative {{ROOT}} keeps the site
base-independent (works at meaning-global.nsc.agency/website/ or at domain root).
Edit fragments + this file only; run `python3 build.py` to regenerate.

Design: editorial thought-leadership, photo-free. The Sovereign Hexagon is the
navigational spine. Every page ladders vision -> concrete. House style: no
em-dashes, no emojis in agency voice; hedge audits with may/could/might.
"""
import os, shutil

SRC = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(SRC)  # website/

BRANDMARK = ('<svg class="brand__mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">'
  '<path d="M16 2.5 27.7 9v14L16 29.5 4.3 23V9L16 2.5Z" stroke="#B08D4F" stroke-width="1.5"/>'
  '<path d="M16 9.5 21.9 13v6L16 22.5 10.1 19v-6L16 9.5Z" fill="#B08D4F" fill-opacity=".2" stroke="#B08D4F" stroke-width="1.2"/>'
  '<circle cx="16" cy="16" r="1.7" fill="#B08D4F"/></svg>')

# (key, href, label, children) — children None for a plain link, else list of
# (href, label, sublabel_or_None). A child page sets its `active` to the parent key.
NAV = [
    ("economy",  "new-earth-economy/",    "New Earth Economy", None),
    ("hexagon",  "sovereign-hexagon/",    "Sovereign Hexagon", None),
    ("services", "services/",             "Services", [
        ("services/",                          "All services", "The engagement model"),
        ("sovereign-audit/",                   "The Sovereign Audit", "The entry diagnostic"),
        ("services/future-proofing-brands/",   "Future-Proofing Brands", "Evolutionary trajectory"),
        ("services/advisory-alignment/",       "Advisory &amp; Alignment", "Strategic realignment"),
        ("services/meaning-strategy/",         "Meaning Strategy", "The humanistic core"),
        ("services/business-reimagination/",   "Business Reimagination", "New value ecosystems"),
    ]),
    ("speaking", "speaking/",             "Speaking",              None),
    ("thinking", "thinking/",             "Thinking", [
        ("thinking/",                          "Overview", "Books, media and essays"),
        ("thinking/the-luxury-report/",        "The Luxury Report", "The book"),
        ("thinking/reimagining-consumerism/",  "Reimagining Consumerism", "The study"),
        ("thinking/in-media/",                 "In Media", "Features and interviews"),
        ("thinking/thought-leadership/",       "Thought Leadership", "Essays by pillar"),
    ]),
    ("contact",  "contact/",              "Contact",               None),
]

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} | Meaning Global</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title} | Meaning Global">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<link rel="icon" href="{root}assets/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{root}assets/site.css">
{schema}
</head>
<body>
<div class="proto-note">Prototype rebuild by <b>North Star Communications</b> &middot; a review candidate, not the live meaning.global</div>
<header class="site-head"><div class="wrap site-head__in">
  <a class="brand" href="{root}index.html">{brandmark}<span>Meaning Global<small>The New Earth Economy</small></span></a>
  <button class="navtoggle" aria-label="Menu" onclick="document.body.classList.toggle('nav-open')"><span></span><span></span><span></span></button>
  <nav class="nav">{nav}
    <a class="btn btn--sm btn--brass nav__cta" href="{root}sovereign-audit/">Request Audit</a>
  </nav>
</div></header>
<main>
"""

FOOT = """</main>
<section class="founder">
  <div class="wrap founder__in">
    <div class="founder__text">
      <p class="eyebrow">The founder</p>
      <h2>Dr. Martina Olbert</h2>
      <p class="founder__bio">Founder and Chief Economic Architect of Meaning Global. Recognized by Forbes as a preeminent authority on brand meaning and a leading voice on Humanistic Capitalism. Author of <em>The Luxury Report</em> and <em>Reimagining Consumerism As A Force For Good</em>, annually top-ranked on Thinkers360 since 2020, and a global keynote speaker represented by Chartwell Speakers, London.</p>
      <div class="founder__actions">
        <a class="btn btn--brass" href="{root}speaking/">Book a keynote</a>
        <a class="btn btn--ghost" href="{root}thinking/">Read her thoughts</a>
        <a class="btn btn--ghost" href="https://www.linkedin.com/in/martinaolbert/" target="_blank" rel="noopener">Follow on LinkedIn</a>
      </div>
    </div>
    <div class="founder__book founder__portrait">
      <img src="{root}assets/img/martina.webp" alt="Dr. Martina Olbert, Founder and Chief Economic Architect of Meaning Global">
    </div>
  </div>
</section>
__TESTIMONIALS__
<footer class="site-foot"><div class="wrap">
  <div class="foot__grid">
    <div class="foot__brand">
      <a class="brand" href="{root}index.html">{brandmark}<span>Meaning Global</span></a>
      <p>Building the New Earth Economy. We reimagine brands, organizations and leaders around meaning, so that human flourishing becomes a logical output of the business.</p>
    </div>
    <div>
      <h4>The Work</h4>
      <a href="{root}new-earth-economy/">The New Earth Economy</a>
      <a href="{root}sovereign-hexagon/">The Sovereign Hexagon</a>
      <a href="{root}services/">Services</a>
      <a href="{root}sovereign-audit/">The Sovereign Audit</a>
    </div>
    <div>
      <h4>Thinking &amp; Speaking</h4>
      <a href="{root}thinking/">Thinking</a>
      <a href="{root}thinking/in-media/">In Media</a>
      <a href="{root}thinking/thought-leadership/">Thought Leadership</a>
      <a href="{root}speaking/">Speaking</a>
    </div>
    <div>
      <h4>Contact</h4>
      <a href="{root}contact/">Get in touch</a>
      <a href="mailto:hello@meaning.global">hello@meaning.global</a>
      <a href="https://www.linkedin.com/in/martinaolbert/" target="_blank" rel="noopener">LinkedIn &middot; Dr. Martina Olbert</a>
      <span style="display:block;padding:.24rem 0;color:rgba(236,230,216,.42)">London &middot; Prague &middot; New York</span>
    </div>
  </div>
  <div class="foot__bar">
    <span>&copy; 2017&ndash;2026 Meaning Global. Prototype for demonstration by North Star Communications.</span>
    <span>The Sovereign Hexagon&trade; and Humanistic Capitalism are proprietary to Meaning Global.</span>
  </div>
</div></footer>
<script src="{root}assets/review-bootstrap.js" defer></script>
</body></html>"""


# (slug, num, name, meaning, hue-var, image, short description) — for the "other pillars" strip
PILLARS = [
    ("health",     "01", "Health",     "Grounded meaning",       "--p-health",    "pillar-health.webp",     "Restoring the body&rsquo;s baseline: health, healing, pharma, fitness and wellness. The value is the capacity to function and feel well."),
    ("nurture",    "02", "Nurture",    "Embodied meaning",       "--p-nurture",   "pillar-nurture.webp",    "Nourishment felt in the body: high-quality food, functional nutrition, beverage and clean supplementation."),
    ("wealth",     "03", "Wealth",     "Materialized meaning",   "--p-wealth",    "pillar-wealth.webp",     "Material security: the new personal economy, finance, banking and investment. The value is agency, the freedom solvency buys."),
    ("connection", "04", "Connection", "Shared meaning",         "--p-connect",   "pillar-connection.webp", "Connecting people and systems: technology, AI, conscious media and clean energy. The value is belonging."),
    ("creation",   "05", "Creation",   "Meaning creation",       "--brass",       "pillar-creation.webp",   "Self-realization: luxury, design, fashion and new materials. The value is identity, the new meaning of luxury."),
    ("longevity",  "06", "Longevity",  "Future-proofed meaning", "--p-longevity", "pillar-longevity.webp",  "Extending and expanding a life: longevity labs, biotech, human-tech and research. The value is meaningful time."),
]

def other_pillars_html(current, root):
    cards = ""
    for slug, num, name, meaning, hue, img, desc in PILLARS:
        if slug == current:
            continue
        cards += ('\n      <a class="pcard pcard--img" style="--hue:var(%s)" href="%spillars/%s/">'
                  '<span class="pcard__bar"></span>'
                  '<img class="pcard__img" src="%sassets/img/%s" alt="">'
                  '<div class="pcard__body"><span class="pcard__n">%s</span><h3>%s</h3>'
                  '<p class="pcard__meaning">%s</p><p>%s</p>'
                  '<span class="pcard__more">Open the pillar &rarr;</span></div></a>'
                  % (hue, root, slug, root, img, num, name, meaning, desc))
    return ('<section class="sec sec--paper"><div class="wrap">'
            '<div class="sec-head"><p class="eyebrow">The other pillars</p>'
            '<h2>Explore the rest of the Hexagon.</h2></div>'
            '<div class="opillars">%s\n    </div></div></section>' % cards)


# (quote, name, title) — extracted verbatim from the References slider on meaning.global
TESTIMONIALS = [
    ("Take Dr. Olbert&rsquo;s advice.", "Marty Neumeier", "Author of The Brand Gap, Director of CEO Branding at Liquid Agency"),
    ("Astonishingly valuable.", "Rory Sutherland", "Author of Alchemy and Vice-Chairman of Ogilvy UK"),
    ("Martina presents a clear roadmap for how brands can ensure they are not engaging in purpose-washing, but rather authentically engage with consumers as humans. The thought leader we need for the &rsquo;20s and beyond.", "Dr. Giana Eckhardt", "Professor of Marketing at King&rsquo;s Business School, King&rsquo;s College London"),
    ("Dr. Martina Olbert is a true visionary and a revolutionary thought leader who can clearly see the future of meaning for consumers. She is so far ahead of the curve as to be able to see and think way beyond what is conventional. Ultimately, Martina is an alchemist of the highest order with a magic so rare it transcends business into the realm of the entirety of the human endeavor.", "John Hays", "Founder and CEO, Ataraxia Living"),
    ("What Martina offers is a quake under our feet. Her suggestion is to not stand behind false totems. Face up and face forward to the reality of life, its light and its darkness. That is what will put us on firmer ground. Exceptional view.", "Dr. Bob Deutsch", "Cognitive Anthropologist, Founder of Brain-Sells, Author of Apple&rsquo;s &lsquo;Think Different&rsquo;"),
    ("Martina brings a unique and highly valued perspective to the discourse on brands today. She is one of the marketing oriented leaders shaping a better world through brand.", "Derrick Daye", "Publisher of Branding Strategy Insider and CEO of The Blake Project"),
    ("As the world&rsquo;s preeminent authority on brand meaning, there is no one better to address what all the changes the world, consumers, and brands are experiencing mean than Martina. I have been coming back to her again and again for her amazing insights and understanding.", "Pamela Danziger", "Luxury Author, Speaker, and Senior Columnist for Forbes.com"),
    ("Martina is the rare person in the business capable of seeing beyond the problems of today to grasp the underlying thematic issues that have led to their development. She brings intelligence, experience, and sensitivity to every project, speaking for the human perspective with competence, creativity, and relevance.", "Jonathan Cook", "Ritual Design Researcher and Creator of This Human Business Podcast"),
]

def testimonials_html():
    slides, dots = "", ""
    for k, (quote, name, title) in enumerate(TESTIMONIALS):
        on = " is-on" if k == 0 else ""
        slides += ('\n        <figure class="tslide%s"><blockquote class="tquote">&ldquo;%s&rdquo;</blockquote>'
                   '<figcaption class="tcite"><span class="tname">%s</span><span class="ttitle">%s</span></figcaption></figure>'
                   % (on, quote, name, title))
        dots += '<button class="tdot%s" type="button" aria-label="Testimonial %d"></button>' % (" is-on" if k == 0 else "", k + 1)
    return ('<section class="sec testimonials"><div class="wrap">'
            '<div class="sec-head center"><p class="eyebrow" style="text-align:center">References</p>'
            '<h2>What clients and industry leaders have said.</h2></div>'
            '<div class="tslider" id="tslider">%s\n      </div>'
            '<div class="tdots">%s</div></div>'
            '<script>(function(){var r=document.getElementById("tslider");if(!r)return;'
            'var s=r.querySelectorAll(".tslide"),d=document.querySelectorAll(".tdot"),i=0,n=s.length,t;'
            'function show(k){i=(k+n)%%n;s.forEach(function(x,j){x.classList.toggle("is-on",j===i)});'
            'd.forEach(function(x,j){x.classList.toggle("is-on",j===i)})}'
            'function go(){clearInterval(t);t=setInterval(function(){show(i+1)},7000)}'
            'd.forEach(function(x,j){x.addEventListener("click",function(){show(j);go()})});go()})();</script>'
            '</section>' % (slides, dots))


def nav_html(active, root):
    out = ""
    for key, href, label, children in NAV:
        act = ' active' if key == active else ''
        if not children:
            out += f'\n    <a class="nav__link{act}" href="{root}{href}">{label}</a>'
        else:
            subs = ""
            for child in children:
                h, l = child[0], child[1]
                sub = child[2] if len(child) > 2 else None
                sublabel = f'<small>{sub}</small>' if sub else ''
                subs += f'<a href="{root}{h}">{l}{sublabel}</a>'
            out += (f'\n    <div class="nav__item">'
                    f'<a class="nav__link nav__parent{act}" href="{root}{href}">{label}<span class="nav__caret">&#9662;</span></a>'
                    f'<div class="nav__sub">{subs}</div></div>')
    return out


# (out_path, root, active, title, desc, fragment_file, schema_file_or_None)
PAGES = [
    ("index.html", "", "home",
     "Building the New Earth Economy",
     "Meaning Global reimagines brands, organizations and leaders around meaning, the currency of the new economy. The Sovereign Hexagon maps where your business creates human value, and where it does not yet.",
     "home.html", "schema/site.html"),

    ("new-earth-economy/index.html", "../", "economy",
     "The New Earth Economy",
     "What the New Earth Economy is, why meaning is its currency, and how Humanistic Capitalism replaces debt-based extraction with human value. The thesis, in plain terms.",
     "new-earth-economy.html", "schema/faq-economy.html"),

    ("sovereign-hexagon/index.html", "../", "hexagon",
     "The Sovereign Hexagon",
     "The Sovereign Hexagon is the foundational architecture of the New Earth Economy: six dimensions of a meaningful, sovereign human life that a brand can create value across. Explore all six pillars.",
     "sovereign-hexagon.html", "schema/faq-hexagon.html"),

    ("pillars/creation/index.html", "../../", "hexagon",
     "Creation &middot; The New Meaning of Luxury",
     "Pillar 5 of the Sovereign Hexagon. Creation is where brands enable self-realization: luxury, design, fashion, materials. The new luxury is meaning, not ostentation.",
     "pillars/creation.html", "schema/faq-creation.html"),
    ("pillars/health/index.html", "../../", "hexagon",
     "Health &middot; Grounded Meaning",
     "Pillar 1 of the Sovereign Hexagon. Health is where a brand restores life force: health protocols, healing, pharma, fitness, wellness. The value created is the capacity to function and feel well.",
     "pillars/health.html", None),
    ("pillars/nurture/index.html", "../../", "hexagon",
     "Nurture &middot; Embodied Meaning",
     "Pillar 2 of the Sovereign Hexagon. Nurture is where a brand nourishes: high-quality food, functional nutrition and beverage, clean supplementation. The value created is daily well-being, felt in the body.",
     "pillars/nurture.html", None),
    ("pillars/wealth/index.html", "../../", "hexagon",
     "Wealth &middot; Materialized Meaning",
     "Pillar 3 of the Sovereign Hexagon. Wealth is where a brand builds material security: finance, banking, investment, the new personal economy. The value created is agency, the freedom solvency buys.",
     "pillars/wealth.html", None),
    ("pillars/connection/index.html", "../../", "hexagon",
     "Connection &middot; Shared Meaning",
     "Pillar 4 of the Sovereign Hexagon. Connection is where a brand connects people: technology, AI, conscious media, clean energy. The value created is belonging and self-sufficiency.",
     "pillars/connection.html", None),
    ("pillars/longevity/index.html", "../../", "hexagon",
     "Longevity &middot; Future-Proofed Meaning",
     "Pillar 6 of the Sovereign Hexagon. Longevity is where a brand extends and expands a life: longevity labs, biotech, HumanTech, research. The value created is time, and the potential a longer life unlocks.",
     "pillars/longevity.html", None),

    ("sovereign-audit/index.html", "../", "audit",
     "Run the Sovereign Audit",
     "The Sovereign Audit is the diagnostic that maps your brand onto the six pillars of the Sovereign Hexagon, showing where you create human value today and where you leave it on the table. Request yours.",
     "sovereign-audit.html", None),

    ("services/index.html", "../", "services",
     "Services",
     "Five ways Meaning Global builds meaning into a business, from the Sovereign Audit through future-proofing, advisory, meaning strategy and business reimagination. The engagement model.",
     "services.html", None),
    ("services/future-proofing-brands/index.html", "../../", "services",
     "Future-Proofing Brands",
     "The New Earth asks for a changed philosophy for brands. We check that your brand and business model are aligned with where humanity is going next, so you keep creating meaning as the ground shifts.",
     "services/future-proofing-brands.html", None),
    ("services/advisory-alignment/index.html", "../../", "services",
     "Advisory &amp; Alignment",
     "Targeted advisory to course-correct strategy, marketing and communications that have drifted out of alignment with the New Earth Economy.",
     "services/advisory-alignment.html", None),
    ("services/meaning-strategy/index.html", "../../", "services",
     "Meaning Strategy",
     "Defining the humanistic meaning at the core of your brand and organization, so you create lasting value rather than becoming obsolete.",
     "services/meaning-strategy.html", None),
    ("services/business-reimagination/index.html", "../../", "services",
     "Business Reimagination",
     "The lasting path to value is to reimagine what your brand does and how it creates value for humanity. We redesign the value ecosystem itself.",
     "services/business-reimagination.html", None),

    ("speaking/index.html", "../", "speaking",
     "Speaking",
     "Dr. Martina Olbert on the New Earth Economy, Human Sovereignty, Humanistic Brands and the New Luxury, for conferences, client events and business schools. Represented by Chartwell Speakers.",
     "speaking.html", None),

    ("thinking/index.html", "../", "thinking",
     "Thinking",
     "The intellectual foundation of the New Earth Economy: two books, features and interviews in the global press, and a library of essays clustered around the Sovereign Hexagon.",
     "thinking.html", None),
    ("thinking/the-luxury-report/index.html", "../../", "thinking",
     "The Luxury Report",
     "Redefining the future meaning of luxury: five cultural shifts and five strategic actions for brands to regain cultural relevance, transform value and drive growth. By Dr. Martina Olbert.",
     "thinking/the-luxury-report.html", None),
    ("thinking/reimagining-consumerism/index.html", "../../", "thinking",
     "Reimagining Consumerism As A Force For Good",
     "The founding study, published in the American Journal of Consumer Research: why the future of brands and capitalism is built on meaning. By Dr. Martina Olbert.",
     "thinking/reimagining-consumerism.html", None),
    ("thinking/in-media/index.html", "../../", "thinking",
     "In Media",
     "Selected features, interviews and commentary on meaning, luxury, brands and the future of capitalism, across Forbes, the BBC, Newsweek, WARC, Vogue Business and more.",
     "thinking/in-media.html", None),
    ("thinking/thought-leadership/index.html", "../../", "thinking",
     "Thought Leadership",
     "Original essays on where durable value is going, clustered around the six pillars of the Sovereign Hexagon.",
     "thinking/thought-leadership.html", None),

    ("thinking/luxury-has-lost-its-meaning/index.html", "../../", "thinking",
     "Luxury Has Lost Its Meaning. Here Is the Architecture to Get It Back",
     "Luxury built its value on scarcity and status. Those signals are weakening. A working architecture for rebuilding luxury on meaning, the one form of value that does not depreciate.",
     "thinking/luxury-has-lost-its-meaning.html", "schema/article-luxury.html"),
    ("thinking/health-the-new-ground-of-value/index.html", "../../", "thinking",
     "Health Is the New Ground of Value",
     "The fear and sick-care model is eroding as buyers grow more literate. Durable value in health, wellness and pharma is shifting to measurable life-force restoration.",
     "thinking/health-the-new-ground-of-value.html", "schema/article-health.html"),
    ("thinking/the-new-meaning-of-nourishment/index.html", "../../", "thinking",
     "The New Meaning of Nourishment",
     "Food and nutrition brands optimized for craving, convenience and cost. The durable value is shifting to genuine nourishment a person can feel in their body.",
     "thinking/the-new-meaning-of-nourishment.html", "schema/article-nurture.html"),
    ("thinking/what-finance-is-for/index.html", "../../", "thinking",
     "What Finance Is For",
     "Finance has treated money as the end rather than the means. Durable value is shifting to finance that genuinely expands human agency and freedom.",
     "thinking/what-finance-is-for.html", "schema/article-wealth.html"),
    ("thinking/the-architecture-of-belonging/index.html", "../../", "thinking",
     "The Architecture of Belonging",
     "Technology optimized for attention and extraction is a compounding trust debt. Durable value is moving to conscious technology that builds belonging and self-sufficiency.",
     "thinking/the-architecture-of-belonging.html", "schema/article-connection.html"),
    ("thinking/time-is-the-real-luxury/index.html", "../../", "thinking",
     "Time Is the Real Luxury",
     "The longevity and biotech industries risk selling fear of death and vanity. The durable value is more meaningful time and fuller human potential, not just more years.",
     "thinking/time-is-the-real-luxury.html", "schema/article-longevity.html"),
    ("thinking/corporate-purpose-or-human-meaning/index.html", "../../", "thinking",
     "Corporate Purpose or Human Meaning",
     "Why human meaning matters more to a business than stated corporate purpose.",
     "thinking/corporate-purpose-or-human-meaning.html", "schema/article-corporate-purpose.html"),
    ("thinking/the-real-value-of-diversity/index.html", "../../", "thinking",
     "The Real Value of Diversity",
     "The real value of diversity, and how to use it to drive meaningful growth.",
     "thinking/the-real-value-of-diversity.html", "schema/article-diversity.html"),

    ("contact/index.html", "../", "contact",
     "Contact",
     "Get in touch with Meaning Global: book Dr. Martina Olbert for a keynote, make a media or partnership inquiry, or send a general message. To run the Sovereign Audit, start on the Sovereign Audit page.",
     "contact.html", None),
]


def build():
    for out_path, root, active, title, desc, frag, schema in PAGES:
        body = open(os.path.join(SRC, "pages", frag), encoding="utf-8").read()
        schema_html = ""
        if schema:
            schema_html = open(os.path.join(SRC, "pages", schema), encoding="utf-8").read()
        # "The other pillars" strip on each pillar page (above the founder block)
        extra = ""
        if out_path.startswith("pillars/"):
            extra = other_pillars_html(out_path.split("/")[1], "{{ROOT}}")
        foot = FOOT.format(root=root, brandmark=BRANDMARK).replace("__TESTIMONIALS__", testimonials_html())
        page = (HEAD.format(title=title, desc=desc, root=root, brandmark=BRANDMARK,
                            nav=nav_html(active, root), schema=schema_html)
                + body + extra + foot)
        page = page.replace("{{ROOT}}", root)
        dest = os.path.join(OUT, out_path)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        open(dest, "w", encoding="utf-8").write(page)
        print("wrote", out_path)
    # assets: copy the whole _src/assets/ (review widget etc.), then site.css + favicon
    out_assets = os.path.join(OUT, "assets")
    os.makedirs(out_assets, exist_ok=True)
    src_assets = os.path.join(SRC, "assets")
    if os.path.isdir(src_assets):
        for name in os.listdir(src_assets):
            if name.startswith("."):
                continue  # skip dev sidecars (e.g. .composition-manifest.md); keep them in _src only
            s = os.path.join(src_assets, name)
            if os.path.isfile(s):
                shutil.copy(s, os.path.join(out_assets, name))
            elif os.path.isdir(s):  # e.g. assets/img/ — copy the whole subtree
                shutil.copytree(s, os.path.join(out_assets, name), dirs_exist_ok=True)
    shutil.copy(os.path.join(SRC, "site.css"), os.path.join(out_assets, "site.css"))
    fav = os.path.join(OUT, "..", "favicon.svg")
    if os.path.exists(fav):
        shutil.copy(fav, os.path.join(out_assets, "favicon.svg"))
    print("done")


if __name__ == "__main__":
    build()
