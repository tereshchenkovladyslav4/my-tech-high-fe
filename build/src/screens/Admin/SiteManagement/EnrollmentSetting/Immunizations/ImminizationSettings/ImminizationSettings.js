import {Form, Formik} from "../../../../../../../_snowpack/pkg/formik.js";
import React, {useEffect, useState} from "../../../../../../../_snowpack/pkg/react.js";
import {useHistory, useRouteMatch} from "../../../../../../../_snowpack/pkg/react-router-dom.js";
import ImmunizationHeader from "../ImmunizationHeader.js";
import ImminizationSettinsItems from "./ImminizationSettinsItems/index.js";
import * as Yup from "../../../../../../../_snowpack/pkg/yup.js";
import {saveImmunizationSettings} from "../services.js";
import {useMutation} from "../../../../../../../_snowpack/pkg/@apollo/client.js";
const validationSchema = Yup.object().shape({
  min_grade_level: Yup.string().required("This field is required!").notOneOf(["N/A"], "This field is required!"),
  max_grade_level: Yup.string().notOneOf(["N/A"], "This field is required!").required("This field is required!"),
  min_spacing_interval: Yup.number().test("min_spacing_interval", "Must be more than 0", function(value) {
    return this.parent.consecutive_vaccine === 0 || value > 0;
  }),
  max_spacing_interval: Yup.number().test("max_spacing_interval", "Must be more than 0", function(value) {
    return this.parent.consecutive_vaccine === 0 || value >= 0;
  }),
  consecutive_vaccine: Yup.number().notOneOf([-1], "This field is required!").required("This field is required!"),
  exempt_update: Yup.number().oneOf([1, 0], "This field is required!").required("This field is required!"),
  level_exempt_update: Yup.string().nullable().test("level_exempt_update", "This field is required", function(value) {
    let level = "";
    try {
      level = JSON.parse(value || "[]");
      if (!(level instanceof Array))
        level = [];
    } catch (e) {
    }
    return this.parent.exempt_update !== 1 || level.length > 0;
  }),
  title: Yup.string().required("This field is required!"),
  immunity_allowed: Yup.number().oneOf([1, 0], "This field is required!").required("This field is required!"),
  email_update_template: Yup.string().min(1).required("This field is required!"),
  tooltip: Yup.string()
});
const NewImminization = ({refetch, order}) => {
  const [itemData, setItemData] = useState({
    is_enabled: true,
    min_grade_level: void 0,
    max_grade_level: void 0,
    consecutive_vaccine: void 0,
    min_spacing_date: 0,
    min_spacing_interval: 0,
    max_spacing_date: 0,
    max_spacing_interval: 0,
    immunity_allowed: void 0,
    title: void 0,
    tooltip: "",
    exempt_update: void 0,
    level_exempt_update: void 0,
    email_update_template: void 0
  });
  const [saveImmunizationSettingsMutation] = useMutation(saveImmunizationSettings);
  const history = useHistory();
  const SetStatus = (is_enabled) => {
    setItemData({...itemData, is_enabled});
  };
  const onSave = async (values) => {
    await saveImmunizationSettingsMutation({
      variables: {input: {...values, min_school_year_required: 0, max_school_year_required: 0, order}}
    });
    refetch();
    history.push("/site-management/enrollment/immunizations");
  };
  return /* @__PURE__ */ React.createElement(Formik, {
    initialValues: {...itemData},
    onSubmit: onSave,
    validationSchema
  }, /* @__PURE__ */ React.createElement(Form, null, /* @__PURE__ */ React.createElement(ImmunizationHeader, {
    enabledState: itemData.is_enabled,
    title: null,
    withSave: true,
    onEnabledChange: SetStatus,
    backUrl: "/site-management/enrollment/immunizations"
  }), /* @__PURE__ */ React.createElement(ImminizationSettinsItems, null)));
};
const ImminizationItem = ({data, refetch}) => {
  const [itemData, setItemData] = useState(data);
  const [saveImmunizationSettingsMutation] = useMutation(saveImmunizationSettings);
  useEffect(() => {
    setItemData(data);
  }, [data]);
  const history = useHistory();
  const SetStatus = (is_enabled) => {
    setItemData({...itemData, is_enabled});
  };
  const onSave = async (values) => {
    if (!values.email_update_template)
      values.email_update_template = null;
    await saveImmunizationSettingsMutation({variables: {input: {...values, id: Number(values.id)}}});
    refetch();
    history.push("/site-management/enrollment/immunizations");
  };
  return /* @__PURE__ */ React.createElement(Formik, {
    initialValues: {...itemData},
    onSubmit: onSave,
    validationSchema
  }, /* @__PURE__ */ React.createElement(Form, null, /* @__PURE__ */ React.createElement(ImmunizationHeader, {
    enabledState: itemData.is_enabled,
    title: null,
    withSave: true,
    onEnabledChange: SetStatus,
    backUrl: "/site-management/enrollment/immunizations"
  }), /* @__PURE__ */ React.createElement(ImminizationSettinsItems, null)));
};
const ImminizationSettings = ({data, refetch}) => {
  const {
    params: {id}
  } = useRouteMatch("/site-management/enrollment/immunizations/:id");
  const history = useHistory();
  let bigestOrder = 0;
  data.forEach((item) => {
    if (item.order > bigestOrder)
      bigestOrder = item.order;
  });
  if (id === "add")
    return /* @__PURE__ */ React.createElement(NewImminization, {
      order: bigestOrder + 1,
      refetch
    });
  const itemData = data.find((item) => item.id.toString() === id);
  if (!itemData) {
    history.push("/site-management/enrollment/immunizations");
    return null;
  }
  return /* @__PURE__ */ React.createElement(ImminizationItem, {
    data: itemData,
    refetch
  });
};
export {ImminizationSettings as default};
