import moment from "../../../../../_snowpack/pkg/moment.js";
export function isValidVaccInput(val, allowIM = true) {
  if (val === null)
    return false;
  if (["EXEMPT", "NA"].includes(val.toUpperCase())) {
    return true;
  } else if (val.toUpperCase() === "IM" && allowIM) {
    return true;
  }
  return isValidDate(val);
}
export function isValidDate(date) {
  return moment(date, "MM/DD/YYYY", true).isValid();
}
export function getValidGrade(v) {
  if (!v)
    return -1;
  const g = +v;
  if (isNaN(g)) {
    return v === "K" ? 0 : -1;
  }
  return g;
}
function getDuration(interval, date) {
  if (!+interval || !+date)
    return null;
  return moment.duration(interval, date === 1 ? "days" : date === 2 ? "weeks" : "months");
}
export function checkImmmValueWithSpacing(item, all) {
  if (!item?.value)
    return true;
  if (!item.immunization?.consecutive_vaccine)
    return true;
  const itemDate = moment(item.value, "MM/DD/YYYY");
  if (!itemDate.isValid())
    return true;
  const conDate = moment(all.find((v) => v.immunization_id === item.immunization.consecutive_vaccine + "").value, "MM/DD/YYYY");
  if (!conDate.isValid())
    return true;
  const minDur = getDuration(item.immunization.min_spacing_interval, item.immunization.min_spacing_date);
  const maxDur = getDuration(item.immunization.max_spacing_interval, item.immunization.max_spacing_date);
  if (!minDur || !maxDur)
    return true;
  const dur = moment.duration(itemDate.diff(conDate));
  return dur.asDays() >= minDur.asDays() && dur.asDays() <= maxDur.asDays();
}
