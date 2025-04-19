// /utils/dateUtils.js

const isWithin30Days= (startDate, endDate)=> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffInTime = end.getTime() - start.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    return diffInDays >= 0 && diffInDays <= 30;
}

module.exports = isWithin30Days;