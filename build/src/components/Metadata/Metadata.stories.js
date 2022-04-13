import React from "../../../_snowpack/pkg/react.js";
import {Metadata} from "./Metadata.js";
import {Title} from "../Typography/Title/Title.js";
import {Subtitle} from "../Typography/Subtitle/Subtitle.js";
import {Avatar} from "../../../_snowpack/pkg/@mui/material.js";
export default {
  title: "Components/Metadata",
  component: Metadata
};
const imageURL = "https://cdn.vox-cdn.com/thumbor/zFJuBWv5NjSeVilWJntvQcgji5M=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/19979927/jomi_avatar_nickleodeon_ringer.jpg";
export const Default = () => /* @__PURE__ */ React.createElement(Metadata, {
  title: "Hunter",
  subtitle: "5th Grade",
  image: /* @__PURE__ */ React.createElement(Avatar, {
    style: {marginRight: 12},
    alt: "Remy Sharp",
    src: imageURL,
    variant: "circular"
  })
});
export const UsingTypographyComponent = () => /* @__PURE__ */ React.createElement(Metadata, {
  title: "Hunter",
  subtitle: "5th Grade",
  image: /* @__PURE__ */ React.createElement(Avatar, {
    style: {marginRight: 12},
    alt: "Remy Sharp",
    src: imageURL,
    variant: "rounded"
  })
});
export const VerticleMetadata = () => /* @__PURE__ */ React.createElement(Metadata, {
  title: /* @__PURE__ */ React.createElement(Title, null, "Hunter"),
  subtitle: /* @__PURE__ */ React.createElement(Subtitle, {
    size: "large"
  }, "5th Grade"),
  image: /* @__PURE__ */ React.createElement(Avatar, {
    alt: "Remy Sharp",
    src: imageURL,
    variant: "rounded"
  }),
  rounded: true,
  verticle: true
});
