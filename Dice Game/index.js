function roll() {
    var random1 = Math.floor(Math.random()*6) +1;

    var random_dice_image = "images/"+"dice" +random1+ ".png";
    
    var image1 = document.querySelectorAll("img")[0];
    image1.setAttribute("src", random_dice_image);

    var random2 = Math.floor(Math.random()*6) +1;

    var random_dice_image2 = "images/"+"dice" +random2+ ".png";
    var image2 = document.querySelectorAll("img")[1];
    image2.setAttribute("src", random_dice_image2);

    if(random1 > random2){
        document.querySelector("h1").innerHTML="🚩Player1 Wins";
    }
    else if(random1 < random2){
        document.querySelector("h1").innerHTML="Player2 Wins🚩";
    }
    else {
        document.querySelector("h1").innerHTML="🚩Draw🚩";
    }
}

roll();