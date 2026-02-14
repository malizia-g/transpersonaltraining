# Color Palette Application Guide

## Visual Design System

### Color Palette Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIMARY: SCIENTIFIC BLUE                      │
│                          #1E40AF                                 │
│                  Trust • Authority • Intelligence                │
├─────────────────────────────────────────────────────────────────┤
│           ↓ PAIRED WITH ↓                                        │
├─────────────────────────────────────────────────────────────────┤
│                    CTA: WARM YELLOW                              │
│                          #FCD34D                                 │
│              Warmth • Accessibility • Humanity                   │
├─────────────────────────────────────────────────────────────────┤
│           ↓ SECONDARY ACCENT ↓                                   │
├─────────────────────────────────────────────────────────────────┤
│                   CALM TEAL ACCENT                               │
│                          #2DD4BF                                 │
│               Balance • Healing • Growth                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Color Mapping

### Hero Section
```
Overlay Gradient:     Blue 900 → Blue 800 → Warm White
Badge Text:           Warm Yellow 200
Primary CTA Button:   Warm Yellow 200 (text on blue bg of button)
Secondary CTA:        White text (subtle, supporting)
```

### Welcome Section Background
```
Section Background:   Neutral Warm 50 (off-white)
Heading:              Science Blue 700
Body Text:            Neutral Warm 700
```

### Feature Cards
```
Card Background:      White
Card Border (top):    Color varies per card:
                      - Card 1: Teal 400
                      - Card 2: Science Blue 500
                      - Card 3: Warm Yellow 400
Icon Background:      Matches border color (light shade)
Icon Color:           Matches border color (dark shade)
Heading:              Science Blue 700
Body Text:            Neutral Warm 700
```

### Contact Section (CTA)
```
Section Background:   Gradient (Science Blue 700 → 600)
Heading:              White
Body Text:            Science Blue 100
CTA Button:           Warm Yellow 200 (matches primary pattern)
```

---

## Tailwind Color Classes Used

```
SCIENCE BLUE
├── text-science-blue-700      → Headings
├── text-science-blue-800      → Primary text
├── text-science-blue-900      → Dark text
├── bg-science-blue-50         → Very light backgrounds
├── bg-science-blue-100        → Icon backgrounds
├── bg-science-blue-500        → Secondary accents
├── bg-science-blue-700        → Buttons
├── bg-science-blue-800        → Sections
└── bg-science-blue-900        → Dark overlays

WARM YELLOW
├── text-warm-yellow-200       → Text on dark backgrounds
├── bg-warm-yellow-100         → Light backgrounds
├── bg-warm-yellow-200         → Primary CTA buttons
├── bg-warm-yellow-300         → Hover states
├── bg-warm-yellow-400         → Accent borders
└── text-warm-yellow-600       → Icon text

ACCENT TEAL
├── text-accent-teal-600       → Icon text
├── bg-accent-teal-100         → Icon backgrounds
├── bg-accent-teal-400         → Accent borders
└── text-accent-teal-400       → Secondary accents

NEUTRAL WARM
├── bg-neutral-warm-50         → Primary page background
├── bg-neutral-warm-100        → Secondary backgrounds
├── text-neutral-warm-700      → Body text
└── text-neutral-warm-800      → Darker text
```

---

## Psychology in Action

### Why This Works for Transpersonal Training

| User Feeling | Color Element | How It Works |
|--------------|---------------|--------------|
| "Is this credible?" | Science Blue | Dominant color says "research-backed, professional" |
| "Would they understand me?" | Warm Yellow | CTA buttons and accents say "we're human, approachable" |
| "Will this help me transform?" | Teal Accents | Secondary color conveys calm, growth, healing energy |
| "Can I trust them?" | Blue Text | Professional typography in blue builds confidence |
| "Am I encouraged to take action?" | Yellow CTAs | Warm, inviting button colors drive engagement |

---

## Applied Sections (Index.html)

✅ **Hero Section**
- Background overlay: Blue gradient over warm neutral
- Badge: Warm yellow text
- Primary button: Yellow background with blue text
- Secondary button: Subtle white ghost button

✅ **Welcome Section**
- Background: Warm white/cream
- Heading: Science blue
- Body text: Neutral warm gray

✅ **Feature Cards**
- Card 1 (Holistic): Teal accent border
- Card 2 (Faculty): Science blue accent border
- Card 3 (Certification): Warm yellow accent border
- All cards: White background, science blue headings

✅ **Contact Section**
- Background: Science blue gradient
- CTA Button: Warm yellow (matches hero)
- Text: White and light blue for contrast

---

## Brand Consistency Checklist

When applying this palette to other pages, ensure:

- [ ] All headings use `text-science-blue-700` or darker
- [ ] All CTAs use `bg-warm-yellow-200` for buttons
- [ ] All body text uses `text-neutral-warm-700` or `text-science-blue-800`
- [ ] Section backgrounds use `bg-neutral-warm-50` or lighter shades
- [ ] Important accent colors use `accent-teal-*`
- [ ] Hover states increase yellow saturation (300 level)
- [ ] Overlays use blue with opacity (e.g., `blue-900/70`)
- [ ] Card borders or top accents use color variation (blue, teal, yellow)

---

## Next Steps

Apply this palette to:
1. Training program pages (teachers.html)
2. Schedule pages
3. Technique pages
4. Navigation header
5. Form elements
6. Email templates

For updates to other pages, replace:
- `indigo-*` → `science-blue-*`
- `amber-*` → `warm-yellow-*`
- `teal-*` → `accent-teal-*`
- `slate-*` → `neutral-warm-*`