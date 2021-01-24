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

    let uid = "";

    function init(){
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                uid = user.uid;
            }
        });

        setTimeout(() => {
            firebase.database().ref("Users/Teachers/" + uid + "/Posts/PostKeyArray").on("value", (snapshot) => {
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
                            title.classList.add("m10");
                            title.classList.add("postTitle");
                            div.appendChild(title);
    
                            // Edit Button ==================================================
    
                            // let editBtn = document.createElement("button");
                            // editBtn.id = key + "edit";
                            // editBtn.classList.add("col");
                            // editBtn.classList.add("m1");
                            // editBtn.classList.add("postEdit");
                            // div.appendChild(editBtn);
    
                            // let editIcon = document.createElement("i");
                            // editIcon.textContent = "edit";
                            // editIcon.classList.add("material-icons");
                            // editIcon.classList.add("small");
                            // editBtn.appendChild(editIcon);
    
                            // Delete Button ============================================
    
                            let deleteBtn = document.createElement("button");
                            deleteBtn.id = key + "delete";
                            // $(deleteBtn).attr("data_target", key + "deleteModal");
                            deleteBtn.classList.add("modal-trigger");
                            deleteBtn.classList.add("col");
                            deleteBtn.classList.add("m1");
                            deleteBtn.classList.add("offset-m1");
                            deleteBtn.classList.add("postDelete");
                            div.appendChild(deleteBtn);
    
                            let deleteIcon = document.createElement("i");
                            deleteIcon.textContent = "delete";
                            deleteIcon.classList.add("material-icons");
                            deleteIcon.classList.add("small");
                            deleteBtn.appendChild(deleteIcon);
    
                            // Comfirm Delete ==============================================
    
                            let confirm = document.createElement("button");
                            confirm.textContent = "Comfirm";
                            confirm.id = key + "comfirm";
                            confirm.classList.add("col");
                            confirm.classList.add("m2");
                            confirm.classList.add("comfirmBtn");
                            div.appendChild(confirm);
    
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

            firebase.database().ref("Users/Teachers/" + uid + "/Questions/QuestionKeyArray").on("value", (snapshot) => {
                let data = snapshot.val();
                console.log(data);
    
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
    
                            // Edit Button ==================================================
    
                            // let editBtn = document.createElement("button");
                            // editBtn.id = key + "edit";
                            // editBtn.classList.add("col");
                            // editBtn.classList.add("m1");
                            // editBtn.classList.add("postEdit");
                            // div.appendChild(editBtn);
    
                            // let editIcon = document.createElement("i");
                            // editIcon.textContent = "edit";
                            // editIcon.classList.add("material-icons");
                            // editIcon.classList.add("small");
                            // editBtn.appendChild(editIcon);
    
                            // Delete Button ============================================
    
                            let deleteBtn = document.createElement("button");
                            deleteBtn.id = key + "delete";
                            // $(deleteBtn).attr("data_target", key + "deleteModal");
                            deleteBtn.classList.add("modal-trigger");
                            deleteBtn.classList.add("col");
                            deleteBtn.classList.add("m1");
                            deleteBtn.classList.add("offset-m1");
                            deleteBtn.classList.add("postDelete");
                            div.appendChild(deleteBtn);
    
                            let deleteIcon = document.createElement("i");
                            deleteIcon.textContent = "delete";
                            deleteIcon.classList.add("material-icons");
                            deleteIcon.classList.add("small");
                            deleteBtn.appendChild(deleteIcon);
    
                            // Comfirm Delete ==============================================
    
                            let confirm = document.createElement("button");
                            confirm.textContent = "Comfirm";
                            confirm.id = key + "comfirm";
                            confirm.classList.add("col");
                            confirm.classList.add("m2");
                            confirm.classList.add("questionComfirmBtn");
                            div.appendChild(confirm);
    
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
        }, 1000);

        $("#postSearch").on("click", post);
        $("#questionSearch").on("click", question);
        $(document.body).on("click", ".postDelete", showComfirm);
        $(document.body).on("click", ".comfirmBtn", deletePost);
        $(document.body).on("click", ".questionComfirmBtn", deleteQuestion);
        $(".logout").on("click", logout);
        $(".sidenav").sidenav();
        $('.modal').modal();
    }

    function deleteQuestion(){
        let id = $(this).attr("id");
        let temp = id.split("comfirm");
        id = temp[0];

        firebase.database().ref("Questions/" + id).remove();
        firebase.database().ref("Users/Teachers/" + uid + "/Questions").child("QuestionKeyArray").transaction((arr) => {
            for(i in arr){
                if(arr[i] === id){
                    arr.splice(i, 1);
                    break;
                }
            }

            return arr;
        })

        $("#" + id).css("display", "none");
    }

    function deletePost(){
        let id = $(this).attr("id");
        let temp = id.split("comfirm");
        id = temp[0];

        firebase.database().ref("Posts/" + id).remove();
        firebase.database().ref("Users/Teachers/" + uid + "/Posts").child("PostKeyArray").transaction((arr) => {
            for(i in arr){
                if(arr[i] === id){
                    arr.splice(i, 1);
                    break;
                }
            }

            return arr;
        })

        $("#" + id).css("display", "none");
    }

    function showComfirm(){
        let id = $(this).attr("id");
        let temp = id.split("delete");
        id = temp[0];

        $(this).css("display", "none");
        $("#" + id + "comfirm").css("display", "block");
    }

    function logout(){
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