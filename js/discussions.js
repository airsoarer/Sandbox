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

    let tagFilterList = [];

    function init(){
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();

        firebase.database().ref("Tags").on("child_added", (snapshot) => {
            let data = snapshot.val();
            
            let tagBtn = document.createElement("button");
            tagBtn.classList.add("col");
            tagBtn.classList.add("m2");
            tagBtn.classList.add("tag");
            tagBtn.textContent = data;

            $(".tags").append(tagBtn);
        })

        firebase.database().ref("Posts").on("child_added", (snapshot) => {
            let data = snapshot.val();
            let key = snapshot.key;

            let div = document.createElement("div");
            div.classList.add("col");
            div.classList.add("s12");
            div.classList.add("m12");
            div.classList.add("postDiv");
            div.classList.add(key + "div");
            div.id = key;

            let title = document.createElement("button");
            title.id = key;
            title.textContent = data.Title;
            // title.href = "../html/post.html?uid=" + key;
            title.classList.add("col");
            title.classList.add("s12");
            title.classList.add("m12");
            title.classList.add("postTitle");
            div.appendChild(title);

            let author = document.createElement("h6");
            author.textContent = data.AuthorFName + " " + data.AuthorLName + " | Date Posted: " + data.CreationDate + " | Views: " + data.Views;
            author.classList.add("col");
            author.classList.add("m12")
            author.classList.add("author");
            div.appendChild(author);

            let description = document.createElement("p");
            let width = $(window).width();
            let truncated = ""
            if(width < 601){
                truncated = data.Description.split(" ").splice(0, 30).join(" ");
            }else{
                truncated = data.Description.split(" ").splice(0, 60).join(" ");
            }
            if(truncated != data.Description){
                truncated = truncated + "..."
            }
            description.textContent = truncated;
            description.classList.add("col");
            description.classList.add("s12");
            description.classList.add("m12");
            description.classList.add("description");
            div.appendChild(description);

            let tagContainer = document.createElement("div");
            tagContainer.classList.add("tagContainer");
            tagContainer.classList.add("col");
            tagContainer.classList.add("s12");
            tagContainer.classList.add("m12");
            div.appendChild(tagContainer);

            for(i in data.Tags){
                let tagDiv = document.createElement("div");
                tagDiv.classList.add("col");
                tagDiv.classList.add("s12");
                tagDiv.classList.add("m2");
                tagDiv.classList.add("tagDiv");
                tagContainer.appendChild(tagDiv);
                
                let p = document.createElement("p");
                let tag;
                if(data.Tags[i].includes("_")){
                    let temp = data.Tags[i].split("_");

                    tag = temp[0] + " " + temp[1];
                    p.textContent = tag;
                }else{
                    p.textContent = data.Tags[i];
                }
                tagDiv.appendChild(p);
            }

            $(".posts").prepend(div);
        });

        firebase.database().ref("Questions").on("child_added", (snapshot) => {
            let data = snapshot.val();
            let key = snapshot.key;

            let div = document.createElement("div");
            div.classList.add("col");
            div.classList.add("s12");
            div.classList.add("m12")
            div.classList.add("postDiv")
            div.classList.add(key + "div");
            $(div).css("border-left-color", "#6B474B");
            div.id = key;

            let title = document.createElement("button");
            title.id = key;
            title.textContent = data.Title;
            // title.href = "../html/question.html?uid=" + key;
            title.classList.add("col");
            title.classList.add("s12");
            title.classList.add("m12");
            // title.classList.add("postTitle");
            title.classList.add("questionTitle");
            div.appendChild(title);

            let author = document.createElement("h6");
            author.textContent = data.AuthorFName + " " + data.AuthorLName + " | Date Posted: " + data.CreationDate + " | Views: " + data.Views;
            author.classList.add("col");
            author.classList.add("s12");
            author.classList.add("m12")
            author.classList.add("author");
            div.appendChild(author);

            let description = document.createElement("p");
            let width = $(window).width();
            let truncated = ""
            if(width < 601){
                truncated = data.Description.split(" ").splice(0, 30).join(" ");
            }else{
                truncated = data.Description.split(" ").splice(0, 60).join(" ");
            }
            if(truncated != data.Description){
                truncated = truncated + "..."
            }
            description.textContent = truncated;
            description.classList.add("col");
            description.classList.add("s12");
            description.classList.add("m12");
            description.classList.add("description");
            div.appendChild(description);

            let tagContainer = document.createElement("div");
            tagContainer.classList.add("tagContainer");
            tagContainer.classList.add("col");
            tagContainer.classList.add("s12");
            tagContainer.classList.add("m12");
            div.appendChild(tagContainer);

            for(i in data.Tags){
                let tagDiv = document.createElement("div");
                tagDiv.classList.add("col");
                tagDiv.classList.add("m2");
                tagDiv.classList.add("s12");
                tagDiv.classList.add("tagDiv");
                tagContainer.appendChild(tagDiv);
                
                let p = document.createElement("p");
                let tag;
                if(data.Tags[i].includes("_")){
                    let temp = data.Tags[i].split("_");

                    tag = temp[0] + " " + temp[1];
                    p.textContent = tag;
                }else{
                    p.textContent = data.Tags[i];
                }
                tagDiv.appendChild(p);
            }

            $(".questions").append(div);
        });

        $("#postSearch").on("click", post);
        $("#questionSearch").on("click", question);
        $("#search").keyup((e) => {
            if($("#search").val() === ""){
                $(".postDiv").css("display", "block");
                $(".questionDiv").css("display", "block");
            }
            if(e.keyCode === 13){
                search();
            }
        })

        $(document.body).on("click", ".postTitle", updatePostViews);
        $(document.body).on("click", ".questionTitle", updateQuestionViews);
        $(document.body).on("click", ".tag", tag);
        $(".logout").on("click", logout);
    }

    function search(){
        let input = $("#search").val();
        input = input.toLowerCase();
        let splitInput = input.split(" ");

        firebase.database().ref("Posts").on("child_added", (snapshot) => {
            let data = snapshot.val();
            let key = snapshot.key;
            let title = data.Title;
            title = title.toLowerCase();
            let titleSplit = title.split(" ");
            
            for(i in splitInput){
                for(x in titleSplit){
                    // console.log(splitInput[i], titleSplit[x]);
                    if(splitInput[i] === titleSplit[x]){
                        $("#" + key).css("display", "block");
                        break;
                    }else{
                        $("#" + key).css("display", "none");
                    }
                }
            }
        })

        firebase.database().ref("Questions").on("child_added", (snapshot) => {
            let data = snapshot.val();
            let key = snapshot.key;
            let title = data.Title;
            title = title.toLowerCase();
            let titleSplit = title.split(" ");
            
            for(i in splitInput){
                for(x in titleSplit){
                    // console.log(splitInput[i], titleSplit[x]);
                    if(splitInput[i] === titleSplit[x]){
                        $("#" + key).css("display", "block");
                        break;
                    }else{
                        $("#" + key).css("display", "none");
                    }
                }
            }
        })
    }

    function updateQuestionViews(){
        let id = $(this).attr("id");
        console.log(id);

        firebase.database().ref("Questions/" + id).child("Views").set(firebase.database.ServerValue.increment(1)).then(() => {
            location.replace("../html/question.html?uid=" + id);
        })
    }

    function updatePostViews(){
        let id = $(this).attr("id");
        console.log(id);

        firebase.database().ref("Posts/" + id).child("Views").set(firebase.database.ServerValue.increment(1)).then(() => {
            location.replace("../html/post.html?uid=" + id);
        })
    }

    function tag(){
        let tag = $(this).text();

        if(tagFilterList.includes(tag)){
            $(this).css("color", "black");
            $(this).css("background-color", "white");

            let index = tagFilterList.indexOf(tag);
            tagFilterList.splice(index, 1);

            $(".postDiv").css("display", "block");

            firebase.database().ref("Posts").on("child_added", (snapshot) => {
                let data = snapshot.val();
                let key = snapshot.key;

                let tempTagList = [];
                
                for(i in data.Tags){
                    let dataTags = data.Tags[i];
                    if(dataTags.includes("_")){
                        let temp = dataTags.split("_");
                        dataTags = temp[0] + " " + temp[1];
                    }

                    tempTagList.push(dataTags);
                }

                for(i in tagFilterList){
                    if(tempTagList.includes(tagFilterList[i])){
                        console.log(tempTagList, tagFilterList[i]);
                        $("#" + key).css("display", "block");
                    }else{
                        $("#" + key).css("display", "none");
                    }
                }
            })
        }else{
            $(this).css("color", "white");
            $(this).css("background-color", "#EA5566");
            
            firebase.database().ref("Posts").on("child_added", (snapshot) => {
                let data = snapshot.val();
                let key = snapshot.key;
                
                for(i in data.Tags){
                    let dataTags = data.Tags[i];
                    if(dataTags.includes("_")){
                        let temp = dataTags.split("_");
                        dataTags = temp[0] + " " + temp[1];
                    }
    
                    if(dataTags === tag){
                        $("#" + key).css("display", "block");
                        break;
                    }else{
                        $("#" + key).css("display", "none");
                    }
                }
            })
    
            tagFilterList.push(tag);
        }
    }

    function logout(){
        console.log("Working");
        firebase.auth().signOut().then(() => {
            location.replace("../html/home.html");
        });
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
})();