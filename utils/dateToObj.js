/**
 * Turns a date object into an object of the date properties
 * 
 * @param {Date} d - the date to use
 * 
 * @returns {object} dateObj - the object created from the date
 */
function dateToObj(d) {
    return {
        year : d.getFullYear(),
        month : d.getMonth() + 1,
        day : d.getDate(),
        hour : d.getHours() + 1,
        min : d.getMinutes() + 1,
        sec : d.getSeconds() + 1
    }
}

module.exports = dateToObj;