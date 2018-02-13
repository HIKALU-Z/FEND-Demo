(function () {
  "use strict";

  //创建一个包含所有卡片的数组
  var cards = [
    "fa-diamond",
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-anchor",
    "fa-bolt",
    "fa-bolt",
    "fa-cube",
    "fa-cube",
    "fa-leaf",
    "fa-leaf",
    "fa-bicycle",
    "fa-bicycle",
    "fa-bomb",
    "fa-bomb"
  ];

  var matchCard1 = {},
    matchCard2 = {};
  var steps = 0,
    matches = 0,
    oneStar = 14,
    twoStar = 12,
    initStarNum = 3,
    currentTime = 0,
    timeClock = '0:00',
    pairs = cards.length / 2,
    matchStatus = false,
    gameStart = false,
    timer;


  initGamePage();

  // 洗牌函数来自于 http://stackoverflow.com/a/2450976
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /*
   * 显示页面上的卡片
   *   - 使用提供的 "shuffle" 方法对数组中的卡片进行洗牌
   *   - 循环遍历每张卡片，创建其 HTML
   *   - 将每张卡的 HTML 添加到页面
   */
  function initGamePage() {
    var newCardArray = shuffle(cards);
    $(".card i").each(function () {
      $(this).addClass(newCardArray.pop());
    });
  }

  /*
  * 设置一张卡片的事件监听器。 如果该卡片被点击：
  *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
  *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
  *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
  *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
  *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
  *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
  *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
  */
  $("li.card").on("click", function () {
    // if the card was opened then return the function to prenvent it clicked twice~
    if ($(this).attr("class").indexOf("open") > -1) {
      return;
    }
    if (!gameStart) {
      gameStart = !gameStart;
      timerStart();
    }
    if (!matchCard1.name) {
      matchCard1 = matchCardConstructor($(this));
      return;
    } else if (!matchCard2.name) {
      matchCard2 = matchCardConstructor($(this));
      if (matchCard1.id === matchCard2.id) {
        matchCard1 = {};
        matchCard2 = {};
        return;
      } else {
        steps++;
        $("span.moves").text(steps);
        checkMatch();
      }
    }
  });

  // time clock start
  function timerStart() {
    timer = setInterval(function () {
      currentTime++;
      $(".clock").text(currentTime);
    }, 1000)
  }

  /**
   * create a click object which contain the card ID|name|itself
   * @param {object} card
   */
  function matchCardConstructor(card) {
    var obj = {};
    obj = card;
    obj.name = card.children().attr("class");
    obj.id = $("ul li").index(card);
    obj.addClass("animated open show");
    // addClass("flipped");
    return obj;
  }

  /**
   * check if the two cards was the same card
   *   - if it is matched then run foundMatch
   *   - if it is not matched then run hideMatch
   */
  function checkMatch() {
    if (matchCard1.name === matchCard2.name) {
      matchSuccess();
    } else {
      matchFail();
    }
    checkStar();
    // reset click object
    matchCard1 = {};
    matchCard2 = {};
  }

  // if card match success then count matched pairs if matched all card then stop the game
  function matchSuccess() {
    matchCard1.addClass("animated pulse matched");
    matchCard2.addClass("animated pulse matched");
    matches++;
    if (matches === pairs) {
      setTimeout(gameOver, 500);
    }
  }

  // if card match fail then use this function
  function matchFail() {
    matchCard1.addClass("animated shake unmatch");
    matchCard2.addClass("animated shake unmatch");
    function reset(matchCard1, matchCard2) {
      matchCard1.removeClass("animated unmatch shake open show");
      matchCard2.removeClass("animated unmatch shake open show");
    }
    setTimeout(reset, 1500, matchCard1, matchCard2);
  }

  // if all the cards matched the show the win modal
  function gameOver() {
    clearInterval(timer);
    getTimeClock();
    setTimeout(function () {
      $("#winModal").toggleClass("hidden animated bounceIn");
    }, 500);
  }

  // check the score
  function checkStar() {
    var currentStars;
    if (steps >= oneStar) {
      currentStars = 1;
    } else if (steps >= twoStar) {
      currentStars = 2;
    } else {
      currentStars = 3;
    }
    if (currentStars != initStarNum) {
      displayStars(currentStars);
      initStarNum = currentStars;
    }
  }

  // display the star score
  function displayStars(num) {
    var starLevelTemplate = '<li><i class="fa fa-star fa-3x animated bounceIn"></i></li>';
    var starTemplate = '<li><i class="fa fa-star "></i></li>';
    $("#starLevel").empty();
    $(".stars").empty();
    for (var i = 0; i < num; i++) {
      $(".stars").append(starTemplate);
      $("#starLevel").append(starLevelTemplate)
    }
  }

  function getTimeClock() {
    var minutes = 0, seconds = 0;
    if (currentTime > 60) {
      // Calculate minutes and seconds
      minutes = Math.floor((currentTime % 60));
      seconds = currentTime - minutes * 60;
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      timeClock = minutes + ':' + seconds;
    } else {
      seconds = currentTime;
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      timeClock = minutes + ':' + seconds;
    }
    var clock = `Time ${timeClock}`
    $("#timeClock").html(clock);
  }

  // reload the game
  function reload() {
    if ($("#winModal").attr("class").indexOf("hidden") <= 0) {
      $("#winModal").toggleClass("fadeOut");
      setTimeout(function () { window.location.reload() }, 700);
      return;
    }
    window.location.reload();
  }

  // replay the game
  $("#replay-button").click(reload)

  // restart the game
  $(".restart").click(reload);

})();