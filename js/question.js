(function(){
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

        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                uid = user.uid;
            }
        })

        let temp = url.split("uid=");
        url = temp[1];
        console.log(temp);
        console.log(url);

        firebase.database().ref("Questions/" + url).on("value", (snapshot) => {
            let data = snapshot.val();
            console.log(data);
            
            $("#postTitle").text(data.Title);
            $("#author").text(data.AuthorFName + " " + data.AuthorLName);
            $("#description").text(data.Description);

            $("#datePosted").text("Date Posted: " + data.CreationDate);
            $("#views").text("Views: " + data.Views);

            if(data.Comments === undefined){
                $("#noComments").css("display", "block");
            }else{
                $("#noComments").css("display", "none");
                $(".comments").css("height", "700px");
                for(i in data.Comments){              
                    let div = document.createElement("div");
                    div.classList.add("col");
                    div.classList.add("m12");
                    div.classList.add("commentBox");

                    let name = document.createElement("p");
                    name.textContent = data.Comments[i].CommenterFirstName + " " + data.Comments[i].CommenterLastName;
                    name.classList.add("col");
                    name.classList.add("m12");
                    name.classList.add("name");
                    div.appendChild(name);

                    let comment = document.createElement("p");
                    comment.textContent = data.Comments[i].Comment;
                    comment.classList.add("col");
                    comment.classList.add("m12");
                    comment.classList.add("comment");
                    div.appendChild(comment);

                    // ===============================================

                    let upvoteBtn = document.createElement("button");
                    upvoteBtn.id = i + "upvote";
                    upvoteBtn.classList.add("col");
                    upvoteBtn.classList.add("m2");
                    upvoteBtn.classList.add("upvoteBtn");
                    div.appendChild(upvoteBtn);

                    let icon = document.createElement("i");
                    icon.id = i + "icon";
                    icon.textContent = "arrow_drop_up";
                    icon.classList.add("material-icons");
                    icon.classList.add("medium");
                    icon.classList.add("left-align")
                    upvoteBtn.appendChild(icon);

                    // holds the uid of the current comment that variable I holds so that the uid can be accessed in the below call to firebase
                    let temp = i;

                    firebase.database().ref("Users/Teachers/" + uid + "/Questions/CommentUpvotes").on("child_added", (snapshot) => {
                        let data = snapshot.val();
                        if(data.CommentUID === temp){
                            upvoteBtn.disabled = true;
                            $(icon).css("color", "#EA5566");
                        }
                    })

                    let upvotes = document.createElement("span");
                    upvotes.id = i + "span";
                    upvotes.textContent = data.Comments[i].Upvotes;
                    upvotes.classList.add("upvotes");
                    upvoteBtn.appendChild(upvotes);

                    // ==============================================

                    let replyBtn = document.createElement("button");
                    replyBtn.id = i + "reply";
                    replyBtn.classList.add("col");
                    replyBtn.classList.add("m1");
                    replyBtn.classList.add("replyBtn");
                    div.appendChild(replyBtn);

                    let replyIcon = document.createElement("i");
                    replyIcon.textContent = "chat_bubble_outline";
                    replyIcon.classList.add("material-icons");
                    replyIcon.classList.add("small");
                    replyIcon.classList.add("left-align")
                    replyBtn.appendChild(replyIcon);

                    // =====================================================

                    let responseDivContainer = document.createElement("div");
                    responseDivContainer.id = i + "responseDivContainer";
                    responseDivContainer.classList.add("col");
                    responseDivContainer.classList.add("m12");
                    responseDivContainer.classList.add("responseDivContainer");
                    div.appendChild(responseDivContainer);

                    if(data.Comments[i].Responses != undefined){
                        console.log("working");
                        for(x in data.Comments[i].Responses){
                            let responseDiv = document.createElement("div");
                            responseDiv.id = i + "responseDiv";
                            responseDiv.classList.add("col");
                            responseDiv.classList.add("m12");
                            responseDiv.classList.add("responseDiv");

                            let responseName = document.createElement("p");
                            responseName.textContent = data.Comments[i].Responses[x].ResponderFirstName + " " + data.Comments[i].Responses[x].ResponderLastName;
                            responseName.classList.add("col");
                            responseName.classList.add("m12");
                            responseName.classList.add("responseName");
                            responseDiv.appendChild(responseName);

                            let response = document.createElement("p");
                            response.textContent = data.Comments[i].Responses[x].ResponderComment;
                            response.classList.add("col");
                            response.classList.add("m12");
                            response.classList.add("response");
                            responseDiv.appendChild(response);

                            responseDivContainer.appendChild(responseDiv);
                        }
                    }

                    // ======================================================

                    let replyInput = document.createElement("input");
                    replyInput.id = i + "replyInput";
                    $(replyInput).attr("placeholder", "Reply Here:");
                    replyInput.classList.add("col");
                    replyInput.classList.add("m12");
                    replyInput.classList.add("replyInput");
                    div.appendChild(replyInput);

                    $(".comments").append(div);
                }
            }

            for(i in data.Tags){
                let tag = document.createElement("div");
                tag.classList.add("col");
                tag.classList.add("m6");
                // tag.classList.add("offset-m1")
                tag.classList.add("center-align");
                tag.classList.add("tag");

                let p = document.createElement("p");

                if(data.Tags[i].includes("_")){
                    let temp = data.Tags[i].split("_");
                    data.Tags[i] = temp[0] + " " + temp[1];
                }
                p.textContent = data.Tags[i];
                tag.appendChild(p);

                $(".tags").append(tag);
            }

            for(i = 0; i < data.NumberOfFiles; i++){
                let a = document.createElement("a");
                firebase.storage().ref("Users/" + uid + "/Questions/" + url + "/file" + i).getDownloadURL().then((url) => {a.href = url;})

                a.target = "_blank";
                a.classList.add("col");
                a.classList.add("s6");
                a.classList.add("m3");
                a.classList.add("fileLink");

                // let icon = document.createElement("i");
                // icon.classList.add("material-icons");
                // icon.classList.add("small")
                // icon.classList.add("fileIcon");
                // icon.textContent = "description";
                // a.prepend(icon);

                let span = document.createElement("span");
                span.textContent = "File " + (i + 1);
                a.append(span);


                $(".files").append(a);
            }
        });

        $(document.body).on("click", ".upvoteBtn", upvote);
        $(document.body).on("click", ".replyBtn", reply);
        $("#makeComment").on("click", makeComment);
        $(".logout").on("click", logout);
    }

    function reply(){
        let id = $(this).attr("id");
        let temp = id.split("reply");
        id = temp[0];

        $("#" + id + "replyInput").css("display", "block");
        $("#" + id +"responseDivContainer").css("display", "block");
        $("#" + id + "replyInput").keyup((e) => {
            if(e.keyCode === 13){
                let comment = $("#" + id + "replyInput").val();
                $(".comments").empty();
                $(".tags").empty();
                firebase.database().ref("Users/Teachers/" + uid + "/Info").on("value", (snapshot) => {
                    let data = snapshot.val();
                    firebase.database().ref("Questions/" + url + "/Comments/" + id + "/Responses").push({
                        ResponderUID:uid,
                        ResponderComment:comment,
                        ResponderFirstName:data.FirstName,
                        ResponderLastName:data.LastName
                    }).then(() => {
                        $("#" + id + "replyInput").val(" ");
                        $("#" + id + "replyInput").css("display", "none");
                    })
                });
            }
        })
    }

    function upvote(){
        let id = $(this).attr("id");
        let temp = id.split("upvote");
        id = temp[0];

        $("#" + id + "icon").css("color", "#EA5566");
        this.disabled = true;

        firebase.database().ref("Questions/" + url + "/Comments/" + id).child("Upvotes").transaction((Upvotes) => {
            Upvotes = Upvotes + 1;
            $("#" + id + "span").text(Upvotes);
            $(".comments").empty();
            $(".tags").empty();
            return Upvotes;
        }).then(() => {
            firebase.database().ref("Users/Teachers/" + uid + "/Questions/CommentUpvotes").push({
                CommentUID:id
            })
        })
    }

    function makeComment(){
        let comment = $("#comment").val();
        $(".comments").empty();
        $(".tags").empty();
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                uid = user.uid;
                firebase.database().ref("Users/Teachers/" + uid + "/Info").on("value", (snapshot) => {
                    let data = snapshot.val();
                    let key = firebase.database().ref("Questions/" + url + "/Comments").push().getKey();
                    firebase.database().ref("Questions/" + url + "/Comments/" + key).set({
                        Comment:comment,
                        CommenterFirstName:data.FirstName,
                        CommenterLastName:data.LastName,
                        CommenterUID:uid,
                        Upvotes:0
                    }).then(() => {
                        $("#comment").val(" ");
                        firebase.database().ref("Users/Teachers/" + uid + "/QuestinoComments").push({
                            CommentUID:key,
                        })
                    });
                });
            }
        });
    }

    function logout(){
        firebase.auth().signOut().then(() => {
            location.replace("../html/home.html");
        });
    }
})();