const GITHUB_URL = 'https://api.github.com';

new Vue({
  el: '#app',
  data () {
    return {
      projects: [{
        name: 'LetsCube',
        url: 'https://github.com/coder13/letscube',
        website: 'https://letscube.net',
        repo: 'letscube',
        docs: true,
        data: {},
      }, {
        name: 'Delegate Dashboard',
        url: 'https://github.com/coder13/delegateDashboard',
        website: 'https://delegate-dashboard.netlify.app/',
        repo: 'delegateDashboard',
        data: {},
      }, {
        name: 'Carat',
        url: 'https://github.com/coder13/carat',
        repo: 'carat',
        data: {},
      }, {
        name: 'Fantasy Cubing',
        url: 'https://github.com/coder13/fantasycubing',
        repo: 'fantasycubing',
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
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetch(`${GITHUB_URL}/users/coder13`).then((data) => data.json()).then((data) => {
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
