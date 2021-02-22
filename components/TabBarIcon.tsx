import Icon from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';

export default function TabBarIcon(props: { name: string; color: string, size: int }) {
    return <Icon style={{ marginLeft: 6, alignSelf: 'flex-end' }} {...props} />;
};
