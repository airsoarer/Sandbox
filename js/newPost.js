(function (){
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

    let tagList = [];
    let cleanTagList = [];
    let postTags = [];
    let questionTags = [];

    let responseType = "TEACHER";

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    function init() {
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();

        // Post Dropdown
        firebase.database().ref("Tags").on("child_added", (snapshot) => {
            let data = snapshot.val();
            cleanTagList.push(data);
            let id = data;

            if(data.includes(" ")){
                let temp = data.split(" ");
                id = temp[0] + "_" + temp[1];
            }

            tagList.push(id);

            let li = document.createElement("li");
            li.id = id + "li";
            // $(li).css("display", "none");
            li.classList.add("row");

            let button = document.createElement("button");
            button.textContent = data;
            button.id = id + "btn";
            button.classList.add("postTagBtn");
            button.classList.add("col");
            button.classList.add("m10");
            li.appendChild(button);

            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "close";
            deleteBtn.id = id;
            deleteBtn.classList.add("col");
            deleteBtn.classList.add("m2");
            deleteBtn.classList.add("material-icons");
            deleteBtn.classList.add("closeBtn");
            li.appendChild(deleteBtn);

            $("#postDropdown").append(li);
        });

        // Question Dropdown
        firebase.database().ref("Tags").on("child_added", (snapshot) => {
            let data = snapshot.val();
            cleanTagList.push(data);
            let id = data;

            if(data.includes(" ")){
                let temp = data.split(" ");
                id = temp[0] + "_" + temp[1];
            }

            tagList.push(id);

            let li = document.createElement("li");
            li.id = id + "liQuestion";
            // $(li).css("display", "none");
            li.classList.add("row");

            let button = document.createElement("button");
            button.textContent = data;
            button.id = id + "btnQuestion";
            button.classList.add("questionTagBtn");
            button.classList.add("col");
            button.classList.add("m10");
            li.appendChild(button);

            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "close";
            deleteBtn.id = id + "Question";
            deleteBtn.classList.add("col");
            deleteBtn.classList.add("m2");
            deleteBtn.classList.add("material-icons");
            deleteBtn.classList.add("closeBtnQuestion");
            li.appendChild(deleteBtn);

            $("#questionDropdown").append(li);
        });

        $("#post").on("click", post);
        $("#question").on("click", question);
        $("#createPost").on("click", createPost);
        $("#createQuestion").on("click", createQuestion);
        $(".logout").on("click", logout);

        $("#teacher").on("click", teacher);
        $('#student').on("click", student);
        $("#studentTeacher").on("click", studentTeacher);

        $(document.body).on("click", ".closeBtn", deletePostTag);
        $(document.body).on("click", ".closeBtnQuestion", deleteQuestionTag)
        $(document.body).on("click", ".postTagBtn", createPostTag);
        $(document.body).on("click", ".questionTagBtn", createQuestionTag);

        let postString = "";
        $("#tagInput").keyup((e) => {
            if(e.key != "Tab" && e.key != "Backspace" && e.key != "Shift" && e.key != "CapsLock" && e.key != "Meta"){
                postString = postString + e.key;
            }if(e.key === "Backspace"){
                postString = postString.slice(0, -1);
            }

            for(i in cleanTagList){
                if(cleanTagList[i].includes(postString)){
                    $("#" + tagList[i] + "li").css("display", "block");
                }else{
                    $("#" + tagList[i] + "li").css("display", "none");
                }
            }
        });

        let questionString = "";
        $("#questionTagInput").keyup((e) => {
            if(e.key != "Tab" && e.key != "Backspace" && e.key != "Shift" && e.key != "CapsLock" && e.key != "Meta"){
                questionString = questionString + e.key;
            }if(e.key === "Backspace"){
                questionString = questionString.slice(0, -1);
            }

            for(i in cleanTagList){
                if(cleanTagList[i].includes(questionString)){
                    $("#" + tagList[i] + "li").css("display", "block");
                }else{
                    $("#" + tagList[i] + "li").css("display", "none");
                }
            }
        });
    }

    function logout(){
        firebase.auth().signOut().then(() => {
            location.replace("../html/home.html");
        });
    }

    function deletePostTag(){
        let tag = $(this).attr("id");

        if(tag.includes(" ")){
            let temp = tag.split(" ");
            tag = temp[0] + "_" + temp[1];
        }
        // console.log("Delete Tag \n" + postTags);

        for(i in postTags){
            if(tag === postTags[i]){
                postTags.splice(i, 1);
                $("#" + tag + "li").css("background-color", "white");
                $("#" + tag + "btn").css("color", "black");
                $("#" + tag).css("color", "black");
            }
        }
    }

    function deleteQuestionTag(){
        let tag = $(this).attr("id");
        let newTag = tag.split("Question");
        tag = newTag[0];

        console.log(tag);

        if(tag.includes(" ")){
            let temp = tag.split(" ");
            tag = temp[0] + "_" + temp[1];
        }
        // console.log("Delete Tag \n" + postTags);

        for(i in questionTags){
            if(tag === questionTags[i]){
                questionTags.splice(i, 1);
                $("#" + tag + "liQuestion").css("background-color", "white");
                $("#" + tag + "btnQuestion").css("color", "black");
                $("#" + tag + "Question").css("color", "black");
            }
        }
    }

    function createPostTag(){
        let tag = $(this).text();
        let inList = false;

        if(tag.includes(" ")){
            let temp = tag.split(" ");
            tag = temp[0] + "_" + temp[1];
        }

        for(i in postTags){
            if(tag === postTags[i]){
                inList = true;
            }
        }

        if(inList === false){
            $("#" + tag + "li").css("background-color", "#EA5566");
            $("#" + tag + "btn").css("color", "white");
            $("#" + tag).css("color", "white");
            postTags.push(tag);
        }

        $("#tagInput").val("");
    }

    function createQuestionTag(){
        let tag = $(this).text();
        let inList = false;

        if(tag.includes(" ")){
            let temp = tag.split(" ");
            tag = temp[0] + "_" + temp[1];
        }

        for(i in questionTags){
            if(tag === questionTags[i]){
                inList = true;
            }
        }

        if(inList === false){
            $("#" + tag + "liQuestion").css("background-color", "#EA5566");
            $("#" + tag + "btnQuestion").css("color", "white");
            $("#" + tag + "Question").css("color", "white");
            questionTags.push(tag);
        }

        console.log(questionTags);

        $("#questionTagInput").val("");
    }

    function createPost(){
        let title = $("#postTitle").val();
        let description = $("#postDescription").val();

        if(title.length === 0){
            $("#postTitle").css("border-bottom-color", "red");
            createPost();
        }

        if(description.length === 0){
            $("#postDescription").css("border-bottom-color", "red");
            createPost();
        }

        if(postTags.length === 0){
            $("#tagInput").css("border-bottom-color", "red");
            createPost();
        }

        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                let uid = user.uid;
                firebase.database().ref("Users").on("child_added", (snapshot) => {
                    for(i in snapshot.val()){
                        let type = snapshot.key;
                        if(uid === i){
                            console.log(uid);
                            firebase.database().ref("Users/" + type + "/" + uid + "/Info").on("value", (snapshot) => {
                                let data = snapshot.val();
                                let key = firebase.database().ref("Posts/").push().getKey();
                                firebase.database().ref("Posts/" + key).set({
                                    Title:title,
                                    Description:description,
                                    AuthorFName:data.FirstName,
                                    AuthorLName:data.LastName,
                                    AuthorUID:uid,
                                    Tags:postTags,
                                    Views:0,
                                    CreationDate:today,
                                    Type:"POST",
                                    Responses:null
                                }).then(() => {
                                    firebase.database().ref("Users/" + type + "/" + uid + "/Posts").child("PostKeyArray").transaction((PostKeyArray) => {
                                        PostKeyArray.push(key);
                                        return PostKeyArray;
                                    })
                                    //     firebase.database().ref("Users/" + type + "/" + uid + "/Posts").set([key]).then(() => {
                                    location.replace("../html/post.html?uid=" + key);
                                    // });
                                })
                            })
                        }
                    }
                })
            }
        })
    }

    function createQuestion(){
        let title = $("#questionTitle").val();
        let description = $("#questionDescription").val();

        if(title.length === 0){
            $("#questionTitle").css("border-bottom-color", "red");
            createQuestion();
        }

        if(description.length === 0){
            $("#questionDescription").css("border-bottom-color", "red");
            createQuestion();
        }

        if(questionTags.length === 0){
            $("#questionTagInput").css("border-bottom-color", "red");
            createQuestion();
        }

        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                let uid = user.uid;
                firebase.database().ref("Users").on("child_added", (snapshot) => {
                    for(i in snapshot.val()){
                        let type = snapshot.key;
                        if(uid === i){
                            console.log(uid);
                            firebase.database().ref("Users/" + type + "/" + uid + "/Info").on("value", (snapshot) => {
                                let data = snapshot.val();
                                let key = firebase.database().ref("Questions/").push().getKey();
                                firebase.database().ref("Questions/" + key).set({
                                    Title:title,
                                    Description:description,
                                    AuthorFName:data.FirstName,
                                    AuthorLName:data.LastName,
                                    AuthorUID:uid,
                                    Tags:questionTags,
                                    ResponseType:responseType,
                                    Views:0,
                                    CreationDate:today,
                                    Type:"QUESTION",
                                    Responses:null
                                }).then(() => {
                                    firebase.database().ref("Users/" + type + "/" + uid + "/Questions").child("QuestionKeyArray").transaction((arr) => {
                                        arr.push(key);
                                        return arr;
                                    }).then(() => {
                                        location.replace("../html/question.html?uid=" + key);
                                    })
                                })
                            })
                        }
                    }
                })
            }
        })
    }

    function post(){
        $(".post").css("display", "block");
        $(".question").css("display", "none");

        $("#post").css("background-color", "#EA5566");
        $("#post").css("color", "white");
        $("#post").css("transition-duration", ".5s");
        $("#post").css("box-shadow", "1px 10px 5px #8f8f8f");

        $("#question").css("background-color", "white");
        $("#question").css("color", "black");
        $("#question").css("transition-duration", ".5s");
        $("#question").css("box-shadow", "1px 2px 5px #8f8f8f");
    }

    function question(){
        $(".post").css("display", "none");
        $(".question").css("display", "block");

        $("#question").css("background-color", "#EA5566");
        $("#question").css("color", "white");
        $("#question").css("transition-duration", ".5s");
        $("#question").css("box-shadow", "1px 10px 5px #8f8f8f");

        $("#post").css("background-color", "white");
        $("#post").css("color", "black");
        $("#post").css("transition-duration", ".5s");
        $("#post").css("box-shadow", "1px 2px 5px #8f8f8f");
    }

    function teacher(){
        $("#teacher").css("background-color", "#EA5566");
        $("#teacher").css("color", "white");
        $("#teacher").css("transition-duration", ".5s");

        $("#student").css("background-color", "white");
        $("#student").css("color", "black");
        $("#student").css("transition-duration", ".5s");

        $("#studentTeacher").css("background-color", "white");
        $("#studentTeacher").css("color", "black");
        $("#studentTeacher").css("transition-duration", ".5s");

        responseType = "TEACHER";
    }

    function student(){
        $("#student").css("background-color", "#EA5566");
        $("#student").css("color", "white");
        $("#student").css("transition-duration", ".5s");

        $("#teacher").css("background-color", "white");
        $("#teacher").css("color", "black");
        $("#teacher").css("transition-duration", ".5s");

        $("#studentTeacher").css("background-color", "white");
        $("#studentTeacher").css("color", "black");
        $("#studentTeacher").css("transition-duration", ".5s");

        responseType = "STUDENT";
    }

    function studentTeacher(){
        $("#studentTeacher").css("background-color", "#EA5566");
        $("#studentTeacher").css("color", "white");
        $("#studentTeacher").css("transition-duration", ".5s");

        $("#student").css("background-color", "white");
        $("#student").css("color", "black");
        $("#student").css("transition-duration", ".5s");

        $("#teacher").css("background-color", "white");
        $("#teacher").css("color", "black");
        $("#teacher").css("transition-duration", ".5s");

        responseType = "STUDENT_TEACHER";
    }
})();