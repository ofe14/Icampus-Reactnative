import { createdAt } from "expo-updates";
import firebase from "firebase/compat/app";

export function addschedule(task, added) {
    firebase.firestore()
    .collection('schedule')
    .add({
        task: task.name,
        time:task.time,
        createdAt:firebase.firestore.FieldValue.serverTimestamp()
    }).then((data) => added(data))
    .catch((error)=> console.log(error))
}

export async function getSchedule(taskRetrieved){

    var tasks = [];

    var snapshot = await firebase.firestore()
    .collection('schedule')
    .orderBy('CreatedAt')
    .get()

    snapshot.forEach((doc)=> {
        tasks.push(doc.data());
    });
    
    taskRetrieved(tasks);
}