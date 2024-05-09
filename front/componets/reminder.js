import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import {
  NativeBaseProvider,
  Box,
  CheckIcon,
  FormControl,
  WarningOutlineIcon,
  Center,
  Modal,
  showModal,
  VStack,
  HStack,
  showModal2,
  Radio,
  showModal3,
  setShowModal,
  Skeleton,
  Spinner,
  Heading,
  Input,
  Button,
  Switch,
} from "native-base";
import { BASE_URL } from "./config";

export default function Reminder({ navigation }) {
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [reminderMsg, setReminderMsg] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isTaken, setIsTaken] = useState(false);
  const [frequency, setFrequency] = useState("");
  const [dosage, setDosage] = useState("");
  const [duration, setDuration] = useState("");
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          const response = await axios.get(
            `${BASE_URL}/reminder/`,
            {
              headers: {
                Authorization: `elagk__ ${storedToken}`,
              },
            }
          );
          if (response.status === 200) {
            console.log("Success:", response.data);
            setReminders(response.data.reminders);
          } else {
            console.error("Error:", response.status, response.statusText);
          }
        }
      } catch (error) {
        console.error("An error occurred during the request:", error);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (reminder) => {
    setEditingReminder(reminder);
    setReminderMsg(reminder.reminderMsg);
    setMedicineName(reminder.medicineName);
    setStartDate(reminder.startDate);
    setIsTaken(reminder.isTaken);
    setFrequency(reminder.frequency);
    setDosage(reminder.dosage);
    setDuration(reminder.duration);
    setShowModal(true);
  };

  const handleSaveReminder = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        const response = await axios.post(
          `${BASE_URL}/reminder/update?reminderId=${editingReminder._id}`,
          {
            reminderMsg,
            medicineName,
            startDate,
            isTaken: isTaken,
            frequency,
            dosage,
            duration,
          },
          {
            headers: {
              Authorization: `elagk__ ${storedToken}`,
            },
          }
        );
        if (response.status === 200) {
          console.log("Reminder updated successfully:", response.data);
          setShowModal(false);
          const updatedReminders = reminders.map((rem) => {
            if (rem._id === editingReminder._id) {
              return { ...rem, ...response.data.reminder };
            }
            return rem;
          });
          setReminders(updatedReminders);
        } else {
          console.error(
            "Error updating reminder:",
            response.status,
            response.statusText
          );
        }
      }
    } catch (error) {
      console.error("An error occurred during the request:", error);
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        const response = await axios.delete(
          `${BASE_URL}/reminder/?reminderId=${reminderId}`,
          {
            headers: {
              Authorization: `elagk__ ${storedToken}`,
            },
          }
        );
        if (response.status === 200) {
          console.log("Reminder deleted successfully:", response.data);
          setShowModal(false);
          const updatedReminders = reminders.filter(
            (rem) => rem._id !== reminderId
          );
          setReminders(updatedReminders);
        } else {
          console.error(
            "Error deleting reminder:",
            response.status,
            response.statusText
          );
        }
      }
    } catch (error) {
      console.error("An error occurred during the request:", error);
    }
  };
  
  return (
    <NativeBaseProvider>
      <ScrollView style={styles.profileContainer}>
        <View style={styles.titleView}>
          <Pressable onPress={() => navigation.navigate("NewDash")}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={30}
              color="grey"
              marginRight="15"
            />
          </Pressable>
          <Text style={styles.title}>Your Reminders</Text>
        </View>
       
      

        <View style={styles.reminder}>
          {reminders.map((reminder, index) => (
            <View style={styles.reminderContainer} key={index}>
              <Text
                style={{
                  color: "#003F5F",
                  fontSize: 20,
                  marginTop: 10,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {reminder.reminderMsg}
              </Text>
              <Text style={styles.reminderText}>
                Medicine: {reminder.medicineName}
              </Text>
              <Text style={styles.reminderText}>
                Start Date: {reminder.startDate}
              </Text>
              <Text style={styles.reminderText}>
                Is Taken: {reminder.isTaken ? "Yes" : "No"}
              </Text>
              <Text style={styles.reminderText}>
                Frequency: {reminder.frequency}
              </Text>
              <Text style={styles.reminderText}>Dosage: {reminder.dosage}</Text>
              <Text style={styles.reminderText}>
                Duration: {reminder.duration}
              </Text>

              <Button
                onPress={() => handleOpenModal(reminder)}
                style={{ marginBottom: 10 }}
              >
                Edit Reminder
              </Button>
              <Button onPress={() => handleDeleteReminder(reminder._id)}>
                Delete Reminder
              </Button>
              <View style={styles.line}></View>
            </View>
          ))}
        </View>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content style={{ height: 400 }}>
            <Modal.CloseButton />
            <Modal.Header>Edit Reminder</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Reminder Message</FormControl.Label>
                <Input value={reminderMsg} onChangeText={setReminderMsg} />
              </FormControl>
              {/* <FormControl>
                <FormControl.Label>Medicine Name</FormControl.Label>
                <Input value={medicineName} onChangeText={setMedicineName} />
              </FormControl> */}
              <FormControl>
                <FormControl.Label>Start Date</FormControl.Label>
                <Input value={startDate} onChangeText={setStartDate} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Is Taken</FormControl.Label>
                <Switch
                  isChecked={isTaken}
                  onToggle={(value) => setIsTaken(value)}
                  colorScheme="blue"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Frequency</FormControl.Label>
                <Input value={frequency} onChangeText={setFrequency} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Dosage</FormControl.Label>
                <Input value={dosage} onChangeText={setDosage} />
              </FormControl>
              <FormControl>
                <FormControl.Label>Duration</FormControl.Label>
                <Input value={duration} onChangeText={setDuration} />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button onPress={() => handleSaveReminder()}>Save</Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </ScrollView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "blue",
    position: "relative",
    width: 428,
    height: 926,
    backgroundColor: "white",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    textAlign: "center",
  },
  titleView: {
    width: "100%",
    justifyContent: "space-around",
    alignItems:'center',
    flexDirection: "row",
    padding: 50,
  },
  title: {
    fontWeight: "700",
    fontSize: 35,
    textAlign: "center",
    textTransform: "capitalize",
    color: "#003F5F",
  },
  reminder: {
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    backgroundColor: "white",

    marginBottom: 30,
  },
  reminderContainer: {
    backgroundColor: "#89CFF0",
    width: "100%",
    height: "auto",
    marginBottom: 30,
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    padding: 20,
  },
  line: {
    marginTop: 20,
    height: 3,
    width: "100%",
    backgroundColor: "white",
  },
  reminderText: {
    color: "#003F5F",
    fontSize: 20,
    marginBottom: 10,
  },
});
