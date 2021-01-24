(function() {
    $(document).ready(init);
    let firebaseConfig = {
        apiKey: "AIzaSyD3_BPpD_0Z6hQborCaM1BkG-0q-Q5T260",
        authDomain: "sandbox-b7af9.firebaseapp.com",
        databaseURL: "https://sandbox-b7af9.firebaseio.com",
        projectId: "sandbox-b7af9",
        storageBucket: "sandbox-b7af9.appspot.com",
        messagingSenderId: "841329369644",
        appId: "1:841329369644:web:7c080b7ac7ec7c1c396789",
        measurementId: "G-SDMHFEY00Q"
    };

    let uid = "";

    function init(){
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();

        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                uid = user.uid;
                loadData();
            }
        })
    }

    function loadData(){
        firebase.database().ref("Users/Teachers/" + uid + "/Info").on("value", (snapshot) => {
            let data = snapshot.val();

            $("#name").text(data.FirstName + " " + data.LastName);
            $("#subject").text(data.Subject);
            $("#school").text(data.School);
            $("#bio").text(data.Bio);

            if(data.Subject === ""){
                $("#subject").text("No Teaching Subject");
            }

            if(data.School === ""){
                $("#school").text("No School");
            }

            if(data.Bio === ""){
                $("#bio").text("No information for Bio");
            }
        })

        $(".contain").css("display", "block");
    }
})();