import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";
import Swiper from "react-native-swiper";
import { WebView } from "react-native-webview";
import data from "./data.json";

//Dimensions of device screen
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

class ArticleSwipe extends Component {
  constructor(props) {
    super(props);
    //position of the current article
    this.position = new Animated.ValueXY();
    //position of the swiped up article
    this.swipedCardPosition = new Animated.ValueXY({ x: 0, y: -SCREEN_HEIGHT });
    this.state = {
      currentIndex: 0,
    };
  }

  UNSAFE_componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0 && this.state.currentIndex > 0) {
          this.swipedCardPosition.setValue({
            x: 0,
            y: -SCREEN_HEIGHT + gestureState.dy,
          });
        } else {
          this.position.setValue({
            x: 0,
            y: gestureState.dy,
          });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (
          this.state.currentIndex > 0 &&
          gestureState.dy > 50 &&
          gestureState.vy > 0.7
        ) {
          Animated.timing(this.swipedCardPosition, {
            toValue: { x: 0, y: 0 },
            duration: 400,
            useNativeDriver:false
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex - 1 });
            this.swipedCardPosition.setValue({ x: 0, y: -SCREEN_HEIGHT });
          });
        } else if (-gestureState.dy > 20 && -gestureState.vy > 0.7 && this.state.currentIndex < data.ARTICLES.length-1) {
          Animated.timing(this.position, {
            toValue: { x: 0, y: -SCREEN_HEIGHT },
            duration: 400,
            useNativeDriver:false
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 });
            this.position.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.parallel([
            Animated.spring(this.position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver:false
            }),
            Animated.spring(this.swipedCardPosition, {
              toValue: { x: 0, y: -SCREEN_HEIGHT },
              useNativeDriver:false
            }),
          ]).start();
        }
      },
    });
  }

  //This function display the articles
  renderArticles() {
    return data.ARTICLES.map((item, i) => {
      if (i == this.state.currentIndex - 1) {
        return (
          <Animated.View
            key={item.id}
            style={this.swipedCardPosition.getLayout()}
            {...this.PanResponder.panHandlers}
          >
            <View
              style={{
                flex: 1,
                position: "absolute",
                height: SCREEN_HEIGHT,
                width: SCREEN_WIDTH,
                backgroundColor: "#fff",
              }}
            >
              <View style={{ flex: 2 }}>
                <Image
                  source={{ uri: data.ARTICLES[i].uri }}
                  style={{
                    flex: 1,
                    height: null,
                    width: null,
                    marginTop: 20,
                  }}
                ></Image>
              </View>
              <View style={{ flex: 3, padding: 5 }}>
                <Text>{data.ARTICLES[i].text}</Text>
              </View>
            </View>
          </Animated.View>
        );
      } else if (i < this.state.currentIndex) {
        return null;
      }
      if (i == this.state.currentIndex) {
          return (
            <Animated.View
              key={item.id}
              style={this.position.getLayout()}
              {...this.PanResponder.panHandlers}
            >
              <View
                style={{
                  flex: 1,
                  position: "absolute",
                  height: SCREEN_HEIGHT,
                  width: SCREEN_WIDTH,
                  backgroundColor: "#fff",
                  marginTop: 20,
                }}
              >
                <View style={{ flex: 2 }}>
                  <Image
                    source={{ uri: data.ARTICLES[i].uri }}
                    style={{
                      flex: 1,
                      height: null,
                      width: null,
                      resizeMode: "cover",
                    }}
                  ></Image>
                </View>
                <View style={{ flex: 3, padding: 5 }}>
                  <Text>{data.ARTICLES[i].text}</Text>
                </View>
              </View>
            </Animated.View>
          );
      } else {
        return (
          <Animated.View key={item.id}>
            <View
              style={{
                flex: 1,
                position: "absolute",
                height: SCREEN_HEIGHT,
                width: SCREEN_WIDTH,
                backgroundColor: "#fff",
              }}
            >
              <View style={{ flex: 2 }}>
                <Image
                  source={{ uri: data.ARTICLES[i].uri }}
                  style={{
                    flex: 1,
                    height: null,
                    width: null,
                    marginTop: 20,
                  }}
                ></Image>
              </View>
              <View style={{ flex: 3, padding: 5 }}>
                <Text>{data.ARTICLES[i].text}</Text>
              </View>
            </View>
          </Animated.View>
        );
      }
    }).reverse();
  }

  render() {
    return (
      <Swiper loop={false} showsPagination={false}>
        <Swiper
          horizontal={false}
          loop={false}
          showsPagination={false}
          index={1}
        >
          <View style={{ flex: 1 }}>{this.renderArticles()}</View>
        </Swiper>
        <WebView
          source={{ uri: data.ARTICLES[this.state.currentIndex].url }}
          style={{ marginTop: 20 }}
        />
      </Swiper>
    );
  }
}
export default ArticleSwipe;
