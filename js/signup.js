(function (){
    $(document).ready(init);
    var firebaseConfig = {
        apiKey: "AIzaSyD3_BPpD_0Z6hQborCaM1BkG-0q-Q5T260",
        authDomain: "sandbox-b7af9.firebaseapp.com",
        databaseURL: "https://sandbox-b7af9.firebaseio.com",
        projectId: "sandbox-b7af9",
        storageBucket: "sandbox-b7af9.appspot.com",
        messagingSenderId: "841329369644",
        appId: "1:841329369644:web:7c080b7ac7ec7c1c396789",
        measurementId: "G-SDMHFEY00Q"
    };
    
    function init(){
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();

        $("#signup").on("click", signup);
        $("#google").on("click", google);
        $("#studentSignup").on("click", studentSignup);
        $("#studentGoogle").on("click", studentGoogle);

        $("#teacher").on("click", teacher);
        $("#student").on("click", student);
    }

    function teacher(){
        $(".teacher").css("display", "block");
        $(".student").css("display", "none");

        $("#teacher").css("background-color", "#EA5566");
        $("#teacher").css("color", "white");
        $("#teacher").css("transition-duration", ".5s");
        $("#teacher").css("box-shadow", "1px 10px 5px #8f8f8f");

        $("#student").css("background-color", "white");
        $("#student").css("color", "black");
        $("#student").css("transition-duration", ".5s");
        $("#student").css("box-shadow", "1px 2px 5px #8f8f8f");
    }

    function student(){
        $(".teacher").css("display", "none");
        $(".student").css("display", "block");

        $("#student").css("background-color", "#EA5566");
        $("#student").css("color", "white");
        $("#student").css("transition-duration", ".5s");
        $("#student").css("box-shadow", "1px 10px 5px #8f8f8f");

        $("#teacher").css("background-color", "white");
        $("#teacher").css("color", "black");
        $("#teacher").css("transition-duration", ".5s");
        $("#teacher").css("box-shadow", "1px 2px 5px #8f8f8f");
    }

    function signup(){
        let fname = $("#fname").val();
        let lname = $("#lname").val();
        let subject = $("#subject").val();
        let school = $("#school").val();
        let email = $("#email").val();
        let pass = $("#pass").val();
        let repass = $("#repass").val();

        if(fname < 1){
            $("#fname").css("border-bottom-color", "red");
            signup();
        }

        if(lname < 1){
            $("#lname").css("border-bottom-color", "red");
            signup();
        }

        if(subject < 1){
            $("subject").css("border-bottom-color", "red");
            signup();
        }

        if(school < 1){
            $("#school").css("border-bottom-color", "red");
            signup();
        }

        if(email < 1){
            $("#email").css("border-bottom-color", "red");
            signup();
        }

        if(pass === repass){
            console.log("Working");
            firebase.auth().createUserWithEmailAndPassword(email, pass).then((user) => {
                if(user){
                    firebase.database().ref("Users/Teachers/" + user.user.uid + "/Info").set({
                        FirstName:fname,
                        LastName:lname,
                        Email:email,
                        UID:user.user.uid,
                        Subject:subject,
                        School:school,
                        Status:"TEACHER",
                        Bio:""
                    }).then(() => {
                        firebase.database().ref("Users/Teachers/" + user.user.uid + "/Posts").set({
                            PostKeyArray: [""]
                        }).then(() => {
                            firebase.database().ref("Users/Teachers/" + user.user.uid + "/Questions").set({
                                QuestionKeyArray: [""]
                            })
                            location.replace("profile.html?first_signup");
                        });
                    });
                }
            })
        }else{
            $("#pass").css("border-bottom-color", "red");
            $("#repass").css("border-bottom-color", "red");
        }
    }

    function google(){
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
            let token = result.credential.accessToken;
            let user = result.user;

            let email = user.email;
            let UID = user.uid;
            let nameFragments = user.displayName.split(" ");
            let fname = nameFragments[0];
            let lname = nameFragments[1];

            firebase.database().ref("Users/Teachers/" + UID + "/Info").set({
                FirstName:fname,
                LastName:lname,
                Email:email,
                UID:UID,
                School:"",
                Subject:"",
                Status:"TEACHER",
                Bio:""
            }).then(() => {
                firebase.database().ref("Users/Teachers/" + UID + "/Posts").set({
                    PostKeyArray: [""]
                }).then(() => {
                    firebase.database().ref("Users/Teachers/" + UID + "/Questions").set({
                        QuestionKeyArray: [""]
                    })
                    location.replace("profile.html?first_signup");
                })
            });
        });
    }

    function studentSignup(){
        let fname = $("#studentfname").val();
        let lname = $("#studentlname").val();
        let grade = $("#grade").val();
        let email = $("#studentEmail").val();
        let pass = $("#studentPass").val();
        let repass = $("#studentRepass").val();

        if(fname < 1){
            $("#fname").css("border-bottom-color", "red");
            signup();
        }

        if(lname < 1){
            $("#lname").css("border-bottom-color", "red");
            signup();
        }

        if(grade < 1){
            $("grade").css("border-bottom-color", "red");
            signup();
        }

        if(email < 1){
            $("#email").css("border-bottom-color", "red");
            signup();
        }

        if(pass === repass){
            firebase.auth().createUserWithEmailAndPassword(email, pass).then((user) => {
                if(user){
                    firebase.database().ref("Users/Students/" + user.user.uid + "/Info").set({
                        FirstName:fname,
                        LastName:lname,
                        Email:email,
                        UID:user.user.uid,
                        Status:"STUDENT",
                        Grade:""
                    }).then(() => {
                        location.replace("profile.html?first_signup");
                    });
                }
            })
        }else{
            $("#pass").css("border-bottom-color", "red");
            $("#repass").css("border-bottom-color", "red");
        }
    }

    function studentGoogle(){
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
            let token = result.credential.accessToken;
            let user = result.user;

            let email = user.email;
            let UID = user.uid;
            let nameFragments = user.displayName.split(" ");
            let fname = nameFragments[0];
            let lname = nameFragments[1];

            firebase.database().ref("Users/Students/" + UID + "/Info").set({
                FirstName:fname,
                LastName:lname,
                Email:email,
                UID:UID,
                Status:"STUDENT",
                Grade:""
            }).then(() => {
                location.replace("profile.html?first_signup");
            });
        });
    }
})();