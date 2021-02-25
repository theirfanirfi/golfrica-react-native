import * as React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
const windowWidth = Dimensions.get('window').width;
import ImageView from "react-native-image-viewing";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { getEndPointUrl } from '../../apis/';

export default class CarouselComponent extends React.PureComponent {

    constructor(props) {
        super(props);
    }
    state = {
        token: null,
        media: [],
        activeSlide: 0,
        visible: false,
        ImageViewerImages: [],
        isLoading: true,
    }

    static = {
        media: PropTypes.array,
        showAlert: PropTypes.func,
    }

    get pagination() {
        return (
            <Pagination
                style={{ height: 10 }}
                dotsLength={this.state.media.length}
                activeDotIndex={this.state.activeSlide}
                containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.92)'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.media !== props.media && props.media !== undefined) {
            let jMedia = JSON.parse(props.media);
            let VImages = [];
            if (jMedia != null) {
                if (jMedia.images.length > 0) {
                    jMedia.images.map((element, index) => {
                        VImages.push({
                            "uri": element.includes('http://') ? element : getEndPointUrl() + '/static/user/status/' + element
                        });
                    });
                }

                return {
                    ImageViewerImages: VImages
                };
            } else {
                return null;
            }

        }
        return null;
    }



    async componentDidMount() {
        let media = await this.props.media;
        if (media == undefined) {
            this.setState({ isLoading: false });

            return null;
        } else {
            let jMedia = await JSON.parse(media);
            let VImages = [];
            if (jMedia != null) {
                if (jMedia.images.length > 0) {
                    await jMedia.images.map((element, index) => {
                        VImages.push({
                            "uri": element.includes('http://') ? element : getEndPointUrl() + '/static/user/status/' + element
                        });
                    });
                }
                this.setState({ ImageViewerImages: VImages, isLoading: false });
            }
        }

    }

    showErrorAlert = msg => {
        this.props.showAlert('error', msg);
    }



    toInt = value => {
        return parseInt(value);
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.setState({ visible: true })}>
                <Image style={{ width: '100%', height: 200 }} source={item} />
            </TouchableOpacity>

        );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ justifyContent: 'center', flexDirection: 'column', flex: 1, alignContent: 'center' }}>
                    <ActivityIndicator size="large" color="green" style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <View>
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.ImageViewerImages}
                    renderItem={this._renderItem}
                    sliderWidth={windowWidth - 60}
                    layout={'tinder'}
                    layoutCardOffset={8}
                    itemWidth={windowWidth - 60}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}

                />

                { this.pagination}

                <ImageView
                    images={this.state.ImageViewerImages}
                    imageIndex={0}
                    visible={this.state.visible}
                    onRequestClose={() => this.setState({ visible: false })}
                />
            </View>
        );
    }
}
