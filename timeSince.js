function timeSince(timePosted) {
    var dateNow = new Date();
    
    if(typeof timePosted["hour"] === "string") {
        timePosted["hour"] = timePosted["hour"].search(/\D/i) !== -1 ? timePosted["hour"].search(/pm/i) !== -1 ? Number(timePosted["hour"].replace(/[\D]/gi, "")) + 12 : timePosted["hour"].replace(/[\D]/gi, "") : Number(timePosted["hour"]);
    }

    var timeNow = {
        v : dateNow,
        year : dateNow.getFullYear(),
        month : dateNow.getMonth() + 1,
        day : dateNow.getDate(),
        hour : dateNow.getHours() + 1,
        min : dateNow.getMinutes() + 1,
        sec : dateNow.getSeconds() + 1
    };


    var timeSince = {
        year : timeNow.year - timePosted.year,
        month : timeNow.month - timePosted.month,
        day : timeNow.day - timePosted.day,
        hour : timeNow.hour - timePosted.hour,
        min : timeNow.min - timePosted.min,
        sec : timeNow.sec - timePosted.sec,
    };


    if(timeSince.month < 0) {
        timeSince.year --;
        timeSince.month += 12;
    }
    if(timeSince.day < 0) {
        timeSince.month--;
        timeSince.day += 30;
    }
    if(timeSince.hour < 0) {
        timeSince.day--;
        timeSince.hour += 24;
    }
    if(timeSince.min < 0) {
        timeSince.hour--;
        timeSince.min += 60;
    }
    if(timeSince.sec < 0) {
        timeSince.min--;
        timeSince.sec += 60;
    }


    var timeSincePosted;


    if(timeSince.year > 0) {
        timeSincePosted = timeSince.year + (timeSince.year === 1 ? " year ago" : " years ago");
    } else {
        if(timeSince.month > 0) {
            timeSincePosted = timeSince.month + (timeSince.month === 1 ? " month ago" : " months ago");
        } else {
            if(timeSince.day > 0) {
                timeSincePosted = timeSince.day + (timeSince.day === 1 ? " day ago" : " days ago");
            } else {
                if(timeSince.hour > 0) {
                    timeSincePosted = timeSince.hour + (timeSince.hour === 1 ? " hour ago" : " hours ago");
                } else {
                    if(timeSince.min > 0) {
                        timeSincePosted = timeSince.min + (timeSince.min === 1 ? " minute ago" : " minutes ago");
                    } else {
                        if(timeSince.sec > 0) {
                            timeSincePosted = "A few seconds ago";
                        } else {
                            timeSincePosted = 0;
                        }
                    }
                }
            }
        }
    }

    return timeSincePosted;
}

module.exports = timeSince;