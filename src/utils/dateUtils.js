exports.generateDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

exports.isDateInRange = (date, startDate, endDate) => {
    return date >= new Date(startDate) && date <= new Date(endDate);
};

exports.isSpecifiedDay = (date, day) => {
    return date.getDay() === day;
};

exports.formatDateForCommit = (date) => {
    return date.toISOString().split('T')[0] + 'T' + date.toTimeString().split(' ')[0] + 'Z';
};