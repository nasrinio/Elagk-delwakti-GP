export const convertDate = (inputDate) => {
    // Split the input date into day, month, and year
    const [day, month, year] = inputDate.split('/');

    // Create a new Date object with the parsed day, month, and year in UTC
    const dateObj = new Date(Date.UTC(year, month - 1, day)); // Note: month is zero-based in JavaScript Date constructor

    // Format the date in ISO string format (e.g., "YYYY-MM-DDTHH:mm:ss.sssZ")
    const databaseFormattedDate = dateObj.toISOString();

    // Return the database-friendly formatted date
    return databaseFormattedDate;
};
