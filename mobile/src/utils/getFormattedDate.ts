export const getFormattedDate = (timestamp: any) => {
  const date = new Date(timestamp * 1000);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    // second: "numeric",
    // timeZoneName: "short",
  };
  const formattedDate = date.toLocaleDateString("en-IN", options);

  return formattedDate;
};
