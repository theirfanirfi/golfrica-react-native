import { getEndPointUrl } from '../../apis/';
import base64 from 'react-native-base64';
import moment from 'moment'
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
    console.log(status_time)
    var startTime = new Date(status_time);
    var today = Date()
    var endTime = new Date(today);
    console.log(endTime)

    var timeDiff = endTime.getTime() - startTime.getTime()
    timeDiff = new Date(timeDiff);
    var hours = timeDiff.getHours();
    var minutes = timeDiff.getMinutes();
    var seconds = timeDiff.getSeconds();
    console.log(hours + ":" + minutes + ":" + seconds)
    if (hours > 0 && hours <= 24) {
        return hours + ' ago'
    } else if (hours > 24) {
        return parseInt(hours / 24) + ' days ago'
    }
    else if (minutes > 0 && minutes < 60) {
        return minutes + ' ago'
    }
    else {
        return seconds + ' ago'
    }
}

export const decodeData = async (data) => {
    return base64.encode(data);
}

export const timeSince = (date) => {
    console.log("seconds = " + new Date(date))

    var seconds = Math.floor((new Date() - new Date(date)) / 1000);

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
        return timeDifferenceInSeconds + ' seconds ago'
    }
}
// var aDay = 24 * 60 * 60 * 1000;
// console.log(timeSince(new Date(Date.now() - aDay)));
// console.log(timeSince(new Date(Date.now() - aDay * 2)));