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