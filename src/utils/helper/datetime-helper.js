function comparedatetime(datetime1, datetime2) {
  const d1 = new Date(datetime1);
  const d2 = new Date(datetime2);

  // getTime gives the time in epoch which is time in milliseconds after 1970

  if (d1.getTime() < d2.getTime()) return true;
  return false;
}

function convertDateTimeToISTandFormat(datetime) {
  const dateObject = new Date(datetime);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  };

  const formattedDateTime = dateObject.toLocaleString("en-IN", options);
  const finalFormattedDateTime = formattedDateTime.replace(" at", "");
  return finalFormattedDateTime;
}

module.exports = {
  comparedatetime,
  convertDateTimeToISTandFormat,
};
