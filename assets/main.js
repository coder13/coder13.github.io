const GITHUB_URL = "https://api.github.com";
const WCA_URL = "https://www.worldcubeassociation.org/api/v0";

new Vue({
  el: "#app",
  data() {
    return {
      projects: [
        {
          name: "LetsCube",
          url: "https://github.com/coder13/letscube",
          website: "https://letscube.net",
          repo: "letscube",
          docs: true,
          data: {},
        },
        {
          name: "Competition Groups",
          url: "https://github.com/coder13/competitor-groups",
          website: "http://competitiongroups.com/",
          repo: "competitor-groups",
          data: {},
        },
        {
          name: "Delegate Dashboard",
          url: "https://github.com/coder13/delegateDashboard",
          website: "https://delegate-dashboard.netlify.app/",
          repo: "delegateDashboard",
          data: {},
        },
        {
          name: "Carat",
          url: "https://github.com/coder13/carat",
          repo: "carat",
          data: {},
        },
        {
          name: "Fantasy Cubing",
          url: "https://github.com/coder13/fantasycubing",
          repo: "fantasycubing",
          data: {},
        },
      ],
      wca: {
        me: {},
        competitions: [],
        profile: {},
      },
      github: {
        avatar_url: "https://via.placeholder.com/460",
      },
    };
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetch(`${GITHUB_URL}/users/coder13`)
        .then((data) => data.json())
        .then((data) => {
          this.github = data;
        });

      this.projects.forEach((project) => {
        fetch(`${GITHUB_URL}/repos/coder13/${project.repo}`)
          .then((data) => data.json())
          .then((data) => {
            project.data = data;
          });
      });

      fetch(`${WCA_URL}/users/8184?upcoming_competitions=true`)
        .then((data) => data.json())
        .then((data) => {
          this.wca.me = data.user;
          this.wca.competitions = data.upcoming_competitions.sort(
            (a, b) =>
              new Date(a.start_date).getTime() -
              new Date(b.start_date).getTime()
          );
        });

      fetch(`${WCA_URL}/persons/2016HOOV01`)
        .then((data) => data.json())
        .then((data) => {
          console.log(89, data);
          this.wca.profile = data;
        });
    },
  },
});
