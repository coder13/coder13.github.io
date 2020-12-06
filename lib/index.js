'use strict';

var GITHUB_URL = 'https://api.github.com';

new Vue({
  el: '#app',
  data: function data() {
    return {
      schools: [{
        name: 'Central Washington University',
        url: 'https://www.cwu.edu/',
        degree: 'Bachelor of Science - Computer Science',
        date: 'Expected Graduation - Winter 2022'
      }, {
        name: 'Columbia Basin College',
        degree: 'Associate of Arts - General Transfer',
        date: 'September 2014 - June 2016'
      }],
      jobs: [{
        company: 'Lift Security',
        url: 'https://liftsecurity.io/',
        title: 'Junior Developer',
        positions: [{
          id: 1,
          date: 'March 2014 - July 2015',
          description: 'Regularly visited office to mentor with company learning web development and accomplishing projects.'
        }, {
          id: 2,
          date: 'July - October 2015 (paid)',
          description: 'Summer internship developing software to analyze Node.JS programs for vulnerablities.'
        }]
      }, {
        company: 'Fred Meyer',
        url: 'https://fredmeyer.com',
        title: 'Cashier',
        positions: [{
          id: 1,
          date: 'October 2016 - present',
          description: 'Retail supervisor working on the frontend. Duties include assisting customers to the best of my abilities and coming up with unique solutions to fix problems.' + '<br/>Awarded employee of the month February 2019'
        }]
      }],
      projects: [{
        name: 'LetsCube',
        url: 'https://github.com/coder13/letscube',
        website: 'https://letscube.net',
        repo: 'letscube',
        description: 'Webapp that lets people cube against each other.',
        data: {}
      }, {
        name: 'Carat',
        url: 'https://github.com/coder13/carat',
        repo: 'carat',
        description: 'Scans Node.JS and reports vulnerablities in them. Extensible and powerful enough to detect any code pattern desired.',
        data: {}
      }, {
        name: 'Fantasy Cubing',
        url: 'https://github.com/coder13/fantasycubing',
        repo: 'fantasycubing',
        description: 'Fantasy Sports website based on the results from Rubik\'s Cube competitions ran by the <a href="https://worldcubeassociation.org">World Cube Association</a>. Allows players to make teams each week of competitors in competitions and collect points based on their results.\n            <br>\n            Technologies used: MySQL, Javascript / Node.js, HTML5, Webpack, Hapi, React, Ampersand.js, Semantic-UI',
        data: {}
      }],
      github: {
        avatar_url: 'https://via.placeholder.com/460'
      }
    };
  },
  created: function created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },

  methods: {
    fetchData: function fetchData() {
      var _this = this;

      fetch(GITHUB_URL + '/users/coder13').then(function (data) {
        return data.json();
      }).then(function (data) {
        _this.github = data;
      });

      this.projects.forEach(function (project) {
        fetch(GITHUB_URL + '/repos/coder13/' + project.repo).then(function (data) {
          return data.json();
        }).then(function (data) {
          project.data = data;
        });
      });
    }
  }
});

//   <p>
//     <b><a href="https://www.fredmeyer.com/">Fred Meyer</a></b><br>
//     <small>October 2016 - September 2019</small><br>
//     <small><i>Supervisor</i></small><br>
//     Duties included processing transactions, handling cash, providing great customer service, training new hires, and supervising the frontend department.<br>
// Awarded employee of the month February 2019.
//   </p>

//   <p>
//   <b><a href="https://worldcubeassociation.org">World Cube Association</a></b><br>
//     <small>February 2016 - December 2018</small><br>
//     Volunteered maintaining the World Cube Association's software and websites. Ran and deployed servers when needed. Contributed to spec for future websites.
//   </p>