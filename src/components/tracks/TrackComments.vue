<template>
  <div>
    <div class="send-comment">
      <div style="grid-column:1">
        <textbox v-model="text"
                :max="100"
                style="margin:0"
                placeholder="Write a comment..."
                disableInfo/>
      </div>
      <div style="grid-column:2">
        <button @click="send" class="send"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
    <h4>Comments ({{ comments.length }})</h4>
    <div v-if="comments.length < 1" class="faded-2">
      <span style="font-size:11pt">no comments yet.</span>
    </div>
    <table v-else class="track-comments" cellspacing="10px">
      <tr v-for="(comment, index) in filteredComments" :key="index" class="comment-container">
        <td class="writer">
          <router-link :to="`/${writerData(comment.writer_id).profile_data.username}`">
            {{ writerData(comment.writer_id).profile_data.name }}
          </router-link>
        </td>
        <td class="comment">
          <div>
            <span class="comment-info faded small-text" style="float:left">
              @{{ comment.seconds | secondsToMoment }}</span>
            <span class="comment-info faded small-text" style="float:right">
              {{ comment.date | dd.mm.yyyy }}
              <span v-if="isOwnComment(comment) || isOwnTrack">|</span>
              <span class="button"
                    style="margin-right:5px"
                    v-if="isOwnTrack"
                    @click="prepareReply(comment.id)">
                <i class="fas fa-reply"></i>
              </span>
              <span class="button"
                    v-if="isOwnComment(comment) || isOwnTrack"
                    @click="deleteComment(comment.id)">
                <i class="fas fa-trash"></i>
              </span>
            </span>
            <div style="clear:both"></div>
          </div>
          {{ comment.text }}
        </td>
      </tr>
    </table>
    <div v-if="number < comments.length" style="text-align:center">
      <span class="more small-text faded" @click="number += 3">show more</span>
    </div>
  </div>
</template>

<script>
import Textbox from '@/components/base/Textbox.vue';

export default {
  components: {
    Textbox,
  },
  props: {
    comments: {
      type: Array,
      required: true,
    },
    track_id: {
      type: String,
      required: true,
    },
    isOwnTrack: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      text: '',
      seconds: 0,
      number: 3,
      reply_id: null,
    };
  },
  methods: {
    send() {
      if (this.text.trim() === '') return;
      const comment = {
        writer_id: this.$store.state.auth.auth.id,
        text: this.text,
        seconds: this.seconds,
        date: Date.now(),
      };
      this.$store.dispatch('tracks/comment', { id: this.track_id, comment });
      this.text = '';
    },
    writerData(id) {
      return this.$store.getters['people/getPersonalDataById'](id) || { profile_data: {} };
    },
    isOwnComment(cm) {
      return cm.writer_id === this.$store.state.auth.auth.id;
    },
    prepareReply(id) {
      this.reply_id = id;
    },
    deleteComment(id) {
      this.$store.dispatch('tracks/deleteComment', {
        id: this.track_id,
        cm_id: id,
      });
    },
  },
  computed: {
    filteredComments() {
      return [].concat(this.comments).reverse().slice(0, this.number);
    },
  },
  watch: {
    filteredComments() {
      this.comments.forEach((comment) => {
        this.$store.dispatch('people/getPersonalDataById', comment.writer_id);
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../style/variables';

.send-comment {
  display: grid;
  column-gap: 30px;
  grid-template-columns: auto 30px;
}
.send {
  width: 30px;
  height: 30px;
  line-height: 0;
  display: block;
  padding: 0;
  border-radius: 50%;
}
.track-comments {
  width: 100%;
}
.comment-container {
  margin: 5px 0;
}
.writer {
  font-size: 11pt;
  vertical-align: top;
  padding-top: 20px;
}
.comment {
  background: #f0f0f0;
  padding: 3px;
  border-radius: 5px;
  font-size: 11pt;
  vertical-align: top;
  width: 100%;
}
.more {
  cursor: pointer;
}
.button {
  cursor: pointer;
}
.button:hover {
  color: #aaa;
}
</style>
