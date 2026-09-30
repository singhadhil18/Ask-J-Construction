# Bold ASKJ favicon — 30 September 2026

Created with the built-in image-generation tool using the existing header logo
(`assets/cb37f97098ee7cf8e55d.jpeg`) as the reference. Generated artwork is saved
as `design/favicon-master.png`. Browser canvas exports resize the master with
5% white padding on each side to protect the building's corners in circular crops.

Production references on all ten pages:

- `assets/favicon-192.png`: square search/high-resolution icon.
- `assets/favicon-32.png`: browser tab icon.
- `assets/favicon-180.png`: Apple touch icon.

Additional 16, 48 and 96px PNG exports are available for inspection. These
unreferenced exports and the design master are excluded from the production
build. Previous JPEG assets remain available for cached pages.

The browser audit verified all 30 page/icon declarations and image dimensions.
The comparison at `audits/favicon-comparison.png` shows 16/24/32/48px samples on
light and dark backgrounds. `audits/build-favicon-20260930` contains the complete
395-file candidate, including the still-unpublished bug fixes and the user's
restored testimonial success wording. This favicon has not yet been deployed.

Google's favicon guidance was checked at:
https://developers.google.com/search/docs/appearance/favicon-in-search

The PNG files are square, the 192px search icon exceeds Google's recommended
48px size, the homepage declares it, and the existing robots rules allow these
assets. Keep these URLs stable. After deployment Google must recrawl/process the
homepage; appearance is not immediate or guaranteed, and processing can take
several days to several weeks.

## Generation prompt

Create a production-ready square favicon icon for ASK-J Construction using the
supplied existing brand logo as the visual reference. Output just ONE flat icon
on a pure white square background, no mockup or presentation. Keep the logo's
distinctive modern architectural building silhouette: asymmetrical roof sweeping
upward from the left to a high apex near the right, steep downward roof on right,
slim rectangular chimney on left side, main front face with a small doorway notch
near its lower right, and two strong vertical architectural divisions on the right
face. Simplify and greatly thicken all architectural strokes so the icon reads
instantly at 16 to 48 pixels. Use solid near-black (#222222) strokes and some solid
charcoal geometric faces or negative-space cutouts; eliminate the original pale
grey fine lines. The building should be visually balanced and occupy approximately
78% of the square width and height with clean white padding, its extremities should
stay inside a circular safe area for Google Search's circular icon crop. No
lettering, no brand name, no text, no tiny decorative details, no gradients, no
shadows, no rounded-square badge. Crisp vector-like geometry, bold high contrast,
luxury architectural brand, recognizable simplified version of the supplied
original building rather than generic house clipart.
