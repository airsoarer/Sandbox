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

                firebase.storage().ref("Users/" + uid).child("ProfilePhoto").getDownloadURL().then((url) => {
                    $("#profilePicture").attr("src", url);
                    $(".picture").css("display", "block");
                })
                
                $(".contain").css("display", "block");
            }
        })

        $("#editFname").keyup((e) => {
            if(e.keyCode === 13){
                updateFname();
            }
        });
        $("#editLname").keyup((e) => {
            if(e.keyCode === 13){
                updateLname();
            }
        });
        $("#editSubject").keyup((e) => {
            if(e.keyCode === 13){
                updateSubject();
            }
        });
        $("#editSchool").keyup((e) => {
            if(e.keyCode === 13){
                updateSchool();
            }
        });
        
        $("#updateBio").on("click", updateBio);
        $("#updatePhoto").on("click", updatePhoto);
        $(".editBtn").on("click", openEdit);
        $(".logout").on("click", logout);
    }

    function openEdit(){
        $(".editable").toggle();
    }

    function updatePhoto(){
        let file = $("#file").prop("files")[0];
        firebase.storage().ref("Users/" + uid + "/ProfilePhoto").put(file).then((snapshot) => {
            console.log(snapshot.downloadURL);
           $("#photoUploaded").css("display", "block");
        })
    }

    function updateFname(){
        let data = $("#editFname").val();

        firebase.database().ref("Users/Teachers/" + uid + "/Info").child("FirstName").transaction((info) => {
            info = data;
            return data;
        })

        $("#editFname").val(" ");
        $("#editFname").attr("placeholder", "First Name");
    }
    
    function updateLname(){
        let data = $("#editLname").val();
        
        firebase.database().ref("Users/Teachers/" + uid + "/Info").child("LastName").transaction((info) => {
            info = data;
            return data;
        })

        $("#editLname").val(" ");
        $("#editLname").attr("placeholder", "Last Name");
    }

    function updateSubject(){
        let data = $("#editSubject").val();
        
        firebase.database().ref("Users/Teachers/" + uid + "/Info").child("Subject").transaction((info) => {
            info = data;
            return data;
        })

        $("#editSubject").val(" ");
        $("#editSubject").attr("placeholder", "Subject");
    }

    function updateSchool(){
        let data = $("#editSchool").val();
        
        firebase.database().ref("Users/Teachers/" + uid + "/Info").child("School").transaction((info) => {
            info = data;
            return data;
        })

        $("#editSchool").val(" ");
        $("#editSchool").attr("placeholder", "School");
    }

    function updateBio(){
        let data = $("#editBio").val();
        
        firebase.database().ref("Users/Teachers/" + uid + "/Info").child("Bio").transaction((info) => {
            info = data;
            return data;
        })

        $("#editBio").val(" ");
    }

    function logout(){
        console.log("Working");
        firebase.auth().signOut().then(() => {
            location.replace("../html/home.html");
        });
    }
})();