# Website asset sources

## WhatsApp

The footer uses the unchanged black digital glyph from Meta's official 2026
WhatsApp Brand Resource Center logo pack, downloaded 29 September 2026.

- Source: https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/
- Pack entry: `01_Glyph/01_Digital RGB/03_SVG/Digital_Glyph_Black_RGB_2026.svg`
- Website file: `assets/whatsapp-black-official-2026.svg`
- Colours and geometry are unchanged. CSS scales the glyph to 23px inside a
  44px link, matching the existing social row. No tracking widget is used.

## Photographs

The `*-sharp-*` AVIF and WebP files come from original photographs recovered
from the former ASKJ website. `recovery-manifest.json` maps originals to Wix
URLs. No generated enlargement, sharpening filter or replacement photograph
was used. Originals and older delivery variants are retained.

The pool-home, kitchen and shower original URLs were fetched again and matched
the recovered 1536 x 1024 files byte-for-byte. The three new service pages use
the same subject-appropriate photographs already paired with those services
on the Services overview. They do not claim a particular client, location,
completion date or project outcome.

Derivatives use AVIF quality 75 and WebP quality 90, capped at native resolution.
Responsive selection accounts for cover-crop height as well as container width.
Original resolution can still limit detail on high-density screens, especially
where a landscape image fills a tall portrait section.
