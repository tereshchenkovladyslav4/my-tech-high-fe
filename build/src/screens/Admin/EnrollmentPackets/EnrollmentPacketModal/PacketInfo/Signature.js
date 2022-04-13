import React, {useEffect, useState} from "../../../../../../_snowpack/pkg/react.js";
import {Grid} from "../../../../../../_snowpack/pkg/@mui/material.js";
import {Box} from "../../../../../../_snowpack/pkg/@mui/system.js";
import {Subtitle} from "../../../../../components/Typography/Subtitle/Subtitle.js";
import {useQuery} from "../../../../../../_snowpack/pkg/@apollo/client.js";
import {getSignatureFile} from "../../services.js";
import {SYSTEM_01} from "../../../../../utils/constants.js";
import {useFormContext} from "../../../../../../_snowpack/pkg/react-hook-form.js";
export default function SignatureComp() {
  const {watch} = useFormContext();
  const signature_file_id = watch("signature_file_id");
  const [signedUrl, setSignedUrl] = useState("");
  const {loading, data} = useQuery(getSignatureFile, {
    variables: {
      fileId: signature_file_id
    },
    fetchPolicy: "network-only"
  });
  useEffect(() => {
    if (data?.signatureFile) {
      setSignedUrl(data.signatureFile.signedUrl);
    }
  }, [loading, data]);
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    sx: {display: "flex", justifyContent: "center", marginTop: "150px"}
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 9,
    sm: 9,
    xs: 9,
    sx: {textAlign: "center"}
  }, signedUrl && /* @__PURE__ */ React.createElement("img", {
    src: signedUrl,
    alt: "signature",
    style: {width: "100%"}
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 9,
    sm: 9,
    xs: 9
  }, /* @__PURE__ */ React.createElement("hr", {
    style: {borderTop: `solid 1px ${SYSTEM_01}`, borderBottom: "0"}
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    md: 12,
    sm: 12,
    xs: 12,
    sx: {display: "flex", justifyContent: "center"}
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Subtitle, {
    size: "small",
    fontWeight: "500"
  }, "Signature"))));
}
