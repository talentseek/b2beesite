# PlanBee Action Plan

## Project Overview
Transform B2BEE from a simple bee showcase into a comprehensive AI automation platform with industry-specific use cases, advanced pricing models, and conversion-optimized pages.

## Technical Decisions Made
- **Content Storage**: Database-first approach (PostgreSQL)
- **Bee Status**: Simple enum field (active/inactive/draft)
- **Pricing**: Extend current regional pricing with optional usage rates
- **Routes**: Slug-based URLs (`/appointment-bee/estate-agents`)
- **Components**: Server Components with inline styles (current approach)
- **Database**: Modify existing tables to support new fields
- **Analytics**: Use existing system
- **Currency**: Store separate prices per currency
- **Notifications**: Extend existing email system with bee-specific tracking

---

## MILESTONE 1: Database Schema & Core Bee Structure
**Duration**: 2-3 days  
**Goal**: Extend database to support new bee structure and pricing model

### Tasks:
1. **Update Bee Table Schema**
   - Add `slug` field (unique, for URLs)
   - Add `tagline` field
   - Add `status` enum field (active/inactive/draft)
   - Add `short_description` field
   - Add `long_description` field
   - Add `features` JSON field
   - Add `integrations` JSON field
   - Add `roi_model` JSON field
   - Add `faqs` JSON field
   - Add `demo_assets` JSON field
   - Add `seo_title` field
   - Add `seo_description` field
   - Add `seo_og_image` field

2. **Create Usage Pricing Table**
   - Table: `bee_usage_pricing`
   - Fields: `bee_id`, `currency_code`, `usage_type`, `rate_per_unit`, `unit_description`
   - Example: `appointment-bee`, `GBP`, `per_minute`, `0.15`, `per minute`

3. **Create CTA Packs Table**
   - Table: `cta_packs`
   - Fields: `id`, `name`, `primary_label`, `primary_action`, `secondary_label`, `secondary_action`, `microcopy`

4. **Create Bee CTA Assignments Table**
   - Table: `bee_cta_assignments`
   - Fields: `bee_id`, `cta_pack_id`, `is_default`

5. **Update Email Subscriptions Table**
   - Add `bee_id` field (optional, for bee-specific notifications)
   - Add `use_case_slug` field (optional)

6. **Migration Scripts**
   - Create migration to add new fields to existing bees table
   - Generate slugs for existing bees (e.g., "appointment-bee", "sales-bee")
   - Create default CTA packs
   - Assign default CTAs to existing bees

---

## MILESTONE 2: Enhanced Bee Profile Pages
**Duration**: 3-4 days  
**Goal**: Create comprehensive bee profile pages with new structure

### Tasks:
1. **Update Bee Interface Type**
   - Extend TypeScript interface to include all new fields
   - Update API responses to include new data

2. **Create New Bee Profile Layout Components**
   - `BeeHero` component (name, tagline, status, short pitch, image)
   - `BeePricing` component (base + usage, currency toggle, price notes)
   - `BeeSkills` component (features list with badges)
   - `BeeSavings` component (ROI calculator)
   - `BeeIntegrations` component (logos list)
   - `BeeDemo` component (audio/video samples)
   - `BeeFAQ` component (expandable Q&A)
   - `BeeCTA` component (configurable CTAs)

3. **Update Bee Profile Page (`/bees/[slug]`)**
   - Implement new layout with all components
   - Add status-based rendering logic
   - Add currency toggle functionality
   - Implement ROI calculator
   - Add CTA system integration

4. **Status-Based Behavior**
   - **Active**: Show full page + purchase/demo CTAs
   - **Inactive**: Show "Coming Soon" banner + email capture
   - **Draft**: Return 404 for public access

5. **Currency Toggle System**
   - Add currency selector (GBP/USD/EUR)
   - Update pricing display based on selection
   - Store preference in cookies/localStorage

6. **ROI Calculator Component**
   - Inputs: calls/month, avg call length, staff cost
   - Outputs: estimated cost vs Bee
   - Real-time calculation updates

---

## MILESTONE 3: Use Case System Foundation
**Duration**: 2-3 days  
**Goal**: Create database structure and basic routing for use cases

### Tasks:
1. **Create Use Cases Table**
   - Fields: `id`, `bee_id`, `slug`, `industry`, `headline`, `subheadline`
   - Fields: `problem_section`, `solution_section`, `example_scenarios`
   - Fields: `playbooks`, `roi_assumptions`, `integrations`
   - Fields: `social_proof`, `faqs`, `primary_ctas`, `secondary_ctas`
   - Fields: `seo_title`, `seo_description`, `status`

2. **Create Use Case Components**
   - `UseCaseHero` component (industry-specific headline)
   - `PainSolution` component (3 pains mapped to solutions)
   - `Scenarios` component (example scenarios)
   - `Playbooks` component (step-by-step workflows)
   - `UseCaseROI` component (industry-specific calculator)
   - `UseCaseIntegrations` component (relevant integrations)
   - `UseCaseFAQ` component (industry objections)

3. **Create Use Case Page Route**
   - Route: `/bees/[beeSlug]/[useCaseSlug]`
   - Example: `/appointment-bee/estate-agents`
   - Implement page with all components

4. **Update Bee Profile to Link to Use Cases**
   - Add "Experience" section showing use cases grid
   - Link each use case to its detail page

---

## MILESTONE 4: Admin Interface Enhancements
**Duration**: 3-4 days  
**Goal**: Build admin tools for managing new bee structure and use cases

### Tasks:
1. **Enhanced Bee Management**
   - Update bee creation/edit forms with all new fields
   - Add slug generation/validation
   - Add status management
   - Add pricing management (base + usage)
   - Add features/integrations management
   - Add FAQ management
   - Add SEO fields management

2. **Use Case Management**
   - Create use case creation/edit forms
   - Add industry selection
   - Add content sections management
   - Add CTA configuration
   - Add SEO management

3. **CTA Pack Management**
   - Create CTA pack creation/edit interface
   - Add assignment system (which bees use which CTAs)
   - Add preview functionality

4. **Content Preview System**
   - Add preview mode for bees and use cases
   - Show how pages will look in different statuses
   - Add draft vs published comparison

---

## MILESTONE 5: First Use Case Implementation
**Duration**: 2-3 days  
**Goal**: Create the Estate Agents use case as a complete example

### Tasks:
1. **Create Estate Agents Use Case Content**
   - Hero: "Capture every buyer & valuation call—bookings done automatically"
   - Subheadline: "Appointment Bee handles enquiries 24/7, schedules viewings, and sends confirmations"
   - 3 Pains → Solutions mapping
   - 3-4 Example scenarios
   - Playbooks for viewing/valuation booking
   - Industry-specific ROI assumptions
   - Relevant integrations (Google/Outlook calendars)
   - Industry-specific FAQs

2. **Implement Use Case Page**
   - Build complete `/appointment-bee/estate-agents` page
   - Test all components and interactions
   - Optimize for conversion

3. **Add Cross-Linking**
   - Link from bee profile to estate agents use case
   - Add breadcrumb navigation
   - Add related use cases section

---

## MILESTONE 6: Analytics & Conversion Tracking
**Duration**: 1-2 days  
**Goal**: Implement tracking for new CTAs and user interactions

### Tasks:
1. **Enhanced Analytics**
   - Track CTA clicks by position (hero, mid, sticky, footer)
   - Track currency toggle usage
   - Track ROI calculator interactions
   - Track use case page visits

2. **Email Subscription Tracking**
   - Track bee-specific notification signups
   - Track use case-specific signups
   - Add UTM parameter support

3. **Conversion Funnels**
   - Track user journey from bee profile → use case → CTA
   - Track demo booking conversions
   - Track "notify me" conversions

---

## MILESTONE 7: Cal.com Integration & Demo Booking
**Duration**: 2-3 days  
**Goal**: Implement demo booking system for active bees

### Tasks:
1. **Cal.com Integration**
   - Set up Cal.com account and API
   - Create booking page template
   - Add booking links to active bee CTAs

2. **Demo Booking Flow**
   - Create booking confirmation page
   - Add email notifications
   - Track booking conversions

3. **CTA System Updates**
   - Update CTA system to support external booking links
   - Add booking link management in admin

---

## MILESTONE 8: Content Migration & Polish
**Duration**: 2-3 days  
**Goal**: Migrate existing content and polish the experience

### Tasks:
1. **Content Migration**
   - Migrate existing bees to new structure
   - Generate slugs for all bees
   - Create default CTAs for existing bees
   - Add missing content fields

2. **URL Migration**
   - Set up redirects from old numeric URLs to new slug URLs
   - Update all internal links
   - Test all redirects work correctly

3. **Final Polish**
   - Optimize page load times
   - Add loading states
   - Test responsive design
   - Cross-browser testing

---

## MILESTONE 9: Testing & Launch Preparation
**Duration**: 1-2 days  
**Goal**: Comprehensive testing and launch preparation

### Tasks:
1. **Comprehensive Testing**
   - Test all bee profile pages
   - Test use case pages
   - Test admin interface
   - Test email notifications
   - Test booking system

2. **Performance Optimization**
   - Optimize database queries
   - Add caching where needed
   - Optimize images and assets

3. **Launch Checklist**
   - Verify all CTAs work correctly
   - Test email capture forms
   - Verify analytics tracking
   - Test booking system
   - Final content review

---

## Success Metrics
- **Technical**: All pages load under 3 seconds
- **Content**: Complete bee profiles with use cases
- **Conversion**: CTA click-through rates > 5%
- **User Experience**: Smooth navigation between bees and use cases
- **Admin**: Easy content management workflow

## Risk Mitigation
- **Database Migration**: Backup before schema changes
- **URL Changes**: Implement proper redirects
- **Content Loss**: Preserve existing bee data during migration
- **Performance**: Monitor page load times during development

## Next Phase Considerations
- Additional use cases for other industries
- Advanced analytics dashboard
- A/B testing for CTAs and content
- Integration with CRM systems
- Multi-language support

---

**Total Estimated Duration**: 18-25 days  
**Priority Order**: Milestones 1-3 are critical foundation, 4-6 build functionality, 7-9 polish and launch
