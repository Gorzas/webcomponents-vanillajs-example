'use strict';

module.exports = function (grunt) {
  // Project configuration
  var devel = 'devel/',
    vendorDir = devel + 'vendor/',
    vendor = [
      vendorDir + 'jquery/dist/jquery.js',
      vendorDir + 'bootstrap/dist/bootstrap.js',
      vendorDir + 'underscore/underscore.js'
    ];

  grunt.initConfig({
    clean: {
      all: {
        src : ['.tmp']
      }
    },

    concat: {
      devel: {
        src : [
          vendorDir + 'loader.js/loader.js',
          '.tmp/**/**.amd.js'
        ],
      
        dest: '.tmp/app.js'
      },

      vendor : {
        src : vendor,
        dest : 'dist/js/vendor.js'
      }
    },

    copy: {
      less : {
        expand : true,
        flatten : true,
        src : [
          vendorDir + 'bootstrap/dist/css/bootstrap.css'
        ],
        dest: 'devel/src/styles/libs/'
      }
    },

    jshint: {
      devel: {
        options: {
          browser : true,
          esnext: true,
          node: true,
          globals: {
            $: true,
            _: true,
            jQuery: true
          }
        },

        src: [
          'devel/src/**/**.js'
        ]
      }
    },

    jst: {
      compile: {
        files: {
          '.tmp/templates.tpl' : [
            devel + 'src/templates/**/**.tpl'
          ]
        }
      }
    },

    less: {
      devel : {
        files : {
          'dist/css/styles.css' : 'devel/src/styles/styles.less'
        }
      }
    },

    replace: {
      templates: {
        options: {
          patterns: [
            {
              match: /devel\/src\/templates\//g,
              replacement: ''
            },
            {
              match: /\.tpl/g,
              replacement: ''
            }
          ]
        },

        files: {
          '.tmp/_templates.amd.js' : ['.tmp/templates.tpl']
        }
      }
    },


    transpile: {
      dist: {
        type: 'amd',
        files: [{
          cwd: 'devel/src/',
          expand: true,
          src: '**/**.js',
          dest : '.tmp/',
          ext: '.amd.js'
        }]
      }
    },

    uglify : {
      vendor : {
        files: {
          'dist/js/vendor.js' : [
            'dist/js/vendor.js'
          ]
        },

        options : {
          report : 'gzip',
          sourceMap : true
        }
      }
    },

    wrap : {
      basic : {
        src: [
          '.tmp/app.js'
        ],
        dest: 'dist/js/app.js',
        options: {
          wrapper: [
            '(function (global){\n',
            '\nglobal.App = requireModule(\'app\')[\'default\'];\n}(this));'
          ]
        }
      }
    }

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-wrap');

  // Tasks
  grunt.registerTask('vendor', [
    'concat:vendor',
    'uglify:vendor'
  ]);

  grunt.registerTask('devel', [
    'copy:less',
    'less',
    'jshint',
    'transpile',
    'jst',
    'replace',
    'concat:devel',
    'wrap',
    'clean:all'
  ]);

  grunt.registerTask('default');
};