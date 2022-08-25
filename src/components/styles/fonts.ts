import { css } from "@emotion/react";

const fontStyles = css`
  /**
	* Euclid
	*/

  /* Semibold */
  @font-face {
    font-family: "Euclid Circular A";
    font-weight: 700;
    font-style: normal;
    src: url("/static/fonts/EuclidCircularAEuclidCircularA-Semibold-WebXL.woff2")
        format("woff2"),
      url("/static/fonts/EuclidCircularAEuclidCircularA-Semibold-WebXL.woff")
        format("woff");
  }

  /* Semibold Italic */
  @font-face {
    font-family: "Euclid Circular A";
    font-weight: 700;
    font-style: italic;
    src: url("/static/fonts/EuclidCircularAEuclidCircularA-SemiboldItalic-WebXL.woff2")
        format("woff2"),
      url("/static/fonts/EuclidCircularAEuclidCircularA-SemiboldItalic-WebXL.woff")
        format("woff");
  }

  /* Medium */
  @font-face {
    font-family: "Euclid Circular A";
    font-weight: 500;
    font-style: normal;
    src: url("/static/fonts/EuclidCircularAEuclidCircularA-Medium-WebXL.woff2")
        format("woff2"),
      url("/static/fonts/EuclidCircularAEuclidCircularA-Medium-WebXL.woff")
        format("woff");
  }

  /* Medium Italic */
  @font-face {
    font-family: "Euclid Circular A";
    font-weight: 500;
    font-style: italic;
    src: url("/static/fonts/EuclidCircularAEuclidCircularA-MediumItalic-WebXL.woff2")
        format("woff2"),
      url("/static/fonts/EuclidCircularAEuclidCircularA-MediumItalic-WebXL.woff")
        format("woff");
  }

  /* Normal */
  @font-face {
    font-family: "Euclid Circular A";
    font-weight: 400, normal;
    font-style: normal;
    src: url("/static/fonts/EuclidCircularAEuclidCircularA-Regular-WebXL.woff2")
        format("woff2"),
      url("/static/fonts/EuclidCircularAEuclidCircularA-Regular-WebXL.woff")
        format("woff");
  }

  /* Italic */
  @font-face {
    font-family: "Euclid Circular A";
    font-weight: 400, normal;
    font-style: italic;
    src: url("/static/fonts/EuclidCircularAEuclidCircularA-RegularItalic-WebXL.woff2")
        format("woff2"),
      url("/static/fonts/EuclidCircularAEuclidCircularA-RegularItalic-WebXL.woff")
        format("woff");
  }
`;

export default fontStyles;
