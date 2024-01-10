function comparedatetime(datetime1, datetime2) {
  const d1 = new Date(datetime1);
  const d2 = new Date(datetime2);

  // getTime gives the time in epoch which is time in milliseconds after 1970

  if (d1.getTime() < d2.getTime()) return true;
  return false;
}

module.exports = comparedatetime;
