import React from 'react'
import { Text, TouchableOpacity, View, FlatList, Image } from 'react-native'
import { getEndPointUrl } from '../../apis/';

export const DescriptionImagesFlatList = (props) => {
  let media = JSON.parse(props.media);
  console.log("my props: " + media.images)
  return (
    <FlatList
      data={media.images}
      keyExtractor={(item) => {
        return item.index
      }}
      numColumns={2}
      renderItem={(item) => {
        const image = item.item
        const image_path = getEndPointUrl() + '/static/clubs/description/' + image
        console.log(image_path)
        return (
          <Image style={{ width: '45%', height: 180, margin: 4 }} source={{ uri: image_path }} />
        )
      }}
    />
  )
}
