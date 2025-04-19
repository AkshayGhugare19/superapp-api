/**
 * Utility function to check if a given date string is valid in the format YYYY-MM-DD
 * and also checks for valid month and day values.
 *
 * @param {string} date - The date string to validate.
 * @returns {boolean} - True if the date is valid, false otherwise.
 */
exports.isValidDate = (date) => {
    // Ensure the date matches the YYYY-MM-DD format using a regular expression
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;
  
    const [year, month, day] = date.split('-').map(Number);
  
    // Check if the year, month, and day are valid
    if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  
    // Days in each month, excluding February for leap year adjustments
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
    // Adjust February days for leap year
    if (month === 2) {
      // Check for leap year: divisible by 4 but not by 100, or divisible by 400
      if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        daysInMonth[1] = 29; // February has 29 days in a leap year
      }
    }
  
    // Check if the day is valid for the given month
    return day <= daysInMonth[month - 1];
  };
 