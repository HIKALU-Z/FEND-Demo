// 设定格子宽高的全局变量
var CELL_WIDTH = 101;
var CELL_HEIGHT = 83;
//设置碰撞距离
var colisionDistance = 50;

/**
 * 这是我们的玩家要躲避的敌人
 */
var Enemy = function(x, y, speed) {
  // 要应用到每个敌人的实例的变量写在这里
  // 我们已经提供了一个来帮助你实现更多
  this.x = x;
  this.y = y;
  this.speed = speed;
  // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
  this.sprite = "images/enemy-bug.png";
};

/**
 * 重置Enemy实例初始位置和速度的函数。
 * 在实例对象初始化或者一处边界以及特殊效果触发时可调用
 */
Enemy.prototype.initLocation = function() {
  this.x = -CELL_WIDTH;
  this.y = CELL_HEIGHT * Math.ceil(Math.random() * 4);
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
  // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
  // 都是以同样的速度运行的
  this.x += this.speed * dt;
  // 当敌人跑至外侧的时候，初始化敌人的位置
  if (this.x > CELL_WIDTH * 5) {
    this.initLocation();
  }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y + 20, 60, 102);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function(x, y) {
  // 玩家的坐标
  this.x = x;
  this.y = y;
  // 玩家的雪碧图
  this.sprite = "images/char-boy.png";
  // 玩家是否可以移动
  this.moveable = true;
  // 玩家的生命值，初始数值为1
  this.lives = 3;
  // 玩家的分数，初始为0，每次累加10
  this.score = 0;
};

// 初始化玩家位置的函数
Player.prototype.initLocation = function() {
  this.x = CELL_WIDTH * 2;
  this.y = CELL_HEIGHT * 5;
};

// 每当渲染一帧时对玩家类进行的更新函数（或者说检测函数）
Player.prototype.update = function(dt) {
  if (this.moveable && this.hasCollisionWhith(allEnemies)) {
    Engine.collideWithEnemy();
  }
};

// 玩家类的碰撞检测
Player.prototype.hasCollisionWhith = function(enemys) {
  for (var i = 0; i < enemys.length; i++) {
    var obj = enemys[i];
    if (this.y === obj.y && Math.abs(this.x - obj.x) < colisionDistance) {
      return true;
    }
  }
};

// 玩家类对于键盘的监听事件
Player.prototype.handleInput = function(direction) {
  // 判断当前实例是否可以移动
  if (player.moveable == false) {
    return;
  }

  switch (direction) {
    case "left":
      if (this.x >= CELL_WIDTH) {
        this.x -= CELL_WIDTH;
      }
      break;
    case "right":
      if (this.x < CELL_WIDTH * 4) {
        this.x += CELL_WIDTH;
      }
      break;
    case "up":
      if (this.y > 0) {
        this.y -= CELL_HEIGHT;
        if (this.y <= 0) {
          Engine.crossRiver();
        }
      }
      break;
    case "down":
      if (this.y < CELL_HEIGHT * 5) {
        this.y += CELL_HEIGHT;
      }
      break;
  }
};
// player的渲染函数
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x + 5, this.y - 5, 90, 160);
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var allEnemies = [
  new Enemy(0, CELL_HEIGHT * 2, Math.floor(Math.random() * 150) + 50),
  new Enemy(CELL_WIDTH, CELL_HEIGHT * 3, Math.floor(Math.random() * 150) + 50),
  new Enemy(CELL_WIDTH, CELL_HEIGHT * 4, Math.floor(Math.random() * 150) + 50),
  new Enemy(CELL_WIDTH, CELL_HEIGHT * 5, Math.floor(Math.random() * 150) + 50)
  
];
var player = new Player(CELL_WIDTH * 2, CELL_HEIGHT * 4);

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
