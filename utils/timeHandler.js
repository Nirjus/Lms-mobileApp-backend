export const durationToMinute = (duration) => {
  const [hours, minutes] = duration.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToDuration = (minutes) => {
  const houres = Math.floor(minutes / 60);
  const min = minutes % 60;
  return `${String(houres).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

export const calculateEndDate = (subscriptionPeriod) => {
  const [amount, unit] = subscriptionPeriod.split(" ");
  const now = new Date();
  const parsedAmount = parseInt(amount, 10);

  switch (unit.toLowerCase()) {
    case "day":
    case "days":
      return new Date(now.setDate(now.getDate() + parsedAmount));
    case "week":
    case "weeks":
      return new Date(now.setDate(now.getDate() + parsedAmount * 7));
    case "month":
    case "months":
      return new Date(now.setMonth(now.getMonth() + parsedAmount));
    case "year":
    case "years":
      return new Date(now.setFullYear(now.getFullYear() + parsedAmount));
    default:
      throw new Error("Invalid subscription period format");
  }
};
