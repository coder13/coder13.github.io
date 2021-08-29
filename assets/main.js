const GITHUB_URL = 'https://api.github.com';

new Vue({
  el: '#app',
  data () {
    return {
      foo: 'bar',
      projects: [{
        name: 'LetsCube',
        url: 'https://github.com/coder13/letscube',
        website: 'https://letscube.net',
        repo: 'letscube',
        description: 'Webapp that lets people cube against each other.',
        data: {},
      }, {
        name: 'Carat',
        url: 'https://github.com/coder13/carat',
        repo: 'carat',
        description: 'Scans Node.JS and reports vulnerablities in them. Extensible and powerful enough to detect any code pattern desired.',
        data: {},
      }, {
        name: 'Fantasy Cubing',
        url: 'https://github.com/coder13/fantasycubing',
        repo: 'fantasycubing',
        description: `Fantasy Sports website based on the results from Rubik's Cube competitions ran by the <a href="https://worldcubeassociation.org">World Cube Association</a>. Allows players to make teams each week of competitors in competitions and collect points based on their results.
            <br>
            Technologies used: MySQL, Javascript / Node.js, HTML5, Webpack, Hapi, React, Ampersand.js, Semantic-UI`,
        data: {},
      }],
      github: {
        avatar_url: 'https://via.placeholder.com/460'
      },
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData().then(() => {
      console.log(this.github)
    })
  },
  methods: {
    fetchData() {
      return fetch(`${GITHUB_URL}/users/coder13`).then((data) => data.json()).then((data) => {
        this.github = data;
      });

      this.projects.forEach((project) => {
        fetch(`${GITHUB_URL}/repos/coder13/${project.repo}`).then((data) => data.json()).then((data => {
          project.data = data;
        }));
      })
    }
  }
});