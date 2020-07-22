//Global variable assignment
var CatImgTag = document.getElementById("CatImageTag");
var UpvotedCats = document.getElementById("UpvotedCats");
var DownvotedCats = document.getElementById("DownvotedCats");
var xhr = new XMLHttpRequest();
var currCatObj; 

//Resize and deplay the inputted cat picture.
function CatImager(CatApiRsp){
    var MaxWidth = 700;
    var MaxHeight = 700;
    var imagewidth = CatApiRsp[0].width;
    var imageheight = CatApiRsp[0].height;

    while ((imagewidth > MaxWidth) || (imageheight > MaxHeight)){
        imagewidth = imagewidth/2;
        imageheight = imageheight/2;
    }

    CatImgTag.width = imagewidth;
    CatImgTag.height = imageheight;
    CatImgTag.src = CatApiRsp[0].url;
}

//Fetch a random cat picture
function Catpicturexhr(){
    xhr.open('GET', "https://api.thecatapi.com/v1/images/search", true);
    xhr.send(null);
    
    xhr.onreadystatechange = processRequest;
    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                //console.log(JSON.stringify(response,null,"\t"));
                CatImager(response);
                currCatObj = response;
            } 
    }

}

//Called when user votes on cat picture, add the voted cat picture to liked or disliked div
function CatpictureVote(vote){

    var postBody= {}; 
    postBody.image_id = currCatObj[0].id;
    postBody.sub_id = "PersonalUser3";
    postBody.value = vote;
    console.log(JSON.stringify(postBody));

    var ImageDivCon = document.createElement('div');
    ImageDivCon.setAttribute("class", "cat-vote-image-container");
    var ImageTag = document.createElement('img');
    ImageTag.setAttribute("class", "catimg");
    var ImageTagSrc = currCatObj[0].url; 
    ImageTag.src = ImageTagSrc;
    ImageDivCon.appendChild(ImageTag);

    if (vote == 1){
        UpvotedCats.appendChild(ImageDivCon);
    }
    else if (vote == 0){
        DownvotedCats.appendChild(ImageDivCon);
    }

    xhr.open('POST', "https://api.thecatapi.com/v1/votes", true);
    xhr.setRequestHeader("x-api-key", "24c4ec12-a05e-4a61-88b0-fea181b2ed31");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(postBody));
    xhr.onreadystatechange = processRequest;
    CatImgTag.src = "";

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                //console.log(JSON.stringify(response,null,"\t"));
                Catpicturexhr();
            } 
    }
}

//Get the array of voted cats
function getCatpictureVote(){

    xhr.open('GET', "https://api.thecatapi.com/v1/votes?sub_id=PersonalUser3&limit=20", true);
    xhr.setRequestHeader("x-api-key", "24c4ec12-a05e-4a61-88b0-fea181b2ed31");
    xhr.send();
    xhr.onreadystatechange = processRequest;
    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                //console.log(JSON.stringify(response,null,"\t"));
                populateCatVote(response);
            } 
    }
}

//Populating the past happy and grumpy cats, iterating each object in the vote object and deplays them
function populateCatVote(CatVoteObj){
    if (CatVoteObj.length == 0){
        Catpicturexhr();
    }
    else {
    xhr.open('GET', `https://api.thecatapi.com/v1/images/${CatVoteObj[0].image_id}`, true);
    xhr.setRequestHeader("x-api-key", "24c4ec12-a05e-4a61-88b0-fea181b2ed31");
    xhr.send();
    xhr.onreadystatechange = processRequest;
    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                console.log(JSON.stringify(response,null,"\t"));

                var ImageDivCon = document.createElement('div');
                ImageDivCon.setAttribute("class", "cat-vote-image-container");
                var ImageTag = document.createElement('img');
                ImageTag.setAttribute("class", "catimg");
                ImageTag.src = response.url;
                ImageDivCon.appendChild(ImageTag);

                if (CatVoteObj[0].value == 1){
                    UpvotedCats.appendChild(ImageDivCon);
                }
                else if (CatVoteObj[0].value == 0){
                    DownvotedCats.appendChild(ImageDivCon);
                }
                CatVoteObj.shift();
                populateCatVote(CatVoteObj);
            } 
    }
    }
}


//Populate the page
getCatpictureVote();