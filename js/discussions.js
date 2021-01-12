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
            div.classList.add("m12")
            div.classList.add("postDiv")
            div.classList.add(key + "div");
            div.id = key;

            let title = document.createElement("a");
            title.textContent = data.Title;
            title.href = "../html/post.html?uid=" + key;
            title.classList.add("col");
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
            let truncated = data.Description.split(" ").splice(0, 60).join(" ");
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

            for(i in data.Tags){
                let tagDiv = document.createElement("div");
                tagDiv.classList.add("col");
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

            $(".discussions").append(div);
        });

        $(document.body).on("click", ".tag", tag);
        $("#logout").on("click", logout);
    }

    function tag(){
        let tag = $(this).text();

        // if(data.Tags[i].includes("_")){
        //     let temp = data.Tags[i].split("_");
        //     data.Tags[i] = temp[0] + " " + temp[1];
        // }

        firebase.database().ref("Posts").on("child_added", (snapshot) => {
            let data = snapshot.val();
            let key = snapshot.key;

            if(!tagFilterList.includes(tag)){
                tagFilterList.push(tag);

                // console.log("Add: " + tagFilterList);
                for(i in data.Tags){
                    if(data.Tags[i].includes("_")){
                        let temp = data.Tags[i].split("_");
                        data.Tags[i] = temp[0] + " " + temp[1];
                    }

                    console.log(tag + " " + data.Tags[i]);
                    if(tag === data.Tags[i]){
                        $(this).css("color", "white");
                        $(this).css("background-color", "#EA5566");
                    }
                }

            }else{
                tagFilterList.splice(tagFilterList.indexOf(tag), 1);
                // console.log("Remove: " + tagFilterList);
                for(i in data.Tags){
                    if(data.Tags[i].includes("_")){
                        let temp = data.Tags[i].split("_");
                        data.Tags[i] = temp[0] + " " + temp[1];
                    }

                    if(tag === data.Tags[i]){
                        $(this).css("color", "black");
                        $(this).css("background-color", "white");
                    }
                }
            }

            // console.log(tagFilterList);
            // console.log("---------------------")
        });
    }

    function logout(){
        firebase.auth().signOut().then(() => {
            location.replace("../html/home.html");
        });
    }
})();