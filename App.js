/**
 * Gratitude React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, AsyncStorage, 
  Button, TextInput, Keyboard} from 'react-native';

const isAndroid = Platform.OS == "android";
const viewPadding = 10;

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

type Props = {};
export default class App extends Component<Props> {
  state = {
    items: [],
    text: ""
  };

  changeTextHandler = text => {
    this.setState({ text: text });
  };

  addItem = () => {
    let notEmpty = this.state.text.trim().length > 0;

    if (notEmpty) {
      this.setState(
        prevState => {
          let { items, text } = prevState;
          return {
            items: items.concat({ key: items.length, text: text }),
            text: ""
          };
        },
        () => Items.save(this.state.items)
      );
    }
  };

  deleteItem = i => {
    this.setState(
      prevState => {
        let items = prevState.items.slice();

        items.splice(i, 1);

        return { items: items };
      },
      () => Items.save(this.state.items)
    );
  };

  componentDidMount() {
    Keyboard.addListener(
      isAndroid ? "keyboardDidShow" : "keyboardWillShow",
      e => this.setState({ viewPadding: e.endCoordinates.height + viewPadding })
    );

    Keyboard.addListener(
      isAndroid ? "keyboardDidHide" : "keyboardWillHide",
      () => this.setState({ viewPadding: viewPadding })
    );

    Items.all(items => this.setState({ items: items || [] }));
  }

  render() {
    return (
      <View
        style={[styles.container, { paddingBottom: this.state.viewPadding }]}
      >
        <FlatList
          style={styles.list}
          data={this.state.items}
          renderItem={({ item, index }) =>
            <View>
              <View style={styles.listItemCont}>
                <Text style={styles.listItem}>
                  {item.text}
                </Text>
                <Button title="X" onPress={() => this.deleteItem(index)} />
              </View>
              <View style={styles.hr} />
            </View>}
        />
        <TextInput
          style={styles.textInput}
          onChangeText={this.changeTextHandler}
          onSubmitEditing={this.addItem}
          value={this.state.text}
          placeholder="Add an Item"
          returnKeyType="done"
          returnKeyLabel="done"
        />
      </View>
    );
  }
}

let Items = {
  convertToArrayOfObject(items, callback) {
    return callback(
      items ? items.split("||").map((item, i) => ({ key: i, text: item })) : []
    );
  },
  convertToStringWithSeparators(items) {
    return items.map(item => item.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("ITEMS", (err, items) =>
      this.convertToArrayOfObject(items, callback)
    );
  },
  save(items) {
    AsyncStorage.setItem("ITEMS", this.convertToStringWithSeparators(items));
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: viewPadding,
    paddingTop: 50,
    
  },
  list: {
    width: "100%",
    backgroundColor: "#e8e8e8",
    borderRadius: 4,
    padding: 5,
    marginTop: 50,
    marginBottom: 100
  },
  listItem: {
    backgroundColor: "#fff",
    paddingTop: 3,
    paddingBottom: 10,
    fontSize: 18,
    marginBottom: 6,
    borderRadius: 4
  },
  hr: {
    height: 1,
    backgroundColor: "gray"
  },
  listItemCont: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textInput: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: "gray",
    borderWidth: isAndroid ? 0 : 1,
    width: "100%",
    borderRadius: 4
  }
});
