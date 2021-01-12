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

    function init(){
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();

        let temp = url.split("uid=");
        url = temp[1];

        firebase.database().ref("Posts/" + url).on("value", (snapshot) => {
            let data = snapshot.val();
            
            $("#postTitle").text(data.Title);
            $("#author").text(data.AuthorFName + " " + data.AuthorLName);
            $("#description").text(data.Description);

            $("#datePosted").text("Date Posted: " + data.CreationDate);
            $("#Views").text("Views: " + data.Views);

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

                    let upvoteBtn = document.createElement("button");
                    upvoteBtn.textContent = "Upvote It!"
                    upvoteBtn.classList.add("col");
                    upvoteBtn.classList.add("m2");
                    upvoteBtn.classList.add("upvoteBtn");
                    div.appendChild(upvoteBtn);

                    let upvotes = document.createElement("p");
                    upvotes.textContent = data.Comments[i].Upvotes;
                    upvotes.classList.add("col");
                    upvotes.classList.add("m1");
                    upvotes.classList.add("upvotes");
                    div.appendChild(upvotes);

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
        });

        $("#makeComment").on("click", makeComment);
        $("#logout").on("click", logout);
    }

    function makeComment(){
        let comment = $("#comment").val();
        $(".comments").empty();
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                let uid = user.uid;
                firebase.database().ref("Users/Teachers/" + uid + "/Info").on("value", (snapshot) => {
                    let data = snapshot.val();
                    let key = firebase.database().ref("Posts/" + url + "/Comments").push().getKey();
                    firebase.database().ref("Posts/" + url + "/Comments/" + key).set({
                        Comment:comment,
                        CommenterFirstName:data.FirstName,
                        CommenterLastName:data.LastName,
                        CommenterUID:uid,
                        Upvotes:0
                    }).then(() => {
                        $("#comment").val(" ");
                        firebase.database().ref("Users/Teachers/" + uid + "/PostComments").push({
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