/**
 * Three layered SVG mountain silhouettes as fixed background.
 * Pure CSS — see globals.css `.mtn-1 / .mtn-2 / .mtn-3` for the SVG data URIs.
 */
export default function ParallaxMountains() {
  return (
    <>
      <div className="mtn mtn-3" aria-hidden />
      <div className="mtn mtn-2" aria-hidden />
      <div className="mtn mtn-1" aria-hidden />
    </>
  );
}
