import { getEndPointUrl } from '../../apis/';
import base64 from 'react-native-base64';
import moment from 'moment'

export const convertUTCDateToLocalDate = (date) => {
    let newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    let offset = date.getTimezoneOffset() / 60;
    let hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}

export const getTimeInLocalTimeZone = (datetime) => {

    datetime = datetime.replace(" ", "T")
    let date = new Date(datetime)
    // date = convertUTCDateToLocalDate(date)

    let strDate = "";
    let amPm = "pm";

    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    let hours = date.getHours()
    if (hours > 12) {
        strDate = "0" + (hours - 12) + ":" + minutes + " pm"
    } else {
        hours < 10 ? strDate = "0" + hours : strDate = hours
        strDate += ":" + minutes + " am"
    }

    return date.toDateString()
}

export const getTimeeInLocalTimeZone = (datetime) => {

    datetime = datetime.replace(" ", "T")
    let date = new Date(datetime)
    date = convertUTCDateToLocalDate(date)

    let strDate = "";
    let amPm = "pm";

    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    let hours = date.getHours()
    if (hours > 12) {
        let h = hours - 12
        let zero = h < 10 ? "0" : ''
        strDate = zero + (hours - 12) + ":" + minutes + " pm"
    } else {
        hours < 10 ? strDate = "0" + hours : strDate = hours
        strDate += ":" + minutes + " am"
    }

    return strDate
}

export const getProfileImage = (type, profile_pic) => {
    if (profile_pic != null) {
        if (profile_pic.includes('http://') || profile_pic.includes('https://')) {
            return profile_pic
        } else {
            return getEndPointUrl() + `/static/${type}/profile/` + profile_pic
        }
    } else {
        return getEndPointUrl() + `/static/default/profile/${type}_default.png`
    }
}

export const getTimeDifference = (status_time) => {
    status_time = status_time.replace(" ", "T");

    var startTime = new Date(status_time);
    var today = Date()
    var endTime = convertUTCDateToLocalDate(new Date(today))

    // get total seconds between the times
    var delta = Math.abs(endTime - startTime) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = delta % 60;

    if (days > 30) {
        let month = parseInt(days / 30)
        let plural = month > 1 ? 's' : ''
        return month + ' month' + plural + ' ago'
    }
    else if (days > 0) {
        let plural = days > 1 ? 's' : ''

        return days + ' day' + plural + ' ago'
    }

    else if (hours > 0) {
        let plural = hours > 1 ? 's' : ''

        return hours + ' hour' + plural + ' ago'
    }
    else if (minutes > 0) {
        let plural = minutes > 1 ? 's' : ''
        return minutes + ' minute' + plural + ' ago'
    }
    else {
        return seconds.toFixed(0) + ' seconds ago'
    }
}

export const decodeData = async (data) => {
    return base64.encode(data);
}

export const timeSince = (date) => {
    // console.log("seconds = " + new Date(date))

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
};

export const getMoment = date => {
    var now = moment(new Date());
    var then = moment(date, "YYYY-MM-DD HH:mm:ss");
    // var then = convertUTCDateToLocalDate(new Date(date))
    var timeDifferenceInSeconds = now.diff(then, 'seconds');
    var timeDifferenceInHours = now.diff(then, 'hours');
    var timeDifferenceInMinutes = now.diff(then, 'minutes');
    var timeDifferenceInDay = now.diff(then, 'days');
    if (timeDifferenceInDay > 0) {

        return timeDifferenceInHours + ' days ago'
    }
    else if (timeDifferenceInHours > 0) {
        let mH = timeDifferenceInHours > 1 ? 's' : ''
        return timeDifferenceInHours + ' hour' + mH + ' ago'
    }
    else if (timeDifferenceInMinutes > 0) {
        let mM = timeDifferenceInMinutes > 1 ? 's' : ''
        return timeDifferenceInMinutes + ' minute' + mM + ' ago'
    }
    else {
        return timeDifferenceInSeconds.toFixed(0) + ' seconds ago'
    }
}
