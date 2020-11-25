let start=document.getElementById("start");//getting the start button element

let heading=document.getElementById("heading");//getting the heading element

let main=document.getElementById("main");//getting the main element

let rulesAndInstructionsContainer=document.getElementById("rules-and-instructions-container");//getting the rules and the instructions container

let gameOver=document.getElementById("game-over");//getting the game over element

let gameWon=document.getElementById("game-won");//getting the game won element

let canvas=document.getElementById("game-canvas");//getting the game canvas element

let ctx=canvas.getContext("2d");//storing the 2D rendering context inside ctx, which is the tool we're using to paint on the canvas

let x=canvas.width/2;//getting the mid point cooridnates for the ball at the initial arrangement of the game and this will place the ball just above the paddle at the initial arrangement of the game

let y=canvas.height-12;

let dx=2;//this is the small change in the x and the y coordinates of the ball for each frame and this is responsible for making the ball move

let dy=-2;

let ballRadius=7;//this is the ball radius

let paddleHeight=5;//this is the paddle height

let paddleWidth=60;//this is the paddle width

let paddleX=(canvas.width-paddleWidth)/2;//x coordinate wrt the left edge of the paddle

let leftPressed=false;//initial value of whether the left key is pressed or not

let rightPressed=false;//initial value of whether the right key is pressed or not

let brickRowCount=4;//number of rows of bricks

let brickColCount=5;//number of columns of bricks

let brickWidth=50;//width of each brick

let brickHeight=5;//height of each brick

let brickMargin=5;//gap between adjacent bricks

let brickOffsetTop=30;//distance from the top edge for the topmost level bricks

let brickOffsetLeft=15;//distance of the 1st column bricks from the left edge of the canvas

let bricks=[];//bricks 2D array and is initially empty;

let gamesWonCount=document.getElementById("games-won-count");//getting the games won count element

let gamesWon=localStorage.getItem("gamesWon");//getting the number of games won from the local storage

let won=false;//initially assuming that the game is not won

if(gamesWon==null){//if the output from the local storage is null(no such key exists), then this is case when the user has to create an item inside the local storage for the first time as we're doing below

    gamesWon=0;
    localStorage.setItem("gamesWon", 0);

}

gamesWonCount.innerText=localStorage.getItem("gamesWon");//the games won count element's inner text will be set to the value which is obtained from the local storage

for(let c=0;c<brickColCount;c++){
    bricks[c]=[];//making a 1D array corresponding to each column for the bricks

    for(let r=0;r<brickRowCount;r++){
        bricks[c][r]={x: 0, y: 0, status: 1};//adding brickRowCount bricks to each of the brickColCount columns and each brick is an object, storing its x and y coordinate and its status(whether the brick has been breaked or not(1 for not broken and 0 for broken))
    }
}

let score=0;//current score of the player

let lives=3;//current number of lives of the player

let hitSound=document.getElementById("hit-sound");//getting the hit sound element

let breakSound=document.getElementById("break-sound");//getting the break sound element

let volume=document.getElementById("volume");//getting the volume container

let mute=document.getElementById("mute");//getting the mute element

let unmute=document.getElementById("unmute");//getting the unmute element

let countVol=0;//count of times the volume container or button has been clicked

let volumeOn=false;//whether the volume is on or not

volume.addEventListener("click", function(){//handling the event when the volume container or button is clicked

    if(countVol%2==0){//when countVol is even

        volume.style.backgroundColor="#04c704";//change the background color and the box shadow to shade of green
        volume.style.boxShadow="0 0 4px 4px lightgreen";
        mute.style.opacity="0";//making the mute icon disappear and the unmute icon appear
        unmute.style.opacity="1";

        volumeOn=true;//volume is now set to on

    }
    else{//when countVol is odd

        volume.style.backgroundColor="rgb(238, 1, 1)";//setting the background color and the box shadow to shade of red
        volume.style.boxShadow="0 0 4px 4px #ffa7a7";
        unmute.style.opacity="0";//making the unmute icon disappear and the mute icon appear
        mute.style.opacity="1";

        volumeOn=false;//volume is not set to off

    }

    countVol++;//increasing countVol

});

document.addEventListener("keydown", function(event){//hadling the event when the keydown event is taking place i.e a key is pressed down

    let keyPressed=event.key;//obtaing the key i.e. pressed

    if(keyPressed=="a" || keyPressed=="A" || keyPressed=="ArrowLeft"){//if the key which is pressed is a valid key to move in the left direction, then we set leftPressed value to true 
        leftPressed=true;
    }
    else if(keyPressed=="d" || keyPressed=="D" || keyPressed=="ArrowRight"){//if the key which is pressed is a valid key to move in the right direction, then we set rightPressed to true
        rightPressed=true;
    } 

});

document.addEventListener("keyup", function(event){//handling the event when the keyup event is taking place, i.e. a key is released

    let keyPressed=event.key;//obtaining the key i.e. pressed

    if(keyPressed=="a" | keyPressed=="A" || keyPressed=="ArrowLeft"){//if the key which is released is a valid key to move in the left direction, then we set leftPressed value to false
        leftPressed=false;
    }
    else if(keyPressed=="d" || keyPressed=="D" || keyPressed=="ArrowRight"){//if the key which is released is a valid key to move in the right direction, then we set rightPressed value to false;
        rightPressed=false;
    }

});

document.addEventListener("mousemove", function(event){//handling the event when the mouse is moved i.e. when mousemove is taking place

    let relativeX=event.clientX-canvas.offsetLeft-14;//obtaing the x coordinate of the mouse pointer relative to the canvas and we are subtracting 14 to include the margin of the body element and the border of the canvas element

    if(relativeX>0 && relativeX<canvas.width){//if the pointer is within the canvas, then we change the paddleX value, so that the mouse pointer becomes the middle point of the paddle as done below, where paddleX is the x coordinate of paddle wrt its left edge

        paddleX=(relativeX-(paddleWidth/2));//getting the paddleX value i.e. the x coordinate of the paddle wrt its left edge

        if(paddleX<0){//to make sure that the paddle does not go out of the left edge of the canvas
            paddleX=0;
        }
        else if(paddleX>(canvas.width-paddleWidth)){//to make sure that the paddle does not go out of the right edge of the canvas
            paddleX=(canvas.width-paddleWidth);
        }

    }

});

function drawBall(){//function to draw the ball

    ctx.beginPath();//starting a path
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);//drawing a circle with center at x, y, radius as ball radius, starting angle as 0 and ending angle as 2*pi i.e. 360deg
    ctx.fillStyle="darkorange";//defining the color for the circle
    ctx.fill();//filling the circle with the above color
    ctx.closePath();//closing the path

}

function drawPaddle(){//function to draw the paddle

    ctx.beginPath();//starting a path
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);//drawing a rectangle, with the top left coordinates as paddleX and canvas.height-paddleHeight, width as paddleWidth and height as paddleHeight
    ctx.fillStyle="darkblue";//defining the color for the rectangle
    ctx.fill();//filling the rectangle with the above color
    ctx.closePath();//closing the path

}

function drawBricks(){//function to draw the bricks

    for(let c=0;c<brickColCount;c++){//iterating on all the bricks
        for(let r=0;r<brickRowCount;r++){

            if(bricks[c][r].status==1){//checking the brick status, so that we draw a brick only if it has not been broken and is intact

                let brickX=brickOffsetLeft+(c*(brickWidth+brickMargin));//getting the top left corrdinates for a 
                // brick
                let brickY=brickOffsetTop+(r*(brickHeight+brickMargin));

                bricks[c][r].x=brickX;//setting the x and the y coordinates of the top left corner of a brick to the coordinates obtained above
                bricks[c][r].y=brickY;

                ctx.beginPath();//starting a path
                ctx.rect(brickX, brickY, brickWidth, brickHeight);//drawing a rectangle with top left corner at brickX, brickY, width as brickWidth and height as brickHeight
                ctx.fillStyle="darkslategrey";//defining the color for the rectangle
                ctx.fill();//filling the rectangle with the above color
                ctx.closePath();//closing the path

            }

        }
    }

}

function collisionDetection(){//function to detect collision and handle it

    for(let c=0;c<brickColCount;c++){//iterating on all the bricks
        for(let r=0;r<brickRowCount;r++){

            let b=bricks[c][r];//obtaining a particular brick and check if it is colliding or not with the ball

            if(b.status==1){//for a ball to collide with a brick, the brick must exist, so we check whether is not broken i.e. its status is 1

                if(x> b.x && x< (b.x+brickWidth) && y> b.y && y< (b.y+brickHeight)){//if the center of the ball lies inisde the brick, then the brick should be broken

                    if(volumeOn){//loading and playing the break sound if the volume is on

                        breakSound.load();
                        breakSound.play();

                    }                    

                    dy=-dy;//changing the direction of the ball, by reversing the value of the small increase in the y coordinate of the ball, so if the ball was supposed to move up, then it will move down in the next frame and vice-versa
                    b.status=0;//since the brick has been broken and should not be displayed in the next frame, so we change its status to 0
                    score++;//increasing the player's score

                    if(score==(brickRowCount*brickColCount)){//if the player has broken all the bricks, then we update the gamesWon value in the local storage
                                              
                        localStorage.setItem("gamesWon", parseInt(localStorage.getItem("gamesWon"))+1);

                        start.style.opacity="0";//setting the opacity of all the elements to 0, except the game won message, so that only it is displayed
                        heading.style.opacity="0";
                        volume.style.opacity="0";
                        main.style.opacity="0";
                        rulesAndInstructionsContainer.style.opacity="0";
                        gameWon.style.opacity="1";             
                        
                        won=true;//setting won value to true    
                        volumeOn=false;//turning off the sound                       
                       
                        setTimeout(function(){//showing the message for 2s and then reloading the URL by accessing location object of document which contains information about the URL and then calling the reload function on it
                            document.location.reload();
                        }, 2000);                        

                    }

                }

            }

        }
    }    

}

function drawScore(){//function to draw the score

    // here since we are not drawing a shape and it is simple text, so no path is required and hence no ctx.beginPath(); and ctx.closePath(); functions    
    ctx.font="10px sans-serif";//defining the font-size and the type     
    ctx.fillStyle="black";//defining the color
    ctx.fillText("Score : "+score, 8, 20);//filling the text with the given value with the above properties and at the location 8, 20, where the x value is wrt the left edge of the text and the y value is wrt the middle line passing horizontally through the text

}

function drawLives(){//function to draw the lives

    ctx.font="10px sans-serif";//defining the font-size and the type
    ctx.fillStyle="black";//defining the color
    ctx.fillText("Lives : "+lives, canvas.width-45, 20);//filling the text with the given value with the above properties at the location canvas.width-45, 20

}

function draw(){//function to paint the canvas at each frame which is requested below using requestAnimationFrame function taking this function draw, as the argument and this is the function for which the animation is requested
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);//clearing the complete canvas each time before we draw on it and we provide the top left corner coordinates of the canvas which are 0, 0 and the width and the height of the canvas too

    drawBall();//drawing the ball
    drawPaddle();//drawing the paddle
    drawBricks();//drawing the bricks
    drawScore();//drawing the score
    drawLives();//drawing the lives
    
    collisionDetection();//detecting collision and handling it
    
    if(y+dy<ballRadius || y+dy>(canvas.height-ballRadius)){//checking the case when the new y coordinate of the center of the ball(y coordinate for the next frame) i.e. y+dy is making the ball go out of the top or the bottom edge

        if(y+dy>(canvas.height-ballRadius)){//if the new y coordinate makes the ball go out of the bottom edge

            if(x>paddleX && x<(paddleX+paddleWidth)){//if the x coordinate of the center of the ball is inside the paddle then we bounce the ball from the bottom edge
             
                if(volumeOn){//loading and playing the hit sound if the volume is on

                    hitSound.load();
                    hitSound.play();

                }

            }
            else{//this is the case when the ball does not hit the paddle and goes down the bottom edge
                
                lives--;//decrease the number of lives the player has

                if(!lives){//if the lives have reduced to 0     
                    
                    if(!won){//checking if the player has not won, because this piece of code can execute even after the player has won, in the case when the player won with 1 life remaining and then the ball may not hit the paddle as we stop playing the game and we can get the game over message displayed too which should not be the case

                        start.style.opacity="0";//setting the opacity of all the elements to 0, except the game over message, so that only this message is displayed
                        heading.style.opacity="0";
                        volume.style.opacity="0";
                        main.style.opacity="0";
                        rulesAndInstructionsContainer.style.opacity="0";
                        gameOver.style.opacity="1";

                        won=false;//setting won value to false and turning off the volume
                        volumeOn=false;                    

                        setTimeout(function(){//showing the above message for 2s and then reloading the URL
                            document.location.reload();
                        }, 2000);                          

                    }                                                          

                }
                else{//if the player still has some lives then we give another chance                      

                    x=canvas.width/2;//reset the value of the coordinates for the center of the ball
                    y=canvas.height-12;
                    dx=2;//reset the small increment for the x and the y directions
                    dy=-2;
                    paddleX=(canvas.width-paddleWidth)/2;//reset the paddleX value i.e. the x coordinate wrt the left edge of the paddle, so that the paddle again appears in the middle

                }
            
            }

        }

        dy=-dy;//reversing the small y increment value, so that if the ball was moving up in the previous frame, moves down in the coming frame and vice versa              

    }
    
    if(x+dx<ballRadius || x+dx>(canvas.width-ballRadius)){//if the ball tends to go out of the left or the right edge, then we simply reverse the direction by reversing the small x increment value as done below
        dx=-dx;        
    }

    if(rightPressed){//if the right key was pressed before the start of the next frame

        paddleX+=5;//increase the paddleX value to move the paddle towards the right

        if((paddleX+paddleWidth)>canvas.width){//making sure that the paddle does not go out of the right edge
            paddleX=canvas.width-paddleWidth;
        }

    }
    else if(leftPressed){//if the left key was pressed before the start of the next frame

        paddleX-=5;//decrease the paddleX value to move the paddle towards the left

        if(paddleX<0){//making sure that the paddle does not go out of the left edge
            paddleX=0;
        }

    }    

    x+=dx;//adding the small increments to the x and the x values
    y+=dy;    

    requestAnimationFrame(draw);//telling the browser that we wish to perform an animation and now the framerate will be controlled by the browser which will sync the framerate accordingly, rendering the content only when needed which gives an efficient and smooth animation loop and we pass this draw function as the argument to the request animation frame method as this is the function which is responsible for drawing on the canvas

}

let countStr=0;//count of number of times the button new game or end game has been clicked
let gameOn=false;//we are assuming the game is initially off

start.addEventListener("click", function(){//handling the event when the start button is clicked

    if(countStr%2==0){//when countStr is even
        
        start.innerText="end game";//change the content of start to end game, change the color and the background color too and transform the text to uppercase
        start.style.color="darkslategrey";
        start.style.backgroundColor="whitesmoke"
        start.style.textTransform="uppercase";

        gameOn=true;//the game is now on

    }
    else{//when countStr is odd

        start.setAttribute("style", "");//removing any previous styles and setting the content of start to new game 
        start.innerText="new game";    

        gameOn=false;//the game is now off

    }

    if(gameOn){//if the game is on

        canvas.style.opacity="1";//show the canvas and this transition will take 1s
    
        setTimeout(function(){//wait for 1s for the above transition to complete and then we start to paint our canvas
            draw();
        }, 1000);
    
    }
    else{//if the game is off

        canvas.style.opacity="0";//hide the canvas and this transition will take 1s

        setTimeout(function(){//wait for 1s for the above transition to complete and then we reload the URL
            document.location.reload();   
        }, 1000);             

    }
    
    countStr++;//increasing countStr

});