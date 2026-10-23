# KINGBAGS · Google Ads launch

Goal: booked proof-review calls from buyers who need 1,500+ custom bags.
Budget: $3,000/month to start ($100/day), raise to $4,000 once cost per
booked call is under $250. Landing page: https://www.kingbags.co/custom-bags

Everything below is in the order you do it. Budget two hours total.

---

## 1. Google Ads account (15 min)

1. Go to ads.google.com and sign in with the Google account that owns the
   GA4 property (G-N59VQSXXNF). Create the account as **King Universal Inc.**,
   currency USD, time zone America/New_York.
2. Skip the "smart campaign" wizard. Click **Switch to Expert Mode** at the
   bottom of the first screen. If you miss it, Tools → Settings → Expert mode.
3. Add billing (Billing → Settings). Card, monthly invoicing is not needed.
4. Write down the customer ID from the top right (format 123-456-7890).

## 2. Link GA4 and import conversions (15 min)

1. In Google Ads: Tools → Data manager → Google Analytics (GA4) → Link.
   Pick the KINGBAGS property, enable **Import site metrics** and
   **Enable personalized advertising**.
2. In GA4 (analytics.google.com): Admin → Events. Toggle **Mark as key
   event** on `generate_lead` and `book_call`. If `generate_lead` isn't
   listed yet, create it: Admin → Key events → New key event → name
   `generate_lead`. Same for `book_call`.
3. Back in Google Ads: Goals → Conversions → New conversion action →
   Import → Google Analytics 4 → Web. Tick `book_call` and `generate_lead`.
   - `book_call`: category **Submit lead form**, goal **Primary**, count
     **One**, value **Use value from GA4** (the quote total), fallback 250.
   - `generate_lead`: category **Request quote**, goal **Secondary**
     (observation only), count One.
   Primary = what Google bids toward. Secondary = tracked but not optimized.
4. Optional but better: direct Ads conversions so bidding doesn't wait on
   the GA4 import. Goals → Conversions → New conversion action → Website →
   enter kingbags.co → "Add a conversion action manually" twice:
   - Name **Call booked**, category Submit lead form, value 250, count One.
   - Name **Price requested**, category Request quote, value 1, count One,
     goal Secondary.
   Each one shows a **Conversion ID** (AW-XXXXXXXXX, same for both) and a
   **Conversion label**. Send me the ID and both labels and I'll set
   `NEXT_PUBLIC_GADS_ID`, `NEXT_PUBLIC_GADS_BOOK_LABEL`, and
   `NEXT_PUBLIC_GADS_LEAD_LABEL` on Vercel. The site already fires them.
5. Tools → Data manager → Enhanced conversions → turn on, "Google tag".
   The site already sends the hashed email.

## 3. Campaign structure (30 min)

One Search campaign, three ad groups. Nothing else yet (no Performance Max,
no Display, no Shopping). Those spend money finding you; Search finds people
who are already looking.

**Campaign: KINGBAGS · Search · Custom Bags**
- Objective: Leads. Type: Search. Untick "Display Network" and "Search
  partners".
- Location: United States. Under Location options choose **Presence**
  (people in the US), not "presence or interest".
- Language: English.
- Bidding: **Maximize conversions**. No target CPA for the first 30
  conversions. After that, set target CPA at 1.2× your actual average.
- Budget: $100/day.
- Ad schedule: all days, 6am–10pm Eastern. Buyers search at work.
- Campaign-level negatives: paste the list in section 5.

### Ad group A · Custom tote bags (your core)
Keywords (phrase match unless noted):
- "custom tote bags bulk"
- "custom printed tote bags"
- "custom tote bags wholesale"
- "branded tote bags bulk"
- "custom logo tote bags"
- "custom canvas tote bags bulk"
- [custom tote bags] (exact)
- [custom printed tote bags] (exact)

### Ad group B · Reusable grocery / shopping bags
- "custom reusable grocery bags"
- "custom reusable shopping bags"
- "custom printed grocery bags"
- "reusable grocery bags with logo"
- "custom non woven bags"
- "custom laminated tote bags"
- "wholesale reusable bags custom"
- [custom reusable bags] (exact)

### Ad group C · Retail / brand programs (highest ticket)
- "custom retail bags"
- "custom shopping bags for retail stores"
- "branded shopping bags bulk"
- "custom bags for business"
- "custom merchandise bags"
- "private label tote bags"
- "custom bag manufacturer"
- "full color printed tote bags"

Final URL for every ad group: `https://www.kingbags.co/custom-bags`
Tracking template at campaign level (Settings → Campaign URL options):
`{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}`
This stamps the source on every quote in the ops panel.

## 4. Ad copy (paste as-is)

One Responsive Search Ad per ad group. Google rotates the headlines; pin
H1 to position 1. Use the same descriptions in all three groups.

**Ad group A headlines**
1. Custom Tote Bags, Priced in 30 Sec (pin 1)
2. Your Art On Every Inch Of The Bag
3. Fully Custom Cut & Sew Totes
4. Real Delivered Price, No Quote Wait
5. From 1,500 Bags, 5–6 Week Delivery
6. Built For National Brand Programs
7. Free Photoreal Proof Before You Pay
8. Freight & Duties Included
9. Talk To A Bag Specialist, 15 Min
10. Edge-To-Edge Print, Not A Logo Slap

**Ad group B headlines**
1. Custom Reusable Bags, Priced in 30 Sec (pin 1)
2. Full-Color Print On Every Panel
3. Laminated, Wipes Clean, Lasts Years
4. Real Delivered Price, No Quote Wait
5. From 1,500 Bags, 5–6 Week Delivery
6. Same Spec As Grocery Chain Programs
7. Free Photoreal Proof Before You Pay
8. Freight & Duties Included
9. Reinforced Handles, Board Bottom
10. Talk To A Bag Specialist, 15 Min

**Ad group C headlines**
1. Custom Retail Bags, Priced in 30 Sec (pin 1)
2. The Team Behind National Bag Programs
3. Fully Custom Cut & Sew, Sold Direct
4. Your Brand On Every Inch Of The Bag
5. Real Delivered Price, No Quote Wait
6. From 1,500 Bags, 5–6 Week Delivery
7. Free Photoreal Proof Before You Pay
8. Freight & Duties Included
9. Talk To A Bag Specialist, 15 Min
10. Built To Retail Quality, Not Giveaway

**Descriptions (all groups)**
1. Pick bag, size, and quantity for an all-in delivered price. Then 15 minutes with a specialist and a free proof. Nothing charged until you approve.
2. Fully custom cut-and-sew bags from the team behind programs for national brands. Edge-to-edge print, reinforced handles, 5–6 weeks delivered.
3. No quote emails, no freight surprise. Bag, print, air freight, and duties in one number. From 1,500 bags.
4. We've shipped millions of bags for America's biggest brands. Same factories, same spec, simpler to buy.

**Sitelinks** (Assets → Sitelinks, campaign level)
- Get Your Price → /custom-bags
- See Pricing Tiers → /pricing
- $35 Sample Kit → /samples
- Buyer FAQ → /faq

**Callouts**: All-In Delivered Pricing · Free Proof · From 1,500 Bags ·
5–6 Week Delivery · Raleigh, NC Team

**Call asset**: add your phone number once it's live on the site. Set it
to show only during business hours.

## 5. Negative keywords (campaign level, paste all)

free, cheap, diy, pattern, sewing pattern, how to make, tutorial, template
download, amazon, etsy, walmart, target, dollar, paper bags, plastic bags,
poly mailers, garbage bags, trash bags, ziploc, backpack, duffel, luggage,
purse, handbag, leather, designer, louis, gucci, coach, sleeping bag, bean
bag, tea bags, body bag, punching bag, golf bag, gym bag, diaper bag, bag
of, under eye, job, jobs, salary, career, hiring, near me, 100, 50, 25,
small quantity, no minimum, one, single, sample only, blank tote, blank
bags, wholesale blank, screen print kit, heat press, cricut, sublimation
blanks, printable, clipart, vector, mockup, svg

Review Search terms (Insights → Search terms) every day for the first week
and add anything irrelevant as a negative. This is where the budget leaks.

## 6. Monday morning checklist

- [ ] Campaign Enabled, ads Approved (can take 24h; submit Sunday night).
- [ ] Conversion actions show "Recording conversions" within 48h of the
      first form submit. If not, send me the Conversion ID and labels.
- [ ] Google Ads → Tools → Linked accounts → GA4 shows Linked.
- [ ] Calendly event set to 15 minutes with three questions: quantity,
      when you need them, company. Reminder 24h and 1h before.
- [ ] You are watching the ops panel (Quotes tab) and your inbox for the
      "New locked quote" alerts. Reply to every price request within one
      business hour, even if they already booked.
- [ ] Phone number set on Vercel (NEXT_PUBLIC_PHONE) so it shows on the
      landing page and in the call asset.

## 7. What good looks like, and when to change things

| Metric | Week 1 target | If worse after 2 weeks |
| --- | --- | --- |
| Click-through rate | > 4% | Rewrite headlines, check keyword/ad fit |
| Cost per click | $3–8 | Tighten to exact match, drop ad group C |
| Price requests per 100 clicks | 5+ | Landing page problem; tell me |
| Calls booked per price request | 40%+ | Calendly friction; tell me |
| Cost per booked call | < $250 | Pause the worst ad group, not the campaign |

Do not touch bidding, budget, or keywords more than once a week. Google
resets its learning every time you change them, and the first two weeks
are the learning period. Add negatives daily; change everything else weekly.

## 8. After the first 30 conversions

- Switch bidding to **Target CPA** at 1.2× the observed cost per call.
- Split ad group C into its own campaign with its own budget if it's
  producing the biggest quotes.
- Add a Remarketing list (people who priced but didn't book) and run a
  small Display campaign at $10/day pointing to /custom-bags with "Your
  price is still good" copy. I'll build that creative when you're there.
