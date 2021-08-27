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
  Keyboard,
} from "react-native";
import Thought from "./components/Thought";
import { db } from "./firebase";
import firebase from "firebase/app";

export default function App() {
  const [data, setData] = useState("");
  const [items, setItems] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(async () => {
    async function fetchData() {
      await db
        .collection("thoughts")
        .orderBy("createdAt", "desc")
        .get()
        .then((snapshot) => {
          let list = [];
          snapshot.forEach((doc) => list.push({ ...doc.data(), id: doc.id }));
          setItems(list);
        });
    }
    fetchData();
  }, [refresh]);

  const handleAddThought = async () => {
    Keyboard.dismiss();
    if (data != "") {
      await db.collection("thoughts").add({
        thought: data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setRefresh(!refresh);
      setData("");
    }
  };

  const handleDeleteThought = async (id) => {
    await db.collection("thoughts").doc(id).delete();
    setRefresh(!refresh);
  };

  return (
    <View style={styles.container}>
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
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
    color: "#55bcf6",
  },
  head: { textAlign: "center", marginBottom: 20, color: "#a9a9a9" },
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
});
