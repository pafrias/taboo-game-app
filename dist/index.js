axios.get('/api/cards')
.then(res => {
  console.log(res);
  const data = () => ({
      index: 0,
      score: 0,
      timer_sec: 120,
      cards: res.data,
      isTimerRunning: false
  })

  const methods = {
    reset_timer() {
      this.score = 0;
      this.timer_sec = 120;
    },
    start_timer() {
      let cb = () => {
        if (this.isTimerRunning && --this.timer_sec) {
          setTimeout(cb, 1000);
        } else {
          this.isTimerRunning = false;
        }
      }
  
      this.isTimerRunning = true;
      cb();
    },

    fetchCardData() {
      if (this.index + 50 < this.cards.length) return;
      let cardIds = this.cards.map(v => v.id);
      let url = `/api/cards${cardIds.length ? `?prevCards=[${cardIds}]` : ''}`;
      axios.get(url).then(res => {
        this.cards.push(...res.data);
        console.log(this.cards.length);
      });
    },

    deleteCard() {
      let {id} = this.cards[this.index];
      if (prompt('are you sure?', 'no') === 'yes') {
        axios.delete(`/api/cards/${id}`).then(res => {
          console.log(res);
          this.cards= this.cards.filter(v => v.id !== id);
        });
      }
    }
  };
  
  const computed = {
    card: function() {
      return this.cards[this.index];
    },
    timer: function() {
      let min = Math.floor(this.timer_sec/60);
      let sec = this.timer_sec % 60;
      return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }
  }

  new Vue({
    el: '#taboo_game_root',
    data,
    computed,
    methods, 
    template: `
    <div>
      <div id="score_board" class="flex">
        <div class="flex col">
          <h4>Score</h4>
          <div>{{score}}</div>
        </div>
        <div class="flex col">
          <h4>Timer</h4>
          <div>{{timer}}</div>
        </div>
      <button @click="reset_timer()">RESET</button>
      <button @click="start_timer()">START</button>
    </div>
    <div id="game_display" class="flex">
      <div id="card_display">
        <button @click="deleteCard()">delete</button>
        <h3>{{card.word}}</h3>
        <div class="h_line"></div>
        <ul>
          <li v-for="(taboo, index) of card.taboos" :key="index">{{taboo}}</li>
        </ul>
      </div>
      <nav class="flex">
        <button @click="index = (index || 1) - 1">PREV</button>
        <button @click="index++; fetchCardData()">SKIP</button>
        <button @click="score++; index++; fetchCardData()">SCORE!</button>
      </nav>
    </div>
  </div>`
  });
});