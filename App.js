import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import Thought from "./components/Thought";
import { rdb } from "./firebase";
import NetInfo from "@react-native-community/netinfo";

export default function App() {
  const [data, setData] = useState("");
  const [items, setItems] = useState(undefined);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function fetchData() {
      rdb.ref("thoughts").on("value", (snapshot) => {
        let obj = snapshot.val();
        let list = [];
        for (let key in obj) {
          {
            list.unshift({ id: key, ...obj[key] });
          }
        }
        setItems(list);
      });
    }
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });

    fetchData();

    return () => unsubscribe();
  }, []);

  const handleAddThought = () => {
    try {
      if (data != "" && isOnline) {
        rdb.ref("/thoughts").push({
          thought: data,
        });
        setData("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteThought = async (id) => {
    try {
      await rdb.ref("thoughts").child(id).remove();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./assets/bg.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.sectionTitle}>thoughts</Text>
        <Text style={styles.head}>Say something nice...</Text>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.writeTaskWrapper}
          >
            <TextInput
              style={styles.input}
              placeholder={"What's on your mind ?"}
              value={data}
              onChangeText={(text) => setData(text)}
            />
            <TouchableOpacity onPress={() => handleAddThought()}>
              <View style={styles.addWrapper}>
                <Text style={styles.addText}>+</Text>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
          {isOnline ? (
            items ? (
              <View style={styles.tasksWrapper}>
                <View style={styles.items}>
                  {items.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleDeleteThought(item.id)}
                    >
                      <Thought text={item.thought} />
                    </TouchableOpacity>
                  ))}
                </View>
                <View />
              </View>
            ) : (
              <Text style={styles.loadingText}>Loading...</Text>
            )
          ) : (
            <View>
              <Text style={styles.offlineText}>No network connection</Text>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  tasksWrapper: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 50,
    color: "white",
  },
  head: { textAlign: "center", marginBottom: 20, color: "white" },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 20,
    color: "white",
  },
  offlineText: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 20,
    marginBottom: 20,
  },
  addText: {
    fontSize: 35,
  },
});
