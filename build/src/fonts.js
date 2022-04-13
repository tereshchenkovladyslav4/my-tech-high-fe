import VisbyCFBold from "../assets/fonts/VisbyCF-Bold.ttf.js";
import {createGlobalStyle} from "../_snowpack/pkg/styled-components.js";
export default createGlobalStyle`
    @font-face {
      font-family: 'VisbyCF';
      src: local('VisbyCF'),
      url(${VisbyCFBold}) format('ttf'),
      font-weight: 300;
      font-style: normal;
     }
  `;
