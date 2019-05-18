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
var data;
var fedCollection = "feed"
var isFed = false;
var dataArray = []

function runSequence() {
    checkToday();
    setFoodTrue();
}

function updatePage() {
	console.log("updatePage")
    if (isFed) {
        document.getElementsByClassName("fed")[0].innerText = "FED"
        document.getElementById("bg").style.backgroundColor = "#8BFF86"
    } else {
        document.getElementsByClassName("fed")[0].innerText = "NOT FED"
        document.getElementById("bg").style.backgroundColor = "#FF6666"
    }
}

function load(){
	fetchFeedData(checkFed);
	fetchFeedData(checkToday);
	fetchFeedData(updatePage)
	fetchFeedData(createTable)
}

function checkFed() {
	console.log("checkFed")
    if (date.getHours() < 15) {
        if (dataArray[0].morning != "No") {
            isFed = true;
        }
    } else {
        if (dataArray[0].evening != "No") {
            isFed = true;
        }
    }
}


function fetchFeedData(callback) {
	
    db.collection(fedCollection)
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

function checkToday() {
	console.log("checkToday")
    try {
        if (parseDate(dataArray[0].date) != (parseDate(date.getTime()))) {
            console.log("are you working")
            addToday()
        }
    } catch (err) {

        console.log("are you erroring")
        addToday()
    }
}

function addToday() {

    db.collection(fedCollection).add({
            date: parseInt(date.getTime()),
            morning: "No",
            evening: "No"
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            fetchFeedData(function(){
            	console.log("fetching data")
            });
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
}

function setFoodTrue() {
    if (date.getHours() > 15) {
        db.collection(fedCollection).doc(dataArray[0].id).update({
                evening: parseInt(date.getTime())
            })
            .then(function() {
                console.log("Document successfully updated!");
            });
    } else {
        db.collection(fedCollection).doc(dataArray[0].id).update({
                morning: parseInt(date.getTime())
            })
            .then(function() {
                console.log("Document successfully updated!");
            });
    }
}

function createTable(){
	// console.log(data)
	console.log("createTable")
	var table = document.getElementById("myTable");
	var body = table.createTBody();
	for(var i = 0; i < dataArray.length; i++){
		var row = body.insertRow(i);
		var cell = row.insertCell(0);
		cell.innerHTML = "<b>"+(i+1)+"</b>";
		var cell = row.insertCell(1);
		cell.innerHTML = parseDate(dataArray[i].date);
		var cell = row.insertCell(2);
        try{
		    cell.innerHTML = parseTime(dataArray[i].morning);
        }catch(err){
            cell.innerHTML = "No";
        }
		colourTable(cell);
		var cell = row.insertCell(3);
		try{
            cell.innerHTML = parseTime(dataArray[i].evening);
        }catch(err){
            cell.innerHTML = "No";
        }
        colourTable(cell);
	}
}

function colourTable(cell){
	if(cell.innerHTML != "No"){
			cell.style.backgroundColor = "#8BFF86"
		}else{
			cell.style.backgroundColor = "#FF6666"	
		}
}