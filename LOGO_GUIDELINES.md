# 🎨 Official Logo Guidelines - Project Records

## 📋 Brand Identity Overview

**Project Records** is a Professional Media Management System with a modern, professional brand identity featuring orange and grey color palette with clean, geometric design elements.

---

## 🎯 Brand Values

- **Professional**: Clean, modern design for business applications
- **Reliable**: Stable, trustworthy visual presence
- **Creative**: Dynamic yet structured for media management
- **Efficient**: Streamlined design for optimal user experience

---

## 🎨 Logo Variations

### 1. Primary Logo
**Usage**: Main brand identifier, headers, important applications

```
┌─────────────────────────────────────┐
│  [PM] Project Records                │
│      Professional Media Management   │
└─────────────────────────────────────┘
```

**Components:**
- **Icon**: Orange gradient square with "PM" monogram
- **Main Text**: "Project Records" (bold, dark grey)
- **Sub Text**: "Digital Footprints Multimedia" (orange, smaller)

### 2. Minimal Logo
**Usage**: Navigation bars, small spaces, mobile applications

```
┌─────────────────────────┐
│  [PM] Project Records   │
└─────────────────────────┘
```

**Components:**
- **Icon**: Dark grey square with orange "PM"
- **Text**: "Project Records" (single line, dark grey)

### 3. Icon Only
**Usage**: Favicons, app icons, social media profiles

```
┌─────┐
│ [PM] │
└─────┘
```

**Components:**
- **Icon**: Orange gradient square with "PM"
- **Size**: Scalable for various applications

### 4. Monogram Logo
**Usage**: Profile pictures, avatars, circular applications

```
   ┌─────┐
   │ [PM] │
   └─────┘
```

**Components:**
- **Background**: Dark grey circle
- **Text**: Orange "PM" monogram
- **Shape**: Perfect circle for social media

### 5. Horizontal Logo
**Usage**: Headers, banners, wide format applications

```
┌─────────────────────────────────────┐
│  [PM] Project Records                │
└─────────────────────────────────────┘
```

**Components:**
- **Icon**: Orange gradient square
- **Text**: Gradient text effect
- **Layout**: Horizontal alignment

### 6. Badge Logo
**Usage**: Social media, stickers, promotional materials

```
   ┌─────┐
   │ [PM]  │
   │ Records │
   └─────┘
```

**Components:**
- **Shape**: Orange gradient circle
- **Icon**: "PM" monogram
- **Text**: "Records" below icon

---

## 🎨 Color Palette

### Primary Colors
- **Orange Primary**: `#f97316` (RGB: 249, 115, 22)
- **Orange Dark**: `#ea580c` (RGB: 234, 88, 12)
- **Orange Light**: `#fb923c` (RGB: 251, 146, 60)

### Grey Scale
- **Grey Dark**: `#1f2937` (RGB: 31, 41, 55)
- **Grey Medium**: `#4b5563` (RGB: 75, 85, 99)
- **Grey Light**: `#9ca3af` (RGB: 156, 163, 175)
- **Grey Background**: `#f9fafb` (RGB: 249, 250, 251)

### Gradient Definitions
- **Orange Gradient**: `linear-gradient(135deg, #f97316, #ea580c)`
- **Text Gradient**: `linear-gradient(135deg, #1f2937, #ea580c)`

---

## 📏 Typography

### Font Family
- **Primary**: 'Montserrat', sans-serif
- **Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold), 900 (Black)

### Text Hierarchy
- **Logo Main**: 1.8rem, Weight 800, Letter-spacing -0.5px
- **Logo Sub**: 0.9rem, Weight 500, Letter-spacing 0.5px
- **Monogram**: Variable based on size, Weight 700-900

---

## 📐 Size Specifications

### Primary Logo
- **Small**: 45px icon height, 1.4rem text
- **Standard**: 60px icon height, 1.8rem text
- **Large**: 80px icon height, 2.4rem text

### Icon Only
- **Small**: 50px × 50px
- **Standard**: 80px × 80px
- **Large**: 120px × 120px

### Monogram
- **Small**: 60px × 60px
- **Standard**: 100px × 100px
- **Large**: 150px × 150px

---

## 🎯 Usage Guidelines

### ✅ DO's
- **Use appropriate logo variation** for each application
- **Maintain clear space** around logos (minimum 0.5x logo height)
- **Ensure sufficient contrast** against backgrounds
- **Scale proportionally** - never stretch or distort
- **Use official colors** only
- **Test readability** at all sizes

### ❌ DON'Ts
- **Modify logo colors** (except for special cases)
- **Stretch or distort** proportions
- **Add drop shadows** or effects not specified
- **Place on busy backgrounds** without sufficient contrast
- **Rotate or skew** logos
- **Change fonts** or letter spacing
- **Use unauthorized variations**

---

## 📱 Application Examples

### Web Applications
- **Header**: Primary logo (standard size)
- **Navigation**: Minimal logo
- **Footer**: Logo-footer class (slightly transparent)
- **Favicon**: Icon only (32px × 32px)

### Mobile Applications
- **Splash Screen**: Primary logo (large)
- **App Icon**: Icon only (1024px × 1024px)
- **Navigation**: Minimal logo (small)
- **Profile**: Monogram logo

### Print Materials
- **Business Cards**: Primary logo (standard)
- **Letterhead**: Horizontal logo
- **Brochures**: Primary or horizontal logo
- **Stickers**: Badge logo

### Social Media
- **Profile Pictures**: Monogram logo
- **Cover Photos**: Horizontal logo
- **Posts**: Primary logo
- **Stories**: Badge logo

---

## 🎨 Logo Variations by Context

### Light Backgrounds
- Use standard logo colors
- Ensure sufficient contrast
- No additional modifications needed

### Dark Backgrounds
- Use `logo-on-dark` class
- White text elements
- Orange accent maintained

### Photographic Backgrounds
- Use icon-only version for complex backgrounds
- Add subtle shadow if needed for readability
- Ensure logo stands out

---

## 📁 File Formats

### Vector Formats (Recommended)
- **SVG**: For web applications (scalable)
- **AI**: Adobe Illustrator (original design)
- **EPS**: For print applications

### Raster Formats
- **PNG**: With transparent background
- **JPG**: For photographic backgrounds
- **PDF**: For print documents

### Sizes Available
- **SVG**: Scalable vector
- **PNG**: 16px, 32px, 64px, 128px, 256px, 512px, 1024px
- **ICO**: For favicon (16px, 32px, 48px)

---

## 🛠️ Implementation Code

### HTML Usage
```html
<!-- Primary Logo -->
<div class="logo-primary">
    <div class="logo-icon">PM</div>
    <div class="logo-text">
        <div class="logo-main">Project Records</div>
        <div class="logo-sub">Professional Media Management</div>
    </div>
</div>

<!-- Minimal Logo -->
<div class="logo-minimal">
    <div class="logo-icon">PM</div>
    <div class="logo-text">Project Records</div>
</div>

<!-- Icon Only -->
<div class="logo-icon-only">PM</div>

<!-- Monogram -->
<div class="logo-monogram">PM</div>
```

### CSS Classes
```css
/* Size Variations */
.logo-primary.small    /* Smaller version */
.logo-primary.large    /* Larger version */

/* Context Variations */
.logo-on-dark          /* For dark backgrounds */
.logo-on-light         /* For light backgrounds */
.logo-header           /* For page headers */
.logo-nav              /* For navigation */
.logo-footer           /* For footers */
.logo-loading          /* With pulse animation */

/* Animations */
.logo-bounce           /* Bounce animation */
.logo-pulse            /* Pulse animation */
.logo-rotate           /* Rotation animation */
```

---

## 🎯 Quality Assurance

### Before Using Logo
- [ ] Check file resolution (300dpi for print)
- [ ] Verify color accuracy
- [ ] Test readability at intended size
- [ ] Ensure proper clear space
- [ ] Check contrast against background

### Common Issues
- **Low resolution**: Use vector formats or higher resolution PNGs
- **Poor contrast**: Test against various backgrounds
- **Incorrect proportions**: Never stretch logos
- **Color variations**: Use only official brand colors

---

## 📞 Support & Resources

### Files Available
- `logo-design.html` - Complete logo showcase
- `logo-styles.css` - All logo styles and variations
- `config.js` - Brand configuration
- Logo assets in multiple formats (upon request)

### For Additional Assets
- Custom logo variations
- Brand guidelines presentation
- Marketing materials
- Social media templates

---

*Last Updated: February 2026*
*Brand Version: 1.0*
*System: Professional Media Management Suite*
