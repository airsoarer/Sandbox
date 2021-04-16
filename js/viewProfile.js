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

    let url = window.location.href;
    let uid = "";

    function init(){
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();

        let temp = url.split("?uid=");
        url = temp[1];

        // Profile Info
        firebase.database().ref("Users/Teachers/" + url + "/Info").on("value", (snapshot) => {
            let data = snapshot.val();

            $("#name").text(data.FirstName + " " + data.LastName);
            $("#subject").text(data.Subject);
            $("#email").text(data.Email);
            $("#school").text(data.School);
            $("#bio").text(data.Bio);

            if(data.Subject === ""){
                $("#subject").text("No Teaching Subject");
            }

            if(data.School === ""){
                $("#school").text("No School");
            }

            if(data.Bio === ""){
                $("#bio").text("Hmmm... It appears that " + data.FirstName + " " + data.LastName + " hasn't added to their bio yet. Come back a little later to learn more about them.");
            }
        })

        firebase.storage().ref("Users/" + uid).child("ProfilePhoto").getDownloadURL().then((url) => {
            $("#profilePicture").attr("src", url);
            $(".picture").css("display", "block");
        }).catch((err) => {
            if(err.code === "storage/object-not-found"){
                $("#profilePicture").attr("src", "../images/user-placeholder.png");
                $(".picture").css("display", "block");
            }
        })

        // Posts and Questions 
        firebase.database().ref("Users/Teachers/" + url + "/Posts/PostKeyArray").on("value", (snapshot) => {
            let data = snapshot.val();
            if(data.length === 1){
                $("#noPosts").css("display", "block")
            }else{
                $("#noPosts").css("display", "none");
                for(let i = 1; i < data.length; i++){
                    firebase.database().ref("Posts/" + data[i]).on("value", (snapshot) => {
                        let data = snapshot.val();
                        let key = snapshot.key;
            
                        let div = document.createElement("div");
                        div.classList.add("col");
                        div.classList.add("m12")
                        div.classList.add("postDiv")
                        div.classList.add(key + "div");
                        div.id = key;
            
                        let title = document.createElement("a");
                        title.id = key;
                        title.textContent = data.Title;
                        title.href = "../html/post.html?uid=" + key;
                        title.classList.add("col");
                        title.classList.add("m12");
                        title.classList.add("postTitle");
                        div.appendChild(title);

                        // Description =======================================================
            
                        let description = document.createElement("p");
                        let truncated = data.Description.split(" ").splice(0, 30).join(" ");
                        if(truncated != data.Description){
                            truncated = truncated + "..."
                        }
                        description.textContent = truncated;
                        description.classList.add("col");
                        description.classList.add("m12");
                        description.classList.add("description");
                        div.appendChild(description);
            
                        let tagContainer = document.createElement("div");
                        tagContainer.classList.add("tagContainer");
                        tagContainer.classList.add("col");
                        tagContainer.classList.add("m12");
                        div.appendChild(tagContainer);
            
                        $(".posts").append(div);
                    });
                }
            }
        });

        // Questions =======================================================

        firebase.database().ref("Users/Teachers/" + url + "/Questions/QuestionKeyArray").on("value", (snapshot) => {
            let data = snapshot.val();

            if(data.length === 1){
                $("#noQuestions").css("display", "block")
            }else{
                $("#noQuestions").css("display", "none");
                for(let i = 1; i < data.length; i++){
                    console.log(data[i]);
                    firebase.database().ref("Questions/" + data[i]).on("value", (snapshot) => {
                        let data = snapshot.val();
                        let key = snapshot.key;
            
                        let div = document.createElement("div");
                        div.classList.add("col");
                        div.classList.add("m12")
                        div.classList.add("postDiv");
                        div.classList.add("questionDiv")
                        div.classList.add(key + "div");
                        div.id = key;
            
                        let title = document.createElement("a");
                        title.id = key;
                        title.textContent = data.Title;
                        title.href = "../html/post.html?uid=" + key;
                        title.classList.add("col");
                        title.classList.add("m10");
                        title.classList.add("questionTitle");
                        div.appendChild(title);

                        // Description =======================================================
            
                        let description = document.createElement("p");
                        let truncated = data.Description.split(" ").splice(0, 30).join(" ");
                        if(truncated != data.Description){
                            truncated = truncated + "..."
                        }
                        description.textContent = truncated;
                        description.classList.add("col");
                        description.classList.add("m12");
                        description.classList.add("description");
                        div.appendChild(description);
            
                        let tagContainer = document.createElement("div");
                        tagContainer.classList.add("tagContainer");
                        tagContainer.classList.add("col");
                        tagContainer.classList.add("m12");
                        div.appendChild(tagContainer);
            
                        $(".questions").append(div);
                    });
                }
            }
        });
        
        $("#postSearch").on("click", post);
        $("#questionSearch").on("click", question);
        $(".contain").css("display", "block");
        $(".logout").on("click", logout);
    }

    function post(){
        $(".posts").css("display", "block");
        $(".questions").css("display", "none");

        $("#postSearch").css("background-color", "#EA5566");
        $("#postSearch").css("color", "white");
        $("#postSearch").css("transition-duration", ".5s");
        $("#postSearch").css("box-shadow", "1px 10px 5px #8f8f8f");

        $("#questionSearch").css("background-color", "white");
        $("#questionSearch").css("color", "black");
        $("#questionSearch").css("transition-duration", ".5s");
        $("#questionSearch").css("box-shadow", "1px 2px 5px #8f8f8f");
    }

    function question(){
        $(".posts").css("display", "none");
        $(".questions").css("display", "block");

        $("#questionSearch").css("background-color", "#6B474B");
        $("#questionSearch").css("color", "white");
        $("#questionSearch").css("transition-duration", ".5s");
        $("#questionSearch").css("box-shadow", "1px 10px 5px #8f8f8f");

        $("#postSearch").css("background-color", "white");
        $("#postSearch").css("color", "black");
        $("#postSearch").css("transition-duration", ".5s");
        $("#postSearch").css("box-shadow", "1px 2px 5px #8f8f8f");
    }

    function logout(){
        console.log("Working");
        firebase.auth().signOut().then(() => {
            location.replace("../html/home.html");
        });
    }
})();