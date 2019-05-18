var firebaseConfig = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appID: "app-id",
};
firebase.initializeApp(firebaseConfig);
//======================================================


var db = firebase.firestore();
var date = new Date();
var dataArray = [];
var notesCollection = "notes"
var isFed = false;


function runSequence() {
    checkToday();
    setFoodTrue();
}


function load(){
	fetchNotesData(createTable)
}

function parseDate(millis){
    var oldDate = new Date(millis);
    var dateStr = oldDate.getFullYear() + "-" + (oldDate.getMonth()+1) + "-" + oldDate.getDate()
    return dateStr;
}

function parseTime(millis){
    var oldDate = new Date(millis);
    if(isNaN(oldDate.getTime())){
        return "No";
    }
    var dateStr = oldDate.getHours() + ":" + oldDate.getMinutes()
    // console.log(dateStr)
    return(dateStr)
}

function fetchNotesData(callback) {
	
    db.collection(notesCollection)
        .get()
        .then(function(querySnapshot) {
        	dataArray = []
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
            	var dataObj = doc.data();
                dataObj.id = doc.id
                dataArray.push(dataObj)
                console.log(dataObj)
        });
        dataArray = dataArray.sort(function(a, b){return a.date - b.date}).reverse();
        callback();
    });

}

function addNotesData() {
	db.collection(notesCollection).add({
            date: parseInt(date.getTime()),
            topic: document.getElementById("topic").value,
            note: document.getElementById("note").value
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            fetchNotesData(function(){
            	console.log("fetching data")
            });
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
}

function createTable(){
	console.log("createTable")
	var table = document.getElementById("myTable");
	var body = table.createTBody();
	for(var i = 0; i < dataArray.length; i++){
		var row = body.insertRow(i);
		var cell = row.insertCell(0);
		cell.innerHTML = parseDate(dataArray[i].date);
		var cell = row.insertCell(1);
		cell.innerHTML = parseTime(dataArray[i].date);
		var cell = row.insertCell(2);
		cell.innerHTML = dataArray[i].topic;
		var cell = row.insertCell(3);
		cell.innerHTML = dataArray[i].note;
	}

}