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

        $("#login").on("click", login);
        $("#google").on("click", google);
    }

    function login(){
        let email = $("#email").val();
        let pass = $("#pass").val();

        let auth = firebase.auth().signInWithEmailAndPassword(email, pass).catch((err) => {
            let errCode = err.code;
            if(errCode === 'auth/wrong-password'){
                $('#pass').css('border-color', 'red !important');
                $('#wrongPass').css("display", 'block');
                return;
            }

            if(errCode === 'auth/invalid-email'){
                $('#email').css('border-color', 'red !important');
                $('#emailNotFound').css('display', 'block');
                return;
            }

            if(errCode === 'auth/user-not-found'){
                $('#email').css('border-color', 'red !important');
                $('#pass').css('border-color', 'red !important');
                $('#emailNotFound').css('display', 'block');
                return;
            }
        });

        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                location.replace("../html/discussions.html");
            }
        });
    }

    function google(){
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result) => {
            let token = result.credential.accessToken;
            let user = result.user;

            location.replace("../html/discussions.html");
        });
    }
})();