/* Director.js - handles gameplay, level swapping and drawing of maps
*
*  helper file for sketch.js
*/

//Level 1, mcdonalds
var lvl1 = 
[
  "wddwwwwwwwwwwwwwwwwwwwwwwwwwww",
  "ws        scccccw    w       w",
  "www             w ss w httth w",
  "w    cccccccccccw    ws      w",
  "w               wwww wwwwww  w",
  "w                    ws htw  w",
  "wccc  wwwwwwwwwwwwwwww   hw  w",
  "ws                   wh s w  w",
  "wcccccw  s     s     wth     w",
  "wwwwwwwccccccccccc   wwwwww  w",
  "wth                   htth   w",
  "wh                           w",
  "w       bbbbbbbbbbbbbb       w",
  "w     swwwwwwwwwwwwwwwws     w",
  "w       bbbbbbbbbbbbbb       w",
  "wh                          hw",
  "wt                          tw",
  "wh                          hw",
  "w    htth            htth    w",
  "w     tt              tt     w",
  "w    htth    h  h    htth    w",
  "w           tttttt           w",
  "w          htttttth          w",
  "w           tttttt           w",
  "w    htth    h  h    htth    w",
  "w     tt              tt     w",
  "wb   htth            htth   bw",
  "wbs        s               sbw",
  "wbbb          p           bbbw",
  "wwwwwwwwwwwwwddwwwwwwwwwwwwwww",
];

//Level 2, a police station
//J = jail cell bars - impassible
//s = skinwalker
//g = gangstalker
var lvl2 = 
[
  "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww                                             wwwwwwwwwwwwwww",
  "w g               ghtwcccccccw                                             ws            w",
  "w      g hh g      gtwc   g  w                                             w     c gc    w",
  "w      htttth      htwc  ww  w                                             w     cccc    w",
  "w      htttth       twc   g  w                                             w      bb     w",
  "whg    g hh g        wc  ww  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww             w",
  "wth                  wc   g  w    wwww s  wwww    wwww    wwww    wwww  s wwwwwww   wwwwww",
  "wwwwwwwwwwwwwwwwwww  wc  ww  w    wwww    wwww    wwww    wwww    wwww    ww             w",
  "wg                   wc      w    wwww    wwww    wwww    wwww    wwww    ww             w",
  "w                    wwwwww  wjjjjwwwwj  jwwwwjjjjwwwwjjjjwwwwjjjjwwww  jjww         g   w",
  "w                                                 wg                                     w",
  "w           b                                     wg                           g         w",
  "w        c  g  c             w  jjwwwwjjjjwwwwjj  wwwwj  jwwwwjj jwwwwjjjjwwwwwwwwwwwwww w",
  "w        ccccccc           ghw    wwww    wwww    wwww    wwww    wwww    wwwa     g     w",
  "w                            w    wwww    wwww    wwww    wwww    wwww    wwwg     g     w",
  "w        h  p  h           ghws   wwww    wwww         s  wwww s  wwww    wwwa a a a a a w",
  "wwwwwwwwwwwddwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
];

//Array of maps
var maps = [lvl1, lvl2];

//Enemies
var enems = [];

let anim = 0; //animation variable
let con = 0;
var tiles = maps[level];
var timer = 10;

/* play function - like draw but for gameplay
*
*  Handles drawing, spawning and general combat
*/
function play()
{
  if(level == 1)
  {
    tiles = maps[1];
  }
  
  background(0);
  
  //Handles initialization of enemies
  if(!con)
  {
    initEntities(maps[level])
    con++;
  }
  
  translate(200 - sigmund.x, 200 - sigmund.y);
  
  drawMap(maps[level])
  
  sigmund.draw();
  sigmund.move();
  
  //Draws all bullets, also removes them
  for(let b in bullets)
  {
    let cur = bullets[b];
    if(cur.collision())
      bullets.splice(b,1);
    else if(cur.x >= tiles[0].length * 30  || cur.x <= -5 ||
       cur.y >= 1205  || cur.y <= -5)
    {     
      bullets.splice(b,1);
  }  
    else
    {  
      cur.draw();
    }
  }
  
  //Draws enemies, deletes them as well
  for(let b in enems)
  {
    enems[b].draw();
    if(enems[b].health <= 0)
    {
      enems.splice(b,1);
      if(sigmund.weapon == 0)
      {
        sigmund.health += int(random(5,20));
      }
    }
  }
  
  
  //Beginning of process to do flashlight
  loadPixels();
  
  light = createImage(400,400);
  light.loadPixels();
  
  light.pixels = pixels;
  
  background(25, 250);
  
  flashlight(200, 200, sigmund.angle);
  
  //gunshot, lasts 3 frames
  if(anim > 0)
  {
    anim--;
    gunShot(200,200,sigmund.angle);
  }
  
  //Code to try and get enemy shooters to have gunshots
  /*
  for(let b in enems)
  {
    if(enems[b].anim > 0)
    {
      push();
      gunShot(enems[b].x-200,enems[b].y-200,enems[b].angle);
      enems[b].anim--;
    }
  }
  */
  
  //Timer 
  if(timer > 0)
    timer--;
  
  //Handles level transitions
  if(enems.length == 0 && level == 1)
    gameState = 5;
  else if(enems.length == 0 && level == 0)
  {
    con--;                //Reset conditional for enemy spawning
    level++;
    sigmund.health = 100; //Heal the player
  }
  //Loss condition
  if(sigmund.health <= 0)
    gameState = 4;
  
  
  //UI stuff
  push();
  fill(255);
  textSize(15);
  text("Health: " + str(sigmund.health), sigmund.x + 120, sigmund.y + 150);
  text("Enemies: " + str(enems.length), sigmund.x - 150, sigmund.y + 150);
  
  //Ammo counter, shown only when gun is out
  if(sigmund.weapon == 1)
  {
    text("Ammo: " + str(sigmund.ammo), sigmund.x -150, sigmund.y + 130);
  }
  
  pop();
  
}


/* drawMap - draws the map of the current level
*
*  tiles - array of the current level
*
*/
function drawMap(tiles)
{
  let max = level == 0 ? 29 : 16;
  for(let i = 0; i < tiles.length; i++)
    {
      for(let j = 0; j < tiles[i].length; j++)
        {
          if(tiles[i][j] == 'w')
          {
            
            push();
            push();
            fill('#cf9855');
            noStroke();
            rect(j*30,i*30,30,30)
            pop();
            if(i == 0 || tiles[i-1][j] != 'w')
              line(j*30,i*30,j*30+30,i*30);
            if(i == max || tiles[i+1][j] != 'w')
              line(j*30,i*30+30,j*30+30,i*30+30);
            if(j == 0 || tiles[i][j-1] != 'w')
              line(j*30,i*30,j*30,i*30+30);
            if(j == 29 || tiles[i][j+1] != 'w')
              line(j*30+30,i*30,j*30+30,i*30+30);
            

            //graph[i][j] = -1;
            
            pop();
          }
          else if(tiles[i][j] == 't')
          {
            //Create Shape??
            push();
            if(i == 0 || tiles[i-1][j] != 't')
              line(j*30,i*30,j*30+30,i*30);
            if(i == max || tiles[i+1][j] != 't')
              line(j*30,i*30+30,j*30+30,i*30+30);
            if(j == 0 || tiles[i][j-1] != 't')
              line(j*30,i*30,j*30,i*30+30);
            if(j == 29 || tiles[i][j+1] != 't')
              line(j*30+30,i*30,j*30+30,i*30+30);
            
            noStroke();
            fill('#5c4033')
            rect(j*30,i*30,30,30)

            //graph[i][j] = -1;
            
            pop();
          }
          else if(tiles[i][j] == 'h')
          {
            push();
            fill('#ada592')
            rect(j*30, i*30, 30,30);
            pop();
            
            push();
            fill('#5c4033');
            circle(j*30+15, i*30+15, 20);
            pop();
          }
          else if(tiles[i][j] == 'c')
          {
            push();
            fill('#d1cac0');
            if(i == 0 || tiles[i-1][j] != 'c')
              line(j*30,i*30,j*30+30,i*30);
            if(i == 29 || tiles[i+1][j] != 'c')
              line(j*30,i*30+30,j*30+30,i*30+30);
            if(j == 0 || tiles[i][j-1] != 'c')
              line(j*30,i*30,j*30,i*30+30);
            if(j == 29 || tiles[i][j+1] != 'c')
              line(j*30+30,i*30,j*30+30,i*30+30);
            
            pop();
          }
          else if(tiles[i][j] == 'j')
          {
            push();
            fill('#ada592')
            rect(j*30, i*30, 30,30);
            pop();
            
            push();
            fill('#2c2f33')
            circle(j*30+15, i*30+15, 20);
            pop();
          }
          else
          {
            push();
            fill('#ada592')
            rect(j*30, i*30, 30,30);
            pop();
            
            //graph[i][j] = 0;
            
          }

        }
    }

}

/* initEntities function - initializes players and (currently) skinwalkers
* 
*  tiles - the current level map
*
*/
function initEntities(tiles)
{
  for(let i = 0; i < tiles.length; i++)
    {
      for(let j = 0; j < tiles[i].length; j++)
        {
          if(tiles[i][j] == 'p')
          {
            sigmund = new Player(j*30, i * 30, 0, pArt[3] )
            
          }
          else if(tiles[i][j] == 's')
          {
            enems.push(new Enemy(j*30, i * 30, -PI, pArt[2] ));
            
          }
          else if(tiles[i][j] == 'g')
          {
            enems.push(new Enemy(j*30, i * 30, PI, pArt[1] ));
            
          }
        }
    }
}

//Handles the player shooting,
//Called every time the mouse clicks
function mouseClicked()
{
  if(gameState == 3 && timer <= 0)
  {
    //Stuff for shooting sigmunds gun
    if(sigmund.weapon == 1 && sigmund.ammo > 0)
    {  
      if(sigmund.reload <= 0)
      {
      sigmund.shoot();
      sigmund.ammo--;
      anim = 3;
      }
    }
    else if(sigmund.weapon == 1 && sigmund.reload <= 0 && sigmund.ammo <= 0)
      sigmund.reload = 10;
    
    //Axe stuff
    if(sigmund.weapon == 0 && sigmund.axeSwing <= 0)
    {
      sigmund.swing();
    }
  }
}

