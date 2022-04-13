import { r as react, o as objectAssign } from './common/index-ec604146.js';
import { c as createCommonjsModule } from './common/_commonjsHelpers-37fa8da4.js';
import { D as Draft, i as immutable } from './common/Draft-bd018159.js';
import './common/process-2545f00a.js';
import './common/index-0aa87803.js';

function p(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return "Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
var q=60106,r=60107,u=60108,z=60114,B=60109,aa=60110,ba=60112,D=60113,ca=60120,da=60115,ea=60116,fa=60121,ha=60117,ia=60119,ja=60129,ka=60131;
if("function"===typeof Symbol&&Symbol.for){var E=Symbol.for;q=E("react.portal");r=E("react.fragment");u=E("react.strict_mode");z=E("react.profiler");B=E("react.provider");aa=E("react.context");ba=E("react.forward_ref");D=E("react.suspense");ca=E("react.suspense_list");da=E("react.memo");ea=E("react.lazy");fa=E("react.block");ha=E("react.fundamental");ia=E("react.scope");ja=E("react.debug_trace_mode");ka=E("react.legacy_hidden");}
function F(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case r:return "Fragment";case q:return "Portal";case z:return "Profiler";case u:return "StrictMode";case D:return "Suspense";case ca:return "SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case aa:return (a.displayName||"Context")+".Consumer";case B:return (a._context.displayName||"Context")+".Provider";case ba:var b=a.render;b=b.displayName||b.name||"";return a.displayName||
(""!==b?"ForwardRef("+b+")":"ForwardRef");case da:return F(a.type);case fa:return F(a._render);case ea:b=a._payload;a=a._init;try{return F(a(b))}catch(c){}}return null}var la=react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ma={};function I(a,b){for(var c=a._threadCount|0;c<=b;c++)a[c]=a._currentValue2,a._threadCount=c+1;}function na(a,b,c,d){if(d&&(d=a.contextType,"object"===typeof d&&null!==d))return I(d,c),d[c];if(a=a.contextTypes){c={};for(var f in a)c[f]=b[f];b=c;}else b=ma;return b}
for(var J=new Uint16Array(16),K=0;15>K;K++)J[K]=K+1;J[15]=0;var oa=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,pa=Object.prototype.hasOwnProperty,qa={},ra={};
function sa(a){if(pa.call(ra,a))return !0;if(pa.call(qa,a))return !1;if(oa.test(a))return ra[a]=!0;qa[a]=!0;return !1}function ta(a,b,c,d){if(null!==c&&0===c.type)return !1;switch(typeof b){case "function":case "symbol":return !0;case "boolean":if(d)return !1;if(null!==c)return !c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return "data-"!==a&&"aria-"!==a;default:return !1}}
function ua(a,b,c,d){if(null===b||"undefined"===typeof b||ta(a,b,c,d))return !0;if(d)return !1;if(null!==c)switch(c.type){case 3:return !b;case 4:return !1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return !1}function M(a,b,c,d,f,h,t){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=f;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=h;this.removeEmptyString=t;}var N={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){N[a]=new M(a,0,!1,a,null,!1,!1);});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];N[b]=new M(b,1,!1,a[1],null,!1,!1);});["contentEditable","draggable","spellCheck","value"].forEach(function(a){N[a]=new M(a,2,!1,a.toLowerCase(),null,!1,!1);});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){N[a]=new M(a,2,!1,a,null,!1,!1);});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){N[a]=new M(a,3,!1,a.toLowerCase(),null,!1,!1);});
["checked","multiple","muted","selected"].forEach(function(a){N[a]=new M(a,3,!0,a,null,!1,!1);});["capture","download"].forEach(function(a){N[a]=new M(a,4,!1,a,null,!1,!1);});["cols","rows","size","span"].forEach(function(a){N[a]=new M(a,6,!1,a,null,!1,!1);});["rowSpan","start"].forEach(function(a){N[a]=new M(a,5,!1,a.toLowerCase(),null,!1,!1);});var va=/[\-:]([a-z])/g;function wa(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(va,
wa);N[b]=new M(b,1,!1,a,null,!1,!1);});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(va,wa);N[b]=new M(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1);});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(va,wa);N[b]=new M(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1);});["tabIndex","crossOrigin"].forEach(function(a){N[a]=new M(a,1,!1,a.toLowerCase(),null,!1,!1);});
N.xlinkHref=new M("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){N[a]=new M(a,1,!1,a.toLowerCase(),null,!0,!0);});var xa=/["'&<>]/;
function O(a){if("boolean"===typeof a||"number"===typeof a)return ""+a;a=""+a;var b=xa.exec(a);if(b){var c="",d,f=0;for(d=b.index;d<a.length;d++){switch(a.charCodeAt(d)){case 34:b="&quot;";break;case 38:b="&amp;";break;case 39:b="&#x27;";break;case 60:b="&lt;";break;case 62:b="&gt;";break;default:continue}f!==d&&(c+=a.substring(f,d));f=d+1;c+=b;}a=f!==d?c+a.substring(f,d):c;}return a}
function ya(a,b){var c=N.hasOwnProperty(a)?N[a]:null;var d;if(d="style"!==a)d=null!==c?0===c.type:!(2<a.length)||"o"!==a[0]&&"O"!==a[0]||"n"!==a[1]&&"N"!==a[1]?!1:!0;if(d||ua(a,b,c,!1))return "";if(null!==c){a=c.attributeName;d=c.type;if(3===d||4===d&&!0===b)return a+'=""';c.sanitizeURL&&(b=""+b);return a+'="'+(O(b)+'"')}return sa(a)?a+'="'+(O(b)+'"'):""}function za(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}
var Aa="function"===typeof Object.is?Object.is:za,P=null,Q=null,R=null,S=!1,T=!1,U=null,V=0;function W(){if(null===P)throw Error(p(321));return P}function Ba(){if(0<V)throw Error(p(312));return {memoizedState:null,queue:null,next:null}}function Ca(){null===R?null===Q?(S=!1,Q=R=Ba()):(S=!0,R=Q):null===R.next?(S=!1,R=R.next=Ba()):(S=!0,R=R.next);return R}function Da(a,b,c,d){for(;T;)T=!1,V+=1,R=null,c=a(b,d);Ea();return c}function Ea(){P=null;T=!1;Q=null;V=0;R=U=null;}
function Fa(a,b){return "function"===typeof b?b(a):b}function Ga(a,b,c){P=W();R=Ca();if(S){var d=R.queue;b=d.dispatch;if(null!==U&&(c=U.get(d),void 0!==c)){U.delete(d);d=R.memoizedState;do d=a(d,c.action),c=c.next;while(null!==c);R.memoizedState=d;return [d,b]}return [R.memoizedState,b]}a=a===Fa?"function"===typeof b?b():b:void 0!==c?c(b):b;R.memoizedState=a;a=R.queue={last:null,dispatch:null};a=a.dispatch=Ha.bind(null,P,a);return [R.memoizedState,a]}
function Ia(a,b){P=W();R=Ca();b=void 0===b?null:b;if(null!==R){var c=R.memoizedState;if(null!==c&&null!==b){var d=c[1];a:if(null===d)d=!1;else {for(var f=0;f<d.length&&f<b.length;f++)if(!Aa(b[f],d[f])){d=!1;break a}d=!0;}if(d)return c[0]}}a=a();R.memoizedState=[a,b];return a}function Ha(a,b,c){if(!(25>V))throw Error(p(301));if(a===P)if(T=!0,a={action:c,next:null},null===U&&(U=new Map),c=U.get(b),void 0===c)U.set(b,a);else {for(b=c;null!==b.next;)b=b.next;b.next=a;}}function Ja(){}
var X=null,Ka={readContext:function(a){var b=X.threadID;I(a,b);return a[b]},useContext:function(a){W();var b=X.threadID;I(a,b);return a[b]},useMemo:Ia,useReducer:Ga,useRef:function(a){P=W();R=Ca();var b=R.memoizedState;return null===b?(a={current:a},R.memoizedState=a):b},useState:function(a){return Ga(Fa,a)},useLayoutEffect:function(){},useCallback:function(a,b){return Ia(function(){return a},b)},useImperativeHandle:Ja,useEffect:Ja,useDebugValue:Ja,useDeferredValue:function(a){W();return a},useTransition:function(){W();
return [function(a){a();},!1]},useOpaqueIdentifier:function(){return (X.identifierPrefix||"")+"R:"+(X.uniqueID++).toString(36)},useMutableSource:function(a,b){W();return b(a._source)}},La={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};function Ma(a){switch(a){case "svg":return "http://www.w3.org/2000/svg";case "math":return "http://www.w3.org/1998/Math/MathML";default:return "http://www.w3.org/1999/xhtml"}}
var Na={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},Oa=objectAssign({menuitem:!0},Na),Y={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,
gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Pa=["Webkit","ms","Moz","O"];Object.keys(Y).forEach(function(a){Pa.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);Y[b]=Y[a];});});
var Qa=/([A-Z])/g,Ra=/^ms-/,Z=react.Children.toArray,Sa=la.ReactCurrentDispatcher,Ta={listing:!0,pre:!0,textarea:!0},Ua=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,Va={},Wa={};function Xa(a){if(void 0===a||null===a)return a;var b="";react.Children.forEach(a,function(a){null!=a&&(b+=a);});return b}var Ya=Object.prototype.hasOwnProperty,Za={children:null,dangerouslySetInnerHTML:null,suppressContentEditableWarning:null,suppressHydrationWarning:null};function $a(a,b){if(void 0===a)throw Error(p(152,F(b)||"Component"));}
function ab(a,b,c){function d(d,h){var e=h.prototype&&h.prototype.isReactComponent,f=na(h,b,c,e),t=[],g=!1,n={isMounted:function(){return !1},enqueueForceUpdate:function(){if(null===t)return null},enqueueReplaceState:function(a,c){g=!0;t=[c];},enqueueSetState:function(a,c){if(null===t)return null;t.push(c);}};if(e){if(e=new h(d.props,f,n),"function"===typeof h.getDerivedStateFromProps){var k=h.getDerivedStateFromProps.call(null,d.props,e.state);null!=k&&(e.state=objectAssign({},e.state,k));}}else if(P={},e=h(d.props,
f,n),e=Da(h,d.props,e,f),null==e||null==e.render){a=e;$a(a,h);return}e.props=d.props;e.context=f;e.updater=n;n=e.state;void 0===n&&(e.state=n=null);if("function"===typeof e.UNSAFE_componentWillMount||"function"===typeof e.componentWillMount)if("function"===typeof e.componentWillMount&&"function"!==typeof h.getDerivedStateFromProps&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&"function"!==typeof h.getDerivedStateFromProps&&e.UNSAFE_componentWillMount(),t.length){n=t;var v=
g;t=null;g=!1;if(v&&1===n.length)e.state=n[0];else {k=v?n[0]:e.state;var H=!0;for(v=v?1:0;v<n.length;v++){var x=n[v];x="function"===typeof x?x.call(e,k,d.props,f):x;null!=x&&(H?(H=!1,k=objectAssign({},k,x)):objectAssign(k,x));}e.state=k;}}else t=null;a=e.render();$a(a,h);if("function"===typeof e.getChildContext&&(d=h.childContextTypes,"object"===typeof d)){var y=e.getChildContext();for(var A in y)if(!(A in d))throw Error(p(108,F(h)||"Unknown",A));}y&&(b=objectAssign({},b,y));}for(;react.isValidElement(a);){var f=a,h=f.type;if("function"!==
typeof h)break;d(f,h);}return {child:a,context:b}}
var bb=function(){function a(a,b,f){react.isValidElement(a)?a.type!==r?a=[a]:(a=a.props.children,a=react.isValidElement(a)?[a]:Z(a)):a=Z(a);a={type:null,domNamespace:La.html,children:a,childIndex:0,context:ma,footer:""};var c=J[0];if(0===c){var d=J;c=d.length;var g=2*c;if(!(65536>=g))throw Error(p(304));var e=new Uint16Array(g);e.set(d);J=e;J[0]=c+1;for(d=c;d<g-1;d++)J[d]=d+1;J[g-1]=0;}else J[0]=J[c];this.threadID=c;this.stack=[a];this.exhausted=!1;this.currentSelectValue=null;this.previousWasTextNode=!1;
this.makeStaticMarkup=b;this.suspenseDepth=0;this.contextIndex=-1;this.contextStack=[];this.contextValueStack=[];this.uniqueID=0;this.identifierPrefix=f&&f.identifierPrefix||"";}var b=a.prototype;b.destroy=function(){if(!this.exhausted){this.exhausted=!0;this.clearProviders();var a=this.threadID;J[a]=J[0];J[0]=a;}};b.pushProvider=function(a){var b=++this.contextIndex,c=a.type._context,h=this.threadID;I(c,h);var t=c[h];this.contextStack[b]=c;this.contextValueStack[b]=t;c[h]=a.props.value;};b.popProvider=
function(){var a=this.contextIndex,b=this.contextStack[a],f=this.contextValueStack[a];this.contextStack[a]=null;this.contextValueStack[a]=null;this.contextIndex--;b[this.threadID]=f;};b.clearProviders=function(){for(var a=this.contextIndex;0<=a;a--)this.contextStack[a][this.threadID]=this.contextValueStack[a];};b.read=function(a){if(this.exhausted)return null;var b=X;X=this;var c=Sa.current;Sa.current=Ka;try{for(var h=[""],t=!1;h[0].length<a;){if(0===this.stack.length){this.exhausted=!0;var g=this.threadID;
J[g]=J[0];J[0]=g;break}var e=this.stack[this.stack.length-1];if(t||e.childIndex>=e.children.length){var L=e.footer;""!==L&&(this.previousWasTextNode=!1);this.stack.pop();if("select"===e.type)this.currentSelectValue=null;else if(null!=e.type&&null!=e.type.type&&e.type.type.$$typeof===B)this.popProvider(e.type);else if(e.type===D){this.suspenseDepth--;var G=h.pop();if(t){t=!1;var C=e.fallbackFrame;if(!C)throw Error(p(303));this.stack.push(C);h[this.suspenseDepth]+="\x3c!--$!--\x3e";continue}else h[this.suspenseDepth]+=
G;}h[this.suspenseDepth]+=L;}else {var n=e.children[e.childIndex++],k="";try{k+=this.render(n,e.context,e.domNamespace);}catch(v){if(null!=v&&"function"===typeof v.then)throw Error(p(294));throw v;}finally{}h.length<=this.suspenseDepth&&h.push("");h[this.suspenseDepth]+=k;}}return h[0]}finally{Sa.current=c,X=b,Ea();}};b.render=function(a,b,f){if("string"===typeof a||"number"===typeof a){f=""+a;if(""===f)return "";if(this.makeStaticMarkup)return O(f);if(this.previousWasTextNode)return "\x3c!-- --\x3e"+O(f);
this.previousWasTextNode=!0;return O(f)}b=ab(a,b,this.threadID);a=b.child;b=b.context;if(null===a||!1===a)return "";if(!react.isValidElement(a)){if(null!=a&&null!=a.$$typeof){f=a.$$typeof;if(f===q)throw Error(p(257));throw Error(p(258,f.toString()));}a=Z(a);this.stack.push({type:null,domNamespace:f,children:a,childIndex:0,context:b,footer:""});return ""}var c=a.type;if("string"===typeof c)return this.renderDOM(a,b,f);switch(c){case ka:case ja:case u:case z:case ca:case r:return a=Z(a.props.children),this.stack.push({type:null,
domNamespace:f,children:a,childIndex:0,context:b,footer:""}),"";case D:throw Error(p(294));case ia:throw Error(p(343));}if("object"===typeof c&&null!==c)switch(c.$$typeof){case ba:P={};var d=c.render(a.props,a.ref);d=Da(c.render,a.props,d,a.ref);d=Z(d);this.stack.push({type:null,domNamespace:f,children:d,childIndex:0,context:b,footer:""});return "";case da:return a=[react.createElement(c.type,objectAssign({ref:a.ref},a.props))],this.stack.push({type:null,domNamespace:f,children:a,childIndex:0,context:b,footer:""}),
"";case B:return c=Z(a.props.children),f={type:a,domNamespace:f,children:c,childIndex:0,context:b,footer:""},this.pushProvider(a),this.stack.push(f),"";case aa:c=a.type;d=a.props;var g=this.threadID;I(c,g);c=Z(d.children(c[g]));this.stack.push({type:a,domNamespace:f,children:c,childIndex:0,context:b,footer:""});return "";case ha:throw Error(p(338));case ea:return c=a.type,d=c._init,c=d(c._payload),a=[react.createElement(c,objectAssign({ref:a.ref},a.props))],this.stack.push({type:null,domNamespace:f,children:a,childIndex:0,
context:b,footer:""}),""}throw Error(p(130,null==c?c:typeof c,""));};b.renderDOM=function(a,b,f){var c=a.type.toLowerCase();if(!Va.hasOwnProperty(c)){if(!Ua.test(c))throw Error(p(65,c));Va[c]=!0;}var d=a.props;if("input"===c)d=objectAssign({type:void 0},d,{defaultChecked:void 0,defaultValue:void 0,value:null!=d.value?d.value:d.defaultValue,checked:null!=d.checked?d.checked:d.defaultChecked});else if("textarea"===c){var g=d.value;if(null==g){g=d.defaultValue;var e=d.children;if(null!=e){if(null!=
g)throw Error(p(92));if(Array.isArray(e)){if(!(1>=e.length))throw Error(p(93));e=e[0];}g=""+e;}null==g&&(g="");}d=objectAssign({},d,{value:void 0,children:""+g});}else if("select"===c)this.currentSelectValue=null!=d.value?d.value:d.defaultValue,d=objectAssign({},d,{value:void 0});else if("option"===c){e=this.currentSelectValue;var L=Xa(d.children);if(null!=e){var G=null!=d.value?d.value+"":L;g=!1;if(Array.isArray(e))for(var C=0;C<e.length;C++){if(""+e[C]===G){g=!0;break}}else g=""+e===G;d=objectAssign({selected:void 0,children:void 0},
d,{selected:g,children:L});}}if(g=d){if(Oa[c]&&(null!=g.children||null!=g.dangerouslySetInnerHTML))throw Error(p(137,c));if(null!=g.dangerouslySetInnerHTML){if(null!=g.children)throw Error(p(60));if(!("object"===typeof g.dangerouslySetInnerHTML&&"__html"in g.dangerouslySetInnerHTML))throw Error(p(61));}if(null!=g.style&&"object"!==typeof g.style)throw Error(p(62));}g=d;e=this.makeStaticMarkup;L=1===this.stack.length;G="<"+a.type;b:if(-1===c.indexOf("-"))C="string"===typeof g.is;else switch(c){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":C=
!1;break b;default:C=!0;}for(w in g)if(Ya.call(g,w)){var n=g[w];if(null!=n){if("style"===w){var k=void 0,v="",H="";for(k in n)if(n.hasOwnProperty(k)){var x=0===k.indexOf("--"),y=n[k];if(null!=y){if(x)var A=k;else if(A=k,Wa.hasOwnProperty(A))A=Wa[A];else {var cb=A.replace(Qa,"-$1").toLowerCase().replace(Ra,"-ms-");A=Wa[A]=cb;}v+=H+A+":";H=k;x=null==y||"boolean"===typeof y||""===y?"":x||"number"!==typeof y||0===y||Y.hasOwnProperty(H)&&Y[H]?(""+y).trim():y+"px";v+=x;H=";";}}n=v||null;}k=null;C?Za.hasOwnProperty(w)||
(k=w,k=sa(k)&&null!=n?k+'="'+(O(n)+'"'):""):k=ya(w,n);k&&(G+=" "+k);}}e||L&&(G+=' data-reactroot=""');var w=G;g="";Na.hasOwnProperty(c)?w+="/>":(w+=">",g="</"+a.type+">");a:{e=d.dangerouslySetInnerHTML;if(null!=e){if(null!=e.__html){e=e.__html;break a}}else if(e=d.children,"string"===typeof e||"number"===typeof e){e=O(e);break a}e=null;}null!=e?(d=[],Ta.hasOwnProperty(c)&&"\n"===e.charAt(0)&&(w+="\n"),w+=e):d=Z(d.children);a=a.type;f=null==f||"http://www.w3.org/1999/xhtml"===f?Ma(a):"http://www.w3.org/2000/svg"===
f&&"foreignObject"===a?"http://www.w3.org/1999/xhtml":f;this.stack.push({domNamespace:f,type:c,children:d,childIndex:0,context:b,footer:g});this.previousWasTextNode=!1;return w};return a}();var renderToNodeStream=function(){throw Error(p(207));};var renderToStaticMarkup=function(a,b){a=new bb(a,!0,b);try{return a.read(Infinity)}finally{a.destroy();}};var renderToStaticNodeStream=function(){throw Error(p(208));};var renderToString=function(a,b){a=new bb(a,!1,b);try{return a.read(Infinity)}finally{a.destroy();}};
var version="17.0.2";

var reactDomServer_browser_production_min = {
	renderToNodeStream: renderToNodeStream,
	renderToStaticMarkup: renderToStaticMarkup,
	renderToStaticNodeStream: renderToStaticNodeStream,
	renderToString: renderToString,
	version: version
};

createCommonjsModule(function (module) {

{
  module.exports = reactDomServer_browser_production_min;
}
});

var rangeSort = (function (r1, r2) {
  if (r1.offset === r2.offset) {
    return r2.length - r1.length;
  }

  return r1.offset - r2.offset;
});

var ORDERED_LIST_TYPES = ['1', 'a', 'i'];
({
  unstyled: react.createElement("p", null),
  paragraph: react.createElement("p", null),
  'header-one': react.createElement("h1", null),
  'header-two': react.createElement("h2", null),
  'header-three': react.createElement("h3", null),
  'header-four': react.createElement("h4", null),
  'header-five': react.createElement("h5", null),
  'header-six': react.createElement("h6", null),
  'code-block': react.createElement("pre", null),
  blockquote: react.createElement("blockquote", null),
  'unordered-list-item': {
    element: react.createElement("li", null),
    nest: react.createElement("ul", null)
  },
  'ordered-list-item': {
    element: react.createElement("li", null),
    nest: function nest(depth) {
      var type = ORDERED_LIST_TYPES[depth % 3];
      return react.createElement("ol", {
        type: type
      });
    }
  },
  media: react.createElement("figure", null),
  atomic: react.createElement("figure", null)
});

var fallback = function fallback(html) {
  var doc = document.implementation.createHTMLDocument('');
  doc.documentElement.innerHTML = html;
  return doc;
};

function parseHTML(html) {
  var doc;

  if (typeof DOMParser !== 'undefined') {
    var parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');

    if (doc === null || doc.body === null) {
      doc = fallback(html);
    }
  } else {
    doc = fallback(html);
  }

  return doc.body;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the /src directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
var NBSP = '&nbsp;';
var SPACE = ' '; // Arbitrary max indent

var MAX_DEPTH = 4; // used for replacing characters in HTML

/* eslint-disable no-control-regex */

var REGEX_CR = new RegExp('\r', 'g');
var REGEX_LF = new RegExp('\n', 'g');
var REGEX_NBSP = new RegExp(NBSP, 'g');
var REGEX_BLOCK_DELIMITER = new RegExp('\r', 'g');
/* eslint-enable no-control-regex */
// Block tag flow is different because LIs do not have
// a deterministic style ;_;

var blockTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre'];
var inlineTags = {
  b: 'BOLD',
  code: 'CODE',
  del: 'STRIKETHROUGH',
  em: 'ITALIC',
  i: 'ITALIC',
  s: 'STRIKETHROUGH',
  strike: 'STRIKETHROUGH',
  strong: 'BOLD',
  u: 'UNDERLINE'
};

var handleMiddleware = function handleMiddleware(maybeMiddleware, base) {
  if (maybeMiddleware && maybeMiddleware.__isMiddleware === true) {
    return maybeMiddleware(base);
  }

  return maybeMiddleware;
};

var defaultHTMLToBlock = function defaultHTMLToBlock(nodeName, node, lastList) {
  return undefined;
};

var defaultHTMLToStyle = function defaultHTMLToStyle(nodeName, node, currentStyle) {
  return currentStyle;
};

var defaultHTMLToEntity = function defaultHTMLToEntity(nodeName, node) {
  return undefined;
};

var defaultTextToEntity = function defaultTextToEntity(text) {
  return [];
};

var nullthrows = function nullthrows(x) {
  if (x != null) {
    return x;
  }

  throw new Error('Got unexpected null or undefined');
};

var sanitizeDraftText = function sanitizeDraftText(input) {
  return input.replace(REGEX_BLOCK_DELIMITER, '');
};

function getEmptyChunk() {
  return {
    text: '',
    inlines: [],
    entities: [],
    blocks: []
  };
}

function getWhitespaceChunk(inEntity) {
  var entities = new Array(1);

  if (inEntity) {
    entities[0] = inEntity;
  }

  return {
    text: SPACE,
    inlines: [immutable.OrderedSet()],
    entities: entities,
    blocks: []
  };
}

function getSoftNewlineChunk(block, depth) {
  var flat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : immutable.Map();

  if (flat === true) {
    return {
      text: '\r',
      inlines: [immutable.OrderedSet()],
      entities: new Array(1),
      blocks: [{
        type: block,
        data: data,
        depth: Math.max(0, Math.min(MAX_DEPTH, depth))
      }],
      isNewline: true
    };
  }

  return {
    text: '\n',
    inlines: [immutable.OrderedSet()],
    entities: new Array(1),
    blocks: []
  };
}

function getBlockDividerChunk(block, depth) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : immutable.Map();
  return {
    text: '\r',
    inlines: [immutable.OrderedSet()],
    entities: new Array(1),
    blocks: [{
      type: block,
      data: data,
      depth: Math.max(0, Math.min(MAX_DEPTH, depth))
    }]
  };
}

function getBlockTypeForTag(tag, lastList) {
  switch (tag) {
    case 'h1':
      return 'header-one';

    case 'h2':
      return 'header-two';

    case 'h3':
      return 'header-three';

    case 'h4':
      return 'header-four';

    case 'h5':
      return 'header-five';

    case 'h6':
      return 'header-six';

    case 'li':
      if (lastList === 'ol') {
        return 'ordered-list-item';
      }

      return 'unordered-list-item';

    case 'blockquote':
      return 'blockquote';

    case 'pre':
      return 'code-block';

    case 'div':
    case 'p':
      return 'unstyled';

    default:
      return null;
  }
}

function baseCheckBlockType(nodeName, node, lastList) {
  return getBlockTypeForTag(nodeName, lastList);
}

function processInlineTag(tag, node, currentStyle) {
  var styleToCheck = inlineTags[tag];

  if (styleToCheck) {
    currentStyle = currentStyle.add(styleToCheck).toOrderedSet();
  } else if (node instanceof HTMLElement) {
    var htmlElement = node;
    currentStyle = currentStyle.withMutations(function (style) {
      if (htmlElement.style.fontWeight === 'bold') {
        style.add('BOLD');
      }

      if (htmlElement.style.fontStyle === 'italic') {
        style.add('ITALIC');
      }

      if (htmlElement.style.textDecoration === 'underline') {
        style.add('UNDERLINE');
      }

      if (htmlElement.style.textDecoration === 'line-through') {
        style.add('STRIKETHROUGH');
      }
    }).toOrderedSet();
  }

  return currentStyle;
}

function baseProcessInlineTag(tag, node) {
  var inlineStyles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : immutable.OrderedSet();
  return processInlineTag(tag, node, inlineStyles);
}

function joinChunks(A, B) {
  var flat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  // Sometimes two blocks will touch in the DOM and we need to strip the
  // extra delimiter to preserve niceness.
  var firstInB = B.text.slice(0, 1);
  var lastInA = A.text.slice(-1);
  var adjacentDividers = lastInA === '\r' && firstInB === '\r';
  var isJoiningBlocks = A.text !== '\r' && B.text !== '\r'; // when joining two full blocks like this we want to pop one divider

  var addingNewlineToEmptyBlock = A.text === '\r' && !A.isNewline && B.isNewline; // when joining a newline to an empty block we want to remove the newline

  if (adjacentDividers && (isJoiningBlocks || addingNewlineToEmptyBlock)) {
    A.text = A.text.slice(0, -1);
    A.inlines.pop();
    A.entities.pop();
    A.blocks.pop();
  } // Kill whitespace after blocks if flat mode is on


  if (A.text.slice(-1) === '\r' && flat === true) {
    if (B.text === SPACE || B.text === '\n') {
      return A;
    } else if (firstInB === SPACE || firstInB === '\n') {
      B.text = B.text.slice(1);
      B.inlines.shift();
      B.entities.shift();
    }
  }

  var isNewline = A.text.length === 0 && B.isNewline;
  return {
    text: A.text + B.text,
    inlines: A.inlines.concat(B.inlines),
    entities: A.entities.concat(B.entities),
    blocks: A.blocks.concat(B.blocks),
    isNewline: isNewline
  };
}
/*
 * Check to see if we have anything like <p> <blockquote> <h1>... to create
 * block tags from. If we do, we can use those and ignore <div> tags. If we
 * don't, we can treat <div> tags as meaningful (unstyled) blocks.
 */


function containsSemanticBlockMarkup(html) {
  return blockTags.some(function (tag) {
    return html.indexOf("<".concat(tag)) !== -1;
  });
}

function genFragment(node, inlineStyle, lastList, inBlock, fragmentBlockTags, depth, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, inEntity) {
  var nodeName = node.nodeName.toLowerCase();
  var newBlock = false;
  var nextBlockType = 'unstyled'; // Base Case

  if (nodeName === '#text') {
    var text = node.textContent;

    if (text.trim() === '' && inBlock === null) {
      return getEmptyChunk();
    }

    if (text.trim() === '' && inBlock !== 'code-block') {
      return getWhitespaceChunk(inEntity);
    }

    if (inBlock !== 'code-block') {
      // Can't use empty string because MSWord
      text = text.replace(REGEX_LF, SPACE);
    }

    var entities = Array(text.length).fill(inEntity);
    var offsetChange = 0;
    var textEntities = checkEntityText(text, createEntity, getEntity, mergeEntityData, replaceEntityData).sort(rangeSort);
    textEntities.forEach(function (_ref) {
      var entity = _ref.entity,
          offset = _ref.offset,
          length = _ref.length,
          result = _ref.result;
      var adjustedOffset = offset + offsetChange;

      if (result === null || result === undefined) {
        result = text.substr(adjustedOffset, length);
      }

      var textArray = text.split('');
      textArray.splice.bind(textArray, adjustedOffset, length).apply(textArray, result.split(''));
      text = textArray.join('');
      entities.splice.bind(entities, adjustedOffset, length).apply(entities, Array(result.length).fill(entity));
      offsetChange += result.length - length;
    });
    return {
      text: text,
      inlines: Array(text.length).fill(inlineStyle),
      entities: entities,
      blocks: []
    };
  } // BR tags


  if (nodeName === 'br') {
    var _blockType = inBlock;

    if (_blockType === null) {
      //  BR tag is at top level, treat it as an unstyled block
      return getSoftNewlineChunk('unstyled', depth, true);
    }

    return getSoftNewlineChunk(_blockType || 'unstyled', depth, options.flat);
  }

  var chunk = getEmptyChunk();
  var newChunk = null; // Inline tags

  inlineStyle = processInlineTag(nodeName, node, inlineStyle);
  inlineStyle = processCustomInlineStyles(nodeName, node, inlineStyle); // Handle lists

  if (nodeName === 'ul' || nodeName === 'ol') {
    if (lastList) {
      depth += 1;
    }

    lastList = nodeName;
    inBlock = null;
  } // Block Tags


  var blockInfo = checkBlockType(nodeName, node, lastList, inBlock);
  var blockType;
  var blockDataMap;

  if (blockInfo === false) {
    return getEmptyChunk();
  }

  blockInfo = blockInfo || {};

  if (typeof blockInfo === 'string') {
    blockType = blockInfo;
    blockDataMap = immutable.Map();
  } else {
    blockType = typeof blockInfo === 'string' ? blockInfo : blockInfo.type;
    blockDataMap = blockInfo.data ? immutable.Map(blockInfo.data) : immutable.Map();
  }

  if (!inBlock && (fragmentBlockTags.indexOf(nodeName) !== -1 || blockType)) {
    chunk = getBlockDividerChunk(blockType || getBlockTypeForTag(nodeName, lastList), depth, blockDataMap);
    inBlock = blockType || getBlockTypeForTag(nodeName, lastList);
    newBlock = true;
  } else if (lastList && (inBlock === 'ordered-list-item' || inBlock === 'unordered-list-item') && nodeName === 'li') {
    var listItemBlockType = getBlockTypeForTag(nodeName, lastList);
    chunk = getBlockDividerChunk(listItemBlockType, depth);
    inBlock = listItemBlockType;
    newBlock = true;
    nextBlockType = lastList === 'ul' ? 'unordered-list-item' : 'ordered-list-item';
  } else if (inBlock && inBlock !== 'atomic' && blockType === 'atomic') {
    inBlock = blockType;
    newBlock = true;
    chunk = getSoftNewlineChunk(blockType, depth, true, // atomic blocks within non-atomic blocks must always be split out
    blockDataMap);
  } // Recurse through children


  var child = node.firstChild; // hack to allow conversion of atomic blocks from HTML (e.g. <figure><img
  // src="..." /></figure>). since metadata must be stored on an entity text
  // must exist for the entity to apply to. the way chunks are joined strips
  // whitespace at the end so it cannot be a space character.

  if (child == null && inEntity && (blockType === 'atomic' || inBlock === 'atomic')) {
    child = document.createTextNode('a');
  }

  if (child != null) {
    nodeName = child.nodeName.toLowerCase();
  }

  var entityId = null;

  while (child) {
    entityId = checkEntityNode(nodeName, child, createEntity, getEntity, mergeEntityData, replaceEntityData);
    newChunk = genFragment(child, inlineStyle, lastList, inBlock, fragmentBlockTags, depth, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, entityId || inEntity);
    chunk = joinChunks(chunk, newChunk, options.flat);
    var sibling = child.nextSibling; // Put in a newline to break up blocks inside blocks

    if (sibling && fragmentBlockTags.indexOf(nodeName) >= 0 && inBlock) {
      var newBlockInfo = checkBlockType(nodeName, child, lastList, inBlock);
      var newBlockType = void 0;
      var newBlockData = void 0;

      if (newBlockInfo !== false) {
        newBlockInfo = newBlockInfo || {};

        if (typeof newBlockInfo === 'string') {
          newBlockType = newBlockInfo;
          newBlockData = immutable.Map();
        } else {
          newBlockType = newBlockInfo.type || getBlockTypeForTag(nodeName, lastList);
          newBlockData = newBlockInfo.data ? immutable.Map(newBlockInfo.data) : immutable.Map();
        }

        chunk = joinChunks(chunk, getSoftNewlineChunk(newBlockType, depth, options.flat, newBlockData), options.flat);
      }
    }

    if (sibling) {
      nodeName = sibling.nodeName.toLowerCase();
    }

    child = sibling;
  }

  if (newBlock) {
    chunk = joinChunks(chunk, getBlockDividerChunk(nextBlockType, depth, immutable.Map()), options.flat);
  }

  return chunk;
}

function getChunkForHTML(html, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, DOMBuilder) {
  html = html.trim().replace(REGEX_CR, '').replace(REGEX_NBSP, SPACE);
  var safeBody = DOMBuilder(html);

  if (!safeBody) {
    return null;
  } // Sometimes we aren't dealing with content that contains nice semantic
  // tags. In this case, use divs to separate everything out into paragraphs
  // and hope for the best.


  var workingBlocks = containsSemanticBlockMarkup(html) ? blockTags.concat(['div']) : ['div']; // Start with -1 block depth to offset the fact that we are passing in a fake
  // UL block to sta rt with.

  var chunk = genFragment(safeBody, immutable.OrderedSet(), 'ul', null, workingBlocks, -1, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options); // join with previous block to prevent weirdness on paste

  if (chunk.text.indexOf('\r') === 0) {
    chunk = {
      text: chunk.text.slice(1),
      inlines: chunk.inlines.slice(1),
      entities: chunk.entities.slice(1),
      blocks: chunk.blocks
    };
  } // Kill block delimiter at the end


  if (chunk.text.slice(-1) === '\r') {
    chunk.text = chunk.text.slice(0, -1);
    chunk.inlines = chunk.inlines.slice(0, -1);
    chunk.entities = chunk.entities.slice(0, -1);
    chunk.blocks.pop();
  } // If we saw no block tags, put an unstyled one in


  if (chunk.blocks.length === 0) {
    chunk.blocks.push({
      type: 'unstyled',
      data: immutable.Map(),
      depth: 0
    });
  } // Sometimes we start with text that isn't in a block, which is then
  // followed by blocks. Need to fix up the blocks to add in
  // an unstyled block for this content


  if (chunk.text.split('\r').length === chunk.blocks.length + 1) {
    chunk.blocks.unshift({
      type: 'unstyled',
      data: immutable.Map(),
      depth: 0
    });
  }

  return chunk;
}

function convertFromHTMLtoContentBlocks(html, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, DOMBuilder, generateKey) {
  // Be ABSOLUTELY SURE that the dom builder you pass hare won't execute
  // arbitrary code in whatever environment you're running this in. For an
  // example of how we try to do this in-browser, see getSafeBodyFromHTML.
  var chunk = getChunkForHTML(html, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, DOMBuilder);

  if (chunk == null) {
    return [];
  }

  var start = 0;
  return chunk.text.split('\r').map(function (textBlock, blockIndex) {
    // Make absolutely certain that our text is acceptable.
    textBlock = sanitizeDraftText(textBlock);
    var end = start + textBlock.length;
    var inlines = nullthrows(chunk).inlines.slice(start, end);
    var entities = nullthrows(chunk).entities.slice(start, end);
    var characterList = immutable.List(inlines.map(function (style, entityIndex) {
      var data = {
        style: style,
        entity: null
      };

      if (entities[entityIndex]) {
        data.entity = entities[entityIndex];
      }

      return Draft.CharacterMetadata.create(data);
    }));
    start = end + 1;
    return new Draft.ContentBlock({
      key: generateKey(),
      type: nullthrows(chunk).blocks[blockIndex].type,
      data: nullthrows(chunk).blocks[blockIndex].data,
      depth: nullthrows(chunk).blocks[blockIndex].depth,
      text: textBlock,
      characterList: characterList
    });
  });
}

var convertFromHTML = function convertFromHTML(_ref2) {
  var _ref2$htmlToStyle = _ref2.htmlToStyle,
      htmlToStyle = _ref2$htmlToStyle === void 0 ? defaultHTMLToStyle : _ref2$htmlToStyle,
      _ref2$htmlToEntity = _ref2.htmlToEntity,
      htmlToEntity = _ref2$htmlToEntity === void 0 ? defaultHTMLToEntity : _ref2$htmlToEntity,
      _ref2$textToEntity = _ref2.textToEntity,
      textToEntity = _ref2$textToEntity === void 0 ? defaultTextToEntity : _ref2$textToEntity,
      _ref2$htmlToBlock = _ref2.htmlToBlock,
      htmlToBlock = _ref2$htmlToBlock === void 0 ? defaultHTMLToBlock : _ref2$htmlToBlock;
  return function (html) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      flat: false
    };
    var DOMBuilder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : parseHTML;
    var generateKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Draft.genKey;
    var contentState = Draft.ContentState.createFromText('');

    var createEntityWithContentState = function createEntityWithContentState() {
      if (contentState.createEntity) {
        var _contentState;

        contentState = (_contentState = contentState).createEntity.apply(_contentState, arguments);
        return contentState.getLastCreatedEntityKey();
      }

      return Draft.Entity.create.apply(Draft.Entity, arguments);
    };

    var getEntityWithContentState = function getEntityWithContentState() {
      if (contentState.getEntity) {
        var _contentState2;

        return (_contentState2 = contentState).getEntity.apply(_contentState2, arguments);
      }

      return Draft.Entity.get.apply(Draft.Entity, arguments);
    };

    var mergeEntityDataWithContentState = function mergeEntityDataWithContentState() {
      if (contentState.mergeEntityData) {
        var _contentState3;

        contentState = (_contentState3 = contentState).mergeEntityData.apply(_contentState3, arguments);
        return;
      }

      Draft.Entity.mergeData.apply(Draft.Entity, arguments);
    };

    var replaceEntityDataWithContentState = function replaceEntityDataWithContentState() {
      if (contentState.replaceEntityData) {
        var _contentState4;

        contentState = (_contentState4 = contentState).replaceEntityData.apply(_contentState4, arguments);
        return;
      }

      Draft.Entity.replaceData.apply(Draft.Entity, arguments);
    };

    var contentBlocks = convertFromHTMLtoContentBlocks(html, handleMiddleware(htmlToStyle, baseProcessInlineTag), handleMiddleware(htmlToEntity, defaultHTMLToEntity), handleMiddleware(textToEntity, defaultTextToEntity), handleMiddleware(htmlToBlock, baseCheckBlockType), createEntityWithContentState, getEntityWithContentState, mergeEntityDataWithContentState, replaceEntityDataWithContentState, options, DOMBuilder, generateKey);
    var blockMap = Draft.BlockMapBuilder.createFromArray(contentBlocks);
    var firstBlockKey = contentBlocks[0].getKey();
    return contentState.merge({
      blockMap: blockMap,
      selectionBefore: Draft.SelectionState.createEmpty(firstBlockKey),
      selectionAfter: Draft.SelectionState.createEmpty(firstBlockKey)
    });
  };
};

var convertFromHTML$1 = (function () {
  if (arguments.length >= 1 && typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string') {
    return convertFromHTML({}).apply(void 0, arguments);
  }

  return convertFromHTML.apply(void 0, arguments);
});

export { convertFromHTML$1 as convertFromHTML };
