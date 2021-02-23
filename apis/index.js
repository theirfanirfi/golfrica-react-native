const endpoint = "http://192.168.10.8:5000"
// const endpoint = "http://127.0.0.1:5000"
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getEndPointUrl = () => {
  return endpoint
}

export const getToken = async (context) => {
  let isLoggedIn = await AsyncStorage.getItem('token').then(item => {
    if (item !== null) {
      context.setState({ 'isLoggedIn': true }, () => {
        context.setState({ 'token': item });
      });
      return true;
    } else {
      return false;
    }
  });
}

export const getTokenForComponent = async (context) => {
  let isLoggedIn = await AsyncStorage.getItem('token').then(item => {
    if (item !== null) {
      context.setState({ token: item });
      return true;
    } else {
      return false;
    }
  });
}


export const login = async (username, password) => {
  try {
    const params = `username=${username}&password=${password}`
    const url = `${endpoint}/login?${params}`
    const response = await fetch(url, { method: "GET" });
    const responseJson = await response.json()
    if (responseJson.status === "success") {
      return {
        status: true,
        message: responseJson
      }
    }
    return {
      status: false,
      message: responseJson,
    }
  } catch (err) {
    return {
      status: false,
      err
    }
  }

};

export const getStatuses = async (context) => {
  await getToken(context);
  console.log('context token = ' + context.state.token);
  try {
    const url = `${endpoint}/statuses/?offset=` + context.state.offset
    const response = await fetch(url, {
      method: "GET", headers: {
        'Authorization': context.state.token
      }
    });
    const responseJson = await response.json()

    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}


export const getSwaps = async (context) => {
  await getToken(context);
  try {
    const url = `${endpoint}/swap/?offset=` + context.state.offset
    const response = await fetch(url, {
      method: "GET", headers: {
        'Authorization': context.state.token
      }
    });
    const responseJson = await response.json()

    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const getClubStatuses = async (context, club_id) => {
  await getToken(context);
  try {
    const url = `${endpoint}/clubs/statuses/${club_id}/${context.state.offset}`
    const response = await fetch(url, {
      method: "GET", headers: {
        'Authorization': context.state.token
      }
    });
    const responseJson = await response.json()

    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const getFeedComponentStatuses = async (context, type, id) => {
  await getToken(context);
  let url = "";
  if (type == "player") {
    url = `${endpoint}/player/statuses/${id}/${context.state.offset}`
  } else if (type == "user") {
    url = `${endpoint}/user/statuses/${id}/${context.state.offset}`
  }


  try {
    const response = await fetch(url, {
      method: "GET", headers: {
        'Authorization': context.state.token
      }
    });
    const responseJson = await response.json()

    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}


export const getClubs = async (context) => {
  await getToken(context);
  try {
    const url = `${endpoint}/clubs/`
    const response = await fetch(url, {
      method: "GET", headers: {
        'Authorization': context.state.token
      }
    });
    const responseJson = await response.json()
    context.setState({ clubs: responseJson.clubs, isRefreshing: false });
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}


export const likeStatus = async (context, token, status_id) => {
  try {
    const url = `${endpoint}/like/status/${status_id}/`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const getStatusComments = async (context, token, status_id) => {
  try {
    const url = `${endpoint}/comment/status/${status_id}/`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": token
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const rateAndCommentStatus = async (context, data) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/comment/comment_status/`

    const response = await fetch(url, {
      method: "POST",
      body: data,
      headers: {
        "Authorization": context.state.token
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const sendSwapRequest = async (context, status_id) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/swap/status/` + status_id + '/';
    console.log(url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const getSingleStatus = async (context, status_id) => {
  await getToken(context);
  try {
    const url = `${endpoint}/statuses/` + status_id + '/';
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const updateClubDescription = async (context, club_id, form) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/clubs/club_description/` + club_id;
    const response = await fetch(url, {
      method: "POST",
      body: form,
      headers: {
        "Authorization": context.state.token,
        'Content-Type': 'multipart/form-data'
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const getClub = async (context, club_id) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/clubs/` + club_id + `/`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const getClubDescriptions = async (context, club_id) => {
  await getTokenForComponent(context);
  // console.log(context.state.token)
  try {
    const url = `${endpoint}/clubs/club_description/` + club_id;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const rateClub = async (context, club_id, formData) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/rating/rate_club/` + club_id;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const followClub = async (context, club_id) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/follow/club/` + club_id;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}


export const getFollowersForFollowersScreens = async (context, type, id) => {
  await getTokenForComponent(context);
  try {

    let url = "";
    if (type == "club") {
      url = `${endpoint}/follow/club_followers/` + id;
    } else if (type == "player") {
      url = `${endpoint}/follow/player_followers/` + id;
    }

    console.log(url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const followUser = async (context, user_id) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/follow/user/` + user_id;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}


export const getClubPlayers = async (context, club_id) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/player/` + club_id + `/`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const followPlayer = async (context, player_id) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/follow/player/` + player_id;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const ratePlayer = async (context, player_id, formData) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/rating/rate_player/` + player_id;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const getPlayerProfile = async (context, player_id) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/player/profile/` + player_id;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const getUserProfile = async (context, user_id) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/user/profile/` + user_id;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}


export const uploadUnPublishedStatusPicture = async (context, form) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/statuses/upload`;
    const response = await fetch(url, {
      method: "POST",
      body: form,
      headers: {
        "Authorization": context.state.token,
        'Content-Type': 'multipart/form-data'
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}


// notifications

export const getSwapNotifications = async (context) => {
  await getTokenForComponent(context);
  try {
    const url = `${endpoint}/swap/notifications/`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": context.state.token,
      }
    });
    const responseJson = await response.json();
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

//chats

export const getChatParticipants = async (context) => {
  await getToken(context);
  try {
    const url = `${endpoint}/chat/`
    const response = await fetch(url, {
      method: "GET", headers: {
        'Authorization': context.state.token
      }
    });
    const responseJson = await response.json()
    context.setState({ participants: responseJson.participants, isRefreshing: false });
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const getChatWithUser = async (context) => {
  await getToken(context);
  try {
    const url = `${endpoint}/chat/get_chat_messages/${context.state.chat_with_id}/`
    const response = await fetch(url, {
      method: "GET", headers: {
        'Authorization': context.state.token
      }
    });
    const responseJson = await response.json()
    let msgs = responseJson.messages
    await responseJson.messages.forEach((value, index) => {
      msgs[index].user = JSON.parse(value.user);
    })
    console.log(msgs)
    context.setState({ messages: msgs, participants: responseJson.participants, isRefreshing: false });
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const sendChatMessage = async (context, form) => {
  await getToken(context);
  try {
    const url = `${endpoint}/chat/`
    const response = await fetch(url, {
      method: "POST",
      body: form,
      headers: {
        'Authorization': context.state.token
      }
    });
    const responseJson = await response.json()
    // context.setState({ message: responseJson.message });
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}


export const get = async (context, pUrl) => {
  await getToken(context);
  try {
    const url = `${endpoint}/${pUrl}/`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Authorization': context.state.token
      }
    });
    const responseJson = await response.json()
    // context.setState({ message: responseJson.message });
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}


export const unAuthPost = async (pUrl, form) => {
  try {
    const url = `${endpoint}/${pUrl}/`
    const response = await fetch(url, {
      method: "POST",
      body: form,
    });
    const responseJson = await response.json()
    // context.setState({ message: responseJson.message });
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}

export const postWithImages = async (context, pUrl, form) => {
  await getToken(context);
  try {
    const url = `${endpoint}/${pUrl}/`
    const response = await fetch(url, {
      method: "POST",
      body: form,
      headers: {
        'Authorization': context.state.token,
        'Content-Type': 'multipart/form-data'
      }
    });
    const responseJson = await response.json()
    // context.setState({ message: responseJson.message });
    return {
      response: responseJson,
      status: true
    };
  } catch (err) {
    return {
      status: false,
      response: err
    }
  }
}