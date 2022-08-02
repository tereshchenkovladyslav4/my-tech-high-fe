// @ts-ignore
import { createGlobalStyle } from 'styled-components'
import VisbyCFBold from '../assets/fonts/VisbyCF-Bold.ttf'

export default createGlobalStyle`
    @font-face {
      font-family: 'VisbyCF';
      src: local('VisbyCF'),
      url(${VisbyCFBold}) format('ttf'),
      font-weight: 300;
      font-style: normal;
     }
  `
