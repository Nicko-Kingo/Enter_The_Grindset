/* "Enter the Grindset"
*  
*  A tactical, top-down horror shooter.
*  You play as Sigmund Grinder, a unassuming man against the forces of evil.
*  
*  You must rid the world of Skinwalkers, Gang members, .... , one room at a time.
*
*
*  Features 2 weapons and 2 levels, and 2 enemies. alot of 2s...
*
*
*  Comes filled with game lore and subtext, along with super fun music
*
*  Credits go to:
*  Can you feel my heart - lose and win screens
*  Silent Hill           - Lore Screen
*  Polozhenie            - Game music
*
*/

var musicG;
var musicWL;
var musicL;


//Pixel Art
var pArt = [];

//axe art
var axe = [
  "        bb                 ",
  "       bbbb                ",
  "      bbbbbb               ",
  "     bbbbbb                ",
  "    bbbbbbr                ",
  "   bbbbbbbrr               ",
  "  bbbbbbbrrrr              ",
  " bbbbbbbb rrrr             ",
  "  bbbbbb   rrrr            ",
  "   bbbb     rrrr           ",
  "    bbb      rrrr          ",
  "     bb       rrrr         ",
  "      b        rrrr        ",
  "                rrrr       ",
  "                 rrrr      ",
  "                  rrrr     ",
  "                   rrrr    ",
  "                    rrrr   ",
  "                     rrrr  ",
  "                      rrrr ",
  "                       rrr ",
  "                       rr  ",
  "                           ",
];

//Gangstalker art - pistol
var pistolier = [
  "              bb    ",
  "              bb    ",
  "             sbbs   ",
  "             sbbs   ",
  "              sss   ",
  "              ggg   ",
  "       bbbbbb ggg   ",
  "     bbggggggbbbgg  ",
  "   bbggggbbggggbbg  ",
  "  bgggggbbbbgggggb  ",
  "  bgggggbggbgggggb  ",
  " bgggggbbggbbgggggb ",
  " bggggbbggggbbggggb ",
  " bggggbggggggbggggb ",
  " bgggbbggggggbbgggb ",
  " bgggbggggggggbgggb ",
  " bgggbbggggggbbgggb ",
  "  bgggbbggggbbgggb  ",
  "  bggggbbbbbbggggb  ",
  "   bbggggggggggbb   ",
  "     bbggggggbb     ",
  "       bbbbbb       ",
  "                    ",
  "                    ",
];

//Note that the Skinwalker will be made here, but for now due to its size 
//I am using it as a .jpg, however note that I did hand make the wendigo 

//bullets array
var bullets = [];

//variables to hold imported images
var siggy;
var logo;
var digo;
var dubbs;
var ells;
var lores;

//Image to hold the map information
var light;

//Turns the axe array into 
//a pixel image
function drawAxe()
{
  rectMode(CORNER);
  for(let i = 0; i < axe.length; i++)
    {
      for(let j = 0; j < axe[i].length; j++)
        {
          switch(axe[i][j])
          {
            case 'b':
              push();
              noStroke();
              fill('#7b7d7d')
              rect(100+10*j, 100+10*i, 10, 10);
              pop();
              break;
            case 'r':
              push();
              noStroke();
              fill('#d4ac0d')
              rect(100+10*j, 100+10*i, 10, 10);
              pop();
              break;
            default:break;
          }
        }
    }
}

//Turns the pistol array into 
//a pixel image
function drawPistol()
{
  rectMode(CORNER);
  noStroke();
  for(let i = 0; i < pistolier.length; i++)
    {
      for(let j = 0; j < pistolier[i].length; j++)
        {
          switch(pistolier[i][j])
          {
            case 'b':
              fill(0)
              rect(100+10*j, 100+10*i, 10, 10);
              break;
            case 'g':
              fill('#555353')
              rect(100+10*j, 100+10*i, 10, 10);
              break;
            case 's':
              fill('#c68a57')
              rect(100+10*j, 100+10*i, 10, 10);
              break;
            default:break;
          }
        }
    }
}


//loads in custom images
function preload() {
  //Can repurpose the below image to be Mcdonalds worker
  siggy = loadImage('Sigmund_V1.png');
  logo  = loadImage('Main_Menu.png');
  digo  = loadImage('Skinwalker.png');
  dubbs = loadImage('Win.png');
  ells  = loadImage('Loss.png');
  lores = loadImage('Lore.png');

  
}


/* Variable that controls what should be displayed
*  Game States:
*  0 - Main Menu
*  1 - Instructions Menu
*  2 - Lore Menu
*  3 - Gameplay Menu (seperate variable for levels)
*  4 - Defeat Screen
*  5 - Victory Screen?
*/
var gameState = 0;
var sigmund;          //The Player

var level = 0;        //Which level you're on

var grinders = [];    //Array of player objects for animations??
var betas    = [];    //Array of Enemy objects for animations???
var canSpawn = 0;

/* Player class
*
*  basic entity class - extends to enemy classes
*  handles initializes, drawing, and eventual movement
*/
class Player
{
  constructor(x, y, angle, sprite)
  {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.light = false;
    this.angle = angle;
    this.sprite = sprite;
    this.dir = [0, 0];
    this.ammo = 8;
    this.reload = 0;
    this.weapon = 1; //Starts with gun equipped 
    this.axeSwing = 0;
    //Weapon field
    //Sprite field
    //Will likely need an angle field because I fucking course I will
  }
  
  draw()
  {
    if(gameState == 3)
      this.angle = atan2(mouseY - 200, mouseX - 200);
    else
      this.angle = atan2(mouseY - this.y, mouseX - this.x);
    push();
    translate(this.x,this.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(this.sprite,0,0,40,40);
    
    //Draw the axe
    if(this.weapon == 0)
    {
      push();
      translate(20,0);
      rotate(-PI/1.5 - 1.5*(this.axeSwing/50));
      image(pArt[0], 0 , 0, 25, 25);
      pop();
      if(this.axeSwing > 0)
        this.axeSwing-=4;
    }
    
    
    pop();
    
    
    
    if(this.reload > 0)
    {
      this.reload--;
      if(this.reload <= 0)
        this.ammo = 6;
    }
    
    
  }
  
  move()
  {
    if(keyIsDown(UP_ARROW))
    {
      this.dir[0] = 0;
      this.dir[1] = 1;
        
      //Check if we can move before moving
      //This is how I will do collisions
      if(this.collision())
        this.y -= 2;
      
    }
    if(keyIsDown(DOWN_ARROW))
    {
      this.dir[0] = 0;
      this.dir[1] = -1;
        
      if(this.collision())
        this.y += 2;
    }
    if(keyIsDown(LEFT_ARROW))
    {
      this.dir[0] = -1;
      this.dir[1] = 0;
        
      if(this.collision())
        this.x -= 2;
    }
    if(keyIsDown(RIGHT_ARROW))
    {
      this.dir[0] = 1;
      this.dir[1] = 0;
        
      if(this.collision())
        this.x += 2;
    }

  }
  
  collision()
  {
    let ret = true;
    
    if(gameState != 3)
      return true;
    
    //Rare bug, concerning y for x axis collisions
    //and x for y axis collisions
    if(this.dir[0]) //x axis collision - left or right
    {
      if(this.x + 15 >= tiles[0].length * 40 || this.x - 15 < 0)
        return false;
      
      let xbbU = int((this.y - 10)/30);
      let xbbD = int((this.y + 10)/30);
      let xCheck = int((this.x + (15*this.dir[0]))/30);
      
      if(xbbU >= tiles[0].length || xbbD >= tiles[0].length) return false;
      
      if( tiles[xbbU][xCheck] == 'w' || tiles[xbbD][xCheck] == 'w')
        ret = false;
      if( tiles[xbbU][xCheck] == 't' || tiles[xbbD][xCheck] == 't')
        ret = false;
      if( tiles[xbbU][xCheck] == 'c' || tiles[xbbD][xCheck] == 'c')
        ret = false;
      if( tiles[xbbU][xCheck] == 'j' || tiles[xbbD][xCheck] == 'j')
        ret = false;

    }
    if(this.dir[1]) //y axis collisions - up or down
    {
      
      if(this.y +10 >= tiles.length * 40 || this.y - 10 < 0)
      {  
        this.y -= 3;
        return false;
       
      }
      let ybbU = int((this.x - 10)/30);
      let ybbD = int((this.x + 10)/30);
      let yCheck = int((this.y + (15*-this.dir[1]))/30);
      
      if(yCheck >= tiles.length) return false;
      

      if( tiles[yCheck][ybbU] == 'w' || tiles[yCheck][ybbD] == 'w')
        ret = false;
      if( tiles[yCheck][ybbU] == 't' || tiles[yCheck][ybbD] == 't')
        ret = false;
      if( tiles[yCheck][ybbU] == 'c' || tiles[yCheck][ybbD] == 'c')
        ret = false;
      if( tiles[yCheck][ybbU] == 'j' || tiles[yCheck][ybbD] == 'j')
        ret = false;
    }
    
    return ret
  }
  
  shoot()
  {
    let x =  cos(this.angle);
    let y =  sin(this.angle);
    let dest = createVector(x,y);
    
    bullets.push(new Bullet(this.x,this.y,dest.x,dest.y, this));
    gunShot(this.x,this.y,this.angle)
  }
  
  swing()
  {
    this.axeSwing = 50;
    
    print(this.angle);
    
    
    for(let e in enems)
    {
      if(dist(enems[e].x,enems[e].y,this.x,this.y) > 60)
        continue;
      
      let Eangle = Math.atan2(enems[e].y - 200, enems[e].x - 200) - this.angle;
      print(Eangle);
      
      if(abs(Eangle) <= 1.5 || abs(Eangle-PI) <= 1.5 || abs(Eangle+PI) <= 1.5)
      {
        enems[e].health -= int(random(40,80));
      }
    }
  }
  
}

//Bullet class - handles spawning, drawing, and collisions for bullets
class Bullet
{
  constructor(x,y, xdir,ydir, owner)
  {
    this.x = x;
    this.y = y;
    this.xdir = xdir;
    this.ydir = ydir;
    this.owner = owner;
    this.speed = 0;
    
    if(this.owner == sigmund)
      this.speed = 12;
    else
      this.speed = 8;
    
  }
  
  draw()
  {
    push();
    fill(0);
    circle(this.x,this.y,5);
    pop();
    

    this.x += this.speed * this.xdir;
    this.y += this.speed * this.ydir;
  
    this.collision();
  }
  
  collision()
  {
    if(this.owner == sigmund)
    {
      for(let e in enems)
      {
        if(dist(this.x,this.y,enems[e].x,enems[e].y) < 10)
        {
          enems[e].health -= int(random(10,30));
          return true;
        }
      }
    }
    else
    {
      if(dist(this.x,this.y,sigmund.x,sigmund.y) < 8)
      {
        sigmund.health -= int(random(1,5));
        return false;
      }
    }
    
    let xCheck = int((this.x)/30);
    let yCheck = int((this.y)/30);
      
    if(yCheck >= tiles.length || yCheck < 0)
    {

      return true;
    }
      
    if(tiles[yCheck][xCheck] == 'w')
    {  
      
      return true;
    }
    
    return false;
  }
  
  
}

//Extended player class
//Handles animation for menu purposes
//Also attacks and tracks the player
class Enemy extends Player
{
  constructor(x,y, angle, sprite)
  {
    super(x,y, angle, sprite);
    this.state = [new chaseState()]
    this.currst = 0;
    this.ai = true;
    this.dir = [0,0];
    this.attackTimer = 0;
    this.speed       = 0;
    
    this.anim        = 0;
    
    if(this.sprite == pArt[2]) //skinwalker speed
      this.speed = 4;
    else
      this.speed = 2;
    
    //Different health for enemies?
  }
  
  draw()
  {
    push();
    translate(this.x,this.y);
    
    imageMode(CENTER);
    
    if(this.sprite == pArt[2] || gameState != 3)
    {
      rotate(this.angle - PI/2);
      image(this.sprite,0,0,40,40);
    }
    else if(this.sprite == pArt[1] && gameState == 3)
    {
      push();
      rotate(this.angle + PI/2);
      image(this.sprite,0,0,40,40);
      pop();
    }
   
    pop();
    let temp 
    
    if(this.ai)
      temp = dist(this.x,this.y,sigmund.x,sigmund.y)
    
    if(this.ai && temp < 150 && temp > 15)
      this.state[this.currst].execute(this);
  }
  
  move()
  {
    this.dir[0] = cos(this.angle) > 0 ? 1 :-1;
    this.dir[1] = sin(this.angle) > 0 ? -1 : 1;
    
    //if statement for sprites that aren't skinwalker
    //If distance is less than 100, stop and shoot?
    
    if(this.sprite == pArt[1] &&
       dist(this.x,this.y,sigmund.x,sigmund.y) < 80)
    {
      
      
      if(this.attackTimer <= 0)
      {  
        this.shoot();
        this.anim = 3;
        this.attackTimer = 30;
      }
      this.attackTimer--;
      return;
    }
    
    
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
    
    this.collision();
    
    //Attack for the SkinWalker
    if(this.sprite == pArt[2] && dist(this.x,this.y,sigmund.x,sigmund.y) < 30)
      this.attack();
    
  }
  
  //Attack function, does a random amount of damage from 1-10
  attack()
  {
    if(this.attackTimer <= 0)
    {
      sigmund.health -= int(random(10,15));
      this.attackTimer = 30;
    }
    else
      this.attackTimer--;
  }
  
  collision()
  {
    if(this.dir[0]) //x axis collision - left or right
    {
      if(this.x + 30 >= tiles[0].length * 40 || this.x - 30 < 0)
      {
        this.health -= 5;
        this.x -= this.speed * this.dir[0];
      }
      
      let xbbU = int((this.y - 10)/30);
      let xbbD = int((this.y + 10)/30);
      let xCheck = int((this.x + (15*this.dir[0]))/30);
      
      if(xCheck >= tiles[0].length || xbbU >= tiles[0].length || xbbD >= tiles.length || xbbU < 0) 
      {
        this.health -= 5;
        this.x -= this.speed * this.dir[0];
        return; 
      }
      
      if(xbbD >= tiles.length)
        console.log(xbbD)
      
      if( tiles[xbbU][xCheck] == 'w' || tiles[xbbD][xCheck] == 'w')
        this.x -= this.speed * this.dir[0];
      if( tiles[xbbU][xCheck] == 't' || tiles[xbbD][xCheck] == 't')
        this.x -= this.speed * this.dir[0];
      if( tiles[xbbU][xCheck] == 'c' || tiles[xbbD][xCheck] == 'c')
        this.x -= this.speed * this.dir[0];
      if( tiles[xbbU][xCheck] == 'j' || tiles[xbbD][xCheck] == 'j')
        this.x -= this.speed * this.dir[0];

    }
    if(this.dir[1]) //y axis collisions - up or down
    {
      
      if(this.y + 10 >= tiles.length * 40 || this.y - 10 < 0)
      {  
        this.health-=5;
        this.y += this.speed * this.dir[1];
        return;
       
      }
      let ybbU = int((this.x - 10)/30);
      let ybbD = int((this.x + 10)/30);
      let yCheck = int((this.y + (15*-this.dir[1]))/30);
      
      if(yCheck >= tiles.length) 
      {
        this.y += this.speed * this.dir[1];
        this.health-=50;
        return;
      }
      
      
      if( tiles[yCheck][ybbU] == 'w' || tiles[yCheck][ybbD] == 'w')
        this.y += this.speed * this.dir[1];
      if( tiles[yCheck][ybbU] == 't' || tiles[yCheck][ybbD] == 't')
        this.y += this.speed * this.dir[1];
      if( tiles[yCheck][ybbU] == 'c' || tiles[yCheck][ybbD] == 'c')
        this.y += this.speed * this.dir[1];
      if( tiles[yCheck][ybbU] == 'j' || tiles[yCheck][ybbD] == 'j')
        this.y += this.speed * this.dir[1];
    }
    
  }
  
  
  //enemy specific function for animating
  //them on the start screen
  animate(direction)
  {
    this.ai = false;
    if(direction == 1)
    {
      this.x--;
    }
    else if(direction == 2)
    {
      this.y--;
    }
    else if(direction == 3)
    {
      this.x++;
    }
  }
}

//Chase state for the enemies, turns towards the player and chases them
//Will eventually implement A* searching to bypass obstacles
class chaseState
{
  constructor()
  {
    this.dx = 0;
    this.dy = 0;
    this.arc = 0;
  }
  
  //Unfortunately, could not implement A* in time, so they just turn to face you and rush you
  execute(me)
  {
    
    this.dx = sigmund.x - me.x;
    this.dy = sigmund.y - me.y;
    
    this.arc = Math.atan2(this.dy,this.dx);
   
    me.angle = this.arc
    
 
    me.move();
    
  }
}

//Special array for attacking enemies in main menu title screen
let betaL = [];
let betaR = [];

//Animation variables, timers and angle offsets
let shootTimer = 100;
let mainAnim = 0;
let axeTimer = 25;
let axeState = false;
let sigL;
let sigR;

//Main Menu function, shows a glimpse on the amazingness that is this game
function mainMenu()
{
  let title = "Enter \t\t\t\t\t\t\t  The \n\n\t\t\t\t  Grindset";
  let credit = "A Nick King Experience";
  
  //Maybe draw a line or something to seperate bottom animation
  //From top animation??
  
  push();
  translate(100,168);
  rotate(PI);
  image(pArt[3],0, 0, 80,80);
  pop();
  
  
  ///////////////////////////////////Axe drawings, they animate
  push();
  translate(70,170)

  rotate(PI/2.8 + (axeTimer/50));
  image(pArt[0],0, 0,40,30);
  
  pop();
  
  push();
  translate(300,175);
  //rotate(PI/2);
  image(pArt[3],0, 0, 80,80);
  
  pop();
  
  push();
  translate(328,175)
  scale(-1,1)
  rotate(PI/2.8 + (axeTimer/50));
  image(pArt[0],0, 0,40,30);
  
  pop();
  //////////////////////////////////////

  if(!axeState)
  {
    axeTimer-=3;
    if(axeTimer <= -25)
      axeState = !axeState;
  }
  else if(axeState)
  {
    axeTimer+=3;
    if(axeTimer >= 25)
      axeState = !axeState;
  }
  
  push();
  translate(60,370);

  image(pArt[3],0, 0, 80,80);
  pop();
  
  light = createImage(400,400)
  
  //Spawn enemies if there are few enemies to be spawn
  //For left and right upper sides
  if(betaL.length < 1  )
  {
    let sp   = int(random(1,3));
    let rot  = 0;
    if (sp == 2)
      rot = PI;
    betaR.push(new Enemy(400, 175, rot, pArt[sp])); //Draws gangstalkers
    betaL.push(new Enemy(-10, 170, rot + PI, pArt[sp])); //Draws gangstalkers
  }
 
  
  //Work with this to determine 3 spawn zones for animation.
  if(betas.length < 5 && canSpawn <= 0)
  {
    let rany = int(random(350,380));
    let sp   = int(random(1,3));
    let rot  = 0;
    if (sp == 2)
      rot = PI;
    betas.push(new Enemy(400, rany, rot, pArt[sp])); //Draws gangstalkers
    canSpawn = int(random(30,200));
  }
  canSpawn--;
  
  //Draw the randomly spawned enemies to be killed for flavor
  for(let b in betas)
  {
    betas[b].animate(1);
    betas[b].draw();
    if(betas[b].x < 120)
    {
      betas.splice(b,1);
    }
  }
  
  betaL[0].animate(3)
  betaL[0].draw()
  if(betaL[0].x > 45)
    betaL.splice(0,1)
  
  betaR[0].animate(1)
  betaR[0].draw()
  if(betaR[0].x < 345)
    betaR.splice(0,1)
  
  //Put pixelated image here
  imageMode(CENTER);
  image(logo,200,75,100,125);
  
  textSize(30);
  text(title, 60, 100);
  
  textSize(18);
  text(credit, 110,205);
  
  push();
  rectMode(CENTER);
  noFill();
  
  rect(200,230,100,20); //Play Button
  rect(200,270,100,20); //Instructions Button
  rect(200,310,100,20); //Lore Button
  
  
  
  
  pop();
  
  sigL = new Player(75,275,0,pArt[3]);
  sigR = new Player(325,275,0,pArt[3]);
  

  
  sigL.draw(); //SMall left facing sigmund
  sigR.draw(); //Small right facing sigmund
  
  
  textSize(17);
  text("Grind Time", 156, 236)
  text("Instructions", 156, 276);
  text("Game Lore", 156, 316);
  
  //If statement for play button
  if(mouseX >= 150 && mouseX <= 250 
         && mouseY >= 220 && mouseY <= 240)
  {
    push();
    noFill();
    rectMode(CENTER);
    strokeWeight(3);
    rect(200,230,100,20);
    pop();
       
    if(mouseIsPressed) gameState = 3;
  }
  else if(mouseX >= 150 && mouseX <= 250 
         && mouseY >= 260 && mouseY <= 280)//Instructions Button
  {
    push();
    noFill();
    rectMode(CENTER);
    strokeWeight(3);
    rect(200,270,100,20);
    pop();
       
    if(mouseIsPressed) gameState = 1;
  }
  else if(mouseX >= 150 && mouseX <= 250 
         && mouseY >= 300 && mouseY <= 320) //Lore Button
  {
    
    push();
    noFill();
    rectMode(CENTER);
    strokeWeight(3);
    rect(200,310,100,20);
    pop();
    
    if(mouseIsPressed) gameState = 2;
  }
  
  loadPixels()
  light.loadPixels()
  light.pixels = pixels
  
  background(25, 100);
  
  //Fun little gunshot in the main menu
  if(shootTimer <= 0 || mainAnim > 0)
  {
    if(mainAnim <= 0)
      mainAnim = 4;
    else
      mainAnim--;
    shootTimer = 50;
    gunShot(65,365,0);
  }
  else
  {  
    shootTimer--;
  }
  
  //2 flashlights, acting a spotlights
  flashlight(sigL.x,sigL.y,sigL.angle);
  flashlight(sigR.x,sigR.y,sigR.angle);
  
}

//Animation variables
var temp;
var tempState = 0;
var axeTime = 25;
var inState = false;
//instructions menu, can just play attack animations of each weapon/enemy
//2 more gangstalkers will be made, mostly variations of the grey one shown
//2 of the grey gangstalkers are currently placeholders
function instructions()
{
  if(!tempState)
  {
    temp = new Player(200,200,0, pArt[3]);
    tempState++;
  }
  textSize(30);
  text("How to turn that mindset\n\t\t\t into a Grindset:", 40, 30);
  push();
  strokeWeight(4);
  line(0,75,400,75);
  pop();
  
  push();
  textSize(15);
  image(pArt[1], 350, 150, 40, 40); //Change to shotgun guy
  image(pArt[1], 300, 150, 40, 40); //Change to machine gun guy
  image(pArt[1], 250, 150, 40, 40); 
  text("Your Gangstalkers, watch out for their guns!", 225,80,175)
  
  text("Your trusty axe, simple yet strong.", 15, 85 ,150);
  text("High AOE damage but risky, heals on kills", 15, 180, 150);
  
  push();
  translate(50,150)
  rotate(PI/2.8 + (axeTime/50))
  image(pArt[0], 0,0,40,40); //Axe
  
  if(!inState)
  {
    axeTime-=20;
    if(axeTime <= -50)
      inState = !inState;
  }
  else if(inState)
  {
    axeTime+=3;
    if(axeTime >= 25)
      inState = !inState;
  }
  pop();
  
  
  
  text("The Skinwalker, purge the world of this evil spirit!", 220, 240, 200);
  image(pArt[2], 300,300,80,80);
  
  text("Sigmund, an normal man in an abnormal situation...", 10, 240, 200);
  pop();
  push();
  translate(90,320);
  rotate(-PI)
  image(pArt[3], 0,0,90,90);
  
  pop();
  
  
  
  temp.draw();
  temp.move();
  
  push();
  textSize(10);
  fill(0);
  text("You never know what's lurking in the dark", 30, 300, 50);
  text("Ranged but low damage, reloads when empty", 150, 280, 75);
  
  pop();
  
  
  light = createImage(400,400)
  
  light.loadPixels();
  loadPixels();
  light.pixels = pixels
  
  
  background(25,250)
  
  push();
  fill(255)
  textSize(15);
  text("Back", 5,397);
  pop();
  
  //Back Button
  push();
  noFill();
  stroke(255);
  rect(0,382,50, 20);
  pop();
  
  if(mouseX >= 0 && mouseX <= 50 
         && mouseY >= 385 && mouseY <= 400)
  {
    push();
    noFill();
    stroke(255);
    strokeWeight(3);
    rect(0,382,50, 20);
    pop();
       
    if(mouseIsPressed) gameState = 0;
  }
  
  flashlight(temp.x,temp.y,temp.angle);
  
  push();
  fill(255);
  textSize(10);
  text("Arrow Keys to move  click to attack!\nPress 1 to use your axe, 2 to use your gun!", 150,100,75);
  
  pop();
  
  push();
  textSize(10);
  fill(255)
  text("It's a dark world out there, good thing you brought a flashlight", 250, 350, 150)
  text("Gunshots will light up the area!", 100,350,75)
  pop();
  
  if(shootTimer <= 0 || mainAnim > 0)
  {
    if(mainAnim <= 0)
      mainAnim = 12;
    else
      mainAnim--;
    shootTimer = 40;
    gunShot(90,320,PI);
  }
  else
  {  
    shootTimer--;
  }
  
}

//lore menu, pretty much a wall of text
//explaining the lore of this game
function lore()
{
  //Lore Image
  image(lores, 200, 75, 250,150);
  
  textSize(12);
  text("You are Sigmund Grinder, a simple man with a simple routine", 30,160, 350);
  text("Every day you you walk to your favorite fast food restaurant, saying high to the friendly homeless man as you do.", 30, 180, 350 );
  text("One fateful day, as you say hello to your homeless friend, he responds by stating your full legal name and address, entirely in binary! weird?", 30, 220, 350);
  text("Concerned for your friend, you have the police detain him while you figure things out, the stress of the event has made you hungry, maybe a nice big mac will settle your troubles?", 30, 270, 350);
  text("You go and order a big mac, as you get your order you notice that they got it wrong, an order of only 1 thing... You ask the cashier and she responds. She says the exact phrase you told the monster in your dream to say to let you know it was them...", 30,320,350);
  text("You know what you must do...", 80, 395);
  
  
  textSize(15);
  text("Back", 5,397);
  
  //Back Button
  push();
  noFill();
  rect(0,382,50, 20);
  pop();
  
  if(mouseX >= 0 && mouseX <= 50 
         && mouseY >= 385 && mouseY <= 400)
  {
    push();
    noFill();
    strokeWeight(3);
    rect(0,382,50, 20);
    pop();
       
    if(mouseIsPressed) gameState = 0;
  }
}



//Winning screen function, plays when you win (do that)
//Outputs a picture of the player along with lore text on what happens in the game lore
function chad()
{
  push();
  textSize(50);
  text("Victory!!",105, 60);
  push();
  strokeWeight(4);
  line(0,75,400,75);
  pop();
  pop();
  
  push();
  textSize(20);
  text("You saved the world from the forces of darkness!!", 40, 100, 350);
  text("The entire world, to repay your efforts, gives you a sweet jacket with straps on it!!", 40,160,200)
  text("Now this is epic!!", 40,380,300);
  
  image(dubbs, 315,280,175,250);
  
  
  pop();
}

//Losing screen function, plays when you lose (don't do that)
//Outputs a picture of the player along with lore text on what happens in the game lore
function beta()
{
  push();
  textSize(50);
  text("Defeat!!",105, 60);
  push();
  strokeWeight(4);
  line(0,75,400,75);
  pop();
  pop();
  
  push();
  textSize(20);
  text("You and the world have fallen into Darkness!!", 40, 100, 350);
  text("The skinwalkers and your gangstalkers, in a twisted alliance, now rule everything!!", 40,160,200)
  text("You are not happy!!\n(pictured)", 40,350,300);
  
  image(ells, 315,280,175,250);
  
  
  pop();
}

function setup() {
  createCanvas(400, 400);
 
  frameRate(40);
  
  drawAxe();
  
  pArt.push(get(100,100,250,250));
  clear();
  push();
  drawPistol();
  pop();
  pArt.push(get(100,100,250,250));
  
  pArt.push(digo);
  pArt.push(siggy);
  

  
  pixelDensity(1);
  
  musicG = createAudio('Grinding.mp3')
  musicML = createAudio('WinLoss.mp3')
  musicL  = createAudio('Lore.mp3')
  console.log(musicML.volume)
  musicML.volume(.05);
  musicG.volume(.6);
  musicL.volume(.2);
  musicL.loop = true;
  musicG.loop = true;
  musicML.loop = true;
}




//A state machine that is called every frame
//calls helper functions to draw certain scenes
function draw() {
  background(200);
  
  if(gameState == 3)
    musicG.play();
  else
    musicG.pause();
  
  if(gameState >= 4)
    musicML.play()
  else
    musicML.pause()
  
  if(gameState == 2)
    musicL.play()
  else
    musicL.pause()
  
  switch(gameState)
  {
    case 0: mainMenu();
            break;
    case 1: instructions();
            break;
    case 2: lore();
            break;
            
    case 3: play();
            break;
            
    case 4: beta();
            break;
            
    case 5: chad();
            break;
            
    default: break;
  }
}

//Key events for player
//Currently only flashlight
function keyPressed() {
  switch(keyCode)
  {
    //Flashlight Toggle
    case 70: gameState = 5;
             break;
    case 87: gameState = 4;
             break;
    case 50: sigmund.weapon = 1;
             break;
    case 49: sigmund.weapon = 0;
             break;
    default: break;
  }
}




/*  flashlight function - projects a flashlight effect
*   
*   q - x coordinate of origin
*   p - y coordinate of origin
*   rad - angle (in radians) of origin point
*
*   pretty resource intensive, limit its use
*   Or modify rad or desired length/width of the beam
*
*   Need to create an image, set its pixels to that of
*   whats on the screen (before loading background)
*   then modify the pixels on the screen using this image
*
*   Lower the framerate if you do this:
*   p5.js said >= 24 is enough for smooth animation
*
*
*   Can probably map out intensity magnitudes based on distance
*   on setup and just apply them when needed
*/
function flashlight(q, p, rad)
{
  loadPixels();
  //Need to loop 
  
  //Use math to know what quadrant I'm in?
  //And if really close to 0, use half of each quadrant??
  
  //Think of ways to loop through a box, can half (maybe more) the looping count
  //By knowing which direction the mouse is relative to the player
  for(let y = p-80; y < p+80; y++)
  {
    for(let x = q-80; x < q+80; x++)
    {
      
      let angle = Math.atan2(y - p, x - q) - rad;
      
      // normal check            check + angle > PI           check - angle < -PI
      if(abs(angle) <= 0.5236 || abs(angle-2*PI) <= 0.5236 || abs(angle+2*PI) <= 0.5236)
      {
        let d = dist(x, y, q, p);
        
        //Removes lines at edges of box
        //Makes it look more realistic
        //Increases efficiency??
        //Change value to length of beam
        if(d > 80) continue;
        
        let pos = (x + y * width) * 4;
        let r = light.pixels[pos];
        let g = light.pixels[pos+1];
        let b = light.pixels[pos+2];
        
        //Set .25 to something different when messing with
        //alpha values of the background
        //change 3rd value to create a nice gradient
        let adjustBrightness = map(d, 0, 80, 1, 0.25);
	    r *= adjustBrightness;
		g *= adjustBrightness;
		b *= adjustBrightness;

		r = constrain(r, pixels[pos], 255); //Middle Parameter should equal background color??
		g = constrain(g, pixels[pos+1], 255);
		b = constrain(b, pixels[pos+2], 255);
        
        pixels[pos] = r;
		pixels[pos + 1] = g;
		pixels[pos + 2] = b;
      } 

    }
    
  }
  updatePixels();

}


/* gunShot function - creates a gun flash effect
*
*  q - x coordinate
*  p - y coordinate
*  rad - angle (in radians) 
*/
function gunShot(q,p,rad)
{
  
  loadPixels();
  //Need to loop 
  
  //Think of ways to loop through a box, can half (maybe more) the looping count
  //By knowing which direction the mouse is relative to the player
  for(let y = p-60; y < p+60; y++)
  {
    for(let x = q-60; x < q+60; x++)
    {
      
      let angle = Math.atan2(y - p, x - q) - rad;
      
      //Change value to whatever radian I want the flash to be
      if(abs(angle) <= .7 || abs(angle-2*PI) <= .7 || abs(angle+2*PI) <= .7)
      {
        let d = dist(x, y, q, p);
        
        //Removes lines at edges of box
        //Makes it look more realistic
        //Increases efficiency??
        //Change value to length of beam
        if(d > 60) continue;
        
        let pos = (x + y * width) * 4;
        let r = light.pixels[pos];
        let g = light.pixels[pos+1];
        let b = light.pixels[pos+2];
        
        //Set .25 to something different when messing with
        //alpha values of the background
        //change 3rd value to create a nice gradient
        let adjustBrightness = map(d, 0, 60, 1, 0.25);
	    r *= adjustBrightness;
		g *= adjustBrightness;
		b *= adjustBrightness * 0;

		r = constrain(r, pixels[pos], 255); //Middle Parameter should equal background color??
		g = constrain(g, pixels[pos + 1], 255);
		b = constrain(b, 25, 255);
        
        pixels[pos] = r;
		pixels[pos + 1] = g;
		pixels[pos + 2] = b;
        
      } 

    }
    
  }
  updatePixels();
  
  
  
}