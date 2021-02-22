import { getEndPointUrl } from '../../apis/';
import base64 from 'react-native-base64';

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
    var startTime = new Date(status_time);
    var today = Date()
    var endTime = new Date(today);
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